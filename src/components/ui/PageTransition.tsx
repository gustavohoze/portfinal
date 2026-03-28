"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";

export default function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  const isAnimating = useRef(false);
  const isOpening = useRef(false); // Protect against concurrent hydration race conditions
  const prevPathname = useRef(pathname);
  
  // Size of the hole to leave visible directly over the custom cursor ring
  const TARGET_RADIUS = 36;
  
  const irisCenter = useRef({ x: typeof window !== "undefined" ? window.innerWidth / 2 : 0, y: typeof window !== "undefined" ? window.innerHeight / 2 : 0 });

  const openIris = () => {
    if (isOpening.current) return;
    
    if (!isAnimating.current && overlayRef.current?.style.pointerEvents === 'none') {
       return; // Guard: Already open
    }
    
    isOpening.current = true;
    
    // Unlock the custom cursor physics
    window.dispatchEvent(new CustomEvent("cursor-unlock"));
    
    const { x, y } = irisCenter.current;
    const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 1.5;
    
    const obj = { radius: TARGET_RADIUS }; // Expand from the parked cursor bounds
    gsap.to(obj, {
      radius: maxRadius,
      duration: 1.0,
      ease: "power3.inOut",
      onUpdate: () => {
        if (overlayRef.current) {
          const mask = `radial-gradient(circle at ${x}px ${y}px, transparent ${obj.radius}px, black ${obj.radius + 1}px)`;
          overlayRef.current.style.maskImage = mask;
          overlayRef.current.style.webkitMaskImage = mask;
        }
      },
      onComplete: () => {
        isAnimating.current = false;
        isOpening.current = false;
        if (overlayRef.current) {
          overlayRef.current.style.pointerEvents = "none";
        }
      }
    });
  };

  useEffect(() => {
    const handleTransition = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { href, x, y } = customEvent.detail;

      if (isAnimating.current) return;
      isAnimating.current = true;
      isOpening.current = false; // Arm opening circuit for subsequent use
      
      irisCenter.current = { x, y };
      const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 1.5;
      
      if (overlayRef.current) {
        overlayRef.current.style.pointerEvents = "auto";
        
        // Lock the CustomCursor mechanically so it freezes in place perfectly inside the targeted hole
        window.dispatchEvent(new CustomEvent("cursor-lock", { detail: { x, y } }));
        
        const obj = { radius: maxRadius };
        gsap.to(obj, {
          radius: TARGET_RADIUS, // Stops the wipe EXACTLY around the custom cursor limits!
          duration: 1.0,
          ease: "power3.inOut",
          onUpdate: () => {
            if (overlayRef.current) {
              const mask = `radial-gradient(circle at ${x}px ${y}px, transparent ${obj.radius}px, black ${obj.radius + 1}px)`;
              overlayRef.current.style.maskImage = mask;
              overlayRef.current.style.webkitMaskImage = mask;
            }
          },
          onComplete: () => {
            // Darkness has perfectly framed the cursor. Wait elegantly before routing.
            setTimeout(() => {
              router.push(href);
              // Next.js async route hydration takes over from here. The page will remain black until the [pathname] effect mathematically confirms the new DOM has rendered.
            }, 600);
          }
        });
      }
    };

    window.addEventListener("page-transition", handleTransition);
    
    return () => {
      window.removeEventListener("page-transition", handleTransition);
    };
  }, [router]);

  // 2. Listen natively for the next completion of the React App Router path transition
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      openIris();
    }
  }, [pathname]);

  return (
    <div 
      ref={overlayRef} 
      id="page-transition-overlay"
      aria-hidden="true"
    />
  );
}
