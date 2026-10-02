import { ArrowDownIcon, ArrowRightIcon, GithubLogoIcon, LinkedinLogoIcon, XLogoIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { getProject } from "@/content/projects";
import { site } from "@/content/site";
import { LocalTime } from "@/components/local-time";
import { Mention } from "@/components/ui/mention";
import { OrbitBadge } from "@/components/ui/orbit-badge";
import { Reveal } from "@/components/ui/reveal";
import type { GitHubData } from "@/lib/github";

function ProjectMention({ slug }: { slug: string }) {
  const p = getProject(slug);
  if (!p) return null;
  return (
    <Mention
      href={`/work/${p.slug}`}
      label={p.title}
      logo={p.logo}
      image={p.image?.src}
      focus={p.image?.focus}
      preview={{ title: p.title, body: p.summary.split(". ")[0] + "." }}
    />
  );
}

const socials = [
  { href: site.links.github, label: "GitHub", Icon: GithubLogoIcon },
  { href: site.links.x, label: "X", Icon: XLogoIcon },
  { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedinLogoIcon },
];

export function Hero({ github }: { github: GitHubData }) {
  return (
    <section className="wrap relative pb-24 pt-36 md:pb-32 md:pt-44">
      <Reveal trigger="intro" className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px]">
        <span className="font-medium">{site.name}</span>
        <span aria-hidden="true" className="h-3.5 w-px bg-line" />
        <span className="text-muted">{site.role}</span>
        <span aria-hidden="true" className="h-3.5 w-px bg-line" />
        <LocalTime className="text-muted" />
      </Reveal>

      <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
        <Reveal
          as="h1"
          mode="words"
          trigger="intro"
          className="max-w-[16ch] text-[clamp(34px,4.4vw,62px)] leading-[1.05] tracking-[-0.04em] sm:max-w-[23ch]"
        >
          I build the whole thing. <span className="text-faint">From the ledger nobody sees to the button everyone presses.</span>
        </Reveal>
        <Reveal trigger="intro" delay={0.6} className="hidden lg:block">
          <OrbitBadge src={site.avatar} text="Open to work" href="#contact" />
        </Reveal>
      </div>

      <Reveal
        as="p"
        trigger="intro"
        delay={0.45}
        className="mt-10 max-w-[720px] text-[clamp(17px,1.45vw,20px)] leading-[1.75] text-muted"
      >
        These days I&apos;m co-founder at <ProjectMention slug="boundless" />, CTO at{" "}
        <ProjectMention slug="threadify" /> and deep in <ProjectMention slug="useroutr" />. Before that I led the
        frontend team at <ProjectMention slug="gridape" />. It started in 2019 with a website for{" "}
        <Mention
          href="#experience"
          label="UNICEF"
          logo="/logos/unicef.png"
          preview={{ title: "UNICEF", body: "Web developer & graphic designer, 2019 to 2022, on a joint contract with the Enugu State Ministry of Education." }}
        />{" "}
        and the{" "}
        <Mention
          href="#experience"
          label="Enugu State Ministry of Education"
          logo="/logos/enugu-moe.png"
          preview={{
            title: "Enugu State Ministry of Education",
            body: "Built an education website used by over 2,000 schools, 2019 to 2022, on a joint contract with UNICEF.",
          }}
        />{" "}
        that over 2,000 schools ended up using. In between, I ship code to{" "}
        <Mention
          href="#open-source"
          label="open source"
          icon="oss"
          preview={{
            title: `${github.openSource.mergedPRs} PRs merged into ${github.openSource.repos} projects`,
            body: "Mostly Stellar, Starknet and Bitcoin SV: dapps, AI agents, tooling and docs.",
          }}
        />{" "}
        and go down AI rabbit holes.
      </Reveal>

      <Reveal trigger="intro" delay={0.6} className="mt-12 flex flex-wrap items-center gap-3">
        <a
          href="#work"
          className="group inline-flex items-center gap-2 rounded-full bg-fg py-2.5 pl-5 pr-4 text-[14px] text-white transition-transform duration-300 ease-[var(--ease-out-expo)] hover:scale-[1.03]"
        >
          See the work
          <ArrowDownIcon weight="bold" className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
        </a>
        <Link
          href="/me#principles"
          className="group inline-flex items-center gap-1.5 rounded-full border border-line py-2.5 pl-5 pr-4 text-[14px] transition-colors duration-200 hover:border-fg/30"
        >
          How I think about systems
          <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
        {socials.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors duration-200 hover:border-fg/30 hover:text-fg"
          >
            <Icon weight="regular" className="size-[18px]" />
          </a>
        ))}
      </Reveal>
    </section>
  );
}
