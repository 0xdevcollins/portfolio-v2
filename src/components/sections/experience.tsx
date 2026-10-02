"use client";

import Image from "next/image";
import { useRef } from "react";
import { experience, type Role } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";
import { ease, gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/intro";

const AXIS_START = 2019;
const now = new Date();
const AXIS_END = now.getUTCFullYear() + (now.getUTCMonth() + 1) / 12;
const TICKS = Array.from({ length: Math.floor(AXIS_END) - AXIS_START + 1 }, (_, i) => AXIS_START + i);
const pct = (y: number) => ((Math.max(y, AXIS_START) - AXIS_START) / (AXIS_END - AXIS_START)) * 100;

const COLS =
  "grid-cols-[auto_minmax(0,1fr)_auto] lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,300px)_150px]";

function Logo({ role }: { role: Role }) {
  if (role.logos) {
    // Two marks overlapped diagonally inside the same 48px slot as a single logo.
    return (
      <span className="relative size-12 shrink-0">
        {role.logos.map((src, i) => (
          <span
            key={src}
            className={`absolute size-8 overflow-hidden rounded-[10px] border border-line bg-white ring-2 ring-white ${i ? "bottom-0 right-0" : "left-0 top-0"}`}
            style={{ zIndex: role.logos!.length - i }}
          >
            <Image src={src} alt="" fill sizes="32px" className="object-cover" />
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-[14px] border border-line bg-white text-[17px] font-medium text-muted">
      {role.logo ? <Image src={role.logo} alt="" fill sizes="48px" className="object-cover" /> : role.monogram}
    </span>
  );
}

export function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-span]", {
        scaleX: 0,
        duration: 1.2,
        ease: ease.out,
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-roles]", start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" className="wrap scroll-mt-24 pb-28">
      <div className="mb-8">
        <Reveal as="h2" mode="words" className="text-[clamp(28px,2.6vw,36px)] tracking-[-0.03em]">
          Experience
        </Reveal>
        <p className="mt-1.5 text-[15px] text-muted">Seven years, six stops, one very long commit history.</p>
      </div>

      {/* Year axis, aligned with the tenure bars below. */}
      <div className={`hidden gap-x-5 px-5 pb-3 lg:grid ${COLS}`} aria-hidden="true">
        <span className="size-0" />
        <span />
        <div className="relative h-4 text-[11px] text-faint">
          {TICKS.map((y) => (
            <span key={y} className="absolute -translate-x-1/2" style={{ left: `${pct(y)}%` }}>
              {String(y).slice(2)}′
            </span>
          ))}
        </div>
        <span />
      </div>

      <ol data-roles="" className="border-t border-line">
        {experience.map((role) => (
          <li key={`${role.org}-${role.title}`} className="group relative border-b border-line">
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-left scale-x-0 rounded-2xl bg-soft transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
            />
            <div className={`relative grid items-center gap-x-5 gap-y-2 px-2 py-6 md:px-5 ${COLS}`}>
              <Logo role={role} />
              <div className="min-w-0">
                <h3 className="flex flex-wrap items-center gap-2 text-[19px] tracking-[-0.02em] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                  {role.org}
                  {role.kind && role.kind !== role.org.toLowerCase() && (
                    <span className="rounded-full border border-line bg-white px-2 py-0.5 text-[11px] capitalize tracking-normal text-muted">
                      {role.kind}
                    </span>
                  )}
                </h3>
                <p className="mt-0.5 text-[14px] text-muted">{role.title}</p>
                {role.note && <p className="mt-1.5 max-w-[60ch] text-[14px] text-faint">{role.note}</p>}
              </div>

              <div className="relative hidden h-1.5 rounded-full bg-soft-2 lg:block">
                {TICKS.map((y) => (
                  <span key={y} aria-hidden="true" className="absolute top-0 h-full w-px bg-white" style={{ left: `${pct(y)}%` }} />
                ))}
                <span
                  data-span=""
                  className="absolute inset-y-0 origin-left rounded-full bg-fg"
                  style={{ left: `${pct(role.start)}%`, width: `${Math.max(1.2, pct(role.end ?? AXIS_END) - pct(role.start))}%` }}
                />
                {role.end === null && (
                  <span
                    aria-hidden="true"
                    className="blink absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-green"
                    style={{ left: "100%" }}
                  />
                )}
              </div>

              <span className="whitespace-nowrap text-right text-[13px] tabular-nums text-muted">{role.period}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
