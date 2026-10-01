import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./CollectionCard.module.css";

export interface Collection {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  itemCount?: number;
}

interface CollectionCardProps {
  collection: Collection;
  size?: "sm" | "lg";
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  size = "sm",
}) => {
  return (
    <Link
      href={collection.href}
      className={`${styles.card} ${styles[size]}`}
      aria-label={`View ${collection.title} collection`}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        {collection.subtitle && (
          <span className={styles.subtitle}>{collection.subtitle}</span>
        )}
        <h3 className={styles.title}>{collection.title}</h3>
        {collection.itemCount !== undefined && (
          <span className={styles.itemCount}>{collection.itemCount} pieces</span>
        )}
        <span className={styles.cta}>
          Explore <span className={styles.arrow}>→</span>
        </span>
      </div>
    </Link>
  );
};

export default CollectionCard;
