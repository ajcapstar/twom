import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ShowcaseItem,
  getFallbackItemsForCategory,
} from "@/lib/showcase-catalog";
import ProductCard from "@/components/ProductCard";

export const instant = false;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  // Build the query
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true);

  // If there's a category in the URL, filter by it case-insensitively
  if (category) {
    query = query.ilike("category", category);
  }

  const { data: products, error } = await query.order("created_at", {
    ascending: false,
  });

  // Fall back to showcase previews for matching campaign categories when DB is empty
  const fallbackProducts =
    !error && (!products || products.length === 0) && category
      ? getFallbackItemsForCategory(category)
      : [];

  const displayedProducts: ShowcaseItem[] =
    products && products.length > 0
      ? (products as ShowcaseItem[])
      : fallbackProducts;

  // Handle empty state or errors gracefully
  if (error || displayedProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-twom-bg text-twom-title gap-4 px-6">
        <p className="text-twom-muted">
          {category
            ? `No pieces found under "${category}".`
            : "No products available at the moment."}
        </p>
        {category && (
          <Link
            href="/products"
            className="text-xs uppercase tracking-widest text-twom-title underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            ← View All Pieces
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-twom-bg pt-32 pb-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-twom-muted">
              The Collection
            </span>
            <h1 className="font-zodiak text-4xl md:text-6xl text-twom-title mt-2 capitalize">
              {category ? category : "Shop All"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {category && (
              <Link
                href="/products"
                className="text-xs uppercase tracking-widest text-twom-muted hover:text-twom-title underline underline-offset-4 transition-colors"
              >
                Clear Filter ✕
              </Link>
            )}
            <span className="text-xs uppercase tracking-widest text-twom-muted">
              Showing {displayedProducts.length}{" "}
              {displayedProducts.length === 1 ? "Piece" : "Pieces"}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
          {displayedProducts.map((product: ShowcaseItem) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
