"use client";

import { useRef, useState } from "react";
import { categories, projects, type ProjectCategory } from "@/content/projects";
import { WorkCard } from "@/components/work-card";
import { Reveal } from "@/components/ui/reveal";
import { ease, Flip, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { hasFinePointer, onIntroDone, prefersReducedMotion } from "@/lib/intro";

type Filter = ProjectCategory | "all";

/** The first visible card runs full width; the rest sit two to a row. */
function markFeatured(cards: HTMLElement[]) {
  let first = true;
  for (const el of cards) {
    const visible = !el.classList.contains("is-out");
    el.toggleAttribute("data-featured", visible && first);
    if (visible) first = false;
  }
}

export function WorkGrid() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const count = (id: Filter) =>
    id === "all" ? projects.length : projects.filter((p) => p.category === id).length;

  const placeThumb = (instant: boolean) => {
    const btn = track.current?.querySelector<HTMLElement>("[aria-pressed='true']");
    if (!btn || !thumb.current) return;
    gsap.to(thumb.current, {
      x: btn.offsetLeft,
      width: btn.offsetWidth,
      duration: instant ? 0 : 0.55,
      ease: ease.out,
    });
  };

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".work-card");
      markFeatured(cards);
      placeThumb(true);

      // Cards ease up as they arrive.
      if (!prefersReducedMotion()) {
        gsap.set(cards, { opacity: 0, y: 56 });
        const rise = { opacity: 1, y: 0, duration: 1.1, ease: ease.out, stagger: 0.08 };
        onIntroDone(() => {
          const onScreen = cards.filter((el) => ScrollTrigger.isInViewport(el, 0.05));
          gsap.to(onScreen, { ...rise, delay: 0.5 });
          ScrollTrigger.batch(
            cards.filter((el) => !onScreen.includes(el)),
            { start: "top 92%", once: true, onEnter: (batch) => gsap.to(batch, rise) },
          );
        });
      }

      // A small tilt toward the pointer on each screenshot.
      if (!hasFinePointer() || prefersReducedMotion()) return;
      const cleanups = cards.map((card) => {
        const media = card.querySelector<HTMLElement>("[data-tilt]");
        if (!media) return () => {};
        gsap.set(media, { transformPerspective: 900 });
        const rx = gsap.quickTo(media, "rotationX", { duration: 0.6, ease: "power3.out" });
        const ry = gsap.quickTo(media, "rotationY", { duration: 0.6, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = media.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ry(px * 5);
          rx(-py * 5);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        return () => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        };
      });
      return () => cleanups.forEach((fn) => fn());
    },
    { scope: root },
  );

  const apply = (next: Filter) => {
    if (next === filter) return;
    const cards = gsap.utils.toArray<HTMLElement>(".work-card");
    const state = Flip.getState(cards);

    cards.forEach((el) => {
      const show = next === "all" || el.dataset.category === next;
      el.classList.toggle("is-out", !show);
      if (show) gsap.set(el, { opacity: 1, y: 0 });
    });
    markFeatured(cards);
    setFilter(next);
    requestAnimationFrame(() => placeThumb(false));

    if (prefersReducedMotion()) return;
    Flip.from(state, {
      duration: 0.8,
      ease: ease.inOut,
      absolute: true,
      nested: true,
      stagger: 0.03,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.7, ease: ease.out, delay: 0.25 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.96, duration: 0.3 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  };

  return (
    <section ref={root} id="work" className="wrap scroll-mt-24 pb-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal as="h2" mode="words" className="text-[clamp(28px,2.6vw,36px)] tracking-[-0.03em]">
            Selected work
          </Reveal>
          <p className="mt-1.5 text-[15px] text-muted">Company bets, startup sprints and one stubborn weekend project.</p>
        </div>

        <div
          ref={track}
          role="group"
          aria-label="Filter projects"
          className="relative flex max-w-full overflow-x-auto rounded-full bg-soft p-1"
        >
          <span ref={thumb} aria-hidden="true" className="absolute inset-y-1 left-0 rounded-full bg-white shadow-sm" />
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={filter === c.id}
              onClick={() => apply(c.id)}
              className="relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] text-muted transition-colors duration-200 hover:text-fg aria-pressed:text-fg"
            >
              {c.label}
              <span className="ml-1.5 text-[11px] text-faint">{count(c.id)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="work-grid">
        {projects.map((p) => (
          <WorkCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
