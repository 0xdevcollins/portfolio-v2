"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { ease, gsap, SplitText, useGSAP } from "@/lib/gsap";
import { introIsPending, markIntroDone } from "@/lib/intro";

/** Your name rises in, holds for a beat, and the screen lifts away. Once per session. */
export function IntroLoader() {
  const root = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLParagraphElement>(null);
  const year = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!introIsPending() || !name.current) return;

      const split = SplitText.create(name.current, { type: "chars", mask: "chars" });
      const tl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
          try {
            sessionStorage.setItem("intro", "1");
          } catch {}
          markIntroDone();
        },
      });

      tl.from(split.chars, { yPercent: 110, duration: 0.9, ease: ease.out, stagger: 0.025 })
        .from(year.current, { opacity: 0, y: 6, duration: 0.5, ease: ease.soft }, 0.55)
        .to(root.current, { yPercent: -100, duration: 0.9, ease: ease.inOut }, 1.45)
        .to(name.current, { y: -60, opacity: 0, duration: 0.7, ease: ease.inOut }, 1.45);

      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="intro fixed inset-0 z-[100] place-items-center bg-night text-white"
    >
      <div className="relative">
        <p ref={name} className="text-[clamp(40px,7vw,104px)] font-medium leading-none tracking-[-0.045em]">
          {site.name}
          <span className="text-accent">.</span>
        </p>
        <span
          ref={year}
          className="absolute -bottom-9 right-0 rounded-full border border-white/25 px-2.5 py-0.5 text-[12px] text-white/70"
        >
          © 2026
        </span>
      </div>
    </div>
  );
}
