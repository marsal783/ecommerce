import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getArg(flag, fallback) {
  const arg = process.argv.find(a => a.startsWith(`--${flag}=`));
  if (arg) return arg.split('=')[1];
  const idx = process.argv.indexOf(`--${flag}`);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

let connectionString = getArg('connection-string', process.env.DATABASE_URL);
let host = getArg('host', process.env.PGHOST || process.env.DB_HOST);
let port = parseInt(getArg('port', process.env.PGPORT || process.env.DB_PORT || '5432'), 10);
let user = getArg('user', process.env.PGUSER || process.env.DB_USER);
let password = getArg('password', process.env.PGPASSWORD || process.env.DB_PASSWORD);
let database = getArg('database', process.env.PGDATABASE || process.env.DB_NAME);
let sslArg = getArg('ssl', process.env.DB_SSL);

const sqlFilePath = path.resolve(__dirname, 'database.sql');

if (!fs.existsSync(sqlFilePath)) {
  console.error(`❌ Error: File SQL tidak ditemukan di ${sqlFilePath}`);
  process.exit(1);
}

async function promptCredentials() {
  const rl = readline.createInterface({ input, output });

  console.log('\n======================================================');
  console.log('  🚀 Import database.sql Langsung ke PostgreSQL');
  console.log('  (Tanpa perlu instalasi DBeaver / pgAdmin / GUI)');
  console.log('======================================================\n');
  console.log('Pilihan input:');
  console.log('1. Menggunakan Connection String URI (contoh: postgresql://user:pass@host:5432/db)');
  console.log('2. Memasukkan Host, Port, User, Password, Database satu per satu\n');

  const mode = (await rl.question('Pilih mode (1 atau 2, default: 2): ')).trim();

  if (mode === '1') {
    connectionString = (await rl.question('\nMasukkan PostgreSQL Connection URL: ')).trim();
  } else {
    host = (await rl.question('Host / Server (misal: localhost atau aws-xxx.pooler.supabase.com): ')).trim() || 'localhost';
    const portStr = (await rl.question('Port (default: 5432): ')).trim();
    if (portStr) port = parseInt(portStr, 10);
    database = (await rl.question('Nama Database: ')).trim();
    user = (await rl.question('Username (default: postgres): ')).trim() || 'postgres';
    password = (await rl.question('Password: ')).trim();
    
    const isRemote = host !== 'localhost' && host !== '127.0.0.1';
    const defaultSsl = isRemote ? 'y' : 'n';
    const sslAnswer = (await rl.question(`Gunakan SSL? (${defaultSsl === 'y' ? 'Y/n' : 'y/N'}): `)).trim().toLowerCase();
    sslArg = (sslAnswer === '' ? defaultSsl : sslAnswer) === 'y' ? 'true' : 'false';
  }

  rl.close();
}

async function main() {
  // Jika kredensial belum ada sama sekali, minta input interaktif
  if (!connectionString && (!host || !database)) {
    if (process.stdin.isTTY) {
      await promptCredentials();
    } else {
      console.log(`
❌ Kredensial database belum diberikan.

Jalankan perintah ini di PowerShell Anda untuk input interaktif:
  node import-db.js

Atau jalankan dengan parameter lengkap:
  node import-db.js --host=<HOST> --port=5432 --user=<USER> --password=<PASSWORD> --database=<DB_NAME>

Atau dengan connection string:
  node import-db.js --connection-string="postgresql://user:pass@host:5432/dbname?sslmode=require"
`);
      process.exit(1);
    }
  }

  const clientConfig = connectionString
    ? { connectionString }
    : {
        host,
        port: port || 5432,
        user: user || 'postgres',
        password: String(password || ''),
        database,
      };

  // Setup SSL untuk cloud provider (Supabase, Neon, Railway, Aiven, Render, dsb)
  const isRemote = (host && host.includes('.')) || (connectionString && !connectionString.includes('localhost'));
  if (sslArg === 'true' || sslArg === 'require' || (isRemote && sslArg !== 'false')) {
    clientConfig.ssl = { rejectUnauthorized: false };
  }

  const client = new pg.Client(clientConfig);

  console.log(`\n⏳ Menghubungkan ke PostgreSQL (${host || 'via URI'})...`);
  try {
    await client.connect();
    console.log('✅ Berhasil terhubung ke database!');

    console.log(`⏳ Membaca file: ${sqlFilePath}...`);
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('⏳ Menjalankan skrip database.sql ke DBMS...');
    await client.query(sql);

    console.log('\n🎉 SUKSES! Seluruh skema dan data database.sql berhasil diimpor!');

    // Tampilkan verifikasi tabel
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\n📋 Daftar tabel yang berhasil dibuat:');
    res.rows.forEach(r => console.log(`   ✔️  ${r.table_name}`));

    const countRes = await client.query(`
      SELECT 
        (SELECT count(*) FROM users) AS total_users,
        (SELECT count(*) FROM products) AS total_products;
    `).catch(() => null);

    if (countRes && countRes.rows[0]) {
      console.log(`\n📦 Ringkasan Data:`);
      console.log(`   - Data Users    : ${countRes.rows[0].total_users} baris`);
      console.log(`   - Data Produk   : ${countRes.rows[0].total_products} baris`);
    }
    console.log('\nSelesai! Database siap digunakan oleh aplikasi.\n');

  } catch (err) {
    console.error('\n❌ Terjadi kesalahan saat mengimpor SQL:');
    console.error(err.message);
    if (err.detail) console.error('Detail:', err.detail);
    if (err.hint) console.error('Petunjuk:', err.hint);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
