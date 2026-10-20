import { supabase } from "../../lib/supabase";
import { Product } from "../../lib/types";
import ProductCard from "../components/ProductCard";

// Next.js 16: Allow the server to fetch data before rendering
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  // 1. Fetch products from Supabase
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // 2. Handle empty state or errors gracefully
  if (error || !products || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-twom-bg text-twom-title">
        <p>No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-twom-bg pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-twom-muted">
              The Collection
            </span>
            <h1 className="font-zodiak text-4xl md:text-6xl text-twom-title mt-2">
              Shop All
            </h1>
          </div>
          <span className="text-xs uppercase tracking-widest text-twom-muted">
            Showing {products.length} Pieces
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
