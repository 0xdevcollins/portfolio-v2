"use client";

import { ArrowUpRightIcon, GitMergeIcon, StarIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useMemo, useRef } from "react";
import type { GitHubData } from "@/lib/github";
import { site } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";
import { ease, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion } from "@/lib/intro";

type Day = { date: string; count: number; level: number };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LEVELS = ["bg-soft-2", "bg-accent/25", "bg-accent/50", "bg-accent/75", "bg-accent"];

function useCalendar(github: GitHubData) {
  return useMemo(() => {
    const weeks = github.lastYear.weeks as [string, number][][];
    const nonZero = weeks
      .flat()
      .map(([, c]) => c)
      .filter((c) => c > 0)
      .sort((a, b) => a - b);
    const q = (p: number) => nonZero[Math.floor(p * (nonZero.length - 1))] ?? 1;
    const cut = [q(0.25), q(0.5), q(0.75)];
    const level = (c: number) => (c === 0 ? 0 : c <= cut[0] ? 1 : c <= cut[1] ? 2 : c <= cut[2] ? 3 : 4);

    const cells: (Day | null)[] = [];
    weeks.forEach((week, wi) => {
      // The first week can start mid-week; pad it so rows line up with weekdays.
      if (wi === 0) {
        const pad = new Date(week[0][0] + "T00:00:00Z").getUTCDay();
        for (let i = 0; i < pad; i++) cells.push(null);
      }
      week.forEach(([date, count]) => cells.push({ date, count, level: level(count) }));
    });

    const months: { label: string; col: number }[] = [];
    let last = -1;
    weeks.forEach((week, wi) => {
      const m = new Date(week[0][0] + "T00:00:00Z").getUTCMonth();
      if (m !== last && wi > 0) months.push({ label: MONTHS[m], col: wi });
      last = m;
    });

    return { cells, months, columns: weeks.length };
  }, [github]);
}

function RepoChip({ r, hidden }: { r: GitHubData["openSource"]["list"][number]; hidden?: boolean }) {
  const [owner, name] = r.repo.split("/");
  return (
    <a
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      href={r.latest.url}
      target="_blank"
      rel="noreferrer"
      title={r.latest.title}
      className="flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-4 text-[14px] transition-colors duration-200 hover:border-fg/25"
    >
      <Image src={r.avatar} alt="" width={26} height={26} className="size-[26px] rounded-full bg-soft" />
      <span className="whitespace-nowrap">
        <span className="text-muted">{owner}/</span>
        {name}
      </span>
      {r.stars > 0 && (
        <span className="inline-flex items-center gap-1 text-[12px] text-muted">
          <StarIcon weight="fill" className="size-3" />
          {r.stars.toLocaleString("en-US")}
        </span>
      )}
      <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] text-muted">
        {r.count} PR{r.count > 1 ? "s" : ""}
      </span>
    </a>
  );
}

export function OpenSource({ github }: { github: GitHubData }) {
  const root = useRef<HTMLElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const { cells, months, columns } = useCalendar(github);

  const repos = github.openSource.list;
  const rowA = repos.filter((_, i) => i % 2 === 0);
  const rowB = repos.filter((_, i) => i % 2 === 1);
  const maxYear = Math.max(...github.yearly.map((y) => y.total));
  const synced = new Date(github.syncedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();

      // Numbers count up once the stats scroll in.
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        if (reduce) return;
        const n = { v: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.fromTo(
              n,
              { v: 0 },
              {
                v: target,
                duration: 1.8,
                ease: "power3.out",
                onUpdate: () => (el.textContent = Math.round(n.v).toLocaleString("en-US")),
              },
            ),
        });
      });

      if (!reduce) {
        // The graph fills in from the oldest week to today.
        gsap.from("[data-cell]", {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(2)",
          stagger: { amount: 1.4, grid: "auto", from: "start", axis: "x" },
          scrollTrigger: { trigger: "[data-graph]", start: "top 85%", once: true },
        });
        gsap.from("[data-bar]", {
          scaleY: 0,
          duration: 1,
          ease: ease.out,
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-bars]", start: "top 95%", once: true },
        });

        // Two rows of repos drifting in opposite directions; hover slows them down.
        gsap.utils.toArray<HTMLElement>("[data-marquee]").forEach((row, i) => {
          const loop = gsap.fromTo(
            row,
            { xPercent: i % 2 ? -50 : 0 },
            { xPercent: i % 2 ? 0 : -50, duration: 60, ease: "none", repeat: -1 },
          );
          row.addEventListener("pointerenter", () => gsap.to(loop, { timeScale: 0.1, duration: 0.6 }));
          row.addEventListener("pointerleave", () => gsap.to(loop, { timeScale: 1, duration: 0.6 }));
        });
      }
    },
    { scope: root },
  );

  const onCell = (e: React.PointerEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-cell]");
    const box = tip.current;
    if (!box || !hasFinePointer()) return;
    if (!cell?.dataset.date) {
      gsap.to(box, { autoAlpha: 0, duration: 0.15 });
      return;
    }
    const count = Number(cell.dataset.n);
    const date = new Date(cell.dataset.date + "T00:00:00Z").toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });
    box.textContent = `${count === 0 ? "No" : count} contribution${count === 1 ? "" : "s"} · ${date}`;
    const parent = box.parentElement!.getBoundingClientRect();
    const r = cell.getBoundingClientRect();
    gsap.to(box, {
      x: r.left - parent.left + r.width / 2,
      y: r.top - parent.top - 8,
      autoAlpha: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const stats = [
    { value: github.lastYear.total, label: "Contributions in the last 12 months" },
    { value: github.mergedPRs, label: "Pull requests merged" },
    { value: github.openSource.repos, label: "Outside projects I've shipped to" },
  ];

  return (
    <section ref={root} id="open-source" className="scroll-mt-24 bg-soft py-24 md:py-32">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-[13px] text-muted">
              <GitMergeIcon weight="duotone" className="size-4 text-accent" />
              Open source
            </p>
            <Reveal
              as="h2"
              mode="words"
              className="mt-4 max-w-[18ch] text-[clamp(28px,3vw,44px)] leading-[1.1] tracking-[-0.035em]"
            >
              My code lives in other people&apos;s repos too.
            </Reveal>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted">
              Most of it lands in the Stellar, Starknet and Bitcoin SV ecosystems: dapps, AI agents, starter kits, docs
              and the odd faucet. Here&apos;s the last twelve months, square by square.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-6 lg:gap-12">
            {stats.map((s) => (
              <div key={s.label} className="max-w-[150px]">
                <dd data-count={s.value} className="text-[clamp(28px,3vw,44px)] tabular-nums tracking-[-0.04em]">
                  {s.value.toLocaleString("en-US")}
                </dd>
                <dt className="mt-1 text-[13px] leading-snug text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mt-14 rounded-[22px] bg-white p-5 md:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-[13px] text-muted">
            <span>
              <span className="text-fg">{github.lastYear.total.toLocaleString("en-US")}</span> contributions in the last
              year
            </span>
            <span className="flex items-center gap-1.5">
              Less
              {LEVELS.map((l) => (
                <span key={l} className={`size-2.5 rounded-[3px] ${l}`} />
              ))}
              More
            </span>
          </div>

          <div className="relative overflow-x-auto pb-1">
            <div className="min-w-[700px]">
              <div
                className="mb-2 grid text-[11px] text-faint"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                aria-hidden="true"
              >
                {months.map((m) => (
                  <span key={`${m.label}${m.col}`} style={{ gridColumnStart: m.col + 1 }} className="whitespace-nowrap">
                    {m.label}
                  </span>
                ))}
              </div>
              <div
                data-graph=""
                role="img"
                aria-label={`${github.lastYear.total} GitHub contributions in the last year`}
                onPointerMove={onCell}
                onPointerLeave={() => gsap.to(tip.current, { autoAlpha: 0, duration: 0.15 })}
                className="grid grid-flow-col gap-[3px]"
                style={{
                  gridTemplateRows: "repeat(7, minmax(0, 1fr))",
                  gridAutoColumns: "minmax(0, 1fr)",
                }}
              >
                {cells.map((d, i) =>
                  d ? (
                    <span
                      key={d.date}
                      data-cell=""
                      data-date={d.date}
                      data-n={d.count}
                      className={`aspect-square rounded-[3px] ${LEVELS[d.level]}`}
                    />
                  ) : (
                    <span key={`pad${i}`} />
                  ),
                )}
              </div>
            </div>
            <div
              ref={tip}
              className="pointer-events-none invisible absolute left-0 top-0 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-fg px-2.5 py-1.5 text-[12px] text-white"
            />
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
            <div>
              <p className="text-[13px] text-muted">Contributions per year</p>
              <div data-bars="" className="mt-3 flex h-16 items-end gap-2">
                {github.yearly.map((y) => (
                  <div key={y.year} className="group flex h-full flex-col items-center justify-end gap-1.5">
                    <span className="text-[11px] tabular-nums text-faint opacity-0 transition-opacity group-hover:opacity-100">
                      {y.total.toLocaleString("en-US")}
                    </span>
                    <span
                      data-bar=""
                      className="w-7 origin-bottom rounded-[4px] bg-accent"
                      style={{ height: `${Math.max(6, (y.total / maxYear) * 100)}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1.5 flex gap-2">
                {github.yearly.map((y) => (
                  <span key={y.year} className="w-7 text-center text-[11px] text-faint">
                    {String(y.year).slice(2)}′
                  </span>
                ))}
              </div>
            </div>
            <p className="flex items-center gap-1.5 text-[12px] text-faint">
              {github.source === "live" ? (
                <>
                  <span aria-hidden="true" className="blink size-1.5 rounded-full bg-green" />
                  Live from GitHub, refreshed hourly
                </>
              ) : (
                <>Snapshot from GitHub, {synced}</>
              )}
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
          <p className="text-[15px]">
            Merged into <span className="text-muted">{github.openSource.repos} repositories across {github.openSource.orgs} organisations</span>
          </p>
          <a
            href={`${site.links.github}?tab=overview`}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 text-[14px]"
          >
            Everything on GitHub
            <ArrowUpRightIcon className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      <div className="mt-6 grid gap-3 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {[rowA, rowB].map((row, i) => (
          <div key={i} data-marquee="" className="flex w-max gap-3">
            {[...row, ...row].map((r, j) => (
              <RepoChip key={`${r.repo}-${j}`} r={r} hidden={j >= row.length} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
