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
      {/* Category Tabs Header */}
      <div className="flex items-center gap-6 md:gap-10 mb-4 md:mb-12">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`font-nippo italic uppercase text-lg md:text-2xl tracking-wider transition-colors cursor-pointer ${
              activeTab === tab
                ? "font-black text-black"
                : "font-black text-zinc-300 hover:text-zinc-600"
            }`}
          >
            {tab}
          </button>
        ))}
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
