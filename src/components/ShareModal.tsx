import React, { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopySuccess: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://e-hakim.id/dapurburatna';
  const whatsappText = `Halo! Yuk lihat etalase menu lezat Dapur Bu Ratna di tautan berikut: ${shareUrl}. Pesan langsung via WhatsApp mudah dan cepat!`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    onCopySuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#CDD2D2] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#EEF0F0]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#246750] text-[24px]">
              share
            </span>
            <h3 className="text-lg font-bold text-[#1B2121]">
              Bagikan Katalog Toko
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#7C8686] hover:text-[#1B2121] hover:bg-[#EEF0F0] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-sm text-[#3D4545]">
            Bagikan tautan etalase online Anda ke pelanggan di WhatsApp Status, Instagram, atau grup keluarga.
          </p>

          {/* Copy link input box */}
          <div className="flex items-center gap-2 bg-[#F7F8F8] p-2 rounded-xl border border-[#CDD2D2]">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent flex-1 text-sm font-medium text-[#1B2121] px-2 outline-none"
            />
            <button
              onClick={handleCopy}
              className={`h-9 px-3.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                copied
                  ? 'bg-[#2E9E5B] text-white'
                  : 'bg-[#246750] hover:bg-[#3E7561] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Tersalin!' : 'Salin'}</span>
            </button>
          </div>

          {/* QR Code Simulation */}
          <div className="bg-[#EEF6F2] p-4 rounded-xl text-center border border-[#8FC1A9]/30">
            <p className="text-xs font-semibold text-[#325E4E] mb-2">
              Scan QR Code untuk Buka Katalog di Smartphone
            </p>
            <div className="w-36 h-36 mx-auto bg-white p-2 rounded-lg border border-[#8FC1A9]/40 shadow-xs flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                  shareUrl
                )}`}
                alt="QR Code Katalog Dapur Bu Ratna"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[11px] text-[#7C8686] mt-2">
              Bisa dicetak dan dipajang di kasir atau stiker kemasan produk.
            </p>
          </div>

          {/* Share Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleWhatsAppShare}
              className="w-full h-11 bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span>Bagikan Langsung ke WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
