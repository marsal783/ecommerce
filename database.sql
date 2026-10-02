-- =====================================================================
--  e-hakim : Skema Database (MVP)
--  DBMS      : PostgreSQL 13+ (memakai gen_random_uuid() bawaan)
--  Acuan     : PRD v1.0, FRD v1.0 (F-01 s.d. F-09, Data Validation, Business Rules)
--  Cara pakai: psql -U <user> -d <database> -f e-hakim_database.sql
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 0. BERSIHKAN (hanya untuk lingkungan pengembangan)
--    Hapus tanda komentar jika ingin membuat ulang dari awal.
-- ---------------------------------------------------------------------
-- DROP VIEW  IF EXISTS v_catalog;
-- DROP TABLE IF EXISTS uploads, login_attempts, sessions, products, auth_credentials, users CASCADE;
-- DROP TYPE  IF EXISTS user_role;
-- DROP FUNCTION IF EXISTS set_updated_at(), enforce_product_limit();

-- ---------------------------------------------------------------------
-- 1. TIPE DATA
-- ---------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('umkm', 'admin');   -- Role Management (FRD bagian 4)

-- ---------------------------------------------------------------------
-- 2. FUNGSI UMUM
-- ---------------------------------------------------------------------
-- Memperbarui kolom updated_at otomatis
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------
-- 3. TABEL: users  (F-01 Registrasi & Login)
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name     VARCHAR(100) NOT NULL,
    email             VARCHAR(255) NOT NULL,
    password_hash     TEXT         NOT NULL,                -- hash bcrypt/argon2, BUKAN password asli
    role              user_role    NOT NULL DEFAULT 'umkm',
    failed_login_count SMALLINT    NOT NULL DEFAULT 0,      -- BR-09: kunci setelah 5 kali gagal
    locked_until      TIMESTAMPTZ,                          -- akun terkunci 15 menit
    is_active         BOOLEAN      NOT NULL DEFAULT TRUE,   -- Admin dapat menonaktifkan akun
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_users_business_name
        CHECK (char_length(btrim(business_name)) BETWEEN 3 AND 100),
    CONSTRAINT chk_users_email_format
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_users_failed_count
        CHECK (failed_login_count >= 0)
);

-- BR-10: satu email hanya untuk satu akun (tidak peka huruf besar/kecil)
CREATE UNIQUE INDEX uq_users_email_lower ON users (LOWER(email));

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE  users IS 'Akun pengguna: pemilik UMKM dan admin';
COMMENT ON COLUMN users.password_hash IS 'Simpan hash (bcrypt/argon2). Jangan simpan password asli.';

-- ---------------------------------------------------------------------
-- 3b. TABEL: auth_credentials  (F-01 data autentikasi / login)
--     Menyimpan kredensial login: username dan password (dalam bentuk HASH).
-- ---------------------------------------------------------------------
CREATE TABLE auth_credentials (
    id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               UUID        NOT NULL UNIQUE
                                      REFERENCES users(id) ON DELETE CASCADE,  -- 1 akun = 1 kredensial
    username              VARCHAR(30) NOT NULL,
    password              TEXT        NOT NULL,   -- ISI DENGAN HASH (bcrypt/argon2), BUKAN teks asli
    password_changed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at         TIMESTAMPTZ,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Username: 4-30 karakter, huruf kecil, angka, titik, garis bawah
    CONSTRAINT chk_auth_username_format
        CHECK (username ~ '^[a-z0-9._]{4,30}$'),
    -- Mencegah penyimpanan password teks asli: hash bcrypt/argon2 selalu panjang dan berawalan '$'
    CONSTRAINT chk_auth_password_is_hash
        CHECK (char_length(password) >= 50 AND password LIKE '$%')
);

-- Username unik (BR-10 diperluas ke username)
CREATE UNIQUE INDEX uq_auth_username ON auth_credentials (username);

CREATE TRIGGER trg_auth_credentials_updated_at
    BEFORE UPDATE ON auth_credentials
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE  auth_credentials IS 'Kredensial login pengguna (username + hash password)';
COMMENT ON COLUMN auth_credentials.password IS 'Hash password (bcrypt/argon2). Jangan pernah menyimpan password asli.';

-- ---------------------------------------------------------------------
-- 4. TABEL: sessions  (F-01 sesi login, berlaku 7 hari)
-- ---------------------------------------------------------------------
CREATE TABLE sessions (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT        NOT NULL UNIQUE,                -- simpan hash token, bukan token mentah
    user_agent  TEXT,
    ip_address  INET,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at  TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    revoked_at  TIMESTAMPTZ,                                -- diisi saat logout

    CONSTRAINT chk_sessions_expiry CHECK (expires_at > created_at)
);

CREATE INDEX idx_sessions_user_id ON sessions (user_id);
CREATE INDEX idx_sessions_expires_at ON sessions (expires_at);

-- ---------------------------------------------------------------------
-- 5. TABEL: login_attempts  (pencatatan percobaan login, BR-09 & keamanan)
-- ---------------------------------------------------------------------
CREATE TABLE login_attempts (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email        VARCHAR(255) NOT NULL,
    user_id      UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address   INET,
    is_success   BOOLEAN     NOT NULL,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_login_attempts_email_time ON login_attempts (LOWER(email), attempted_at DESC);

-- ---------------------------------------------------------------------
-- 6. TABEL: products  (F-02 s.d. F-08)
-- ---------------------------------------------------------------------
CREATE TABLE products (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name         VARCHAR(100) NOT NULL,
    price        INTEGER      NOT NULL,                      -- Rupiah, tanpa desimal (F-03)
    description  VARCHAR(500) NOT NULL,
    image_url    TEXT,                                       -- opsional (BR-01), 1 foto per produk (BR-06)
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ,                                -- soft delete (BR-05)

    -- F-02: nama 3-100 karakter
    CONSTRAINT chk_products_name
        CHECK (char_length(btrim(name)) BETWEEN 3 AND 100),
    -- F-03 & BR-02: harga wajib, > 0, maksimal Rp 999.999.999
    CONSTRAINT chk_products_price
        CHECK (price > 0 AND price <= 999999999),
    -- F-04: deskripsi 10-500 karakter
    CONSTRAINT chk_products_description
        CHECK (char_length(btrim(description)) BETWEEN 10 AND 500),
    -- Foto harus tautan HTTPS (FRD bagian 6.1)
    CONSTRAINT chk_products_image_url
        CHECK (image_url IS NULL OR image_url ~* '^https://')
);

-- Katalog diurutkan terbaru di atas (F-05); hanya produk aktif
CREATE INDEX idx_products_owner_active
    ON products (owner_id, created_at DESC)
    WHERE deleted_at IS NULL;

-- Pencarian nama tidak peka huruf besar/kecil (F-09)
CREATE INDEX idx_products_owner_name_lower
    ON products (owner_id, LOWER(name))
    WHERE deleted_at IS NULL;

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- BR-11: maksimal 100 produk aktif per akun pada MVP
CREATE OR REPLACE FUNCTION enforce_product_limit()
RETURNS TRIGGER AS $$
DECLARE
    active_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO active_count
    FROM products
    WHERE owner_id = NEW.owner_id AND deleted_at IS NULL;

    IF active_count >= 100 THEN
        RAISE EXCEPTION 'PRODUCT_LIMIT_REACHED: maksimal 100 produk per akun'
            USING ERRCODE = 'check_violation';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_limit
    BEFORE INSERT ON products
    FOR EACH ROW EXECUTE FUNCTION enforce_product_limit();

COMMENT ON TABLE  products IS 'Produk dalam katalog UMKM';
COMMENT ON COLUMN products.price IS 'Harga dalam Rupiah (integer), 1 - 999.999.999';
COMMENT ON COLUMN products.deleted_at IS 'Soft delete: NULL = aktif';

-- ---------------------------------------------------------------------
-- 7. TABEL: uploads  (F-06 metadata foto yang diunggah)
-- ---------------------------------------------------------------------
CREATE TABLE uploads (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id    UUID        REFERENCES products(id) ON DELETE SET NULL,
    url           TEXT        NOT NULL,
    mime_type     VARCHAR(20) NOT NULL,
    size_bytes    INTEGER     NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- F-06: hanya JPG/PNG, maksimal 5 MB
    CONSTRAINT chk_uploads_mime CHECK (mime_type IN ('image/jpeg', 'image/png')),
    CONSTRAINT chk_uploads_size CHECK (size_bytes > 0 AND size_bytes <= 5242880),
    CONSTRAINT chk_uploads_url  CHECK (url ~* '^https://')
);

CREATE INDEX idx_uploads_owner   ON uploads (owner_id);
CREATE INDEX idx_uploads_product ON uploads (product_id);

-- ---------------------------------------------------------------------
-- 8. VIEW: v_catalog  (F-05 Daftar Katalog)
-- ---------------------------------------------------------------------
CREATE VIEW v_catalog AS
SELECT
    p.id,
    p.owner_id,
    p.name,
    p.price,
    'Rp ' || REPLACE(TO_CHAR(p.price, 'FM999,999,999,999'), ',', '.') AS price_formatted,
    LEFT(p.description, 80)                                           AS description_summary,
    p.description,
    p.image_url,
    (p.created_at > NOW() - INTERVAL '24 hours')                      AS is_new,       -- badge "Baru"
    (p.image_url IS NULL)                                             AS no_photo,     -- badge "Tanpa foto"
    p.created_at,
    p.updated_at
FROM products p
WHERE p.deleted_at IS NULL;

-- ---------------------------------------------------------------------
-- 9. DATA CONTOH (HAPUS BLOK INI DI PRODUKSI)
--    Password hash di bawah hanyalah penanda. Ganti dengan hash asli
--    yang dibuat oleh aplikasi (bcrypt/argon2).
-- ---------------------------------------------------------------------
INSERT INTO users (business_name, email, password_hash, role) VALUES
    ('Warung Mbok Rah', 'mbokrah@example.com', '$2b$12$GANTI_DENGAN_HASH_BCRYPT_ASLI', 'umkm'),
    ('Admin e-hakim',   'admin@example.com',   '$2b$12$GANTI_DENGAN_HASH_BCRYPT_ASLI', 'admin');

-- Kredensial login contoh (panjang placeholder = 60 karakter, sama seperti hash bcrypt asli)
INSERT INTO auth_credentials (user_id, username, password)
SELECT id,
       CASE email WHEN 'mbokrah@example.com' THEN 'mbokrah' ELSE 'admin' END,
       '$2b$12$GANTIDENGANHASHBCRYPTASLIGANTIDENGANHASHBCRYPTASLI123'
FROM users
WHERE email IN ('mbokrah@example.com', 'admin@example.com');

INSERT INTO products (owner_id, name, price, description, image_url)
SELECT u.id, v.name, v.price, v.description, v.image_url
FROM users u
CROSS JOIN (VALUES
    ('Keripik Singkong Pedas', 25000,  'Keripik singkong renyah dengan bumbu pedas khas rumahan.',              'https://cdn.e-hakim.id/uploads/keripik.jpg'),
    ('Batik Tulis Sidoluhur',  185000, 'Kain batik tulis motif klasik, pewarna alami, ukuran 2 meter.',         'https://cdn.e-hakim.id/uploads/batik.jpg'),
    ('Sambal Bawang Mbok Rah', 32000,  'Sambal bawang tanpa pengawet, tahan 2 minggu, botol 200 gram.',         'https://cdn.e-hakim.id/uploads/sambal.jpg'),
    ('Tas Anyaman Pandan',     95000,  'Tas anyaman pandan buatan perajin lokal, kuat dan ringan.',             NULL),
    ('Kopi Gayo Sangrai',      68000,  'Biji kopi Gayo sangrai medium, kemasan 250 gram.',                      'https://cdn.e-hakim.id/uploads/kopi.jpg')
) AS v(name, price, description, image_url)
WHERE u.email = 'mbokrah@example.com';

COMMIT;

-- =====================================================================
--  CONTOH QUERY UNTUK ENDPOINT API
-- =====================================================================

-- F-05  GET /products?page=1&limit=12  (katalog milik pengguna, terbaru di atas)
-- SELECT * FROM v_catalog
-- WHERE owner_id = :user_id
-- ORDER BY created_at DESC
-- LIMIT 12 OFFSET 0;

-- F-09  GET /products?q=keripik  (pencarian nama)
-- SELECT * FROM v_catalog
-- WHERE owner_id = :user_id AND LOWER(name) LIKE '%' || LOWER(:q) || '%'
-- ORDER BY created_at DESC;

-- F-02  POST /products  (tambah produk)
-- INSERT INTO products (owner_id, name, price, description, image_url)
-- VALUES (:user_id, :name, :price, :description, :image_url)
-- RETURNING *;

-- F-07  PUT /products/{id}  (ubah produk, hanya pemilik)
-- UPDATE products
-- SET name = :name, price = :price, description = :description, image_url = :image_url
-- WHERE id = :id AND owner_id = :user_id AND deleted_at IS NULL
-- RETURNING *;

-- F-08  DELETE /products/{id}  (soft delete, hanya pemilik)
-- UPDATE products SET deleted_at = NOW()
-- WHERE id = :id AND owner_id = :user_id AND deleted_at IS NULL;

-- BR-07  Peringatan nama produk duplikat pada katalog yang sama
-- SELECT EXISTS (
--   SELECT 1 FROM products
--   WHERE owner_id = :user_id AND LOWER(btrim(name)) = LOWER(btrim(:name)) AND deleted_at IS NULL
-- );

-- F-01  Login: ambil kredensial berdasarkan username
--       (verifikasi password dilakukan di aplikasi dengan membandingkan hash)
-- SELECT a.user_id, a.password, u.role, u.is_active, u.locked_until
-- FROM auth_credentials a
-- JOIN users u ON u.id = a.user_id
-- WHERE a.username = LOWER(:username);

-- F-01  Registrasi: simpan kredensial (password sudah di-hash oleh aplikasi)
-- INSERT INTO auth_credentials (user_id, username, password)
-- VALUES (:user_id, LOWER(:username), :password_hash);

-- F-01  Setelah login berhasil
-- UPDATE auth_credentials SET last_login_at = NOW() WHERE user_id = :user_id;

-- BR-09  Kunci akun setelah login gagal ke-5
-- UPDATE users
-- SET failed_login_count = failed_login_count + 1,
--     locked_until = CASE WHEN failed_login_count + 1 >= 5
--                         THEN NOW() + INTERVAL '15 minutes' ELSE locked_until END
-- WHERE LOWER(email) = LOWER(:email);

-- Success Metric PRD: jumlah produk berhasil diinput
-- SELECT COUNT(*) AS total_produk, COUNT(DISTINCT owner_id) AS umkm_aktif
-- FROM products WHERE deleted_at IS NULL;

-- Pembersihan sesi kedaluwarsa (jalankan berkala)
-- DELETE FROM sessions WHERE expires_at < NOW() OR revoked_at IS NOT NULL;
