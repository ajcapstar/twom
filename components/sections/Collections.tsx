import React from "react";
import styles from "./Collections.module.css";
import CollectionCard, { Collection } from "@/components/ui/CollectionCard";

const collections: Collection[] = [
  {
    id: "autumn-25",
    title: "Autumn 2025",
    subtitle: "New Season",
    image: "/collections/autumn-25.jpg",
    href: "/collections/autumn-25",
    itemCount: 24,
  },
  {
    id: "essentials",
    title: "Essentials",
    subtitle: "Always In Stock",
    image: "/collections/essentials.jpg",
    href: "/collections/essentials",
    itemCount: 16,
  },
  {
    id: "formal",
    title: "Formal Edit",
    subtitle: "Office Ready",
    image: "/collections/formal.jpg",
    href: "/collections/formal",
    itemCount: 12,
  },
];

const Collections: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="collections-heading">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Curated Drops</span>
        <h2 id="collections-heading" className={styles.heading}>
          Our Collections
        </h2>
      </div>

      <div className={styles.grid}>
        {/* Featured large card */}
        <div className={styles.featured}>
          <CollectionCard collection={collections[0]} size="lg" />
        </div>
        {/* Secondary cards */}
        <div className={styles.secondary}>
          {collections.slice(1).map((col) => (
            <CollectionCard key={col.id} collection={col} size="sm" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
