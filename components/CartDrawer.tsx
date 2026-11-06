"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useUIStore } from "@/lib/ui-store";
import { useCartStore } from "@/lib/store";
import { formatNaira } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, updateQuantity, removeItem } = useCartStore();

  // 1. Hydration fix for React 19 / Next.js 16 SSR
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // 2. Keep component mounted during exit animation
  const [shouldRender, setShouldRender] = useState(isCartOpen);

  if (isCartOpen && !shouldRender) {
    setShouldRender(true);
  }

  // 3. Scroll lock when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isCartOpen]);

  // 4. Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // 5. GSAP animation refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // 6. GSAP Animation Logic
  useGSAP(
    () => {
      if (!shouldRender) return;

      if (isCartOpen) {
        // Animate In
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.fromTo(
          panelRef.current,
          { xPercent: 100 },
          {
            xPercent: 0,
            duration: 0.35,
            ease: "power3.out",
          },
        );
      } else {
        // Animate Out
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
        });
        gsap.to(panelRef.current, {
          xPercent: 100,
          duration: 0.3,
          ease: "power3.in",
          onComplete: () => setShouldRender(false),
        });
      }
    },
    { dependencies: [isCartOpen, shouldRender] },
  );

  if (!mounted || !shouldRender) return null;

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const totalItemsCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <div className="fixed inset-0 z-[120]">
      {/* Dark Blur Overlay */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 opacity-0 backdrop-blur-xs transition-colors cursor-pointer"
        aria-hidden="true"
      />

      {/* Sliding Drawer Panel */}
      <aside
        ref={panelRef}
        className="absolute top-0 right-0 h-full w-full sm:w-[440px] md:w-[480px] bg-twom-bg shadow-2xl flex flex-col z-10"
        aria-label="Shopping Cart Drawer"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-twom-border/60 bg-twom-bg">
          <div className="flex items-center gap-2">
            <h2 className="font-zodiak text-2xl text-twom-title">Your Bag</h2>
            {totalItemsCount > 0 && (
              <span className="text-xs uppercase tracking-widest text-twom-muted font-mono">
                ({totalItemsCount})
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart drawer"
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col divide-y divide-twom-border/40">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <p className="font-zodiak text-xl text-twom-title mb-1">
                Your bag is empty
              </p>
              <p className="text-xs text-twom-muted mb-6 max-w-xs">
                Explore our curated essentials and add your favorite pieces.
              </p>
              <Link
                href="/products"
                onClick={closeCart}
                className="inline-block bg-twom-title text-white px-6 py-3 text-xs uppercase tracking-[0.2em] font-nippo hover:bg-black transition-colors"
              >
                Explore Collection →
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const isLogoPlaceholder =
                !item.image_url ||
                item.image_url.includes("TWOM.png") ||
                item.image_url.includes("Twom.png");

              return (
                <div
                  key={`${item.id}-${item.size || "default"}`}
                  className="py-4 flex gap-4 items-center"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/products/${item.slug || item.id}`}
                    onClick={closeCart}
                    className="relative w-20 h-24 bg-zinc-100 shrink-0 overflow-hidden block"
                  >
                    <Image
                      src={item.image_url || "/TWOM.png"}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className={`transition-transform duration-500 hover:scale-105 ${
                        isLogoPlaceholder
                          ? "object-contain p-2"
                          : "object-cover object-center"
                      }`}
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex flex-col justify-between grow min-w-0">
                    <div>
                      <Link
                        href={`/products/${item.slug || item.id}`}
                        onClick={closeCart}
                        className="font-zodiak text-base text-twom-title leading-snug line-clamp-1 hover:opacity-75 transition-opacity"
                      >
                        {item.name}
                      </Link>

                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-twom-muted">
                          {formatNaira(item.price)}
                        </p>
                        {item.size && (
                          <span className="text-[10px] font-mono font-bold bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded-xs">
                            {item.size}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-zinc-200 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1, item.size)
                          }
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="w-7 h-7 flex items-center justify-center text-sm text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-xs font-mono font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1, item.size)
                          }
                          aria-label={`Increase quantity of ${item.name}`}
                          className="w-7 h-7 flex items-center justify-center text-sm text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-[11px] text-zinc-400 hover:text-red-600 underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-twom-border/60 bg-white shadow-xs flex flex-col gap-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-wider text-twom-muted font-medium">
                Estimated Subtotal
              </span>
              <span className="font-zodiak text-2xl text-twom-title">
                {formatNaira(subtotal)}
              </span>
            </div>

            <p className="text-[11px] text-twom-muted">
              Taxes and shipping calculated at checkout.
            </p>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="block text-center w-full bg-twom-title text-white py-4 text-xs uppercase tracking-[0.2em] font-nippo hover:bg-black transition-colors"
            >
              Proceed to Checkout →
            </Link>

            <Link
              href="/cart"
              onClick={closeCart}
              className="text-center text-xs uppercase tracking-wider text-twom-muted hover:text-twom-title underline underline-offset-4 transition-colors"
            >
              View Full Bag
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
