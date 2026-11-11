"use client";

import { useSyncExternalStore, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCartStore } from "../../lib/store";
import { formatNaira } from "../../lib/utils";

const emptySubscribe = () => () => {};

export default function CartPage() {
  // 1. Hydration-safe client mounting check without cascading renders
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // 2. Pull data from Zustand
  const { items, updateQuantity, removeItem } = useCartStore();

  // 3. Calculate subtotal
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // 4. Derive unavailable IDs directly from URL params (no setState in effect)
  const searchParams = useSearchParams();
  const router = useRouter();

  const unavailableIds = useMemo<Set<string>>(() => {
    const param = searchParams.get("unavailable");
    if (!param) return new Set();
    return new Set(param.split(",").filter(Boolean));
  }, [searchParams]);

  // Clean the query param from the URL once on mount if there are unavailable IDs,
  // so refreshing the page won't re-trigger the highlight state.
  useEffect(() => {
    if (searchParams.get("unavailable")) {
      router.replace("/cart", { scroll: false });
    }
  }, [router, searchParams]); // intentionally empty — run once on mount only

  const removeUnavailable = () => {
    unavailableIds.forEach((id) => removeItem(id));
  };

  // Don't render the cart contents until mounted to avoid hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen bg-twom-bg flex items-center justify-center">
        <p className="text-twom-muted">Loading cart...</p>
      </div>
    );
  }

  // 5. Empty State
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-twom-bg pt-32 pb-24 px-6 flex flex-col items-center justify-center">
        <h1 className="font-zodiak text-3xl md:text-5xl text-twom-title mb-6">
          Your cart is empty
        </h1>
        <Link
          href="/products"
          className="bg-twom-title text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-nippo hover:bg-black transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // 6. The Cart Layout
  return (
    <div className="min-h-screen bg-twom-bg pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-zodiak text-3xl md:text-5xl text-twom-title mb-12">
          Shopping Cart
        </h1>

        {/* Unavailable items banner */}
        {unavailableIds.size > 0 && (
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-rose-50 border border-rose-200">
            <div>
              <p className="text-sm font-medium text-rose-800">
                {unavailableIds.size === 1
                  ? "1 piece is no longer available"
                  : `${unavailableIds.size} pieces are no longer available`}{" "}
                — highlighted below.
              </p>
              <p className="text-xs text-rose-600 mt-0.5">
                Please remove them before proceeding to checkout.
              </p>
            </div>
            <button
              onClick={removeUnavailable}
              className="shrink-0 text-xs uppercase tracking-wider bg-rose-700 text-white px-4 py-2.5 hover:bg-rose-900 transition-colors cursor-pointer"
            >
              Remove unavailable items
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT COLUMN: Cart Items */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            {items.map((item) => {
              const isUnavailable = unavailableIds.has(item.id);

              return (
                <div
                  key={`${item.id}-${item.size || "default"}`}
                  className={`flex gap-6 border-b pb-8 transition-all duration-300 ${
                    isUnavailable
                      ? "border-rose-200 animate-pulse"
                      : "border-zinc-200"
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`relative w-24 h-32 md:w-32 md:h-40 shrink-0 border ${
                      isUnavailable
                        ? "border-rose-300 bg-rose-50"
                        : "bg-zinc-100 border-transparent"
                    }`}
                  >
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className={`object-cover object-center ${isUnavailable ? "opacity-40" : ""}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-twom-muted">
                        No Image
                      </div>
                    )}

                    {isUnavailable && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                        <span className="text-[10px] uppercase tracking-widest text-rose-700 font-medium text-center px-1">
                          Unavailable
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-col grow justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3
                            className={`font-zodiak text-lg md:text-xl ${
                              isUnavailable
                                ? "text-rose-700 line-through decoration-rose-400"
                                : "text-twom-title"
                            }`}
                          >
                            {item.name}
                          </h3>
                          {isUnavailable && (
                            <span className="text-[11px] text-rose-600 font-medium mt-0.5 block">
                              This piece is no longer available
                            </span>
                          )}
                        </div>
                        <p
                          className={`font-medium ${isUnavailable ? "text-rose-400 line-through" : "text-twom-title"}`}
                        >
                          {formatNaira(item.price * item.quantity)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs uppercase tracking-widest text-twom-muted">
                          {item.category}
                        </p>
                        {item.size && (
                          <span className="text-[10px] font-mono font-bold bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded-xs">
                            {item.size}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex justify-between items-end mt-4">
                      <div
                        className={`flex items-center border w-max ${
                          isUnavailable
                            ? "border-rose-200 opacity-40 pointer-events-none"
                            : "border-zinc-300"
                        }`}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1, item.size)
                          }
                          className="px-4 py-1 text-twom-title hover:bg-zinc-100 transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-4 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1, item.size)
                          }
                          className="px-4 py-1 text-twom-title hover:bg-zinc-100 transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          removeItem(item.id, item.size);
                        }}
                        className={`text-xs underline underline-offset-4 cursor-pointer ${
                          isUnavailable
                            ? "text-rose-600 hover:text-rose-800 font-medium"
                            : "text-red-500 hover:text-red-700"
                        }`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 border border-zinc-200">
              <h2 className="font-zodiak text-2xl text-twom-title mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between mb-4 text-sm text-twom-muted">
                <span>Subtotal</span>
                <span>{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between mb-6 text-sm text-twom-muted">
                <span>Shipping</span>
                <span>Complimentary</span>
              </div>

              <div className="border-t border-zinc-200 pt-4 mb-8 flex justify-between items-center">
                <span className="font-medium text-twom-title">Total</span>
                <span className="font-zodiak text-2xl text-twom-title">
                  {formatNaira(subtotal)}
                </span>
              </div>

              {unavailableIds.size > 0 ? (
                <button
                  onClick={removeUnavailable}
                  className="w-full bg-rose-700 text-white py-4 text-xs uppercase tracking-[0.2em] font-nippo hover:bg-rose-900 transition-colors cursor-pointer"
                >
                  Remove unavailable items
                </button>
              ) : (
                <Link
                  href="/checkout"
                  className="w-full block text-center bg-twom-title text-white py-4 text-xs uppercase tracking-[0.2em] font-nippo hover:bg-black transition-colors cursor-pointer"
                >
                  Proceed to Checkout
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
