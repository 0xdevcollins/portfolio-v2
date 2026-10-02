"use client";

import { ArrowUpRightIcon, GameControllerIcon, PersonSimpleRunIcon, TelevisionSimpleIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useRef } from "react";
import { anime, offline, site } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";
import { ease, gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/intro";

const icons = { run: PersonSimpleRunIcon, game: GameControllerIcon, anime: TelevisionSimpleIcon };

/** Strava's mark, from Simple Icons (CC0). */
function StravaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#FC4C02"
        d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"
      />
    </svg>
  );
}

/** One tick per kilometre, filling up to 20K when the card scrolls in. */
function KmScale() {
  return (
    <div className="mt-6" aria-hidden="true">
      <div className="flex h-5 items-end justify-between">
        {Array.from({ length: 20 }, (_, i) => (
          <span
            key={i}
            data-km=""
            className={`w-[2px] origin-bottom rounded-full bg-accent ${(i + 1) % 5 === 0 ? "h-5" : "h-2.5 opacity-40"}`}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-faint">
        <span>0K</span>
        <span>10K</span>
        <span>20K</span>
      </div>
    </div>
  );
}

export function Offline() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-km]", {
        scaleY: 0,
        duration: 0.6,
        ease: ease.out,
        stagger: 0.04,
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="wrap pb-28">
      <div className="mb-8">
        <Reveal as="h2" mode="words" className="text-[clamp(28px,2.6vw,36px)] tracking-[-0.03em]">
          Off the clock
        </Reveal>
        <p className="mt-1.5 text-[15px] text-muted">The part of the week with no pull requests.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {offline.map((item) => {
          const Icon = icons[item.kind];
          return (
            <Reveal
              key={item.kind}
              className="group flex flex-col rounded-[22px] bg-soft p-6 transition-colors duration-500 hover:bg-soft-2 md:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-full bg-white text-fg transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-12 group-hover:scale-110">
                  <Icon weight="duotone" className="size-5" />
                </span>
                {item.kind === "run" && (
                  <a
                    href={site.links.strava}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white py-1.5 pl-2 pr-3 text-[13px] text-fg transition-transform duration-300 ease-[var(--ease-out-expo)] hover:scale-[1.04]"
                  >
                    <StravaLogo className="size-4" />
                    Strava
                    <ArrowUpRightIcon className="size-3 text-muted" />
                  </a>
                )}
                {item.kind === "anime" && (
                  <a
                    href={anime.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${anime.title} on AniList`}
                    className="relative -mb-24 block aspect-[2/3] w-[92px] rotate-6 overflow-hidden rounded-xl bg-soft-2 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.45)] ring-4 ring-white transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-0 group-hover:scale-105"
                  >
                    <Image src={anime.cover} alt={`${anime.title} cover art`} fill sizes="92px" className="object-cover" />
                  </a>
                )}
              </div>
              <p className="mt-10 text-[13px] text-muted">{item.title}</p>
              <p className="mt-1 text-[clamp(26px,2.4vw,34px)] leading-tight tracking-[-0.035em]">{item.stat}</p>
              <p className="mt-2 text-[15px] text-muted">{item.body}</p>
              {item.kind === "run" && <KmScale />}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
