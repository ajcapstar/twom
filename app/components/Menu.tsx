"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import styles from "./Menu.module.css";

gsap.registerPlugin(SplitText);

// SVG dimensions (from your viewBox="0 0 1131 861")
const SVG_W = 1131;
const SVG_H = 861;
const SVG_CX = SVG_W / 2;

// Path states
const OPEN_HIDDEN = `M${SVG_W},0 Q${SVG_CX},0 0,0 L0,0 L${SVG_W},0 Z`;
const OPEN_BULGE = `M${SVG_W},345 Q${SVG_CX},620 0,345 L0,0 L${SVG_W},0 Z`;
const OPEN_FULL = `M${SVG_W},${SVG_H} Q${SVG_CX},${SVG_H} 0,${SVG_H} L0,0 L${SVG_W},0 Z`;

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const isAnimating = useRef(false);
  const splitsCreated = useRef(false);
  const svgTlRef = useRef<gsap.core.Timeline | null>(null);

  // DOM refs
  const menuRef = useRef<HTMLDivElement>(null);
  const navToggleMenuRef = useRef<HTMLParagraphElement>(null);
  const navToggleCloseRef = useRef<HTMLParagraphElement>(null);
  const menuBgRef = useRef<SVGPathElement>(null);
  const menuLogoRef = useRef<HTMLDivElement>(null);

  // Collections (links + info items)
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const infoItemsRef = useRef<Element[]>([]);
  const splitsRef = useRef<SplitText[]>([]);

  // useGSAP handles initial static setup, automatic cleanup, and provides contextSafe
  const { contextSafe } = useGSAP(
    () => {
      if (menuBgRef.current) {
        gsap.set(menuBgRef.current, { attr: { d: OPEN_HIDDEN } });
      }

      return () => {
        splitsRef.current.forEach((s) => s.revert());
        splitsRef.current = [];
        splitsCreated.current = false;
      };
    },
    { scope: menuRef },
  );

  // Wrap interaction functions in contextSafe for automatic timeline & tween cleanup
  const openMenu = contextSafe(() => {
    const menuEl = menuRef.current;
    if (!menuEl) return;

    // LAZY INITIALIZATION (Only runs on first interaction, safe for hydration)
    if (!splitsCreated.current) {
      const menuLinks = Array.from(
        menuEl.querySelectorAll(`.${styles["menu-col-links"]} a`),
      ) as HTMLAnchorElement[];
      const menuInfoItems = Array.from(
        menuEl.querySelectorAll(
          `.${styles["menu-col-info"]} p, .${styles["menu-col-info"]} h3, .${styles["menu-col-info"]} h6`,
        ),
      ) as Element[];

      linksRef.current = menuLinks;
      infoItemsRef.current = menuInfoItems;

      const splits: SplitText[] = [];
      menuLinks.forEach((link) => {
        const split = new SplitText(link, {
          type: "chars",
          charsClass: "char",
        });
        splits.push(split);
        // Hide chars immediately so they don't flash
        gsap.set(split.chars, { opacity: 0, x: "750%" });
      });
      splitsRef.current = splits;

      gsap.set(menuInfoItems, { opacity: 0, y: 100 });
      splitsCreated.current = true;
    }

    const navToggleMenu = navToggleMenuRef.current;
    const navToggleClose = navToggleCloseRef.current;
    const menuBg = menuBgRef.current;
    const menuLogo = menuLogoRef.current;
    const infoItems = infoItemsRef.current;
    const splits = splitsRef.current;

    if (
      !navToggleMenu ||
      !navToggleClose ||
      !menuBg ||
      !menuLogo ||
      !infoItems ||
      !splits
    ) {
      return;
    }

    setIsOpen(true);

    gsap.to(navToggleMenu, {
      duration: 0.25,
      opacity: 0,
      ease: "none",
    });
    gsap.to(navToggleClose, {
      duration: 0.25,
      opacity: 1,
      ease: "none",
      delay: 0.25,
    });

    // SVG-only timeline — stored so close can reverse just the shape
    const svgTl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
      onReverseComplete: () => {
        setIsOpen(false);
        // Reset content to initial state for next open
        gsap.set(menuLogo, { opacity: 0 });
        gsap.set(infoItems, { opacity: 0, y: 100 });
        gsap.set(linksRef.current, { opacity: 1 });
        splitsRef.current.forEach((split) => {
          gsap.set(split.chars, { opacity: 0, x: "750%" });
        });
        isAnimating.current = false;
      },
    });

    svgTl
      .to(menuBg, { duration: 0.5, attr: { d: OPEN_BULGE }, ease: "power4.in" })
      .to(menuBg, {
        duration: 0.5,
        attr: { d: OPEN_FULL },
        ease: "power4.out",
      });

    svgTlRef.current = svgTl;

    // Content animations — separate, never reversed
    gsap.to(menuLogo, { duration: 0.1, opacity: 1, ease: "none", delay: 0.25 });

    gsap.to(infoItems, {
      duration: 0.75,
      opacity: 1,
      y: 0,
      ease: "power3.out",
      stagger: 0.075,
      delay: 0.65,
    });

    const menuLinksChars = splits.flatMap((s) => s.chars);

    gsap.to(menuLinksChars, {
      duration: 1.5,
      x: "0%",
      ease: "elastic.out(1, 0.25)",
      stagger: 0.01,
      delay: 0.45,
    });

    gsap.to(menuLinksChars, {
      duration: 0.75,
      opacity: 1,
      ease: "power2.out",
      stagger: 0.01,
      delay: 0.45,
    });
  });

  const closeMenu = contextSafe(() => {
    const navToggleClose = navToggleCloseRef.current;
    const navToggleMenu = navToggleMenuRef.current;
    const svgTl = svgTlRef.current;
    const links = linksRef.current;

    if (!navToggleClose || !navToggleMenu || !svgTl) return;

    // Logo + info: instant hide (they're small, no value in animating)
    gsap.to(menuLogoRef.current, {
      duration: 1,
      opacity: 0,
      ease: "power2.in",
    });
    gsap.to(infoItemsRef.current, {
      duration: 0.6,
      opacity: 0,
      ease: "power2.in",
    });

    // Links: stagger-fade timed to when the shape sweeps past them.
    gsap.to(links, {
      duration: 0.15,
      opacity: 0,
      ease: "power2.in",
      stagger: { each: 0.06, from: "end" },
      delay: 0.25,
    });

    // Toggle icons
    gsap.to(navToggleClose, { duration: 0.25, opacity: 0, ease: "none" });
    gsap.to(navToggleMenu, {
      duration: 0.25,
      opacity: 1,
      ease: "none",
      delay: 0.2,
    });

    // Shape retracts (mirrored open path)
    svgTl.reverse();
  });

  const toggleMenu = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    if (isOpen) closeMenu();
    else openMenu();
  };

  return (
    <div className={styles.nav}>
      <div className={styles["nav-logo"]}>
        <Link href="/">
          <Image src="/Twom.png" alt="Logo" width={64} height={64} />
        </Link>
      </div>

      <div className={styles["nav-toggle"]} onClick={toggleMenu}>
        <p ref={navToggleMenuRef} className={styles["nav-toggle-menu"]}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </p>
        <p ref={navToggleCloseRef} className={styles["nav-toggle-close"]}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </p>
      </div>

      <div
        ref={menuRef}
        className={`${styles.menu}${isOpen ? ` ${styles["is-open"]}` : ""}`}
      >
        <svg
          className={styles["menu-bg-svg"]}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path ref={menuBgRef} id="menu-path" fill="#f0eeee" d={OPEN_HIDDEN} />
        </svg>

        <div ref={menuLogoRef} className={styles["menu-logo"]}>
          <Link href="/">
            <Image src="/Twom.png" alt="Logo" width={64} height={64} />
          </Link>
        </div>

        <div className={`${styles["menu-col"]} ${styles["menu-col-info"]}`}>
          <p>Get in touch</p>
          <h3>studio@clikd.co</h3>
          <h3>+1 (437) 982 4412</h3>
          <br />
          <h6>42 Mercer Street</h6>
          <h6>Toronto, ON M5V</h6>
        </div>

        <div className={`${styles["menu-col"]} ${styles["menu-col-links"]}`}>
          <Link href="/products" onClick={toggleMenu}>
            Shop Collection
          </Link>
          <Link href="/products?category=tailoring" onClick={toggleMenu}>
            Tailoring
          </Link>
          <Link href="/products?category=essentials" onClick={toggleMenu}>
            Essentials
          </Link>
          <Link href="/story" onClick={toggleMenu}>
            The World
          </Link>
          <Link href="/account" onClick={toggleMenu}>
            Client Account
          </Link>
        </div>
      </div>
    </div>
  );
}
