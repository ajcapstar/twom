import React from "react";
import styles from "./Hero.module.css";
import Button from "@/components/ui/Button";

const Hero: React.FC = () => {
  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Gradient mesh background — no image dependency */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.grain} />
      </div>

      <div className={styles.content}>
        <span className={styles.eyebrow}>Autumn / Winter 2025</span>
        <h1 className={styles.heading}>
          Dressed in
          <br />
          <em className={styles.accent}>silence.</em>
        </h1>
        <p className={styles.sub}>
          Professional clothing rooted in restraint.
          <br />
          Made for Brampton, worn everywhere.
        </p>
        <div className={styles.ctas}>
          <Button href="/collections" size="lg" variant="primary">
            Shop Collection
          </Button>
          <Button href="/about" size="lg" variant="outline">
            Our Story
          </Button>
        </div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll</span>
      </div>
    </section>
  );
};

export default Hero;
