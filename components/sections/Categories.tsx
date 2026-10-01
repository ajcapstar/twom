import React from "react";
import styles from "./Categories.module.css";
import Link from "next/link";

const categories = [
  { label: "Tops", href: "/categories/tops", count: 38, emoji: "👕" },
  { label: "Bottoms", href: "/categories/bottoms", count: 21, emoji: "👖" },
  { label: "Outerwear", href: "/categories/outerwear", count: 14, emoji: "🧥" },
  { label: "Formal", href: "/categories/formal", count: 19, emoji: "👔" },
  { label: "Accessories", href: "/categories/accessories", count: 27, emoji: "🧣" },
  { label: "Footwear", href: "/categories/footwear", count: 11, emoji: "👟" },
];

const Categories: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="categories-heading">
      <h2 id="categories-heading" className={styles.heading}>
        Shop by Category
      </h2>
      <ul className={styles.list}>
        {categories.map((cat) => (
          <li key={cat.label}>
            <Link href={cat.href} className={styles.item}>
              <span className={styles.emoji} aria-hidden="true">{cat.emoji}</span>
              <span className={styles.label}>{cat.label}</span>
              <span className={styles.count}>{cat.count} items</span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Categories;
