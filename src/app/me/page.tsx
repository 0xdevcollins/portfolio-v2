import { ArrowRightIcon, GithubLogoIcon, LinkedinLogoIcon, MapPinIcon, XLogoIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import { LocalTime } from "@/components/local-time";
import { Experience } from "@/components/sections/experience";
import { Offline } from "@/components/sections/offline";
import { Principles } from "@/components/sections/principles";
import { SkillsMap } from "@/components/sections/skills-map";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "Collins Ikechukwu is a full-stack engineer in Enugu, Nigeria: co-founder of Boundless, CTO at Threadify and an open-source contributor.",
};

const story = [
  "My first real project was a big one. In 2019 I joined a joint contract with UNICEF and the Enugu State Ministry of Education, designing and building an education website that over 2,000 schools went on to use.",
  "Then came the apprenticeship years: full-stack PHP work at Oracus NG, followed by almost three years leading the frontend team at GridApe, an email marketing platform.",
  "These days I wear three hats. I co-founded Boundless, I'm CTO at Threadify, and I'm building Useroutr. Most of my work lives where products meet money: ledgers, payment rails and smart contracts, and the screens people use to touch them.",
  "Lately a lot of my curiosity goes into AI. I built QueryMaster, which lets you chat with your own files using OpenAI embeddings and Pinecone, with its backend on Zoho Catalyst functions. I've shipped pull requests to AI agents for Bitcoin SV and Starknet, and AI coding agents are now part of how I build every day.",
  "Along the way I've written TypeScript, Rust, Cairo, PHP, Python, C++, Dart and plenty more. I also keep a foot in open source across the Stellar, Starknet and Bitcoin SV ecosystems. Off the clock you'll find me on a run (20K is my longest so far), dropping into Fortnite, or a few episodes deep into an anime.",
];

const socials = [
  { href: site.links.github, label: "GitHub", Icon: GithubLogoIcon },
  { href: site.links.x, label: "X", Icon: XLogoIcon },
  { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedinLogoIcon },
];

export default function About() {
  return (
    <>
      <section className="wrap grid gap-14 pb-28 pt-36 md:pt-44 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-20">
        <div>
          <Reveal trigger="intro" className="text-[14px] text-muted">
            About
          </Reveal>
          <Reveal
            as="h1"
            mode="words"
            trigger="intro"
            className="mt-6 max-w-[18ch] text-[clamp(34px,4.4vw,62px)] leading-[1.05] tracking-[-0.04em]"
          >
            I&apos;m Collins. <span className="text-faint">I build software from Enugu for people everywhere.</span>
          </Reveal>

          <Reveal trigger="intro" delay={0.4} className="mt-10 grid max-w-[62ch] gap-5 text-[clamp(17px,1.4vw,19px)] leading-[1.7] text-muted">
            {story.map((p, i) => (
              <p key={i} className={i === 0 ? "text-fg" : ""}>
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal trigger="intro" delay={0.6} className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-fg py-2.5 pl-5 pr-4 text-[14px] text-white transition-transform duration-300 ease-[var(--ease-out-expo)] hover:scale-[1.03]"
            >
              Get in touch
              <ArrowRightIcon weight="bold" className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors duration-200 hover:border-fg/30 hover:text-fg"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </Reveal>
        </div>

        <Reveal trigger="intro" delay={0.3} className="self-start lg:sticky lg:top-28">
          <figure className="rounded-[22px] bg-soft p-2.5">
            <div className="relative aspect-square overflow-hidden rounded-[16px] bg-soft-2">
              <Image src={site.avatar} alt="Collins Ikechukwu" fill priority sizes="340px" className="object-cover" />
            </div>
            <figcaption className="flex items-center justify-between gap-3 px-2.5 pb-1.5 pt-3.5 text-[14px]">
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon weight="duotone" className="size-4" />
                {site.location}
              </span>
              <LocalTime className="text-muted" />
            </figcaption>
          </figure>
          {site.available && (
            <p className="mt-4 flex items-center gap-2 px-2 text-[14px] text-muted">
              <span aria-hidden="true" className="blink size-1.5 rounded-full bg-green" />
              Available for new projects
            </p>
          )}
        </Reveal>
      </section>

      <Principles />
      <SkillsMap />
      <Experience />
      <Offline />
    </>
  );
}
