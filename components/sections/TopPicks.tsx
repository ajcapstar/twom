import React from "react";
import styles from "./TopPicks.module.css";
import ProductCard, { Product } from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";

const topPicks: Product[] = [
  {
    id: "brushed-wool-coat",
    name: "Brushed Wool Overcoat",
    price: 289,
    originalPrice: 360,
    image: "/products/coat.jpg",
    rating: 4.8,
    reviewCount: 142,
    badge: "Bestseller",
    category: "Outerwear",
  },
  {
    id: "linen-trousers",
    name: "Relaxed Linen Trousers",
    price: 129,
    image: "/products/trousers.jpg",
    rating: 4.6,
    reviewCount: 89,
    category: "Bottoms",
  },
  {
    id: "oxford-shirt",
    name: "Oxford Button-Down",
    price: 98,
    originalPrice: 120,
    image: "/products/shirt.jpg",
    rating: 4.7,
    reviewCount: 203,
    badge: "Sale",
    category: "Tops",
  },
  {
    id: "knit-vest",
    name: "Merino Knit Vest",
    price: 155,
    image: "/products/vest.jpg",
    rating: 4.5,
    reviewCount: 57,
    badge: "New",
    category: "Tops",
  },
];

const TopPicks: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="top-picks-heading">
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Editor&apos;s Choice</span>
          <h2 id="top-picks-heading" className={styles.heading}>
            Top Picks
          </h2>
        </div>
        <Button href="/collections" variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className={styles.grid}>
        {topPicks.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default TopPicks;
