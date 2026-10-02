"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/intro";

/**
 * A rounded frame whose content drifts a little slower than the page,
 * and eases in from slightly zoomed when it first appears.
 */
export function ParallaxMedia({ children, className }: { children: ReactNode; className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(inner.current, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "expo.out" });
      gsap.fromTo(
        inner.current,
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={`relative overflow-hidden ${className ?? ""}`}>
      <div ref={inner} className="absolute -inset-y-[5%] inset-x-0">
        {children}
      </div>
    </div>
  );
}
