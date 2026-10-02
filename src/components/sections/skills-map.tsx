"use client";

import { ArrowUpRightIcon, FlaskIcon, GithubLogoIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { projects } from "@/content/projects";
import { lab, languageStats, skills } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";
import { ease, gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/intro";

const all = skills.flatMap((g) => g.items);

/** Skills grouped as on the CV. Pick one to see the projects that used it. */
export function SkillsMap() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState("TypeScript");
  const skill = all.find((s) => s.name === active);
  const used = projects.filter((p) => skill?.projects?.includes(p.slug));
  const labUsed = lab.filter((l) => skill?.lab?.includes(l.slug));
  const ossUsed = skill?.oss ?? [];
  const hasAny = used.length + labUsed.length + ossUsed.length > 0;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-used]",
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: ease.out, stagger: 0.06 },
      );
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <section ref={root} className="wrap scroll-mt-24 pb-28">
      <div className="mb-8">
        <Reveal as="h2" mode="words" className="text-[clamp(28px,2.6vw,36px)] tracking-[-0.03em]">
          What I work with
        </Reveal>
        <p className="mt-1.5 text-[15px] text-muted">
          GitHub counts {languageStats.languages} languages across my {languageStats.repos} repos. Pick anything below to
          see where I&apos;ve used it.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
        <div className="grid gap-8">
          {skills.map((g) => (
            <div key={g.group} className="grid gap-3 border-t border-line pt-5 md:grid-cols-[160px_minmax(0,1fr)]">
              <h3 className="text-[14px] text-muted">{g.group}</h3>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((s) => {
                  const count = (s.projects?.length ?? 0) + (s.lab?.length ?? 0) + (s.oss?.length ?? 0);
                  return (
                    <li key={s.name}>
                      <button
                        type="button"
                        aria-pressed={active === s.name}
                        onPointerEnter={() => setActive(s.name)}
                        onFocus={() => setActive(s.name)}
                        onClick={() => setActive(s.name)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[14px] text-fg transition-colors duration-200 hover:border-fg/30 aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-white"
                      >
                        {s.name}
                        {count > 0 && <span className="text-[11px] opacity-50">{count}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <aside className="self-start rounded-[22px] bg-soft p-5 lg:sticky lg:top-28 md:p-6" aria-live="polite">
          <p className="text-[13px] text-muted">Used in</p>
          <p className="mt-1 text-[24px] tracking-[-0.03em]">{active}</p>
          {hasAny ? (
            <ul className="mt-5 grid gap-2">
              {used.map((p) => (
                <li key={p.slug} data-used="">
                  <Link
                    href={`/work/${p.slug}`}
                    className="group flex items-center gap-3 rounded-2xl bg-white p-2.5 pr-4 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:translate-x-1"
                  >
                    <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-[12px] border border-line bg-white text-[15px] text-muted">
                      {p.logo ? <Image src={p.logo} alt="" fill sizes="40px" className="object-cover" /> : p.title[0].toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px]">{p.title}</span>
                      <span className="block truncate text-[13px] text-muted">{p.role}</span>
                    </span>
                    <ArrowUpRightIcon className="ml-auto size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
              {labUsed.map((l) => (
                <li key={l.slug} data-used="">
                  <Link
                    href="/experiments"
                    className="group flex items-center gap-3 rounded-2xl bg-white p-2.5 pr-4 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:translate-x-1"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-fg text-white">
                      <FlaskIcon weight="duotone" className="size-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px]">{l.title}</span>
                      <span className="block truncate text-[13px] text-muted">Lab · {l.year}</span>
                    </span>
                    <ArrowUpRightIcon className="ml-auto size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
              {ossUsed.map((o) => (
                <li key={o.href} data-used="">
                  <a
                    href={o.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-2xl bg-white p-2.5 pr-4 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:translate-x-1"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-[12px] border border-line text-fg">
                      <GithubLogoIcon className="size-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[15px]">{o.label}</span>
                      <span className="block truncate text-[13px] text-muted">Open-source contribution</span>
                    </span>
                    <ArrowUpRightIcon className="ml-auto size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p data-used="" className="mt-5 text-[15px] leading-relaxed text-muted">
              Part of my toolkit, from client work, older projects or private repos that aren&apos;t on this site.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
