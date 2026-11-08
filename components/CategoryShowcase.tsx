"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { useUIStore } from "@/lib/ui-store";

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
  const [addedId, setAddedId] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

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
  const openQuickBuy = useUIStore((state) => state.openQuickBuy);

  const handleQuickAdd = (e: React.MouseEvent, item: ShowcaseItem) => {
    e.preventDefault();
    e.stopPropagation();

    openQuickBuy({
      id: item.id,
      sku: item.sku,
      slug: item.slug,
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      image_url: item.image_url,
      stock_quantity: item.stock_quantity,
      is_active: item.is_active,
      created_at: item.created_at,
    });
  };

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
        {displayedItems.map((item) => {
          const isBrandPlaceholder =
            item.image_url?.includes("TWOM.png") ||
            item.image_url?.includes("Twom.png") ||
            !item.image_url;

          return (
            <div
              key={item.id}
              className="w-[72vw] min-w-[72vw] sm:w-[46vw] sm:min-w-[46vw] md:w-[calc(25%-18px)] md:min-w-[calc(25%-18px)] shrink-0 snap-start flex flex-col group"
            >
              <div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-100 mb-3 isolate">
                <Link
                  href={`/products/${item.slug || item.id}`}
                  className="relative block w-full h-full cursor-pointer"
                >
                  <Image
                    src={item.image_url || "/TWOM.png"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 72vw, (max-width: 1024px) 46vw, 25vw"
                    className={`transition-transform duration-700 ease-out group-hover:scale-105 ${
                      isBrandPlaceholder
                        ? "object-contain p-10 drop-shadow-xs"
                        : "object-cover object-center"
                    }`}
                  />
                </Link>

                {/* Vertical Red Sale / Discount Badge (Like screenshot) */}
                {item.saveBadge && (
                  <div className="pointer-events-none absolute top-3 right-0 z-1 bg-[#c92a2a] text-white text-[9px] font-bold tracking-widest px-1.5 py-2.5 [writing-mode:vertical-rl] select-none uppercase font-mono shadow-xs">
                    {item.saveBadge}
                  </div>
                )}

                {/* Floating Quick Add to Bag Icon (Bottom right of image) */}
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(e, item)}
                  aria-label={`Quick add ${item.name} to cart`}
                  className={`absolute bottom-3 right-3 z-2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
                    addedId === item.id
                      ? "bg-emerald-600 text-white scale-110"
                      : "bg-white/95 text-zinc-900 hover:bg-black hover:text-white"
                  }`}
                >
                  {addedId === item.id ? (
                    // Checkmark indicator
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    // Shopping Bag icon from screenshot
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Product Details */}
              <div className="flex flex-col gap-1">
                <Link
                  href={`/products/${item.slug || item.id}`}
                  className="text-xs md:text-sm font-medium text-twom-title leading-snug line-clamp-1 hover:opacity-75 transition-opacity"
                >
                  {item.name}
                </Link>

                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <span className="font-medium text-twom-title">
                    {formatNaira(item.price)} NGN
                  </span>

                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-zinc-400 line-through text-[11px] md:text-xs">
                      {formatNaira(item.originalPrice)} NGN
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
