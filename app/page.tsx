import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import EditorialCampaignBanners from "../components/EditorialCampaignBanners";
import CategoryShowcase from "../components/CategoryShowcase";
import { supabase } from "../lib/supabase";
import { Product } from "../lib/types";

export const instant = false;
export default async function Home() {
  // Fetch active products for showcase & featured pieces
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

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

      {/* Featured Pieces Selection */}
      <section
        id="collection"
        className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 border-t border-twom-border/40"
      >
        <div className="flex justify-between items-end mb-8 md:mb-16">
          {/* <div>
            <span className="text-xs uppercase tracking-[0.2em] text-twom-muted">
              Featured Pieces
            </span>
          </div> */}
          <span className="text-xs uppercase tracking-widest text-twom-muted hidden md:block">
            Showing {Math.min(products?.length || 0, 4)} Essentials
          </span>
        </div>

        {/* Mobile Horizontal Carousel & Desktop Grid */}
        <div className="flex items-stretch md:grid md:grid-cols-2 gap-4 md:gap-x-10 md:gap-y-16 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {products?.slice(0, 4).map((product: Product, index: number) => (
            <div
              key={product.id}
              className="w-[68vw] min-w-[68vw] sm:w-[48vw] sm:min-w-[48vw] shrink-0 snap-start md:w-auto md:min-w-0 md:shrink flex flex-col h-full"
            >
              <ProductCard product={product} isNew={index === 0} />
            </div>
          ))}
        </div>
      </section>
      {/* Set 1: Editorial Campaign Banners (Tees & Tanks, Pants) */}
      <EditorialCampaignBanners />

      {/* Set 1: Interactive Category Showcase (Tees & Tanks, Pants) */}
      <CategoryShowcase
        dbProducts={products || []}
        tabs={["TEES & TANKS", "PANTS"]}
      />

      {/* Set 2: Editorial Campaign Banners (Hoodies, Accessories) */}
      <EditorialCampaignBanners
        banner1={{
          title: "Hoodies",
          image: "/TWOM.png",
          link: "/products?category=Hoodies",
          priority: false,
        }}
        banner2={{
          title: "Accessories",
          image: "/TWOM.png",
          link: "/products?category=Accessories",
          priority: false,
        }}
      />

      {/* Set 2: Interactive Category Showcase (Hoodies, Accessories) */}
      <CategoryShowcase
        dbProducts={products || []}
        tabs={["HOODIES", "ACCESSORIES"]}
      />
    </div>
  );
}
