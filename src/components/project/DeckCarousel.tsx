"use client";

import { useRef, useCallback } from "react";
import SafeImage from "@/components/ui/SafeImage";
import type { ProjectDeckImage } from "@/types/database";
import styles from "./DeckCarousel.module.css";

interface Props {
  images: ProjectDeckImage[];
}

function DeckSlide({ img, index }: { img: ProjectDeckImage; index: number }) {
  return (
    <div className={styles.slide}>
      <SafeImage
        src={img.image_url}
        alt={`Deck image ${index + 1}`}
        fill
        sizes="(min-width: 1200px) 800px, 90vw"
        className={styles.image}
      />
    </div>
  );
}

export default function DeckCarousel({ images }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
    if (trackRef.current) trackRef.current.style.cursor = "grabbing";
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  return (
    <section className={styles.section}>
      <div className="container">
        <p className={styles.label}>Project Deck</p>
      </div>

      <div
        ref={trackRef}
        className={styles.track}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
        role="region"
        aria-label="Project deck images"
      >
        {images.map((img, i) => (
          <DeckSlide key={img.id} img={img} index={i} />
        ))}
      </div>
    </section>
  );
}
