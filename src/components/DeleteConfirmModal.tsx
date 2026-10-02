import React from 'react';
import { Product } from '../types';

interface DeleteConfirmModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#CDD2D2] animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-full bg-[#FDEAEA] text-[#D64545] flex items-center justify-center mb-4 mx-auto">
          <span className="material-symbols-outlined text-[28px]">delete_forever</span>
        </div>
        <h3 className="text-lg font-bold text-center text-[#1B2121] mb-2">
          Hapus Produk Ini?
        </h3>
        <p className="text-sm text-center text-[#3D4545] mb-6">
          Apakah Anda yakin ingin menghapus <strong className="text-[#1B2121]">&ldquo;{product.name}&rdquo;</strong> dari katalog Dapur Bu Ratna? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 bg-[#EEF0F0] hover:bg-[#dae4e4] text-[#3D4545] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-11 bg-[#D64545] hover:bg-[#b53434] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            <span>Hapus Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
