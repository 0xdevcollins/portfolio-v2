"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { ease, gsap, SplitText, useGSAP } from "@/lib/gsap";
import { onIntroDone, prefersReducedMotion } from "@/lib/intro";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "intro" plays right after the intro screen; "scroll" when it enters view. */
  trigger?: "intro" | "scroll";
  /** words: soft blur-in word by word. lines: slide up from a mask. fade: whole block. */
  mode?: "words" | "lines" | "fade";
  delay?: number;
};

export function Reveal({
  as: Tag = "div",
  children,
  className,
  trigger = "scroll",
  mode = "fade",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { visibility: "visible" });
        return;
      }

      let played = false;
      let off = () => {};

      const from =
        mode === "words"
          ? { opacity: 0, y: 12, filter: "blur(8px)" }
          : mode === "lines"
            ? { yPercent: 105 }
            : { opacity: 0, y: 24 };
      const to = {
        opacity: 1,
        y: 0,
        yPercent: 0,
        filter: "blur(0px)",
        duration: mode === "words" ? 1 : 0.9,
        ease: ease.out,
        stagger: mode === "words" ? 0.025 : 0.08,
        delay,
        onComplete: () => {
          played = true;
        },
      };

      const run = (targets: Element[] | Element) => {
        gsap.set(el, { visibility: "visible" });
        if (trigger === "intro") {
          gsap.set(targets, from);
          off = onIntroDone(() => gsap.to(targets, to));
          return;
        }
        return gsap.fromTo(targets, from, {
          ...to,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      };

      if (mode === "fade") {
        run(el);
        return () => off();
      }

      const split = SplitText.create(el, {
        type: mode === "words" ? "words" : "lines",
        mask: mode === "lines" ? "lines" : undefined,
        autoSplit: true,
        onSplit(self) {
          if (played) {
            gsap.set(el, { visibility: "visible" });
            return;
          }
          return run(mode === "words" ? self.words : self.lines);
        },
      });

      return () => {
        off();
        split.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-reveal="" className={className}>
      {children}
    </Tag>
  );
}
