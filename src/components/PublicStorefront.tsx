import React, { useState } from 'react';
import { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface PublicStorefrontProps {
  products: Product[];
  onBackToAdmin: () => void;
}

export const PublicStorefront: React.FC<PublicStorefrontProps> = ({
  products,
  onBackToAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Only show visible products
  const visibleProducts = products.filter((p) => p.isVisible);

  const filteredProducts = visibleProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Semua' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    let message = `*PESANAN BARU DARI E-HAKIM*\n\n`;
    message += `Halo Dapur Bu Ratna, saya ingin memesan menu berikut:\n`;

    cart.forEach((item) => {
      message += `• ${item.quantity}x ${item.product.name} (Rp ${(
        item.product.price * item.quantity
      ).toLocaleString('id-ID')})\n`;
    });

    message += `\n*Total Belanja:* Rp ${totalCartPrice.toLocaleString('id-ID')}\n`;

    if (customerName.trim()) {
      message += `*Nama Pemesan:* ${customerName.trim()}\n`;
    }
    if (customerAddress.trim()) {
      message += `*Alamat Pengiriman:* ${customerAddress.trim()}\n`;
    }

    message += `\nMohon informasi ongkir dan nomor rekening pembayaran ya. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F7F8F8] pb-24">
      {/* Banner Indicator: Merchant Preview Mode */}
      <div className="bg-[#246750] text-white px-4 py-2.5 shadow-xs sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#adf1d3] animate-ping"></span>
            <span>
              <strong>Mode Pratinjau Toko Publik:</strong> Ini adalah tampilan yang dilihat oleh calon pembeli di <code>e-hakim.id/dapurburatna</code>.
            </span>
          </div>
          <button
            onClick={onBackToAdmin}
            className="px-3 py-1 bg-white text-[#246750] font-semibold rounded-lg hover:bg-[#EEF6F2] transition-colors cursor-pointer shrink-0"
          >
            Kembali ke Pengelolaan Toko
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        {/* Merchant Public Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#CDD2D2] shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              alt="Dapur Bu Ratna"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#246750]/30 shadow-xs"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwwxkV2ntZB7jV6R9csjalp-MBTM1O5_c5rSomFTFkUyjNXBYYPUXDzLEm4HflSdmssoRZ7bZmbjH2h4NOOG2-YiKVjVVIkpQJaHIBR6k8cwQkle91-q5psXXhH78bsqASdKoYsq23S1Kjhj5MGUo6xAynNjYiVpJ_2D2g-cYxnfhg5wZDT-Ej1-ThARikwMjRGduBE5jlQQFKmBI63xapnBwKxbTdVeDJuLNsfxOBTHupT2cbYsiB"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1B2121]">
                  Dapur Bu Ratna
                </h1>
                <span
                  className="material-symbols-outlined text-[#2E9E5B] text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  title="Toko Terverifikasi e-hakim"
                >
                  verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#7C8686] mb-2">
                Kuliner rumahan khas Nusantara, lauk siap saji lezat & higienis, serta aneka camilan renyah.
              </p>
              <div className="flex items-center flex-wrap gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-[#E6F5EC] text-[#2E9E5B] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E5B]"></span> Toko Buka
                </span>
                <span className="text-[#7C8686]">·</span>
                <span className="text-[#3D4545]">Tangerang Selatan</span>
                <span className="text-[#7C8686]">·</span>
                <span className="text-[#3D4545]">Kirim Setiap Hari</span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#EEF0F0]">
            <span className="text-xs text-[#7C8686]">Pesan Praktis via WA:</span>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Hubungi Toko</span>
            </a>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="bg-white rounded-xl p-3 shadow-xs border border-[#EEF0F0] mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7C8686] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari lauk atau camilan..."
              className="w-full h-10 pl-9 pr-3 bg-[#F7F8F8] text-xs rounded-lg border border-[#CDD2D2] outline-none focus:border-[#246750]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
            {['Semua', 'Makanan Ringan', 'Lauk Siap Saji', 'Minuman Segar'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`h-9 px-3.5 whitespace-nowrap text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#246750] text-white shadow-xs'
                    : 'bg-[#EEF0F0] text-[#3D4545] hover:bg-[#dae4e4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid for Buyers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const inCart = cart.find((i) => i.product.id === product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl p-4 border border-[#CDD2D2] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-[#EEF0F0] mb-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.isNew && (
                      <span className="absolute top-2.5 left-2.5 bg-[#D5E9DF] text-[#325E4E] text-xs font-semibold px-2 py-0.5 rounded-full">
                        Baru
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#7C8686] mb-1 font-medium">
                    {product.category}
                  </div>
                  <h3 className="text-base font-bold text-[#1B2121] line-clamp-1 mb-1">
                    {product.name}
                  </h3>
                  <div className="text-base font-bold text-[#246750] tabular-nums mb-2">
                    Rp {product.price.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-[#3D4545] line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EEF0F0] flex items-center justify-between">
                  {inCart ? (
                    <div className="flex items-center gap-2 bg-[#EEF6F2] p-1 rounded-lg">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-7 h-7 rounded bg-white text-[#246750] font-bold flex items-center justify-center border border-[#8FC1A9] hover:bg-[#D5E9DF] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-[#246750] px-2 tabular-nums">
                        {inCart.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="w-7 h-7 rounded bg-white text-[#246750] font-bold flex items-center justify-center border border-[#8FC1A9] hover:bg-[#D5E9DF] cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.isAvailable}
                      className={`h-9 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        product.isAvailable
                          ? 'bg-[#246750] hover:bg-[#3E7561] text-white shadow-xs'
                          : 'bg-[#EEF0F0] text-[#7C8686] cursor-not-allowed'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        add_shopping_cart
                      </span>
                      <span>{product.isAvailable ? '+ Keranjang' : 'Stok Habis'}</span>
                    </button>
                  )}

                  <span className="text-xs text-[#2E9E5B] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E5B]"></span> Siap Kirim
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Cart Bar (if items in cart) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-40 bg-[#1B2121] text-white p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#246750] flex items-center justify-center font-bold text-sm">
              {totalCartCount}
            </div>
            <div>
              <div className="text-xs text-[#EEF0F0]">Total Pesanan:</div>
              <div className="text-base font-bold text-white tabular-nums">
                Rp {totalCartPrice.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="h-10 px-4 bg-[#3D4545] hover:bg-[#4d5656] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Lihat Detail
            </button>
            <button
              onClick={handleCheckoutWhatsApp}
              className="h-10 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Pesan via WA</span>
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#CDD2D2] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF0F0]">
              <h3 className="text-lg font-bold text-[#1B2121]">
                Keranjang Belanja ({totalCartCount} item)
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-lg text-[#7C8686] hover:text-[#1B2121] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="divide-y divide-[#EEF0F0] my-4">
              {cart.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#1B2121] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="text-xs text-[#246750] font-semibold tabular-nums">
                        Rp {item.product.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-6 h-6 rounded bg-[#EEF0F0] text-[#1B2121] font-bold text-xs flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold tabular-nums px-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-6 h-6 rounded bg-[#EEF0F0] text-[#1B2121] font-bold text-xs flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#EEF6F2] p-4 rounded-xl border border-[#8FC1A9]/30 mb-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1B2121] mb-1">
                  Nama Anda
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Ibu Rina"
                  className="w-full h-9 px-3 bg-white text-xs rounded-lg border border-[#CDD2D2] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B2121] mb-1">
                  Alamat Pengiriman
                </label>
                <textarea
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Jl. Mawar No. 12, Kel. BSD, Tangerang Selatan"
                  className="w-full p-2 bg-white text-xs rounded-lg border border-[#CDD2D2] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#8FC1A9]/20 font-bold">
                <span className="text-xs text-[#1B2121]">Subtotal:</span>
                <span className="text-sm text-[#246750] tabular-nums">
                  Rp {totalCartPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsCartOpen(false)}
                className="h-10 px-4 bg-[#EEF0F0] text-[#3D4545] text-xs font-semibold rounded-xl cursor-pointer"
              >
                Lanjut Pilih Menu
              </button>
              <button
                onClick={handleCheckoutWhatsApp}
                className="h-10 px-5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Kirim Pesanan ke WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
