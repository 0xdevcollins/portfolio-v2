"use client";

import { BankIcon, GitMergeIcon, GlobeHemisphereWestIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ease, gsap, useGSAP } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion } from "@/lib/intro";

const icons = {
  global: GlobeHemisphereWestIcon,
  gov: BankIcon,
  oss: GitMergeIcon,
};

type Props = {
  href: string;
  label: string;
  /** Brand mark shown inside the chip. */
  logo?: string;
  /** Screenshot shown in the hover card. */
  image?: string;
  focus?: string;
  icon?: keyof typeof icons;
  preview: { title: string; body: string };
};

/**
 * An inline chip inside running text. On pointer devices, hovering lifts a
 * small preview card above it. On touch it is just a link.
 */
export function Mention({ href, label, logo, image, focus, icon, preview }: Props) {
  const root = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLSpanElement>(null);
  const Icon = icon ? icons[icon] : null;

  useGSAP(
    () => {
      gsap.set(card.current, { xPercent: -50, y: 10, scale: 0.96, autoAlpha: 0 });
    },
    { scope: root },
  );

  const show = () => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    gsap.to(card.current, { y: 0, scale: 1, autoAlpha: 1, duration: 0.45, ease: ease.out, overwrite: true });
  };
  const hide = () => {
    gsap.to(card.current, { y: 6, scale: 0.98, autoAlpha: 0, duration: 0.2, ease: ease.soft, overwrite: true });
  };

  return (
    <span ref={root} className="relative inline-block" onPointerEnter={show} onPointerLeave={hide}>
      <Link
        href={href}
        onFocus={show}
        onBlur={hide}
        className="inline-flex translate-y-[-0.08em] items-center gap-[0.35em] rounded-full border border-line bg-white py-[0.12em] pl-[0.15em] pr-[0.6em] align-middle text-[0.86em] leading-tight text-fg transition-colors duration-200 hover:border-fg/25"
      >
        <span className="relative grid size-[1.45em] shrink-0 place-items-center overflow-hidden rounded-full bg-soft text-fg">
          {logo ? (
            <Image src={logo} alt="" fill sizes="32px" className="object-cover" />
          ) : Icon ? (
            <Icon weight="duotone" className="size-[0.95em]" />
          ) : null}
        </span>
        {label}
      </Link>

      <span
        ref={card}
        aria-hidden="true"
        className="pointer-events-none invisible absolute bottom-[calc(100%+14px)] left-1/2 z-30 block w-[264px] origin-bottom rounded-2xl border border-line bg-white p-2 text-left shadow-[0_24px_60px_-24px_rgba(0,0,0,0.3)]"
      >
        {image && (
          <span className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-soft">
            <Image src={image} alt="" fill sizes="264px" className="object-cover" style={{ objectPosition: focus }} />
          </span>
        )}
        <span className="block px-2 pt-2.5 text-[14px] font-medium leading-snug tracking-[-0.01em]">{preview.title}</span>
        <span className="block px-2 pb-1.5 pt-1 text-[13px] leading-snug text-muted">{preview.body}</span>
      </span>
    </span>
  );
}
