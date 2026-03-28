"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ContactSection.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll("[data-reveal]") ?? [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className={`${styles.section} section--lg`}>
      <div className="container">
        <div className={styles.inner}>
          <span className={styles.label} data-reveal>Let&apos;s talk</span>

          <a
            href="mailto:gustavohoze@gmail.com"
            className={styles.emailLink}
            data-reveal
            data-cursor-hover
          >
            gustavohoze@gmail.com
          </a>

          <p className={styles.sub} data-reveal>
            Say hi to the locals, explore new opportunities,
            <br />
            and start interesting conversations.
          </p>

          <div className={styles.social} data-reveal>
            <a href="https://github.com/gustavohoze" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              GitHub
            </a>
            <span className={styles.dot} aria-hidden="true">·</span>
            <a href="https://www.linkedin.com/in/gustavo-hoze/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              LinkedIn
            </a>
            <span className={styles.dot} aria-hidden="true">·</span>
            <a href="https://wa.me/6285104937022" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
