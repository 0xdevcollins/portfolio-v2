"use client";

import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

/** One set of timings for the whole site. */
export const ease = {
  out: "expo.out",
  inOut: "power4.inOut",
  soft: "power2.out",
  spring: "elastic.out(1, 0.45)",
} as const;

export { gsap, Flip, ScrollTrigger, SplitText, useGSAP };
