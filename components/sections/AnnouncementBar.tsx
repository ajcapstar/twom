import React from "react";
import styles from "./AnnouncementBar.module.css";

const announcements = [
  "Free shipping on orders over $150 · Code: TWOM150",
  "New Autumn Collection — Now Live",
  "Brampton Studio Open Saturdays 10am–5pm",
];

const AnnouncementBar: React.FC = () => {
  return (
    <div className={styles.bar} role="marquee" aria-live="polite">
      <div className={styles.track}>
        {[...announcements, ...announcements].map((text, i) => (
          <span key={i} className={styles.item}>
            {text}
            <span className={styles.dot} aria-hidden="true">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
