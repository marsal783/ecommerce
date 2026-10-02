import React from 'react';

interface FooterProps {
  onOpenHelp: (type: 'whatsapp' | 'photo' | 'share') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHelp }) => {
  return (
    <footer className="w-full bg-white border-t border-[#CDD2D2] mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[#3D4545] text-sm font-medium">
          <button
            onClick={() => onOpenHelp('whatsapp')}
            className="flex items-center gap-1.5 hover:text-[#246750] transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#2E9E5B]">
              chat
            </span>
            <span>Pusat Bantuan WhatsApp</span>
          </button>

          <button
            onClick={() => onOpenHelp('photo')}
            className="flex items-center gap-1.5 hover:text-[#246750] transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#F2B84B]">
              photo_camera
            </span>
            <span>Tips Foto Produk</span>
          </button>

          <button
            onClick={() => onOpenHelp('share')}
            className="flex items-center gap-1.5 hover:text-[#246750] transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#2F7FD1]">
              share
            </span>
            <span>Panduan Bagikan Katalog</span>
          </button>
        </div>

        <div className="text-center md:text-right text-xs text-[#7C8686]">
          © 2025 e-hakim. Seluruh hak cipta dilindungi undang-undang.
        </div>
      </div>
    </footer>
  );
};
