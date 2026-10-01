import React from "react";
import Image from "next/image";
import styles from "./ProductCard.module.css";
import StarRating from "./StarRating";
import Button from "./Button";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string; // e.g. "New", "Sale", "Bestseller"
  category?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {product.badge && (
          <span className={styles.badge}>{product.badge}</span>
        )}
        {discount && (
          <span className={styles.discount}>-{discount}%</span>
        )}
        <div className={styles.overlay}>
          <Button size="sm" variant="primary" href={`/products/${product.id}`}>
            Quick View
          </Button>
        </div>
      </div>

      <div className={styles.info}>
        {product.category && (
          <span className={styles.category}>{product.category}</span>
        )}
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.ratingRow}>
          <StarRating rating={product.rating} size="sm" />
          <span className={styles.reviewCount}>({product.reviewCount})</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
