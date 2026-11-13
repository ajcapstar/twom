"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import {
  ShowcaseItem,
  matchesCategoryTab,
  getFallbackItemsForCategory,
} from "@/lib/showcase-catalog";

interface CategoryShowcaseProps {
  dbProducts: Product[];
  tabs?: [string, string];
}

export default function CategoryShowcase({
  dbProducts,
  tabs = ["TEES & TANKS", "PANTS"],
}: CategoryShowcaseProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  // Filter live DB products by active tab, or fall back to showcase catalog previews
  const getDisplayedItems = (): ShowcaseItem[] => {
    const dbMatches = dbProducts.filter((p) =>
      matchesCategoryTab(p.category, activeTab),
    );

    if (dbMatches.length > 0) return dbMatches as ShowcaseItem[];

    return getFallbackItemsForCategory(activeTab);
  };

  const displayedItems = getDisplayedItems();

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-0 md:py-20">
      {/* Liquid Glass Category Switcher Dock */}
      <div className="flex items-center mb-6 md:mb-10">
        <div className="liquid-glass liquid-glass-sheen inline-flex items-center p-1.5 rounded-full gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-nippo italic uppercase text-xs sm:text-sm md:text-base tracking-wider transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "liquid-glass-pill text-twom-title font-black shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                    : "text-zinc-600 hover:text-twom-title font-bold hover:bg-white/40"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Horizontal Scrollable Product Carousel */}
      <div className="flex items-stretch gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-4 -mx-4 px-4 md:scroll-px-0 md:mx-0 md:px-0 pb-4 md:pb-6">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            className="w-[76vw] min-w-[76vw] sm:w-[48vw] sm:min-w-[48vw] md:w-[calc(25%-18px)] md:min-w-[calc(25%-18px)] shrink-0 snap-start flex flex-col h-full"
          >
            <ProductCard product={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
