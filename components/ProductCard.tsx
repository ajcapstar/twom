"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import { useUIStore } from "@/lib/ui-store";

interface ProductCardProps {
  product: Product & {
    originalPrice?: number;
    saveBadge?: string;
  };
  isNew?: boolean;
}

export default function ProductCard({ product, isNew }: ProductCardProps) {
  const openQuickBuy = useUIStore((state) => state.openQuickBuy);

  const stock =
    typeof product.stock_quantity === "number" ? product.stock_quantity : 999;
  const isOutOfStock = stock <= 0;

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    openQuickBuy(product);
  };

  const productHref = `/products/${product.slug || product.id}`;

  return (
    <div className="group relative flex flex-col justify-between w-full h-full bg-white border border-zinc-200/80 rounded-3xl p-3 shadow-xs hover:shadow-md transition-shadow duration-300">
      {/* Inner Rounded Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-zinc-100 isolate">
        <Link
          href={productHref}
          className="relative block w-full h-full cursor-pointer"
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 70vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out ${
                isOutOfStock ? "opacity-60 grayscale-30" : ""
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-twom-muted">
              No Image
            </div>
          )}
        </Link>

        {/* Vertical Badge in Top-Right Position */}
        {isOutOfStock ? (
          <span className="pointer-events-none absolute top-0 right-0 z-1 bg-zinc-900/90 text-white text-[9px] font-bold tracking-widest px-1.5 py-2.5 [writing-mode:vertical-rl] select-none uppercase font-mono shadow-xs rounded-tr-2xl">
            SOLD OUT
          </span>
        ) : product.saveBadge ? (
          <span className="pointer-events-none absolute top-0 right-0 z-1 bg-[#c92a2a] text-white text-[9px] font-bold tracking-widest px-1.5 py-2.5 [writing-mode:vertical-rl] select-none uppercase font-mono shadow-xs rounded-tr-2xl">
            {product.saveBadge}
          </span>
        ) : isNew ? (
          <span className="pointer-events-none absolute top-0 right-0 z-1 bg-black text-white text-[10px] font-bold tracking-widest px-1.5 py-2.5 [writing-mode:vertical-rl] select-none uppercase rounded-tr-2xl">
            NEW
          </span>
        ) : null}
      </div>

      {/* Product Title Only */}
      <Link
        href={productHref}
        className="hover:opacity-75 transition-opacity block mt-3 mb-1.5"
      >
        <h3 className="text-sm font-medium text-twom-title leading-snug line-clamp-1">
          {product.name}
        </h3>
      </Link>

      {/* Inventory Stock Pill Slot - reserves space when stock > 10 so all cards have identical length */}
      <div className="min-h-5.5 mb-2.5 flex items-center">
        {stock <= 10 &&
          (isOutOfStock ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-zinc-100 text-zinc-500 border border-zinc-200">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              Out of stock
            </span>
          ) : stock <= 5 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Only {stock} left
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Only {stock} left
            </span>
          ))}
      </div>

      {/* Bottom Action Row: Price Pill (Left) + Cart Pill Button (Right) */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="bg-zinc-100/90 text-zinc-900 rounded-full px-3.5 py-1.5 text-xs md:text-sm font-semibold flex items-center gap-1.5 shrink min-w-0">
          <span className="truncate">{formatNaira(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-zinc-400 line-through text-[11px] font-normal shrink-0">
              {formatNaira(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleQuickBuy}
          aria-label={
            isOutOfStock
              ? `${product.name} is out of stock`
              : `Quick buy ${product.name}`
          }
          className={`rounded-full px-4 py-1.5 flex items-center justify-center transition-all shrink-0 shadow-xs touch-manipulation ${
            isOutOfStock
              ? "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
              : "bg-black text-white hover:bg-zinc-800 cursor-pointer active:scale-95"
          }`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}
