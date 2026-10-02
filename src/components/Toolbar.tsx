import React from 'react';
import { CategoryFilter, SortOption } from '../types';

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  categoryCounts: {
    semua: number;
    makananRingan: number;
    laukSiapSaji: number;
    minumanSegar: number;
  };
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  categoryCounts,
  searchInputRef,
}) => {
  return (
    <section className="mt-2 mb-6">
      <div className="bg-white rounded-xl p-2 shadow-xs border border-[#EEF0F0] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7C8686] text-[20px] pointer-events-none">
            search
          </span>
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-[#F7F8F8] focus:bg-white text-[#1B2121] placeholder:text-[#7C8686] text-sm rounded-lg border border-transparent focus:border-[#246750] transition-colors outline-none"
            placeholder="Cari nama produk..."
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8686] hover:text-[#1B2121] p-1 rounded cursor-pointer"
              title="Hapus pencarian"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Categories Tabs */}
        <nav aria-label="Kategori Produk" className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => onCategoryChange('Semua')}
            className={`h-11 px-4 whitespace-nowrap text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'Semua'
                ? 'text-[#246750] bg-[#D5E9DF]/60'
                : 'text-[#3D4545] hover:text-[#1B2121] hover:bg-[#EEF0F0]'
            }`}
            type="button"
          >
            <span>Semua Produk</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                activeCategory === 'Semua'
                  ? 'bg-white text-[#246750] shadow-xs'
                  : 'bg-[#EEF0F0] text-[#7C8686]'
              }`}
            >
              {categoryCounts.semua}
            </span>
          </button>

          <button
            onClick={() => onCategoryChange('Makanan Ringan')}
            className={`h-11 px-4 whitespace-nowrap text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'Makanan Ringan'
                ? 'text-[#246750] bg-[#D5E9DF]/60'
                : 'text-[#3D4545] hover:text-[#1B2121] hover:bg-[#EEF0F0]'
            }`}
            type="button"
          >
            <span>Makanan Ringan</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                activeCategory === 'Makanan Ringan'
                  ? 'bg-white text-[#246750] shadow-xs'
                  : 'bg-[#EEF0F0] text-[#7C8686]'
              }`}
            >
              {categoryCounts.makananRingan}
            </span>
          </button>

          <button
            onClick={() => onCategoryChange('Lauk Siap Saji')}
            className={`h-11 px-4 whitespace-nowrap text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'Lauk Siap Saji'
                ? 'text-[#246750] bg-[#D5E9DF]/60'
                : 'text-[#3D4545] hover:text-[#1B2121] hover:bg-[#EEF0F0]'
            }`}
            type="button"
          >
            <span>Lauk Siap Saji</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                activeCategory === 'Lauk Siap Saji'
                  ? 'bg-white text-[#246750] shadow-xs'
                  : 'bg-[#EEF0F0] text-[#7C8686]'
              }`}
            >
              {categoryCounts.laukSiapSaji}
            </span>
          </button>

          <button
            onClick={() => onCategoryChange('Minuman Segar')}
            className={`h-11 px-4 whitespace-nowrap text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'Minuman Segar'
                ? 'text-[#246750] bg-[#D5E9DF]/60'
                : 'text-[#3D4545] hover:text-[#1B2121] hover:bg-[#EEF0F0]'
            }`}
            type="button"
          >
            <span>Minuman Segar</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                activeCategory === 'Minuman Segar'
                  ? 'bg-white text-[#246750] shadow-xs'
                  : 'bg-[#EEF0F0] text-[#7C8686]'
              }`}
            >
              {categoryCounts.minumanSegar}
            </span>
          </button>
        </nav>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          <label htmlFor="sort-select" className="text-xs text-[#7C8686] whitespace-nowrap hidden sm:inline">
            Urutkan:
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="h-11 pl-3 pr-8 bg-[#F7F8F8] hover:bg-white text-[#1B2121] text-sm font-medium rounded-lg border border-[#CDD2D2]/60 cursor-pointer outline-none appearance-none transition-colors"
            >
              <option value="terbaru">Terbaru Ditambahkan</option>
              <option value="harga-tinggi">Harga Tertinggi</option>
              <option value="harga-rendah">Harga Terendah</option>
              <option value="nama-az">Nama (A - Z)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7C8686] text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
