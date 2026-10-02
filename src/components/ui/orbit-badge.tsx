"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/intro";

/** Your avatar ringed by slowly turning text. Spins faster on hover. */
export function OrbitBadge({ src, text, href }: { src: string; text: string; href: string }) {
  const root = useRef<HTMLAnchorElement>(null);
  const ring = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const spin = gsap.to(ring.current, { rotation: 360, duration: 22, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      const el = root.current;
      if (!el) return;
      const fast = () => gsap.to(spin, { timeScale: 4, duration: 0.6 });
      const slow = () => gsap.to(spin, { timeScale: 1, duration: 0.9 });
      el.addEventListener("pointerenter", fast);
      el.addEventListener("pointerleave", slow);
      return () => {
        el.removeEventListener("pointerenter", fast);
        el.removeEventListener("pointerleave", slow);
      };
    },
    { scope: root },
  );

  const label = `${text} · ${text} · `;

  return (
    <a ref={root} href={href} aria-label={text} className="group relative grid size-[132px] place-items-center">
      <svg ref={ring} viewBox="0 0 132 132" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <path id="orbit" d="M66,66 m-54,0 a54,54 0 1,1 108,0 a54,54 0 1,1 -108,0" />
        </defs>
        <text className="fill-fg font-mono text-[10px] uppercase">
          {/* Stretch the label so it wraps the whole ring exactly once. */}
          <textPath href="#orbit" textLength={2 * Math.PI * 54 - 4} lengthAdjust="spacing">
            {label}
          </textPath>
        </text>
      </svg>
      <span className="relative size-[76px] overflow-hidden rounded-full bg-soft ring-1 ring-line transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105">
        <Image src={src} alt="" fill sizes="76px" className="object-cover" priority />
      </span>
    </a>
  );
}
