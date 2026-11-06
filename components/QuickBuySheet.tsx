"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useUIStore } from "@/lib/ui-store";
import { useCartStore } from "@/lib/store";
import { formatNaira } from "@/lib/utils";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export default function QuickBuySheet() {
  const { quickBuyProduct, closeQuickBuy, openCart } = useUIStore();
  const addItem = useCartStore((state) => state.addItem);

  const [selectedSize, setSelectedSize] = useState<string>("S");
  const [showSizeChart, setShowSizeChart] = useState(false);

  // Hydration safety for Next.js / React 19
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isOpen = Boolean(quickBuyProduct);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const lastProductRef = useRef(quickBuyProduct);

  if (quickBuyProduct) {
    lastProductRef.current = quickBuyProduct;
  }
  const activeProduct = quickBuyProduct || lastProductRef.current;

  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }

  useEffect(() => {
    if (isOpen) {
      setSelectedSize("S"); // Reset to default size when a new product opens
    }
  }, [isOpen]);

  // Lock background scroll when Quick Buy sheet is open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeQuickBuy();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeQuickBuy]);

  // GSAP animation refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!shouldRender) return;

      if (isOpen) {
        // Animate In
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        });
        gsap.fromTo(
          sheetRef.current,
          { y: "100%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.35,
            ease: "power3.out",
          },
        );
      } else {
        // Animate Out
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        });
        gsap.to(sheetRef.current, {
          y: "100%",
          opacity: 0,
          duration: 0.25,
          ease: "power3.in",
          onComplete: () => setShouldRender(false),
        });
      }
    },
    { dependencies: [isOpen, shouldRender] },
  );

  if (!mounted || !shouldRender || !activeProduct) return null;

  const isLogoPlaceholder =
    !activeProduct.image_url ||
    activeProduct.image_url.includes("TWOM.png") ||
    activeProduct.image_url.includes("Twom.png");

  const handleAddToCart = () => {
    // 1. Add product to cart with chosen size
    addItem(activeProduct, selectedSize);

    // 2. Close quick buy sheet
    closeQuickBuy();

    // 3. Immediately slide open the Cart Drawer
    openCart();
  };

  const dynamicSku = `${activeProduct.sku || "TWOM"}-${selectedSize}`;

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Blurred Dark Backdrop */}
      <div
        ref={overlayRef}
        onClick={closeQuickBuy}
        className="fixed inset-0 bg-black/60 opacity-0 backdrop-blur-xs transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* Slide-Up Bottom Sheet Panel */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Quick add ${activeProduct.name}`}
        className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        {/* Top Product Summary Row */}
        <div className="flex gap-4 items-start justify-between">
          <div className="flex gap-4 items-start">
            {/* Square Thumbnail */}
            <div className="relative w-20 h-24 bg-zinc-100 rounded-xs overflow-hidden shrink-0">
              <Image
                src={activeProduct.image_url || "/TWOM.png"}
                alt={activeProduct.name}
                fill
                sizes="80px"
                className={
                  isLogoPlaceholder
                    ? "object-contain p-3"
                    : "object-cover object-center"
                }
              />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 pr-4">
              <h3 className="font-nippo italic font-black text-lg md:text-xl text-black uppercase tracking-wider leading-tight">
                {activeProduct.name}
              </h3>
              <p className="font-mono text-sm font-medium text-zinc-900">
                {formatNaira(activeProduct.price)} NGN
              </p>
              <Link
                href={`/products/${activeProduct.slug || activeProduct.id}`}
                onClick={closeQuickBuy}
                className="text-xs uppercase tracking-wider text-zinc-500 hover:text-black underline underline-offset-4 transition-colors mt-1 font-medium"
              >
                View details
              </Link>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={closeQuickBuy}
            aria-label="Close quick buy"
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black transition-colors cursor-pointer shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="h-px w-full bg-zinc-200/80" />

        {/* Live Stock Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>In stock, limited in some sizes</span>
        </div>

        {/* Size Selection Grid */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-600 font-medium">
              Size: <strong className="text-black font-bold font-mono">{selectedSize}</strong>
            </span>

            <button
              type="button"
              onClick={() => setShowSizeChart((prev) => !prev)}
              className="text-[11px] font-nippo italic uppercase font-bold tracking-wider text-black underline underline-offset-4 hover:opacity-75 transition-opacity cursor-pointer"
            >
              Size Chart
            </button>
          </div>

          {/* Size Chart Quick Helper */}
          {showSizeChart && (
            <div className="p-3 bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex flex-col gap-1.5 font-mono">
              <div className="flex justify-between font-bold text-black border-b border-zinc-200 pb-1">
                <span>Size</span>
                <span>Chest (in)</span>
                <span>Length (in)</span>
              </div>
              <div className="flex justify-between"><span>XS</span><span>36 - 38</span><span>27.5</span></div>
              <div className="flex justify-between"><span>S</span><span>38 - 40</span><span>28.5</span></div>
              <div className="flex justify-between"><span>M</span><span>40 - 42</span><span>29.5</span></div>
              <div className="flex justify-between"><span>L</span><span>42 - 44</span><span>30.5</span></div>
              <div className="flex justify-between"><span>XL</span><span>44 - 46</span><span>31.5</span></div>
              <div className="flex justify-between"><span>XXL</span><span>46 - 48</span><span>32.5</span></div>
            </div>
          )}

          {/* Size Square Tiles */}
          <div className="grid grid-cols-6 gap-2">
            {SIZES.map((size) => {
              const isSelected = selectedSize === size;
              const isOutOfStock = size === "XS"; // e.g. XS out of stock in reference

              return (
                <button
                  key={size}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setSelectedSize(size)}
                  className={`relative h-12 flex items-center justify-center font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                    isOutOfStock
                      ? "bg-zinc-100 text-zinc-300 border border-zinc-200 cursor-not-allowed"
                      : isSelected
                      ? "bg-black text-white shadow-xs"
                      : "bg-white text-zinc-900 border border-zinc-200 hover:border-black"
                  }`}
                >
                  {size}

                  {/* Strikethrough diagonal for out of stock */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-px bg-zinc-300 rotate-45" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Single Luxury Primary Action: ADD TO CART */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.2em] font-nippo italic font-black hover:bg-zinc-900 transition-colors shadow-sm cursor-pointer"
        >
          Add to Cart
        </button>

        {/* Dynamic SKU Footer */}
        <div className="text-[11px] font-mono italic text-zinc-400 text-left">
          SKU: {dynamicSku}
        </div>
      </div>
    </div>
  );
}

