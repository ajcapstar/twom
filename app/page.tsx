import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import { supabase } from "../lib/supabase";
import { Product } from "../lib/types";

export const instant = false;

export default async function Home() {
  // Fetch products for the homepage grid
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(4); // Only show the 4 newest products on the homepage

  return (
    <div className="w-full bg-twom-bg text-twom-body">
      <Hero />

      {/* Editorial Product Grid Section */}
      <section id="collection" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-twom-muted">
              Featured Pieces
            </span>
            <h2 className="font-zodiak text-3xl md:text-4xl text-twom-title mt-2">
              The Current Selection
            </h2>
          </div>
          <span className="text-xs uppercase tracking-widest text-twom-muted hidden md:block">
            Showing {products?.length || 0} Essentials
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
          {products?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
