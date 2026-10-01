import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";
import Image from "next/image";

const footerLinks = {
  Shop: ["New Arrivals", "Collections", "Sale", "Gift Cards"],
  Company: ["About Us", "Careers", "Press", "Sustainability"],
  Support: ["FAQ", "Shipping", "Returns", "Contact Us"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <Image src="/TWOM.png" alt="Logo" width={100} height={100} />
          </span>
          <p className={styles.tagline}>
            Crafted for the ones who move differently.
          </p>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          {Object.entries(footerLinks).map(([group, items]) => (
            <div key={group} className={styles.linkGroup}>
              <h6 className={styles.groupTitle}>{group}</h6>
              <ul>
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className={styles.link}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} TWOM. All rights reserved.
        </p>
        <div className={styles.socials}>
          {["Instagram", "TikTok", "Pinterest", "X"].map((s) => (
            <Link key={s} href="#" className={styles.socialLink}>
              {s}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
