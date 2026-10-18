"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../../lib/store";
import { formatNaira } from "../../lib/utils";

export default function CartPage() {
  // 1. The Hydration Fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Pull data from Zustand
  const { items, updateQuantity, removeItem } = useCartStore();

  // 3. Calculate subtotal
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Don't render the cart contents until mounted to avoid hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen bg-twom-bg flex items-center justify-center">
        <p className="text-twom-muted">Loading cart...</p>
      </div>
    );
  }

  // 4. Empty State
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-twom-bg pt-32 pb-24 px-6 flex flex-col items-center justify-center">
        <h1 className="font-zodiak text-3xl md:text-5xl text-twom-title mb-6">
          Your cart is empty
        </h1>
        <Link
          href="/products"
          className="bg-twom-title text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-nippo hover:bg-opacity-90 transition-all duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // 5. The Cart Layout
  return (
    <div className="min-h-screen bg-twom-bg pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-zodiak text-3xl md:text-5xl text-twom-title mb-12">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT COLUMN: Cart Items */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 border-b border-zinc-200 pb-8"
              >
                {/* Image */}
                <div className="relative w-24 h-32 md:w-32 md:h-40 bg-zinc-100 shrink-0">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col grow justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-zodiak text-lg md:text-xl text-twom-title">
                        {item.name}
                      </h3>
                      <p className="font-medium text-twom-title hidden md:block">
                        {formatNaira(item.price * item.quantity)}
                      </p>
                    </div>
                    <p className="text-xs uppercase tracking-widest text-twom-muted mt-1">
                      {item.category}
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-zinc-300 w-max">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-4 py-1 text-twom-title hover:bg-zinc-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-4 py-1 text-twom-title hover:bg-zinc-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-500 hover:text-red-700 underline underline-offset-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                <span>Calculated at checkout</span>
              </div>

              <div className="border-t border-zinc-200 pt-4 mb-8 flex justify-between items-center">
                <span className="font-medium text-twom-title">Total</span>
                <span className="font-zodiak text-2xl text-twom-title">
                  {formatNaira(subtotal)}
                </span>
              </div>

              <button className="w-full bg-twom-title text-white py-4 text-xs uppercase tracking-[0.2em] font-nippo hover:bg-opacity-90 transition-all duration-300">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
