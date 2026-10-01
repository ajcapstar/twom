import React from "react";
import styles from "./AboutUs.module.css";
import Button from "@/components/ui/Button";

const stats = [
  { value: "2019", label: "Founded" },
  { value: "4K+", label: "Happy Clients" },
  { value: "100%", label: "Local Crafted" },
  { value: "34", label: "Unique Pieces" },
];

const AboutUs: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="about-heading">
      <div className={styles.content}>
        <span className={styles.eyebrow}>Who We Are</span>
        <h2 id="about-heading" className={styles.heading}>
          Born in Brampton.
          <br />
          <em className={styles.accent}>Built to last.</em>
        </h2>
        <p className={styles.body}>
          TWOM started with a simple belief: professional clothing shouldn&apos;t
          feel like a compromise. Every piece we make is obsessively crafted —
          from the weight of the fabric to the width of the stitch — so you
          can move through your day with quiet confidence.
        </p>
        <p className={styles.body}>
          We&apos;re based in Brampton, Ontario, and we&apos;re proud of it.
          Our studio is open every Saturday, and we think that matters.
        </p>
        <Button href="/about" size="lg" variant="primary">
          Read Our Story
        </Button>
      </div>

      <div className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutUs;
