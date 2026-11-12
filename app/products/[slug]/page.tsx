import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatNaira } from "@/lib/utils";
import { Product } from "@/lib/types";
import {
  ShowcaseItem,
  getShowcaseSampleBySlug,
  isSampleProductId,
} from "@/lib/showcase-catalog";
import AddToCartButton from "@/components/AddToCartButton";

export const instant = false;

// In Next.js 16, params is a Promise, so we must await it
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Fetch the specific live product from Supabase by slug
  const { data: dbProduct } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  // 2. Fall back to showcase preview items if DB doesn't have this slug yet
  const sampleProduct = !dbProduct ? getShowcaseSampleBySlug(slug) : undefined;
  const product: ShowcaseItem | null =
    (dbProduct as ShowcaseItem | null) ?? sampleProduct ?? null;

  // 3. If no live or showcase product matches, trigger 404
  if (!product) {
    notFound();
  }

  const isSample = isSampleProductId(product.id);
  const isLogoPlaceholder =
    !product.image_url ||
    product.image_url.includes("TWOM.png") ||
    product.image_url.includes("Twom.png");

  return (
    <div className="w-full min-h-screen bg-twom-bg pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-24">
        {/* Left Column: Image */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-100">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className={
                  isLogoPlaceholder
                    ? "object-contain p-12"
                    : "object-cover object-center"
                }
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-twom-muted">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <Link
            href="/products"
            className="text-xs uppercase tracking-widest text-twom-muted hover:text-twom-title mb-6 inline-block transition-colors"
          >
            ← Back to Collection
          </Link>

          <span className="text-xs uppercase tracking-widest text-twom-muted block mb-2">
            {product.category}
          </span>
          <h1 className="font-zodiak text-3xl md:text-5xl text-twom-title leading-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 mb-8">
            <p className="text-xl md:text-2xl font-medium text-twom-title">
              {formatNaira(product.price)}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-zinc-400 line-through">
                {formatNaira(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-sm md:text-base text-twom-body leading-relaxed mb-12">
            {product.description || "No description available for this piece."}
          </p>

          {/* Add to Cart Button */}
          <div className="mt-8">
            {product.stock_quantity > 0 ? (
              <AddToCartButton product={product as Product} />
            ) : (
              <button
                disabled
                className="w-full bg-zinc-300 text-zinc-500 py-4 text-xs uppercase tracking-[0.2em] font-nippo cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
          </div>

          {/* Stock Check */}
          <p className="text-xs text-twom-muted mt-4 text-center">
            {product.stock_quantity > 0
              ? `In Stock (${product.stock_quantity} available)`
              : "Out of Stock"}
          </p>
          {isSample && (
            <p className="text-[11px] uppercase tracking-wider text-zinc-400 mt-2 text-center">
              Catalog Preview — publish matching inventory in Admin for live
              checkout
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
