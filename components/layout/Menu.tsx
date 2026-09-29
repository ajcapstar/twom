"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import styles from "./Menu.module.css";

gsap.registerPlugin(SplitText);

const Menu = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(false);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const navToggle = document.querySelector(".nav-toggle");
      const navToggleMenu = document.querySelector(".nav-toggle-menu");
      const navToggleClose = document.querySelector(".nav-toggle-close");
      const menu = document.querySelector(".menu");
      const menuBg = document.getElementById("menu-path");
      const menuBgSvg = document.querySelector(".menu-bg-svg");
      const menuLogo = document.querySelector(".menu-logo");
      const menuLinks = document.querySelectorAll(".menu-links a");
      const menuInfoItems = document.querySelectorAll(
        ".menu-col-info p, .menu-col-info h3, .menu-col-info h6",
      );

      // --- PASTE TUTORIAL GSAP TIMELINE CODE HERE ---

      const viewBoxAttr = menuBgSvg?.getAttribute("viewBox");
      const viewBoxValues = viewBoxAttr ? viewBoxAttr.split(" ").map(Number) : [];
      const svgWidth =
        (menuBgSvg as SVGSVGElement)?.viewBox?.baseVal?.width ||
        viewBoxValues[2] ||
        1131;
      const svgHeight =
        (menuBgSvg as SVGSVGElement)?.viewBox?.baseVal?.height ||
        viewBoxValues[3] ||
        861;
      const svgCenterX = svgWidth / 2;

      const OPEN_HIDDEN = `M${svgWidth}, 0 Q${svgCenterX}, 0, 0, 0 L0, 0 L${svgWidth}, 0 Z`;
      const OPEN_BULGE = `M${svgWidth}, 345 Q${svgCenterX}, 620, 0, 345 L0, 0 L${svgWidth}, 0 Z`;
      const OPEN_FULL = `M${svgWidth}, ${svgHeight} Q${svgCenterX}, ${svgHeight}, 0, ${svgHeight} L0, 0 L${svgWidth}, 0 Z`;

      gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } });
      const splits: SplitText[] = [];
      menuLinks.forEach((link) => {
        const split = new SplitText(link, {
          type: "chars",
          charsClass: "char",
        });
        splits.push(split);
        gsap.set(split.chars, { opacity: 0, x: "750%" });
      });
      gsap.set(menuInfoItems, { opacity: 0, y: 100 });
      // --- GSAP TIMELINE GOES BELOW HERE ---

      const openMenu = () => {
        menu?.classList.add("is-open");

        // 2. Fade out the "Menu" text
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
        const tl = gsap.timeline({
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        });
        tl.to(menuBg, {
          duration: 0.5,
          attr: { d: OPEN_BULGE },
          ease: "power4.in",
        }).to(menuBg, {
          duration: 0.5,
          attr: { d: OPEN_FULL },
          ease: "power4.out",
        });
        tl.to(
          menuLogo,
          {
            duration: 0.1,
            opacity: 1,
            ease: "none",
          },
          "-=0.75",
        );
        tl.to(
          menuInfoItems,
          {
            duration: 0.75,
            opacity: 1,
            y: 0,
            ease: "power3.out",
            stagger: 0.075,
          },
          "-=0.35",
        );
        const menuLinksChars = splits.flatMap((s) => s.chars);

        tl.to(
          menuLinksChars,
          {
            duration: 1.5,
            x: "0%",
            ease: "elastic.out(1, 0.25)",
            stagger: 0.01,
          },
          0.45,
        );

        tl.to(
          menuLinksChars,
          {
            duration: 0.75,
            opacity: 1,
            ease: "power2.out",
            stagger: 0.01,
          },
          0.45,
        );
      };
      const closeMenu = () => {
        menu?.classList.remove("is-open");
        gsap.to(navToggleClose, { duration: 0.3, opacity: 0, ease: "none" });
        gsap.to(navToggleMenu, {
          duration: 0.3,
          opacity: 1,
          ease: "none",
          delay: 0.25,
        });
        const menuLinksChars = splits.flatMap((s) => s.chars);
        const tl = gsap.timeline({
          onComplete: () => {
            menu?.classList.remove("is-open");
            gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } });

            splits.forEach((split) => {
              gsap.set(split.chars, { opacity: 0, x: "750%" });
            });
            gsap.set(menuLinks, { opacity: 1 });
            gsap.set(menuInfoItems, { opacity: 0, y: 100 });
            gsap.set(menuLogo, { opacity: 0 });
            isAnimatingRef.current = false;
          },
        });

        tl.to(menuLogo, { duration: 0.3, opacity: 0 })
          .to(menuLinksChars, { duration: 0.3, opacity: 0 }, "<")
          .to(menuInfoItems, { duration: 0.3, opacity: 0 }, "<")
          .to(
            menuBg,
            { duration: 0.5, attr: { d: OPEN_BULGE }, ease: "power3.in" },
            "<",
          )
          .to(menuBg, {
            duration: 0.5,
            attr: { d: OPEN_HIDDEN },
            ease: "power3.out",
          });
      };
      const handleToggle = (e?: Event) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        setTimeout(() => {
          isAnimatingRef.current = false;
        }, 1800);

        if (!isOpenRef.current) {
          isOpenRef.current = true;
          openMenu();
        } else {
          isOpenRef.current = false;
          closeMenu();
        }
      };

      navToggle?.addEventListener("click", handleToggle);
      navToggle?.addEventListener("touchstart", handleToggle as EventListener, { passive: false });

      return () => {
        navToggle?.removeEventListener("click", handleToggle);
        navToggle?.removeEventListener("touchstart", handleToggle as EventListener);
        splits.forEach((split) => split.revert());
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <div className={`${styles.nav} nav`}>
        <div className={`${styles.navLogo} nav-logo`}>
          <Link href="/">
            <Image src="/vercel.svg" alt="Logo" fill />
          </Link>
        </div>
      </div>

      <button
        type="button"
        className={`${styles.navToggle} nav-toggle`}
        aria-label="Toggle Menu"
      >
        <span className={`${styles.navToggleMenu} nav-toggle-menu`}>Menu</span>
        <span className={`${styles.navToggleClose} nav-toggle-close`}>Close</span>
      </button>

      <div className={`${styles.menu} menu`}>
        <svg
          className={`${styles.menuBgSvg} menu-bg-svg`}
          viewBox="0 0 1131 861"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="menu-path"
            fill="#f0eeee"
            d="M1131,0 Q565.5,0 0,0 L0,0 L1131,0 Z"
          />
        </svg>

        <Link href="/">
          <span
            style={{
              position: "relative",
              display: "block",
              width: "100%",
              height: "100%",
            }}
          >
            <Image src="/vercel.svg" alt="Logo" fill />
          </span>
        </Link>
        <div
          className={`${styles.menuCol} ${styles.menuColInfo} menu-col menu-col-info`}
        >
          <p>Get in touch</p>
          <h3>twomclothings.co</h3>
          <h3>+ (437) 982 4412</h3>
          <br />
          <h6>43 freedom parkway</h6>
          <h6>Brampton, Ontario</h6>
          <h6>L6Y1H8</h6>
        </div>

        <div
          className={`${styles.menuCol} ${styles.menuColLinks} menu-col menu-links`}
        >
          <Link href="/work">work</Link>
          <Link href="/about">about</Link>
          <Link href="/contact">contact</Link>
        </div>
      </div>
    </div>
  );
};

export default Menu;
