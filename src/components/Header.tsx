import React from 'react';

interface HeaderProps {
  currentTab: 'catalog' | 'public-store';
  onTabChange: (tab: 'catalog' | 'public-store') => void;
  onOpenAddModal: () => void;
  onOpenSearchFocus: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal,
  onOpenSearchFocus,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#CDD2D2]">
      <div className="h-16 max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
        {/* Brand & Navigation */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onTabChange('catalog')}
            className="flex items-center gap-2 text-left focus:outline-none cursor-pointer"
          >
            <img
              alt="Logo e-hakim"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XpAQH_n2iJorKYU3sPszI6w28o4SJtItSnUol-4uBPgovQhm3NKnaLuqTO42OHPjBUWLKMNrkMwbQDqWvNiTZ9T-T6kq3I2C_LsM1vhYM9SwxLbrL9AKat-lGHhP34B6Bypj0tOksb-vYd1UcBF10vZUmWqDa0ZT1LTb6w4FNR5BOO8xhPAvVgbl7p0l-0gQdS0pD0uqNbEtM9xLMMvm09qp5tlN_E6o5vQZy21dZnFB7fy_A4NqKa4AU"
            />
            <span className="font-bold text-xl text-[#246750] tracking-tight hidden sm:inline">
              e-hakim
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onTabChange('catalog')}
              className={`transition-colors py-2 text-sm font-semibold cursor-pointer ${
                currentTab === 'catalog'
                  ? 'text-[#246750] border-b-2 border-[#246750]'
                  : 'text-[#3D4545] hover:text-[#246750]'
              }`}
            >
              Katalog Produk
            </button>
            <button
              onClick={onOpenAddModal}
              className="text-[#3D4545] hover:text-[#246750] transition-colors py-2 text-sm font-medium cursor-pointer"
            >
              Tambah Produk
            </button>
            <button
              onClick={() => onTabChange('public-store')}
              className={`transition-colors py-2 text-sm font-semibold cursor-pointer ${
                currentTab === 'public-store'
                  ? 'text-[#246750] border-b-2 border-[#246750]'
                  : 'text-[#3D4545] hover:text-[#246750]'
              }`}
            >
              Tampilan Toko Publik
            </button>
          </nav>
        </div>

        {/* Status, Search & Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F5EC] text-[#2E9E5B] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#2E9E5B] animate-pulse"></span>
            <span>Toko Buka</span>
          </div>

          <button
            onClick={onOpenSearchFocus}
            aria-label="Pencarian produk"
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#EEF0F0] hover:bg-[#dae4e4] text-[#3D4545] hover:text-[#1B2121] transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-[#CDD2D2]">
            <img
              alt="Profile Dapur Bu Ratna"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#CDD2D2]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwwxkV2ntZB7jV6R9csjalp-MBTM1O5_c5rSomFTFkUyjNXBYYPUXDzLEm4HflSdmssoRZ7bZmbjH2h4NOOG2-YiKVjVVIkpQJaHIBR6k8cwQkle91-q5psXXhH78bsqASdKoYsq23S1Kjhj5MGUo6xAynNjYiVpJ_2D2g-cYxnfhg5wZDT-Ej1-ThARikwMjRGduBE5jlQQFKmBI63xapnBwKxbTdVeDJuLNsfxOBTHupT2cbYsiB"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-semibold text-[#1B2121] leading-tight">
                Dapur Bu Ratna
              </span>
              <span className="text-xs text-[#7C8686] leading-tight">
                Pemilik Toko
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
