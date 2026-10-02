"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** A hairline under the nav that fills as you read. */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
    });
    return () => st.kill();
  });

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
    </div>
  );
}
