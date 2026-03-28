"use client";

import TransitionLink from "@/components/ui/TransitionLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Header.module.css";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Works" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      
      // Fix for Safari rubber-banding (elastic bounce) exactly at the top
      if (currentY <= 0) {
        setHidden(false);
        lastScrollY = currentY;
        return;
      }

      const delta = currentY - lastScrollY;
      
      // Ignore tiny jitters
      if (Math.abs(delta) < 8) return;

      if (currentY > 80) {
        setHidden(delta > 0); // Hide if scrolling down
      } else {
        setHidden(false);
      }
      
      lastScrollY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${hidden ? styles.hidden : ""}`}
    >
      <div className={styles.inner}>
        {/* Logo */}
        <TransitionLink href="/" className={styles.logo} aria-label="Home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="9" height="9" fill="currentColor" />
            <rect x="13" y="2" width="9" height="9" fill="currentColor" opacity="0.4" />
            <rect x="2" y="13" width="9" height="9" fill="currentColor" opacity="0.4" />
            <rect x="13" y="13" width="9" height="9" fill="currentColor" />
          </svg>
        </TransitionLink>

        {/* Nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <TransitionLink
              key={href}
              href={href}
              className={`${styles.link} ${pathname === href ? styles.active : ""}`}
            >
              {label}
            </TransitionLink>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className={styles.mobileToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <div className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ""}`}>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
        <nav className={styles.mobileNav}>
          {NAV_LINKS.map(({ href, label }) => (
            <TransitionLink
              key={href}
              href={href}
              className={`${styles.mobileLink} ${pathname === href ? styles.active : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </TransitionLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
