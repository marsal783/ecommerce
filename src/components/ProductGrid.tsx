import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  visibleCount: number;
  totalProductsCount: number;
  onLoadMore: () => void;
  onShowLess?: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onToggleVisibility: (productId: string, visible: boolean) => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  visibleCount,
  totalProductsCount,
  onLoadMore,
  onShowLess,
  onEditProduct,
  onDeleteProduct,
  onToggleVisibility,
  onResetFilters,
}) => {
  const displayedProducts = products.slice(0, visibleCount);

  if (products.length === 0) {
    return (
      <section className="w-full py-16 text-center bg-white rounded-xl border border-[#EEF0F0] p-8 shadow-xs my-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#EEF0F0] text-[#7C8686] flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">inventory_2</span>
        </div>
        <h3 className="text-lg font-bold text-[#1B2121] mb-1">
          Tidak ada produk yang cocok
        </h3>
        <p className="text-sm text-[#7C8686] max-w-md mx-auto mb-6">
          Coba periksa kata kunci pencarian atau ubah filter kategori produk Anda.
        </p>
        <button
          onClick={onResetFilters}
          className="h-10 px-5 bg-[#246750] text-white text-sm font-semibold rounded-xl hover:bg-[#3E7561] transition-colors cursor-pointer"
          type="button"
        >
          Reset Filter & Pencarian
        </button>
      </section>
    );
  }

  return (
    <section className="w-full">
      {/* 3 Columns on Desktop, 2 on Tablet, 1 on Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEditProduct}
            onDelete={onDeleteProduct}
            onToggleVisibility={onToggleVisibility}
          />
        ))}
      </div>

      {/* Friendly Empty/End State Footer Callout */}
      <div className="mt-8 p-6 bg-white rounded-xl shadow-xs border border-[#EEF0F0] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#EEF0F0] flex items-center justify-center text-[#246750] shrink-0">
            <span
              className="material-symbols-outlined text-[26px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
          <div>
            <p className="text-base font-bold text-[#1B2121]">
              Menampilkan {displayedProducts.length} dari {totalProductsCount} Produk
            </p>
            <p className="text-sm text-[#7C8686]">
              Semua produk sudah terintegrasi dengan pemesanan cepat via WhatsApp Bu Ratna.
            </p>
          </div>
        </div>

        {displayedProducts.length < products.length ? (
          <button
            onClick={onLoadMore}
            className="h-11 px-5 bg-[#EEF0F0] hover:bg-[#dae4e4] text-[#1B2121] text-sm font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
            type="button"
          >
            Muat Lebih Banyak Produk
          </button>
        ) : products.length > 6 ? (
          <button
            onClick={onShowLess}
            className="h-11 px-5 bg-[#EEF0F0] hover:bg-[#dae4e4] text-[#1B2121] text-sm font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
            type="button"
          >
            Tampilkan 6 Teratas Saja
          </button>
        ) : (
          <span className="text-xs text-[#2E9E5B] font-semibold bg-[#E6F5EC] px-3 py-1.5 rounded-lg">
            Semua Produk Tampil
          </span>
        )}
      </div>
    </section>
  );
};
