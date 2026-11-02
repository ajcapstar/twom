import { Suspense } from "react";
import CartClient from "./CartClient";

// route segment config must live in a Server Component
export const instant = false;

function CartSkeleton() {
  return (
    <div className="min-h-screen bg-twom-bg pt-32 pb-24 px-6 md:px-12 animate-pulse">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-52 bg-zinc-200 mb-12" />
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-6 border-b border-zinc-200 pb-8">
                <div className="w-24 h-32 md:w-32 md:h-40 bg-zinc-200 shrink-0" />
                <div className="flex flex-col grow gap-4 py-1">
                  <div className="h-6 w-48 bg-zinc-200" />
                  <div className="h-4 w-20 bg-zinc-200" />
                  <div className="h-8 w-24 bg-zinc-200 mt-auto" />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full lg:w-1/3">
            <div className="bg-white border border-zinc-200 p-8 space-y-4">
              <div className="h-6 w-32 bg-zinc-200 mb-6" />
              <div className="h-4 w-full bg-zinc-100" />
              <div className="h-4 w-full bg-zinc-100" />
              <div className="h-px w-full bg-zinc-200 my-4" />
              <div className="h-12 w-full bg-zinc-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartClient />
    </Suspense>
  );
}
