import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info';
  title?: string;
  message: React.ReactNode;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <aside
      aria-live="polite"
      role="status"
      className="fixed top-20 right-6 z-50 flex items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xl border border-[#EEF0F0] animate-in fade-in slide-in-from-top-2 duration-200"
      style={{ maxWidth: '420px' }}
    >
      <div className="flex items-center gap-2.5">
        <span className="w-1.5 self-stretch rounded-full bg-[#2E9E5B]" />
        <span
          className="material-symbols-outlined text-[#2E9E5B] text-[22px] shrink-0"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
        <p className="text-sm text-[#1B2121] leading-snug">
          {toast.message}
        </p>
      </div>
      <button
        aria-label="Tutup notifikasi"
        onClick={onClose}
        className="p-1 rounded-lg text-[#7C8686] hover:text-[#1B2121] hover:bg-[#EEF0F0] transition-colors cursor-pointer shrink-0 ml-2"
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </aside>
  );
};
