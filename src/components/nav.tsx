"use client";

import { ListIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { nav, site } from "@/content/site";
import { ease, gsap, useGSAP } from "@/lib/gsap";
import { onIntroDone, prefersReducedMotion } from "@/lib/intro";

/**
 * Floating pill. A soft highlight sits under the current page and slides to
 * whichever link you hover. On phones the links fold into a menu.
 */
export function Nav() {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const activeIndex = nav.findIndex((item) =>
    item.href === "/" ? pathname === "/" || pathname.startsWith("/work") : pathname.startsWith(item.href),
  );

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      gsap.set(root.current, { y: -80, opacity: 0 });
      onIntroDone(() =>
        gsap.to(root.current, { y: 0, opacity: 1, duration: 1, ease: ease.out, delay: 0.1 }),
      );
    },
    { scope: root },
  );

  const moveTo = (index: number, instant = false) => {
    const links = list.current?.querySelectorAll<HTMLElement>("[data-link]");
    const target = links?.[index];
    if (!pill.current) return;
    if (!target) {
      gsap.to(pill.current, { opacity: 0, duration: 0.2 });
      return;
    }
    // Measure from the <li>; the link's own offsetLeft is relative to it and always 0.
    const item = target.parentElement ?? target;
    gsap.to(pill.current, {
      x: item.offsetLeft,
      width: target.offsetWidth,
      opacity: 1,
      duration: instant ? 0 : 0.45,
      ease: ease.out,
    });
  };

  // Park the highlight on the current page after layout and on route change.
  useGSAP(() => moveTo(activeIndex, true), { dependencies: [activeIndex], scope: root });

  const toggleMenu = () => {
    const next = !open;
    setOpen(next);
    if (!panel.current) return;
    if (next) {
      gsap.fromTo(
        panel.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.5, ease: ease.out },
      );
      gsap.fromTo(
        panel.current.querySelectorAll("li"),
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: ease.out, stagger: 0.05, delay: 0.05 },
      );
    } else {
      gsap.to(panel.current, { height: 0, opacity: 0, duration: 0.35, ease: ease.soft });
    }
  };

  return (
    <header
      ref={root}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(16px,env(safe-area-inset-top))]"
    >
      <nav
        aria-label="Main"
        className={`w-full max-w-[560px] rounded-[26px] border border-line p-1.5 transition-colors duration-300 ${open ? "bg-white" : "bg-white/80"} shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:w-auto sm:max-w-none`}
      >
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-soft"
            onClick={() => open && toggleMenu()}
          >
            <span className="grid size-8 place-items-center rounded-full bg-fg text-[12px] font-medium text-white">
              CI
            </span>
            <span className="text-[14px] font-medium tracking-[-0.01em]">{site.firstName}</span>
          </Link>

          <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-line sm:block" />

          <ul
            ref={list}
            className="relative hidden items-center sm:flex"
            onPointerLeave={() => moveTo(activeIndex)}
          >
            <span
              ref={pill}
              aria-hidden="true"
              className="absolute left-0 top-0 h-full rounded-full bg-soft opacity-0"
            />
            {nav.map((item, i) => (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  data-link=""
                  aria-current={i === activeIndex ? "page" : undefined}
                  onPointerEnter={() => moveTo(i)}
                  onFocus={() => moveTo(i)}
                  className="block rounded-full px-4 py-2 text-[14px] text-muted transition-colors duration-200 hover:text-fg aria-[current=page]:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="#contact"
            className="ml-auto rounded-full bg-fg px-4 py-2 text-[14px] text-white transition-transform duration-300 ease-[var(--ease-out-expo)] hover:scale-[1.03] sm:ml-1"
          >
            Contact
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-full text-fg transition-colors hover:bg-soft sm:hidden"
          >
            {open ? <XIcon className="size-[18px]" /> : <ListIcon className="size-[18px]" />}
          </button>
        </div>

        <div ref={panel} id="mobile-menu" className="h-0 overflow-hidden opacity-0 sm:hidden">
          <ul className="grid gap-1 px-2 pb-2 pt-3">
            {nav.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={toggleMenu}
                  aria-current={i === activeIndex ? "page" : undefined}
                  className="block rounded-2xl px-3 py-3 text-[22px] tracking-[-0.02em] text-muted aria-[current=page]:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex gap-4 px-3 pt-3 text-[14px] text-muted">
              <a href={site.links.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={site.links.x} target="_blank" rel="noreferrer">X</a>
              <a href={site.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
