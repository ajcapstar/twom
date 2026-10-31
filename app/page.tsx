import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
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

      {/* Infinite Marquee Ticker */}
      <div className="w-full overflow-hidden border-y border-twom-border/50 bg-twom-bg py-3.5">
        <div className="flex w-max animate-marquee">
          <div className="flex items-center gap-10 px-5 text-xs md:text-sm font-medium tracking-wider text-twom-title shrink-0">
            <span>Good things stay good ✳</span>
            <span>Good things stay good ✳</span>
            <span>Good things stay good ✳</span>
            <span>Good things stay good ✳</span>
            <span>Good things stay good ✳</span>
            <span>Good things stay good ✳</span>
          </div>
          <div
            className="flex items-center gap-10 px-5 text-xs md:text-sm font-medium tracking-wider text-twom-title shrink-0"
            aria-hidden="true"
          >
            <span>Good things stay good ✳</span>
            <span>Good things stay good ✳</span>
            <span>Good things stay good ✳</span>
            <span>Good things stay good ✳</span>
            <span>Good things stay good ✳</span>
            <span>Good things stay good ✳</span>
          </div>
        </div>
      </div>

      {/* Editorial Product Grid Section */}
      <section
        id="collection"
        className="max-w-7xl mx-auto px-6 py-16 md:py-24"
      >
        <div className="flex justify-between items-end mb-8 md:mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-twom-muted">
              Featured Pieces
            </span>
            {/* <h2 className="font-zodiak text-3xl md:text-4xl text-twom-title mt-2">
              The Current Selection
            </h2> */}
          </div>
          <span className="text-xs uppercase tracking-widest text-twom-muted hidden md:block">
            Showing {products?.length || 0} Essentials
          </span>
        </div>

        {/* Mobile Horizontal Carousel & Desktop Grid */}
        <div className="flex md:grid md:grid-cols-2 gap-3 md:gap-x-10 md:gap-y-16 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          {products?.map((product: Product, index: number) => (
            <div
              key={product.id}
              className="w-[68vw] min-w-[68vw] sm:w-[48vw] sm:min-w-[48vw] shrink-0 snap-start md:w-auto md:min-w-0 md:shrink"
            >
              <ProductCard product={product} isNew={index === 0} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
