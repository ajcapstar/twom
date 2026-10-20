import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { formatNaira } from "../../../lib/utils";
import AddToCartButton from "../../components/AddToCartButton";

export const dynamic = "force-dynamic";

// In Next.js 16, params is a Promise, so we must await it
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Fetch the specific product by slug
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  // 2. If no product is found, trigger the 404 page
  if (error || !product) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-twom-bg pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-24">
        {/* Left Column: Image */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-100">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
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

          <p className="text-xl md:text-2xl font-medium mb-8 text-twom-title">
            {formatNaira(product.price)}
          </p>

          <p className="text-sm md:text-base text-twom-body leading-relaxed mb-12">
            {product.description || "No description available for this piece."}
          </p>

          {/* Add to Cart Button */}
          <AddToCartButton product={product} />

          {/* Stock Check */}
          <p className="text-xs text-twom-muted mt-4 text-center">
            {product.stock_quantity > 0
              ? `In Stock (${product.stock_quantity} available)`
              : "Out of Stock"}
          </p>
        </div>
      </div>
    </div>
  );
}
