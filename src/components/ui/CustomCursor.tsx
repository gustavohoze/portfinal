"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lockedPos = useRef<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Only show custom cursor on devices with fine pointers (e.g. mice/trackpads)
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    setMounted(true);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      // Ignore mouse updates completely if the cursor is mechanically locked by a page transition
      if (lockedPos.current) return;
      
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Core updates instantly for zero latency feel vs the trailing ring
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const render = () => {
      let targetX = mouseX;
      let targetY = mouseY;
      
      if (lockedPos.current) {
        targetX = lockedPos.current.x;
        targetY = lockedPos.current.y;
        
        // Mechanically force core strictly to lock constraints
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        }
      }

      // Linear interpolation pushes the ring smoothly towards the target coordinates
      ringX += (targetX - ringX) * 0.2;
      ringY += (targetY - ringY) * 0.2;
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    render();

    const handleMouseOver = (e: MouseEvent) => {
      if (lockedPos.current) return; // Mechanically lock the hover scale during transitions
      const target = e.target as HTMLElement;
      // Trigger astronaut magnetic hover on links and buttons
      if (
        target.tagName.toLowerCase() === "a" || 
        target.tagName.toLowerCase() === "button" || 
        target.closest("a") || 
        target.closest("button")
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    const handleLock = (e: Event) => {
      const { x, y } = (e as CustomEvent).detail;
      lockedPos.current = { x, y };
    };
    const handleUnlock = () => {
      lockedPos.current = null;
    };

    window.addEventListener("cursor-lock", handleLock);
    window.addEventListener("cursor-unlock", handleUnlock);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("cursor-lock", handleLock);
      window.removeEventListener("cursor-unlock", handleUnlock);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div 
        ref={ringRef} 
        className={`${styles.ring} ${hovered ? styles.hovered : ""}`}
        aria-hidden="true"
      />
      <div 
        ref={cursorRef} 
        className={`${styles.core} ${hovered ? styles.coreHidden : ""}`}
        aria-hidden="true"
      />
    </>
  );
}
