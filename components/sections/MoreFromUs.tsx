import React from "react";
import styles from "./MoreFromUs.module.css";
import ProductCard, { Product } from "@/components/ui/ProductCard";

const moreItems: Product[] = [
  {
    id: "wide-leg-chinos",
    name: "Wide-Leg Chinos",
    price: 142,
    image: "/products/chinos.jpg",
    rating: 4.4,
    reviewCount: 44,
    category: "Bottoms",
  },
  {
    id: "mock-neck-tee",
    name: "Mock-Neck Ribbed Tee",
    price: 72,
    image: "/products/tee.jpg",
    rating: 4.3,
    reviewCount: 31,
    badge: "New",
    category: "Tops",
  },
  {
    id: "blazer-wool",
    name: "Unstructured Wool Blazer",
    price: 345,
    originalPrice: 420,
    image: "/products/blazer.jpg",
    rating: 4.9,
    reviewCount: 78,
    category: "Formal",
  },
  {
    id: "cargo-trousers",
    name: "Technical Cargo Trousers",
    price: 168,
    image: "/products/cargo.jpg",
    rating: 4.2,
    reviewCount: 52,
    category: "Bottoms",
  },
  {
    id: "chelsea-boots",
    name: "Leather Chelsea Boots",
    price: 215,
    image: "/products/boots.jpg",
    rating: 4.7,
    reviewCount: 120,
    badge: "Bestseller",
    category: "Footwear",
  },
];

const MoreFromUs: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="more-heading">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Keep Exploring</span>
        <h2 id="more-heading" className={styles.heading}>
          More From Us
        </h2>
      </div>

      {/* Horizontal scroll on mobile, 5-col on desktop */}
      <div className={styles.scrollWrapper}>
        <div className={styles.grid}>
          {moreItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreFromUs;
