import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatNaira } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
}

export default function ProductCard({ product, isNew }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug || product.id}`}
      className="group cursor-pointer flex flex-col w-full"
    >
      {/* Image Container with high-end hover effect */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-100 mb-3 md:mb-4">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 70vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-twom-muted">
            No Image
          </div>
        )}

        {/* Vertical "NEW" Badge */}
        {isNew && (
          <span className="absolute top-0 right-0 z-10 bg-black text-white text-[10px] font-bold tracking-widest px-1.5 py-2.5 [writing-mode:vertical-rl] select-none uppercase">
            NEW
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-twom-title leading-snug line-clamp-1">
          {product.name}
        </h3>
        <span className="text-xs md:text-sm text-neutral-500 font-normal">
          {formatNaira(product.price)}
        </span>
      </div>
    </Link>
  );
}
