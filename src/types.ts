export interface Product {
  id: string;
  name: string;
  category: 'Lauk Siap Saji' | 'Makanan Ringan' | 'Minuman Segar';
  price: number;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  isNew?: boolean;
  isAvailable: boolean;
  isVisible: boolean;
  createdAt: number;
}

export type CategoryFilter = 'Semua' | 'Makanan Ringan' | 'Lauk Siap Saji' | 'Minuman Segar';
export type SortOption = 'terbaru' | 'harga-tinggi' | 'harga-rendah' | 'nama-az';
