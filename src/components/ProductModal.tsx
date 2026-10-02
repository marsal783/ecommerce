import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  editingProduct: Product | null;
}

const PRESET_IMAGES = [
  {
    label: 'Sambal Cumi Asin',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOibecJY28eSbptb2lMFR8qxIzIrDZPiKIpgvQN2w-72B54-n3FOOcgKHyl5wT6IYhd8OschFFDv2je1XRi5dqjwdZTbniVeiWj1OcI-cNq9-01krI3d3zLkiD6VqYnh0_AE7051uOCnNXQmBhLMZRzi5X-pPlGIXD33vDFb0tSUwGL_6dQq7QWQew_4LczPbU0G3SSL1ug7i5lBst9VlD29RP2XmuU0OkmVqTZg00u4v5TZNd2c3k',
  },
  {
    label: 'Rendang Sapi Suwir',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhow8I3MdSmuzQNH5_mh32zk0-ysdCHYCWXaMS0-Hiy-aEU3FZAer06ngArni3-svO-ArIVfihuNSlVtlH2AMnVbsd6MK3rZu7XVv1og-JONd5mKl4V1MpVb0JCFw2vlpzLAaQYOi628VKb8jb6GxIoECOrwdjs81l0Ca9dqyiW_XoYstQxGRCAvFOYrYdRup-7V5UMgS-q7EWlsSyDm24Xp8toEZWIvmw6_AQg96iSIbOnoMzX67-',
  },
  {
    label: 'Keripik Tempe',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrhqGfOeG8THH20evoJZU4re1CpqLF0yuWQSfqCVN93vfYgAIHZvf6oZX67SfdcsOdT05p0860O57bhBiwhgTpXzV7c1A7BIQyYdxMK2cpeslkLhC_dE1_XBgUf6DPndPQi5_Ccq8FHcA2I1YcA3CHE6w8gZ_UNwKGSTGEaA0p8BGdJb9TXDejYJlC4cd5uXpFo80gtkKNF8T8uiR4naeYMPl3UL1-Js5cTE34sVMAgWwQ-Aa1hLC7',
  },
  {
    label: 'Sirup Markisa',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzhA_HeNoOPJPnKlGPvdu84UdRh1Hwj_ghmdVNjJcmaK3O0CPnUnW-gIXS8Z4ryjUQBidRWCPaPgWyE2vRqd3ZmAhKkCapOMwoZfI3Izyz-VhaVGuJjfqIN9frOleoK3U_Zb6ITEjIMLWs7rj_j0Sxrrj1ru4KHcPvRA4bUE2xyjAbm0zG9ws4oV43doVpiNP69EvVt_HRtGpI-4TMhj3T9PXmDiRsCakb4-0srPm2afTZwlTYkqBM',
  },
  {
    label: 'Kentang Mustofa',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7ZEJOf-jPTJ_7dokzp7wxpbotNnhnJSHvEd1g5sw9Sv-K-kSM7Hlvz2cO3XsLg_waf155WoaDvLT0GpnFjaZ9DPJ83bu0MzKOybn0KBfrklON6w5FpotHEGhjzfUDNyyXYz-vQcFUBvAhUm1KdzgJHDO9FBo_VeNi_aIYNcRUkH4jwrCGw60qV-oGHOJ0tx-unmmvPA1U6385dfDIpoUyE-2YmF49O23xp9iht-TdVUEsUjnm3DnV',
  },
  {
    label: 'Abon Cakalang',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfDYVTP5iqDunsXPUdt18Grn1Bw2Yg8BIUcksZalLdYFuy6gRq0P2ONOvrL9VSHBl4EnFnRlUxpxIZRfWOYauuzqdLWQRmRV7fwQ_VvC7jlb9l-Eo5XMDW51mqqqi-HRmi7NMTFU5QfEmCo0A4fUM2IDAIjjTXHTs51dGqp10s6XLwK7BPs31w6PmBZi6VTNL5bMaujXkbCJQQkxzl23Gx5rcDld5dnjm-0T53sKEpYdxlyv_EjQOJ',
  },
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Lauk Siap Saji' | 'Makanan Ringan' | 'Minuman Segar'>('Lauk Siap Saji');
  const [price, setPrice] = useState<number | string>(35000);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setPrice(editingProduct.price);
      setDescription(editingProduct.description);
      setImageUrl(editingProduct.imageUrl);
      setIsAvailable(editingProduct.isAvailable);
      setIsVisible(editingProduct.isVisible);
      setIsNew(!!editingProduct.isNew);
    } else {
      setName('');
      setCategory('Lauk Siap Saji');
      setPrice(25000);
      setDescription('');
      setImageUrl(PRESET_IMAGES[0].url);
      setIsAvailable(true);
      setIsVisible(true);
      setIsNew(true);
    }
    setErrors({});
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Nama produk wajib diisi';
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = 'Harga produk harus lebih dari Rp 0';
    }
    if (!description.trim()) {
      newErrors.description = 'Deskripsi produk wajib diisi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      category,
      price: numPrice,
      description: description.trim(),
      imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
      isAvailable,
      isVisible,
      isNew,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8 border border-[#CDD2D2]">
        <div className="flex items-center justify-between pb-4 border-b border-[#EEF0F0]">
          <h2 className="text-xl font-bold text-[#1B2121]">
            {editingProduct ? 'Edit Informasi Produk' : 'Tambah Produk Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#7C8686] hover:text-[#1B2121] hover:bg-[#EEF0F0] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-[#1B2121] mb-1">
              Nama Produk <span className="text-[#D64545]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Sambal Bawang Cumi Asin (150g)"
              className="w-full h-11 px-3.5 bg-[#F7F8F8] focus:bg-white text-sm text-[#1B2121] rounded-lg border border-[#CDD2D2] focus:border-[#246750] outline-none"
            />
            {errors.name && (
              <p className="text-xs text-[#D64545] mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B2121] mb-1">
                Kategori <span className="text-[#D64545]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-11 px-3 bg-[#F7F8F8] focus:bg-white text-sm text-[#1B2121] rounded-lg border border-[#CDD2D2] focus:border-[#246750] outline-none cursor-pointer"
              >
                <option value="Lauk Siap Saji">Lauk Siap Saji</option>
                <option value="Makanan Ringan">Makanan Ringan</option>
                <option value="Minuman Segar">Minuman Segar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2121] mb-1">
                Harga (Rupiah) <span className="text-[#D64545]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7C8686]">
                  Rp
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="35000"
                  className="w-full h-11 pl-10 pr-3 bg-[#F7F8F8] focus:bg-white text-sm font-semibold tabular-nums text-[#1B2121] rounded-lg border border-[#CDD2D2] focus:border-[#246750] outline-none"
                />
              </div>
              {errors.price && (
                <p className="text-xs text-[#D64545] mt-1">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#1B2121] mb-1">
              Deskripsi Singkat <span className="text-[#D64545]">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan rasa, bahan baku pilihan, keunggulan, dan cara penyajian produk Anda..."
              className="w-full p-3 bg-[#F7F8F8] focus:bg-white text-sm text-[#1B2121] rounded-lg border border-[#CDD2D2] focus:border-[#246750] outline-none resize-none"
            />
            {errors.description && (
              <p className="text-xs text-[#D64545] mt-1">{errors.description}</p>
            )}
          </div>

          {/* Product Image Presets */}
          <div>
            <label className="block text-xs font-semibold text-[#1B2121] mb-1.5">
              Pilih Foto Produk
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => setImageUrl(img.url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    imageUrl === img.url
                      ? 'border-[#246750] ring-2 ring-[#246750]/30 scale-95'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                  title={img.label}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                  {imageUrl === img.url && (
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#246750] text-white rounded-full flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Atau tempel URL gambar kustom..."
              className="w-full h-9 px-3 bg-[#F7F8F8] focus:bg-white text-xs text-[#1B2121] rounded-lg border border-[#CDD2D2] focus:border-[#246750] outline-none"
            />
          </div>

          {/* Status Switches */}
          <div className="bg-[#EEF6F2] p-3 rounded-xl space-y-2 border border-[#8FC1A9]/30">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#1B2121] block">
                  Status Ketersediaan
                </span>
                <span className="text-[11px] text-[#7C8686]">
                  Apakah stok produk siap dipesan pembeli?
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-[#CDD2D2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CDD2D2] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#246750] relative"></div>
                <span className="text-xs font-semibold text-[#246750] w-14">
                  {isAvailable ? 'Tersedia' : 'Habis'}
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#8FC1A9]/20">
              <div>
                <span className="text-xs font-semibold text-[#1B2121] block">
                  Tampilkan di Etalase Publik
                </span>
                <span className="text-[11px] text-[#7C8686]">
                  Dapat dilihat dan dipesan langsung oleh pembeli.
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-[#CDD2D2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CDD2D2] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#246750] relative"></div>
                <span className="text-xs font-semibold text-[#246750] w-14">
                  {isVisible ? 'Aktif' : 'Sembunyi'}
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#8FC1A9]/20">
              <div>
                <span className="text-xs font-semibold text-[#1B2121] block">
                  Beri Tanda &quot;Baru&quot;
                </span>
                <span className="text-[11px] text-[#7C8686]">
                  Tampilkan badge produk baru di pojok foto.
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-[#CDD2D2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CDD2D2] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#246750] relative"></div>
                <span className="text-xs font-semibold text-[#246750] w-14">
                  {isNew ? 'Ya' : 'Tidak'}
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EEF0F0]">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 bg-[#EEF0F0] hover:bg-[#dae4e4] text-[#3D4545] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="h-10 px-6 bg-[#246750] hover:bg-[#3E7561] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>{editingProduct ? 'Simpan Perubahan' : 'Terbitkan Produk'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
