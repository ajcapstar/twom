"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { formatNaira } from "@/lib/utils";

const emptySubscribe = () => () => {};

export default function CheckoutPage() {
  const router = useRouter();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const { items, removeItem, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [invalidIssues, setInvalidIssues] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const hasInvalidItems = Object.keys(invalidIssues).length > 0;

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    setInvalidIssues((prev) => {
      const next = { ...prev };
      delete next[id];
      if (Object.keys(next).length === 0) {
        setErrorMessage(null);
      }
      return next;
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-twom-bg flex items-center justify-center">
        <p className="text-twom-muted text-sm tracking-wider uppercase">
          Loading checkout...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-twom-bg pt-36 pb-24 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="font-zodiak text-3xl md:text-4xl text-twom-title mb-4">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-twom-muted text-sm mb-8 max-w-md">
          Explore our seasonal pieces and add your desired items before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="text-xs uppercase tracking-[0.2em] bg-twom-title text-white px-8 py-4 font-nippo hover:bg-black transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          cart: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Collect specific issues into a lookup map: id -> reason
        if (data.cartIssues && Array.isArray(data.cartIssues)) {
          const issueMap: Record<string, string> = {};
          for (const issue of data.cartIssues as Array<{
            id: string;
            name: string;
            reason: string;
          }>) {
            issueMap[issue.id] =
              issue.reason === "out_of_stock"
                ? "Out of stock"
                : issue.reason.startsWith("only_")
                ? "Insufficient stock"
                : "No longer available";
          }
          setInvalidIssues(issueMap);
        }
        throw new Error(
          data.error || "Unable to proceed with checkout. Please review your order."
        );
      }

      // If Paystack checkout URL is returned, redirect customer to Paystack
      // Note: We intentionally do NOT clear the cart here so that if the user
      // cancels payment on Paystack, their cart remains intact.
      // The cart is cleared upon confirmed acquisition in /checkout/success via <ClearCartOnMount />.
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }

      // Fallback for mock mode or direct redirects
      if (data.redirectUrl) {
        clearCart();
        router.push(data.redirectUrl);
        return;
      }

      throw new Error("Invalid response received from checkout service.");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-twom-bg pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 pb-6 border-b border-zinc-200">
          <Link
            href="/cart"
            className="text-xs uppercase tracking-wider text-twom-muted hover:text-twom-title transition-colors"
          >
            ← Back to Bag
          </Link>
          <h1 className="font-zodiak text-4xl text-twom-title mt-2">
            Secure Checkout
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-medium">Order Update Required</p>
              <p className="text-xs mt-1 text-rose-600">{errorMessage}</p>
            </div>
            {hasInvalidItems && (
              <span className="text-[11px] uppercase tracking-wider font-mono text-rose-700 bg-rose-100 px-2.5 py-1 rounded-xs shrink-0 self-start sm:self-center">
                Action required in Order Summary →
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Customer Form */}
          <div className="w-full lg:w-7/12">
            <h2 className="font-mono text-xs uppercase tracking-widest text-twom-muted mb-6">
              1. Delivery & Contact Details
            </h2>

            <form onSubmit={handleCheckout} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="customer-name"
                  className="block text-xs uppercase tracking-wider text-twom-muted mb-2"
                >
                  Full Name *
                </label>
                <input
                  id="customer-name"
                  type="text"
                  required
                  placeholder="e.g. Kelly Akpeme"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3.5 border border-zinc-300 bg-white text-twom-title focus:outline-none focus:border-twom-title transition-colors text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-email"
                  className="block text-xs uppercase tracking-wider text-twom-muted mb-2"
                >
                  Email Address *
                </label>
                <input
                  id="customer-email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-3.5 border border-zinc-300 bg-white text-twom-title focus:outline-none focus:border-twom-title transition-colors text-sm"
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  Order receipts and tracking information will be sent here.
                </span>
              </div>

              <div>
                <label
                  htmlFor="customer-address"
                  className="block text-xs uppercase tracking-wider text-twom-muted mb-2"
                >
                  Shipping Address *
                </label>
                <textarea
                  id="customer-address"
                  required
                  rows={4}
                  placeholder="Apartment, suite, street address, city, state"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full p-3.5 border border-zinc-300 bg-white text-twom-title focus:outline-none focus:border-twom-title transition-colors text-sm"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing || hasInvalidItems}
                  className="w-full bg-twom-title text-white py-4 text-xs uppercase tracking-[0.2em] font-nippo hover:bg-black transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isProcessing
                    ? "Connecting to Payment Gateway..."
                    : hasInvalidItems
                    ? "Remove unavailable piece(s) to continue"
                    : `Pay ${formatNaira(subtotal)} with Paystack`}
                </button>
                <p className="text-[11px] text-zinc-400 text-center mt-3">
                  Secured by 256-bit SSL encryption via Paystack.
                </p>
              </div>
            </form>
          </div>

          {/* Right: Order Summary with In-Place Resolution */}
          <div className="w-full lg:w-5/12">
            <div className="bg-white border border-zinc-200 p-6 md:p-8 sticky top-32">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-twom-muted">
                  2. Order Summary ({items.length} {items.length === 1 ? "Piece" : "Pieces"})
                </h2>
                {hasInvalidItems && (
                  <span className="text-[10px] uppercase font-mono font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 border border-rose-200">
                    Needs Attention
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-1 border-b border-zinc-100 pb-6 mb-6">
                {items.map((item) => {
                  const issueReason = invalidIssues[item.id];

                  return (
                    <div
                      key={item.id}
                      className={`flex gap-4 items-center transition-all p-2 rounded-xs ${
                        issueReason
                          ? "bg-rose-50/70 border border-rose-300"
                          : "border border-transparent"
                      }`}
                    >
                      <div className="relative w-16 h-20 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className={`object-cover ${issueReason ? "opacity-40" : ""}`}
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">
                            TWOM
                          </div>
                        )}
                        {issueReason && (
                          <div className="absolute inset-0 bg-rose-900/10 flex items-center justify-center">
                            <span className="text-[8px] uppercase tracking-wider font-bold text-rose-700 bg-white/90 px-1 py-0.5">
                              Out
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="grow min-w-0">
                        <p
                          className={`font-medium text-xs truncate ${
                            issueReason
                              ? "text-rose-700 line-through decoration-rose-400"
                              : "text-twom-title"
                          }`}
                        >
                          {item.name}
                        </p>
                        <p className="text-[11px] text-twom-muted mt-0.5">
                          Qty: {item.quantity}
                        </p>
                        {issueReason && (
                          <span className="text-[11px] text-rose-600 font-medium block mt-0.5">
                            {issueReason}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <p
                          className={`text-xs font-medium ${
                            issueReason
                              ? "text-rose-400 line-through"
                              : "text-twom-title"
                          }`}
                        >
                          {formatNaira(item.price * item.quantity)}
                        </p>

                        {issueReason && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-[10px] uppercase tracking-wider text-rose-700 hover:text-white hover:bg-rose-700 border border-rose-300 px-2 py-0.5 transition-colors cursor-pointer font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between text-twom-muted">
                  <span>Subtotal</span>
                  <span>{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-twom-muted">
                  <span>Standard Shipping</span>
                  <span className="text-zinc-500 font-mono text-[11px]">
                    Complimentary
                  </span>
                </div>
                <div className="border-t border-zinc-200 pt-4 mt-2 flex justify-between items-center text-sm font-medium text-twom-title">
                  <span>Total Amount</span>
                  <span className="font-zodiak text-2xl">
                    {formatNaira(subtotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
