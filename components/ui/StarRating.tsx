import React from "react";
import styles from "./StarRating.module.css";

interface StarRatingProps {
  rating: number; // 0-5
  max?: number;
  size?: "sm" | "md" | "lg";
}

const StarRating: React.FC<StarRatingProps> = ({ rating, max = 5, size = "md" }) => {
  return (
    <div className={`${styles.stars} ${styles[size]}`} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <span key={i} className={`${styles.star} ${filled ? styles.filled : ""} ${half ? styles.half : ""}`}>
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
