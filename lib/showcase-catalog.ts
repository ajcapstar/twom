import { Product } from "@/lib/types";

export interface ShowcaseItem extends Product {
  originalPrice?: number; // in Kobo (for strikethrough sale display)
  saveBadge?: string;
}

const SAMPLE_CREATED_AT = "2026-01-01T00:00:00.000Z";

export const SAMPLE_TEES: ShowcaseItem[] = [
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
    created_at: SAMPLE_CREATED_AT,
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
    created_at: SAMPLE_CREATED_AT,
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
    created_at: SAMPLE_CREATED_AT,
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
    created_at: SAMPLE_CREATED_AT,
  },
];

export const SAMPLE_PANTS: ShowcaseItem[] = [
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
    created_at: SAMPLE_CREATED_AT,
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
    created_at: SAMPLE_CREATED_AT,
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
    created_at: SAMPLE_CREATED_AT,
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
    created_at: SAMPLE_CREATED_AT,
  },
];

export const SAMPLE_HOODIES: ShowcaseItem[] = [
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
    created_at: SAMPLE_CREATED_AT,
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
    created_at: SAMPLE_CREATED_AT,
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
    created_at: SAMPLE_CREATED_AT,
  },
];

export const SAMPLE_ACCESSORIES: ShowcaseItem[] = [
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
    created_at: SAMPLE_CREATED_AT,
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
    created_at: SAMPLE_CREATED_AT,
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
    created_at: SAMPLE_CREATED_AT,
  },
];

export const SAMPLE_SHIRTS: ShowcaseItem[] = [
  {
    id: "sample-shirt-1",
    sku: "TWOM-SH-01",
    slug: "relaxed-poplin-atelier-shirt",
    name: "Relaxed Poplin Atelier Shirt Chalk",
    description:
      "Crisp Japanese cotton poplin button-down with concealed placket.",
    category: "Shirts",
    price: 8800000, // ₦88,000
    originalPrice: 11000000, // ₦110,000
    saveBadge: "SAVE ₦22,000.00",
    image_url: "/TWOM.png",
    stock_quantity: 9,
    is_active: true,
    created_at: SAMPLE_CREATED_AT,
  },
  {
    id: "sample-shirt-2",
    sku: "TWOM-SH-02",
    slug: "boxy-linen-camp-collar-shirt",
    name: "Boxy Linen Camp Collar Shirt Charcoal",
    description: "Textured Belgian linen short-sleeve overshirt.",
    category: "Shirts",
    price: 9400000, // ₦94,000
    image_url: "/TWOM.png",
    stock_quantity: 14,
    is_active: true,
    created_at: SAMPLE_CREATED_AT,
  },
  {
    id: "sample-shirt-3",
    sku: "TWOM-SH-03",
    slug: "structured-twill-overshirt",
    name: "Structured Twill Work Overshirt Slate",
    description: "Midweight organic cotton twill shirt with tonal hardware.",
    category: "Shirts",
    price: 10500000, // ₦105,000
    image_url: "/TWOM.png",
    stock_quantity: 5,
    is_active: true,
    created_at: SAMPLE_CREATED_AT,
  },
];

export const SAMPLE_ANIME: ShowcaseItem[] = [
  {
    id: "sample-anime-1",
    sku: "TWOM-ANM-01",
    slug: "mecha-linework-oversized-tee",
    name: "Mecha Linework Graphic Tee Washed Noir",
    description:
      "Heavyweight combed jersey featuring monochrome studio archive print.",
    category: "Anime",
    price: 6900000, // ₦69,000
    originalPrice: 8900000, // ₦89,000
    saveBadge: "SAVE ₦20,000.00",
    image_url: "/TWOM.png",
    stock_quantity: 7,
    is_active: true,
    created_at: SAMPLE_CREATED_AT,
  },
  {
    id: "sample-anime-2",
    sku: "TWOM-ANM-02",
    slug: "tokyo-sketch-boxy-hoodie",
    name: "Tokyo Sketch Boxy Hoodie Ash",
    description: "460GSM brushed fleece with tonal back storyboard embroidery.",
    category: "Anime",
    price: 14200000, // ₦142,000
    image_url: "/TWOM.png",
    stock_quantity: 12,
    is_active: true,
    created_at: SAMPLE_CREATED_AT,
  },
  {
    id: "sample-anime-3",
    sku: "TWOM-ANM-03",
    slug: "cel-frame-archive-longsleeve",
    name: "Cel Frame Archive Longsleeve Bone",
    description: "Dropped-shoulder longsleeve with subtle sleeve typography.",
    category: "Anime",
    price: 8200000, // ₦82,000
    image_url: "/TWOM.png",
    stock_quantity: 4,
    is_active: true,
    created_at: SAMPLE_CREATED_AT,
  },
];

const SHOWCASE_GROUPS: Array<{
  tabKeywords: string[];
  productMatchers: string[];
  items: ShowcaseItem[];
}> = [
  {
    tabKeywords: ["tee", "tank"],
    productMatchers: ["tee", "tank"],
    items: SAMPLE_TEES,
  },
  {
    tabKeywords: ["pant"],
    productMatchers: ["pant", "trouser"],
    items: SAMPLE_PANTS,
  },
  {
    tabKeywords: ["hoodie", "sweat"],
    productMatchers: ["hoodie", "sweat"],
    items: SAMPLE_HOODIES,
  },
  {
    tabKeywords: ["accessor"],
    productMatchers: ["accessor", "bag", "cap", "hat"],
    items: SAMPLE_ACCESSORIES,
  },
  {
    tabKeywords: ["shirt"],
    productMatchers: ["shirt"],
    items: SAMPLE_SHIRTS,
  },
  {
    tabKeywords: ["anime"],
    productMatchers: ["anime"],
    items: SAMPLE_ANIME,
  },
];

export const SHOWCASE_SAMPLES: ShowcaseItem[] = SHOWCASE_GROUPS.flatMap(
  (group) => group.items,
);

/** Match a DB product's category against a showcase tab or category query. */
export function matchesCategoryTab(
  productCategory: string | null | undefined,
  tabOrCategory: string,
): boolean {
  const target = tabOrCategory.toLowerCase();
  const cat = productCategory?.toLowerCase() || "";

  const group = SHOWCASE_GROUPS.find((g) =>
    g.tabKeywords.some((kw) => target.includes(kw)),
  );
  if (group) {
    return group.productMatchers.some((m) => cat.includes(m));
  }
  return cat === target;
}

/** Return fallback showcase items for a showcase tab or category name. */
export function getFallbackItemsForCategory(
  tabOrCategory: string,
): ShowcaseItem[] {
  const target = tabOrCategory.toLowerCase();
  const group = SHOWCASE_GROUPS.find((g) =>
    g.tabKeywords.some((kw) => target.includes(kw)),
  );
  return group ? group.items : [];
}

/** Look up a fallback showcase item by its slug for /products/[slug]. */
export function getShowcaseSampleBySlug(
  slug: string,
): ShowcaseItem | undefined {
  return SHOWCASE_SAMPLES.find((item) => item.slug === slug);
}

/** Check whether a product ID belongs to an unseeded showcase preview item. */
export function isSampleProductId(id: string): boolean {
  return id.startsWith("sample-");
}

