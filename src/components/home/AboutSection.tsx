"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  "UI Design", "UX Research", "Interaction Design",
  "React / Next.js", "Three.js", "GSAP",
  "TypeScript", "Figma", "Prototyping",
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        bodyRef.current?.children ?? [],
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bodyRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className={`${styles.section} section`}>
      <div className="container">
        <div className={styles.inner}>
          {/* Left: Label */}
          <div className={styles.left}>
            <span className={styles.label}>About</span>
          </div>

          {/* Right: Content */}
          <div className={styles.right}>
            <h2 ref={headRef} className={styles.headline}>
              Building products at the intersection of design and engineering.
            </h2>

            <div ref={bodyRef} className={styles.body}>
              <p>
                I&apos;m a product designer and developer with a focus on making
                complex things feel effortlessly simple. I care deeply about the
                details — the micro-interactions, the spacing, the way a
                transition makes you feel.
              </p>
              <p>
                Whether designing systems from scratch or refining an existing
                product, I bring a holistic approach that bridges visual craft
                and technical implementation.
              </p>

              {/* Skills */}
              <ul className={styles.skills}>
                {SKILLS.map((skill) => (
                  <li key={skill} className={styles.skill}>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
