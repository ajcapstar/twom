"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

interface CategoryShowcaseProps {
  dbProducts: Product[];
  tabs?: [string, string];
}

interface ShowcaseItem {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  price: number; // in Kobo
  originalPrice?: number; // in Kobo (for strikethrough sale display)
  saveBadge?: string;
  image_url: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

// Fallback pieces matching the reference screenshot when DB categories are empty
const SAMPLE_TEES: ShowcaseItem[] = [
  {
    id: "sample-tee-1",
    sku: "TWOM-TEE-01",
    slug: "ath-baby-ringer-tee",
    name: "Ath. Baby Ringer Tee Vintage White/Choc",
    description:
      "Premium heavy-cotton vintage ringer tee with contrast ribbing.",
    category: "Tees & Tanks",
    price: 5680000, // ₦56,800
    originalPrice: 9470000, // ₦94,700
    saveBadge: "SAVE ₦37,900.00",
    image_url: "/TWOM.png",
    stock_quantity: 15,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-tee-2",
    sku: "TWOM-TEE-02",
    slug: "star-sign-flow-tee",
    name: "Star Sign Flow Tee GD Choc",
    description:
      "Garment-dyed boxy oversized tee with tonal constellation motif.",
    category: "Tees & Tanks",
    price: 12170000, // ₦121,700
    image_url: "/TWOM.png",
    stock_quantity: 20,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-tee-3",
    sku: "TWOM-TEE-03",
    slug: "atelier-heavyweight-tank",
    name: "Atelier Ribbed Raw Tank Off-Black",
    description: "Heavyweight 2x1 organic cotton rib tank with raw edge hem.",
    category: "Tees & Tanks",
    price: 4850000, // ₦48,500
    originalPrice: 6500000, // ₦65,000
    saveBadge: "SAVE ₦16,500.00",
    image_url: "/TWOM.png",
    stock_quantity: 10,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-tee-4",
    sku: "TWOM-TEE-04",
    slug: "classic-draped-boxy-tee",
    name: "Classic Draped Boxy Tee Bone",
    description: "Relaxed drop-shoulder silhouette in brushed luxury jersey.",
    category: "Tees & Tanks",
    price: 7200000, // ₦72,000
    image_url: "/TWOM.png",
    stock_quantity: 12,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const SAMPLE_PANTS: ShowcaseItem[] = [
  {
    id: "sample-pant-1",
    sku: "TWOM-PNT-01",
    slug: "wide-pleated-tailored-trouser",
    name: "Double Pleated Atelier Trousers Sand",
    description: "Relaxed drape trousers featuring deep double front pleats.",
    category: "Pants",
    price: 9800000, // ₦98,000
    originalPrice: 13500000,
    saveBadge: "SAVE ₦37,000.00",
    image_url: "/TWOM.png",
    stock_quantity: 8,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-pant-2",
    sku: "TWOM-PNT-02",
    slug: "relaxed-straight-leg-chino",
    name: "Structured Cotton Relaxed Chino Navy",
    description: "Mid-rise wide straight trousers in compact Japanese twill.",
    category: "Pants",
    price: 8900000, // ₦89,000
    image_url: "/TWOM.png",
    stock_quantity: 14,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-pant-3",
    sku: "TWOM-PNT-03",
    slug: "fluid-wool-blend-pant",
    name: "Fluid Worsted Wool Lounge Trouser Charcoal",
    description:
      "Tailored elasticated waistband trousers in fine Italian wool.",
    category: "Pants",
    price: 11500000, // ₦115,000
    image_url: "/TWOM.png",
    stock_quantity: 6,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-pant-4",
    sku: "TWOM-PNT-04",
    slug: "cropped-tailored-trousers",
    name: "Cropped Single Pleat Trousers Off-White",
    description:
      "Tapered ankle cut with clean pressed crease and slash pockets.",
    category: "Pants",
    price: 9200000, // ₦92,000
    originalPrice: 11800000,
    saveBadge: "SAVE ₦26,000.00",
    image_url: "/TWOM.png",
    stock_quantity: 9,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const SAMPLE_HOODIES: ShowcaseItem[] = [
  {
    id: "sample-hoodie-1",
    sku: "TWOM-HD-01",
    slug: "heavyweight-oversized-hoodie-washed-black",
    name: "Heavyweight Box Hood Washed Black",
    description: "480GSM loopback French terry with double-layered hood.",
    category: "Hoodies",
    price: 13500000, // ₦135,000
    originalPrice: 16500000,
    saveBadge: "SAVE ₦30,000.00",
    image_url: "/TWOM.png",
    stock_quantity: 10,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-hoodie-2",
    sku: "TWOM-HD-02",
    slug: "distressed-raw-hem-hoodie",
    name: "Distressed Raw Hem Hoodie Sand",
    description: "Drop shoulder silhouette with hand-distressed ribs.",
    category: "Hoodies",
    price: 14800000, // ₦148,000
    image_url: "/TWOM.png",
    stock_quantity: 12,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-hoodie-3",
    sku: "TWOM-HD-03",
    slug: "embroidered-fleece-hoodie-bone",
    name: "Embroidered Tonal Logo Hoodie Bone",
    description: "Ultra-dense custom fleece with minimal embroidery.",
    category: "Hoodies",
    price: 12800000, // ₦128,000
    image_url: "/TWOM.png",
    stock_quantity: 14,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const SAMPLE_ACCESSORIES: ShowcaseItem[] = [
  {
    id: "sample-acc-1",
    sku: "TWOM-ACC-01",
    slug: "tactical-nylon-crossbody-bag",
    name: "Modular Nylon Crossbody Bag Slate",
    description: "Ballistic nylon with magnetic buckle and stormproof zippers.",
    category: "Accessories",
    price: 6800000, // ₦68,000
    originalPrice: 8500000,
    saveBadge: "SAVE ₦17,000.00",
    image_url: "/TWOM.png",
    stock_quantity: 8,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-acc-2",
    sku: "TWOM-ACC-02",
    slug: "structured-cotton-canvas-cap",
    name: "Unstructured Canvas 6-Panel Cap Black",
    description: "Heavy brushed twill with metal sliding buckle closure.",
    category: "Accessories",
    price: 3800000, // ₦38,000
    image_url: "/TWOM.png",
    stock_quantity: 20,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-acc-3",
    sku: "TWOM-ACC-03",
    slug: "atelier-leather-cardholder",
    name: "Atelier French Calf Cardholder Noir",
    description: "Full-grain calfskin with debossed TWOM insignia.",
    category: "Accessories",
    price: 5200000, // ₦52,000
    image_url: "/TWOM.png",
    stock_quantity: 15,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export default function CategoryShowcase({
  dbProducts,
  tabs = ["TEES & TANKS", "PANTS"],
}: CategoryShowcaseProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  // Filter products by active category from DB, or fallback to reference samples
  const getDisplayedItems = (): ShowcaseItem[] => {
    const tabLower = activeTab.toLowerCase();
    const dbMatches = dbProducts.filter((p) => {
      const pCat = p.category?.toLowerCase() || "";
      if (tabLower.includes("tee") || tabLower.includes("tank")) {
        return pCat.includes("tee") || pCat.includes("tank");
      }
      if (tabLower.includes("pant")) {
        return pCat.includes("pant") || pCat.includes("trouser");
      }
      if (tabLower.includes("hoodie") || tabLower.includes("sweat")) {
        return pCat.includes("hoodie") || pCat.includes("sweat");
      }
      if (tabLower.includes("accessor")) {
        return (
          pCat.includes("accessor") ||
          pCat.includes("bag") ||
          pCat.includes("cap") ||
          pCat.includes("hat")
        );
      }
      return pCat === tabLower;
    });

    if (dbMatches.length > 0) return dbMatches as ShowcaseItem[];

    // Fallbacks when no matching products exist in DB yet
    if (tabLower.includes("tee") || tabLower.includes("tank")) return SAMPLE_TEES;
    if (tabLower.includes("pant")) return SAMPLE_PANTS;
    if (tabLower.includes("hoodie") || tabLower.includes("sweat")) return SAMPLE_HOODIES;
    if (tabLower.includes("accessor")) return SAMPLE_ACCESSORIES;

    return [];
  };

  const displayedItems = getDisplayedItems();

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20">
      {/* Category Tabs Header */}
      <div className="flex items-center gap-6 md:gap-10 mb-8 md:mb-12">
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
      <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-6">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            className="w-[76vw] min-w-[76vw] sm:w-[48vw] sm:min-w-[48vw] md:w-[calc(25%-18px)] md:min-w-[calc(25%-18px)] shrink-0 snap-start flex flex-col"
          >
            <ProductCard product={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
