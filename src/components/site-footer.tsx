"use client";

import {
  ArrowUpIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  FileTextIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { nav, site } from "@/content/site";
import { LocalTime } from "./local-time";
import { useLenis } from "./smooth-scroll";
import { Magnetic } from "./ui/magnetic";
import { Reveal } from "./ui/reveal";

const elsewhere = [
  { label: "GitHub", href: site.links.github, Icon: GithubLogoIcon },
  { label: "X", href: site.links.x, Icon: XLogoIcon },
  { label: "LinkedIn", href: site.links.linkedin, Icon: LinkedinLogoIcon },
  { label: "Résumé", href: site.links.resume, Icon: FileTextIcon },
].filter((l): l is { label: string; href: string; Icon: typeof FileTextIcon } => Boolean(l.href));

/** Contact lives here so every page ends with a way to reach you. */
export function SiteFooter() {
  const lenis = useLenis();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const toTop = () => {
    if (lenis.current) lenis.current.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-night text-white">
      <div className="wrap relative z-10 pb-10 pt-24 md:pt-32">
        {site.available && (
          <p className="flex items-center gap-2 text-[14px] text-white/60">
            <span aria-hidden="true" className="blink size-1.5 rounded-full bg-green" />
            Available for new projects
          </p>
        )}
        <Reveal
          as="h2"
          mode="words"
          className="mt-6 max-w-[15ch] text-[clamp(34px,4.4vw,62px)] leading-[1.05] tracking-[-0.04em]"
        >
          Bring the idea. <span className="text-white/40">I&apos;ll bring the whole stack.</span>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Magnetic strength={0.25}>
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex items-center gap-3 rounded-full bg-white py-2.5 pl-6 pr-2.5 text-[15px] text-fg transition-transform duration-300 ease-[var(--ease-out-expo)] hover:scale-[1.02]"
            >
              {site.email}
              <span className="grid size-9 place-items-center rounded-full bg-fg text-white transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45">
                <ArrowUpRightIcon weight="bold" className="size-4" />
              </span>
            </a>
          </Magnetic>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-3 text-[14px] text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            {copied ? <CheckIcon weight="bold" className="size-4 text-green" /> : <CopyIcon className="size-4" />}
            <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
          </button>
        </div>

        <div className="mt-24 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-3">
          <div>
            <p className="text-[13px] text-white/40">Elsewhere</p>
            <ul className="mt-3 grid gap-2 text-[15px]">
              {elsewhere.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2.5 text-white/70 transition-colors hover:text-white"
                  >
                    <Icon className="size-4" />
                    {label}
                    <ArrowUpRightIcon className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[13px] text-white/40">Local time</p>
            <p className="mt-3 text-[15px]">
              <LocalTime />
            </p>
            <p className="mt-1 text-[15px] text-white/50">{site.location}</p>
          </div>
          <div>
            <p className="text-[13px] text-white/40">Pages</p>
            <ul className="mt-3 grid gap-2 text-[15px]">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/70 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 text-[13px] text-white/40">
          <p>© 2026 {site.name}</p>
          <button
            type="button"
            onClick={toTop}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-white/70 transition-colors hover:text-white"
          >
            <ArrowUpIcon className="size-3.5" /> Back to top
          </button>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[0.24em] select-none whitespace-nowrap text-center text-[27vw] font-medium leading-[0.8] tracking-[-0.07em] text-white/[0.05]"
      >
        {site.firstName}
      </p>
    </footer>
  );
}
