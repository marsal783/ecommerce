import React from 'react';

interface HelpModalsProps {
  type: 'whatsapp' | 'photo' | 'share' | null;
  onClose: () => void;
}

export const HelpModals: React.FC<HelpModalsProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#CDD2D2] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#EEF0F0]">
          <div className="flex items-center gap-2">
            {type === 'whatsapp' && (
              <>
                <span className="material-symbols-outlined text-[#2E9E5B] text-[24px]">
                  chat
                </span>
                <h3 className="text-lg font-bold text-[#1B2121]">
                  Pusat Bantuan WhatsApp e-hakim
                </h3>
              </>
            )}
            {type === 'photo' && (
              <>
                <span className="material-symbols-outlined text-[#F2B84B] text-[24px]">
                  photo_camera
                </span>
                <h3 className="text-lg font-bold text-[#1B2121]">
                  Tips Foto Produk Menarik Pembeli
                </h3>
              </>
            )}
            {type === 'share' && (
              <>
                <span className="material-symbols-outlined text-[#2F7FD1] text-[24px]">
                  share
                </span>
                <h3 className="text-lg font-bold text-[#1B2121]">
                  Panduan Membagikan Katalog
                </h3>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#7C8686] hover:text-[#1B2121] hover:bg-[#EEF0F0] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 text-sm text-[#3D4545] space-y-3">
          {type === 'whatsapp' && (
            <>
              <p>
                Butuh bantuan seputar pengelolaan toko, upload produk, atau integrasi nomor WhatsApp pesanan?
              </p>
              <div className="bg-[#EEF6F2] p-4 rounded-xl border border-[#8FC1A9]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#246750] font-semibold text-xs">
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                  <span>Tim Support e-hakim Siap Membantu</span>
                </div>
                <p className="text-xs text-[#3D4545]">
                  Jam operasional: Setiap hari pukul 08.00 – 21.00 WIB.
                </p>
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Tim%20e-hakim,%20saya%20butuh%20bantuan%20seputar%20katalog%20toko%20saya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Chat CS via WhatsApp</span>
                </a>
              </div>
            </>
          )}

          {type === 'photo' && (
            <ul className="space-y-2.5 text-xs text-[#3D4545]">
              <li className="flex items-start gap-2 bg-[#F7F8F8] p-2.5 rounded-lg">
                <span className="material-symbols-outlined text-[#F2B84B] text-[18px] shrink-0">
                  light_mode
                </span>
                <div>
                  <strong className="text-[#1B2121] block">Gunakan Cahaya Alami</strong>
                  Foto di dekat jendela atau ruangan terang pagi hari agar warna masakan terlihat segar dan menggugah selera.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#F7F8F8] p-2.5 rounded-lg">
                <span className="material-symbols-outlined text-[#246750] text-[18px] shrink-0">
                  aspect_ratio
                </span>
                <div>
                  <strong className="text-[#1B2121] block">Format Persegi (1:1)</strong>
                  Katalog e-hakim menampilkan foto rasio 1:1, pastikan produk berada di tengah bidang foto.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#F7F8F8] p-2.5 rounded-lg">
                <span className="material-symbols-outlined text-[#2F7FD1] text-[18px] shrink-0">
                  restaurant
                </span>
                <div>
                  <strong className="text-[#1B2121] block">Perlihatkan Tekstur Asli</strong>
                  Tampilkan potongan lauk, taburan bumbu rempah, atau kemasan toples bersih tanpa filter berlebihan.
                </div>
              </li>
            </ul>
          )}

          {type === 'share' && (
            <div className="space-y-2.5 text-xs text-[#3D4545]">
              <div className="bg-[#EEF6F2] p-3 rounded-lg border border-[#8FC1A9]/30">
                <strong className="text-[#246750] block mb-1">1. Pasang di Bio Instagram & TikTok</strong>
                <p>Salin tautan toko Anda lalu tempel di kolom &ldquo;Website&rdquo; atau &ldquo;Links&rdquo; pada profil media sosial bisnis Anda.</p>
              </div>
              <div className="bg-[#EEF6F2] p-3 rounded-lg border border-[#8FC1A9]/30">
                <strong className="text-[#246750] block mb-1">2. Status WhatsApp Harian</strong>
                <p>Posting foto produk favorit Anda di Status WhatsApp dan sertakan link katalog agar kontak Anda langsung melihat menu lengkap.</p>
              </div>
              <div className="bg-[#EEF6F2] p-3 rounded-lg border border-[#8FC1A9]/30">
                <strong className="text-[#246750] block mb-1">3. Auto-Reply WhatsApp Business</strong>
                <p>Setel pesan selamat datang otomatis di WhatsApp Business yang menyertakan tautan katalog e-hakim Anda.</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-[#EEF0F0] flex justify-end">
          <button
            onClick={onClose}
            className="h-9 px-4 bg-[#246750] text-white text-xs font-semibold rounded-lg hover:bg-[#3E7561] transition-colors cursor-pointer"
            type="button"
          >
            Mengerti, Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
