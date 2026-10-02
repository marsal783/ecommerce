import React from 'react';

interface ReminderBannerProps {
  onPreviewStore: () => void;
}

export const ReminderBanner: React.FC<ReminderBannerProps> = ({ onPreviewStore }) => {
  return (
    <section className="my-4">
      <div className="bg-[#EEF6F2] border border-[#8FC1A9]/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#D5E9DF] text-[#246750] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">storefront</span>
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-[#325E4E] mb-0.5">
              Toko Anda Siap Menerima Pembeli
            </h2>
            <p className="text-sm text-[#3D4545]">
              Katalog Anda sedang online dan aktif menerima pesanan via WhatsApp. Pastikan nomor kontak selalu aktif.
            </p>
          </div>
        </div>
        <button
          onClick={onPreviewStore}
          type="button"
          className="h-10 px-4 inline-flex items-center justify-center text-[#325E4E] hover:text-[#246750] text-sm font-semibold bg-white/90 hover:bg-white rounded-xl border border-[#CDD2D2] shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <span>Lihat Pratinjau Toko</span>
          <span className="material-symbols-outlined text-[18px] ml-1.5">open_in_new</span>
        </button>
      </div>
    </section>
  );
};
