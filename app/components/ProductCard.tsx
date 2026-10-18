import Image from "next/image";
import Link from "next/link";
import { Product } from "../../lib/types";
import { formatNaira } from "../../lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug || product.id}`}
      className="group cursor-pointer flex flex-col"
    >
      {/* Image Container with high-end hover effect */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-100 mb-6">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-twom-muted">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs uppercase tracking-widest text-twom-muted block mb-1">
            {product.category}
          </span>
          <h3 className="font-zodiak text-xl text-twom-title">
            {product.name}
          </h3>
        </div>
        <span className="text-sm font-medium tracking-wider text-twom-title">
          {formatNaira(product.price)}
        </span>
      </div>
    </Link>
  );
}
