"use client";

import { useEffect, useState } from "react";
import styles from "./ProjectNav.module.css";

interface Section {
  id: string;
  label: string;
}

export default function ProjectNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sections.length === 0) return;
    const observers: IntersectionObserver[] = [];
    const sectionEls = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    const onScroll = () => {
      if (sectionEls.length === 0) {
        setProgress(0);
        return;
      }

      const viewportHeight = window.innerHeight;
      const firstTop = sectionEls[0].getBoundingClientRect().top + window.scrollY;
      const lastBottom =
        sectionEls[sectionEls.length - 1].getBoundingClientRect().bottom + window.scrollY;

      // Map progress only across the case-study sections to avoid dead space after content.
      const start = Math.max(firstTop - viewportHeight * 0.3, 0);
      const end = Math.max(lastBottom - viewportHeight * 0.7, start + 1);
      const raw = (window.scrollY - start) / (end - start);

      setProgress(Math.max(0, Math.min(raw, 1)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  if (sections.length === 0) return null;

  return (
    <nav className={styles.nav} aria-label="Page sections">
      {/* Full-height track */}
      <div className={styles.track}>
        {/* Filled progress bar */}
        <div
          className={styles.fill}
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      {/* Section labels */}
      <ul className={styles.list}>
        {sections.map(({ id, label }) => (
          <li key={id}>
            <button
              className={`${styles.item} ${active === id ? styles.active : ""}`}
              onClick={() => scrollTo(id)}
            >
              <span className={styles.tick} />
              <span className={styles.label}>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
