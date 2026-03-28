"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/types/database";
import ProjectCard from "@/components/work/ProjectCard";
import styles from "./WorkSection.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  projects: Project[];
}

export default function WorkSection({ projects }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const children = gridRef.current?.children;
      if (!children || children.length === 0) return;

      gsap.fromTo(
        children,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={sectionRef} className={`${styles.section} section`}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.label}>Selected Work</span>
          <h2 className={styles.headline}>Projects</h2>
        </div>

        {/* Grid */}
        {projects.length > 0 ? (
          <div ref={gridRef} className={styles.grid}>
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Projects coming soon.</p>
        )}
      </div>
    </section>
  );
}
