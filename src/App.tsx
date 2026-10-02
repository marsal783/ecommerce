import { useState, useRef, useMemo, useEffect } from 'react';
import { Product, CategoryFilter, SortOption } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { Header } from './components/Header';
import { Toast, ToastMessage } from './components/Toast';
import { HeroSection } from './components/HeroSection';
import { ReminderBanner } from './components/ReminderBanner';
import { Toolbar } from './components/Toolbar';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ShareModal } from './components/ShareModal';
import { HelpModals } from './components/HelpModals';
import { Footer } from './components/Footer';
import { PublicStorefront } from './components/PublicStorefront';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ehakim_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  // Current View: 'catalog' (Merchant Management) or 'public-store' (Buyer Storefront)
  const [currentTab, setCurrentTab] = useState<'catalog' | 'public-store'>('catalog');

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Semua');
  const [sortBy, setSortBy] = useState<SortOption>('terbaru');

  // Display pagination: initially 6 products as shown in the original screenshot
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Floating Toast Notification matching screenshot: "Produk “Sambal Bawang Cumi” berhasil diperbarui."
  const [toast, setToast] = useState<ToastMessage | null>({
    id: 'initial-toast',
    type: 'success',
    message: (
      <span>
        Produk <strong className="font-semibold">&ldquo;Sambal Bawang Cumi&rdquo;</strong> berhasil diperbarui.
      </span>
    ),
  });

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [helpModalType, setHelpModalType] = useState<'whatsapp' | 'photo' | 'share' | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ehakim_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      semua: products.length,
      makananRingan: products.filter((p) => p.category === 'Makanan Ringan').length,
      laukSiapSaji: products.filter((p) => p.category === 'Lauk Siap Saji').length,
      minumanSegar: products.filter((p) => p.category === 'Minuman Segar').length,
    };
  }, [products]);

  // Total active products count
  const totalActiveProducts = useMemo(() => {
    return products.filter((p) => p.isVisible).length;
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== 'Semua') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'terbaru') {
        return b.createdAt - a.createdAt;
      }
      if (sortBy === 'harga-tinggi') {
        return b.price - a.price;
      }
      if (sortBy === 'harga-rendah') {
        return a.price - b.price;
      }
      if (sortBy === 'nama-az') {
        return a.name.localeCompare(b.name, 'id');
      }
      return 0;
    });

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeletePrompt = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    const name = productToDelete.name;
    setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    setIsDeleteModalOpen(false);
    setProductToDelete(null);

    setToast({
      id: Date.now().toString(),
      type: 'info',
      message: (
        <span>
          Produk <strong className="font-semibold">&ldquo;{name}&rdquo;</strong> berhasil dihapus.
        </span>
      ),
    });
  };

  const handleToggleVisibility = (productId: string, visible: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isVisible: visible } : p))
    );
    const target = products.find((p) => p.id === productId);
    if (target) {
      setToast({
        id: Date.now().toString(),
        type: 'success',
        message: (
          <span>
            Produk <strong className="font-semibold">&ldquo;{target.name}&rdquo;</strong>{' '}
            {visible ? 'kini tampil di etalase toko.' : 'telah disembunyikan.'}
          </span>
        ),
      });
    }
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      // Update
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? ({ ...p, ...productData } as Product)
            : p
        )
      );
      setToast({
        id: Date.now().toString(),
        type: 'success',
        message: (
          <span>
            Produk <strong className="font-semibold">&ldquo;{productData.name}&rdquo;</strong> berhasil diperbarui.
          </span>
        ),
      });
    } else {
      // Create new
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: productData.name || 'Produk Baru',
        category: productData.category || 'Lauk Siap Saji',
        price: productData.price || 30000,
        description: productData.description || '',
        imageUrl: productData.imageUrl || INITIAL_PRODUCTS[0].imageUrl,
        isNew: true,
        isAvailable: productData.isAvailable ?? true,
        isVisible: productData.isVisible ?? true,
        createdAt: Date.now(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      setToast({
        id: Date.now().toString(),
        type: 'success',
        message: (
          <span>
            Produk <strong className="font-semibold">&ldquo;{newProduct.name}&rdquo;</strong> berhasil ditambahkan ke katalog.
          </span>
        ),
      });
    }
  };

  const handleShareLink = () => {
    setIsShareModalOpen(true);
  };

  const handleCopyLinkSuccess = () => {
    setToast({
      id: Date.now().toString(),
      type: 'success',
      message: <span>Tautan katalog toko berhasil disalin ke papan klip!</span>,
    });
  };

  const handleFocusSearch = () => {
    if (currentTab !== 'catalog') {
      setCurrentTab('catalog');
    }
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleLoadMore = () => {
    setVisibleCount(products.length);
  };

  const handleShowLess = () => {
    setVisibleCount(6);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('Semua');
    setSortBy('terbaru');
    setVisibleCount(6);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F8] flex flex-col justify-between selection:bg-[#D5E9DF] selection:text-[#246750]">
      {/* Top Fixed Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddModal={handleOpenAddModal}
        onOpenSearchFocus={handleFocusSearch}
      />

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Main Content Area */}
      {currentTab === 'catalog' ? (
        <main className="w-full pt-16 flex-1 bg-[#F7F8F8] max-w-7xl mx-auto px-4">
          <div className="flex flex-col w-full pb-8">
            {/* Top Hero Section */}
            <HeroSection
              totalActiveProducts={totalActiveProducts}
              onOpenAddModal={handleOpenAddModal}
              onShareLink={handleShareLink}
            />

            {/* Friendly Reminder Banner */}
            <ReminderBanner
              onPreviewStore={() => setCurrentTab('public-store')}
            />

            {/* Filter & Search Toolbar */}
            <Toolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              categoryCounts={categoryCounts}
              searchInputRef={searchInputRef}
            />

            {/* Product Grid */}
            <ProductGrid
              products={filteredProducts}
              visibleCount={visibleCount}
              totalProductsCount={products.length}
              onLoadMore={handleLoadMore}
              onShowLess={handleShowLess}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeletePrompt}
              onToggleVisibility={handleToggleVisibility}
              onResetFilters={handleResetFilters}
            />
          </div>
        </main>
      ) : (
        <PublicStorefront
          products={products}
          onBackToAdmin={() => setCurrentTab('catalog')}
        />
      )}

      {/* Footer */}
      <Footer onOpenHelp={(type) => setHelpModalType(type)} />

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        product={productToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onCopySuccess={handleCopyLinkSuccess}
      />

      <HelpModals
        type={helpModalType}
        onClose={() => setHelpModalType(null)}
      />
    </div>
  );
}
