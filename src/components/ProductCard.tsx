import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleVisibility: (productId: string, visible: boolean) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onToggleVisibility,
}) => {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <article className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group border border-[#EEF0F0]">
      <div>
        {/* Product Image */}
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#EEF0F0] mb-4">
          <img
            src={
              imageError
                ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOibecJY28eSbptb2lMFR8qxIzIrDZPiKIpgvQN2w-72B54-n3FOOcgKHyl5wT6IYhd8OschFFDv2je1XRi5dqjwdZTbniVeiWj1OcI-cNq9-01krI3d3zLkiD6VqYnh0_AE7051uOCnNXQmBhLMZRzi5X-pPlGIXD33vDFb0tSUwGL_6dQq7QWQew_4LczPbU0G3SSL1ug7i5lBst9VlD29RP2XmuU0OkmVqTZg00u4v5TZNd2c3k'
                : product.imageUrl
            }
            alt={product.imageAlt || product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {product.isNew && (
            <span className="absolute top-2.5 left-2.5 bg-[#D5E9DF] text-[#325E4E] text-xs font-semibold px-2 py-0.5 rounded-full shadow-xs">
              Baru
            </span>
          )}

          {!product.isVisible && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
              <span className="text-xs font-semibold bg-[#3D4545] text-white px-2.5 py-1 rounded-md shadow-xs">
                Disembunyikan dari Toko
              </span>
            </div>
          )}
        </div>

        {/* Category & Availability */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs text-[#7C8686] bg-[#EEF0F0] px-2 py-0.5 rounded font-medium">
            {product.category}
          </span>
          {product.isAvailable ? (
            <span className="text-xs text-[#2E9E5B] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E5B]"></span> Tersedia
            </span>
          ) : (
            <span className="text-xs text-[#D64545] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D64545]"></span> Habis
            </span>
          )}
        </div>

        {/* Name */}
        <h3
          className="text-base font-semibold text-[#1B2121] line-clamp-2 mb-1 group-hover:text-[#246750] transition-colors"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="text-base font-bold text-[#325E4E] tabular-nums mb-2">
          {formatPrice(product.price)}
        </div>

        {/* Description */}
        <p className="text-sm text-[#3D4545] line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Footer Controls */}
      <div className="pt-2 bg-[#ebf6f5]/60 -mx-4 -mb-4 px-4 pb-4 rounded-b-xl flex items-center justify-between gap-2 border-t border-[#8FC1A9]/20">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(product)}
            aria-label={`Edit ${product.name}`}
            className="w-10 h-10 rounded-lg text-[#3D4545] hover:text-[#246750] hover:bg-white transition-colors flex items-center justify-center cursor-pointer"
            title="Edit produk"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button
            onClick={() => onDelete(product)}
            aria-label={`Hapus ${product.name}`}
            className="w-10 h-10 rounded-lg text-[#3D4545] hover:text-[#D64545] hover:bg-[#FDEAEA] transition-colors flex items-center justify-center cursor-pointer"
            title="Hapus produk"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>

        {/* Switch Status: Tampilkan */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-xs text-[#3D4545] font-medium">Tampilkan</span>
          <input
            checked={product.isVisible}
            onChange={(e) => onToggleVisibility(product.id, e.target.checked)}
            className="sr-only peer"
            type="checkbox"
          />
          <div className="w-11 h-6 bg-[#CDD2D2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CDD2D2] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#246750] relative"></div>
        </label>
      </div>
    </article>
  );
};
