"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import { useUIStore } from "@/lib/ui-store";

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
}

export default function ProductCard({ product, isNew }: ProductCardProps) {
  const openQuickBuy = useUIStore((state) => state.openQuickBuy);

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickBuy(product);
  };

  const productHref = `/products/${product.slug || product.id}`;

  return (
    <div className="group flex flex-col w-full">
      {/* Image Container with high-end hover effect */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-100 mb-3 md:mb-4">
        <Link href={productHref} className="relative block w-full h-full cursor-pointer">
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
        </Link>

        {/* Vertical "NEW" Badge */}
        {isNew && (
          <span className="pointer-events-none absolute top-0 right-0 z-10 bg-black text-white text-[10px] font-bold tracking-widest px-1.5 py-2.5 [writing-mode:vertical-rl] select-none uppercase">
            NEW
          </span>
        )}

        {/* Floating Quick Buy Bag Icon (Bottom right of image) */}
        <button
          type="button"
          onClick={handleQuickBuy}
          aria-label={`Quick buy ${product.name}`}
          className="absolute bottom-3 right-3 z-20 w-9 h-9 rounded-full bg-white/95 text-zinc-900 hover:bg-black hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1">
        <Link href={productHref} className="hover:opacity-75 transition-opacity">
          <h3 className="text-sm font-medium text-twom-title leading-snug line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <span className="text-xs md:text-sm text-neutral-500 font-normal">
          {formatNaira(product.price)}
        </span>
      </div>
    </div>
  );
}
