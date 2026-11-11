"use client";
import { useState, useRef, useCallback, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCartStore } from "@/lib/store";
import { useUIStore } from "@/lib/ui-store";
import styles from "./Menu.module.css";

interface SplitResult {
  chars: HTMLElement[];
  revert: () => void;
}

// iOS 15-compatible character splitter (avoids gsap/SplitText's incompatible regex)
function createCharSplit(element: HTMLElement): SplitResult {
  const originalHTML = element.innerHTML;
  const text = element.textContent || "";
  element.innerHTML = "";
  const chars: HTMLElement[] = [];

  for (const char of text) {
    const span = document.createElement("span");
    span.className = "char";
    span.style.display = "inline-block";
    span.textContent = char === " " ? "\u00A0" : char;
    element.appendChild(span);
    chars.push(span);
  }

  return {
    chars,
    revert: () => {
      element.innerHTML = originalHTML;
    },
  };
}

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
  // Hydration safety: useSyncExternalStore returns false on server, true on client
  // without triggering a cascading setState in an effect
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isAnimating = useRef(false);
  const splitsCreated = useRef(false);
  const svgTlRef = useRef<gsap.core.Timeline | null>(null);

  // UI and Cart store state
  const items = useCartStore((state) => state.items);
  const isCartOpen = useUIStore((state) => state.isCartOpen);
  const openCart = useUIStore((state) => state.openCart);
  const closeCart = useUIStore((state) => state.closeCart);
  const quickBuyProduct = useUIStore((state) => state.quickBuyProduct);
  const closeQuickBuy = useUIStore((state) => state.closeQuickBuy);
  const totalCount = mounted
    ? items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  // DOM refs
  const menuRef = useRef<HTMLDivElement>(null);
  const navToggleMenuRef = useRef<HTMLParagraphElement>(null);
  const navToggleCloseRef = useRef<HTMLParagraphElement>(null);
  const menuBgRef = useRef<SVGPathElement>(null);

  // Collections (links + info items)
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const infoItemsRef = useRef<Element[]>([]);
  const splitsRef = useRef<SplitResult[]>([]);

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

  // Wrap interaction functions in useCallback so refs are only accessed in event callbacks
  const openMenu = useCallback(() => {
    contextSafe(() => {
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

      const splits: SplitResult[] = [];
      menuLinks.forEach((link) => {
        const split = createCharSplit(link);
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
    const infoItems = infoItemsRef.current;
    const splits = splitsRef.current;

    if (
      !navToggleMenu ||
      !navToggleClose ||
      !menuBg ||
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
    })();
  }, [contextSafe]);

  const closeMenu = useCallback(() => {
    contextSafe(() => {
      const navToggleClose = navToggleCloseRef.current;
      const navToggleMenu = navToggleMenuRef.current;
      const svgTl = svgTlRef.current;
      const links = linksRef.current;

      if (!navToggleClose || !navToggleMenu || !svgTl) return;

      // Info items hide
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
    })();
  }, [contextSafe]);

  const toggleMenu = useCallback(() => {
    if (isAnimating.current) return;
    if (isCartOpen) closeCart();
    if (quickBuyProduct) closeQuickBuy();
    isAnimating.current = true;
    if (isOpen) closeMenu();
    else openMenu();
  }, [isOpen, isCartOpen, quickBuyProduct, closeCart, closeQuickBuy, closeMenu, openMenu]);

  const handleCartClick = useCallback(() => {
    if (quickBuyProduct) closeQuickBuy();
    if (isOpen && !isAnimating.current) {
      isAnimating.current = true;
      closeMenu();
    }
    if (isCartOpen) {
      closeCart();
    } else {
      openCart();
    }
  }, [isOpen, isCartOpen, quickBuyProduct, closeCart, openCart, closeQuickBuy, closeMenu]);

  const handleLogoClick = useCallback(() => {
    if (isCartOpen) closeCart();
    if (quickBuyProduct) closeQuickBuy();
    if (isOpen && !isAnimating.current) {
      isAnimating.current = true;
      closeMenu();
    }
  }, [isOpen, isCartOpen, quickBuyProduct, closeCart, closeQuickBuy, closeMenu]);

  // Lock background scroll when menu is open (matching CartDrawer)
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isAnimating.current) {
        toggleMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggleMenu]);

  return (
    <div className={styles.nav}>
      {/* 1. Toggle Menu on the Left */}
      <button
        type="button"
        className={styles["nav-toggle"]}
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <p ref={navToggleMenuRef} className={styles["nav-toggle-menu"]}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            strokeWidth={1.5}
            stroke="currentColor"
            style={{ pointerEvents: "none" }}
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
            style={{ pointerEvents: "none" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </p>
      </button>

      {/* 2. Brand Logo in the Center */}
      <div className={styles["nav-logo"]}>
        <Link href="/" onClick={handleLogoClick}>
          <Image src="/TWOM.png" alt="Logo" width={64} height={64} priority />
        </Link>
      </div>

      {/* 3. Shopping Cart on the Extreme Right */}
      <button
        type="button"
        onClick={handleCartClick}
        className={styles["nav-cart"]}
        aria-label="Toggle Shopping Bag"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          strokeWidth={1.5}
          stroke="currentColor"
          style={{ pointerEvents: "none" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"
          />
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 10a4 4 0 0 1-8 0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {totalCount > 0 && (
          <span className={styles["cart-badge"]}>
            {totalCount}
          </span>
        )}
      </button>

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
          <Link href="/products?category=Outerwear" onClick={toggleMenu}>
            Outerwear
          </Link>
          <Link href="/products?category=Tailoring" onClick={toggleMenu}>
            Tailoring
          </Link>
          <Link href="/products?category=Knitwear" onClick={toggleMenu}>
            Knitwear
          </Link>
          <Link href="/products?category=Essentials" onClick={toggleMenu}>
            Essentials
          </Link>
          <Link href="/cart" onClick={toggleMenu}>
            Your Cart
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
