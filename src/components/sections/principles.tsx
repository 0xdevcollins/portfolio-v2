"use client";

import { FlaskIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import { lab, principles } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";

function SeenIn({ slug }: { slug: string }) {
  const project = projects.find((p) => p.slug === slug);
  if (project) {
    return (
      <Link
        href={`/work/${project.slug}`}
        className="relative z-10 inline-flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 text-[13px] transition-colors hover:border-fg/30"
      >
        <span className="relative grid size-6 place-items-center overflow-hidden rounded-full bg-soft text-[11px] text-muted">
          {project.logo ? <Image src={project.logo} alt="" fill sizes="24px" className="object-cover" /> : project.title[0]}
        </span>
        {project.title}
      </Link>
    );
  }
  const entry = lab.find((l) => l.slug === slug);
  if (!entry) return null;
  return (
    <Link
      href="/experiments"
      className="relative z-10 inline-flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 text-[13px] transition-colors hover:border-fg/30"
    >
      <span className="grid size-6 place-items-center rounded-full bg-fg text-white">
        <FlaskIcon weight="duotone" className="size-3.5" />
      </span>
      {entry.title}
    </Link>
  );
}

/** Engineering principles, each pinned to work that shows it. */
export function Principles() {
  // A soft light follows the pointer across the card grid.
  const spotlight = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <section id="principles" className="wrap scroll-mt-24 pb-28">
      <div className="mb-8">
        <Reveal as="h2" mode="words" className="text-[clamp(28px,2.6vw,36px)] tracking-[-0.03em]">
          How I think about systems
        </Reveal>
        <p className="mt-1.5 max-w-[60ch] text-[15px] text-muted">
          Eight ideas I keep coming back to when I design software, and the work where you can see each one.
        </p>
      </div>

      <div
        onPointerMove={spotlight}
        className="group/grid relative grid gap-px overflow-hidden rounded-[22px] border border-line bg-line md:grid-cols-2"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover/grid:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgba(219,39,119,0.07), transparent 60%)",
          }}
        />
        {principles.map((p) => (
          <Reveal key={p.title} className="group relative flex flex-col bg-white p-6 md:p-8">
            <ul className="flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <li key={t} className="rounded-full bg-soft px-2.5 py-1 text-[12px] text-muted">
                  {t}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-[clamp(20px,1.8vw,24px)] leading-snug tracking-[-0.025em] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
              {p.title}
            </h3>
            <p className="mt-2 flex-1 text-[15.5px] leading-[1.65] text-muted">{p.body}</p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-faint">Seen in</span>
              {p.seen.map((slug) => (
                <SeenIn key={slug} slug={slug} />
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
