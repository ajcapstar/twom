export interface Product {
  id: string;              // UUID from database
  sku: string;             // 'twom-01'
  slug: string;            // 'heavyweight-cashmere-overcoat'
  name: string;
  description: string | null;
  category: string;
  price: number;           // Integer in Kobo
  image_url: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}