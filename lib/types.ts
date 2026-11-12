export const PRODUCT_CATEGORIES = [
  "Tees & Tanks",
  "Pants",
  "Hoodies",
  "Accessories",
  "Shirts",
  "Anime",
  "Outerwear",
  "Tailoring",
  "Essentials",
  "Knitwear",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface Product {
  id: string;              // UUID from database
  sku: string;             // 'twom-01'
  slug: string;            // 'heavyweight-cashmere-overcoat'
  name: string;
  description: string | null;
  category: ProductCategory | string;
  price: number;           // Integer in Kobo
  image_url: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled" | "failed";

export interface OrderItemWithProduct {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  products: {
    name: string;
    image_url: string;
  } | null;
}

export interface AdminOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  total_amount: number;
  status: OrderStatus;
  payment_reference: string | null;
  payment_channel: string | null;
  paid_at: string | null;
  created_at: string;
  order_items: OrderItemWithProduct[];
}
