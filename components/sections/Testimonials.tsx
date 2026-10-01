import React from "react";
import styles from "./Testimonials.module.css";
import StarRating from "@/components/ui/StarRating";

const testimonials = [
  {
    id: 1,
    name: "Khalil M.",
    location: "Brampton, ON",
    rating: 5,
    text: "The quality is genuinely unmatched for the price. I wore the wool overcoat on a night out and got stopped three times. TWOM is the brand.",
    product: "Brushed Wool Overcoat",
  },
  {
    id: 2,
    name: "Priya S.",
    location: "Toronto, ON",
    rating: 5,
    text: "Finally a brand that gets minimalist done right without looking boring. Everything fits perfectly out of the box.",
    product: "Oxford Button-Down",
  },
  {
    id: 3,
    name: "Devon A.",
    location: "Mississauga, ON",
    rating: 4,
    text: "The linen trousers are incredibly breathable for summer. Sizing is true — go with your usual. Love the attention to detail.",
    product: "Relaxed Linen Trousers",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="testimonials-heading">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Real Reviews</span>
        <h2 id="testimonials-heading" className={styles.heading}>
          What People Say
        </h2>
      </div>

      <div className={styles.grid}>
        {testimonials.map((t) => (
          <article key={t.id} className={styles.card}>
            <StarRating rating={t.rating} size="md" />
            <blockquote className={styles.quote}>
              &ldquo;{t.text}&rdquo;
            </blockquote>
            <footer className={styles.footer}>
              <span className={styles.name}>{t.name}</span>
              <span className={styles.meta}>
                {t.location} · {t.product}
              </span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
