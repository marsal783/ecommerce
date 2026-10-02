import React from 'react';

interface HeroSectionProps {
  totalActiveProducts: number;
  onOpenAddModal: () => void;
  onShareLink: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalActiveProducts,
  onOpenAddModal,
  onShareLink,
}) => {
  return (
    <section className="w-full pt-6 pb-4">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center flex-wrap gap-2.5 mb-1.5">
            <h1 className="text-2xl sm:text-[26px] font-bold text-[#1B2121] tracking-tight">
              Katalog Produk Saya
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#D5E9DF] text-[#325E4E] text-xs font-semibold">
              {totalActiveProducts} Produk Aktif
            </span>
          </div>
          <p className="text-sm text-[#3D4545] leading-relaxed">
            Kelola etalase online Anda. Perubahan akan langsung terlihat oleh pembeli di tautan katalog publik.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start">
          <button
            onClick={onShareLink}
            id="btn-share-link"
            type="button"
            className="h-11 px-4 bg-white hover:bg-[#EEF6F2] text-[#325E4E] text-sm font-semibold rounded-xl border border-[#CDD2D2] shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] text-[#246750]">
              share
            </span>
            <span>Bagikan Katalog</span>
            <span className="hidden sm:inline text-xs text-[#7C8686] bg-[#EEF0F0] px-2 py-0.5 rounded font-normal">
              e-hakim.id/dapurburatna
            </span>
          </button>

          <button
            onClick={onOpenAddModal}
            type="button"
            className="h-11 px-5 bg-[#246750] hover:bg-[#3E7561] active:bg-[#325E4E] text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Tambah Produk Baru</span>
          </button>
        </div>
      </div>
    </section>
  );
};
