"use client";

import dynamic from "next/dynamic";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const scrollToWork = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.headline}>
          Crafting
          <br />
          <em className={styles.em}>digital experiences</em>
          <br />
          that matter.
        </h1>

        <p className={styles.sub}>
          Designer & developer focused on the intersection of craft,
          <br className={styles.brDesktop} />
          interaction, and performance.
        </p>

        <div className={styles.cta}>
          <button className={styles.ctaPrimary} onClick={scrollToWork}>
            View work
          </button>
          <a href="mailto:hello@example.com" className={styles.ctaSecondary}>
            Get in touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span className={styles.scrollLabel}>scroll</span>
      </div>
    </section>
  );
}
