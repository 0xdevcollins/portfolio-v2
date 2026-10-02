import { ArrowUpRightIcon, GithubLogoIcon, LockSimpleIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { MoatPlayground } from "@/components/lab/moat-playground";
import { CodePeek, dvnTests, moatCli, nivouiTree, queryMasterFeatures } from "@/components/ui/code-peek";
import { Reveal } from "@/components/ui/reveal";
import { lab, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Lab",
  description: "Side projects, tools and experiments by Collins Ikechukwu: Moat, stellar-dvn, nivoui and more.",
};

const peeks: Record<string, { file: string; code: string; variant: "shell" | "plain" }> = {
  "stellar-dvn": { file: "stellar-dvn", code: dvnTests, variant: "shell" },
  nivoui: { file: "nivoui", code: nivouiTree, variant: "plain" },
  querymaster: { file: "README.md", code: queryMasterFeatures, variant: "plain" },
};

function Links({ repo, caseStudy }: { repo: string | null; caseStudy?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-[14px]">
      {repo ? (
        <a href={repo} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5">
          <GithubLogoIcon className="size-4" />
          Source
          <ArrowUpRightIcon className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-muted">
          <LockSimpleIcon className="size-4" />
          Private repo
        </span>
      )}
      {caseStudy && (
        <Link href={caseStudy} className="underline decoration-line underline-offset-4 hover:decoration-fg">
          Case study
        </Link>
      )}
    </div>
  );
}

export default function Lab() {
  const [moat, ...rest] = lab;

  return (
    <>
      <section className="wrap pb-16 pt-36 md:pt-44">
        <Reveal trigger="intro" className="text-[14px] text-muted">
          Lab
        </Reveal>
        <Reveal
          as="h1"
          mode="words"
          trigger="intro"
          className="mt-6 max-w-[20ch] text-[clamp(34px,4.4vw,62px)] leading-[1.05] tracking-[-0.04em]"
        >
          Where ideas get a weekend. <span className="text-faint">Some grow into tools. Some stay delightfully weird.</span>
        </Reveal>
        <Reveal as="p" trigger="intro" delay={0.4} className="mt-6 max-w-[56ch] text-[17px] leading-relaxed text-muted">
          Side projects, tools and experiments. Most are public on GitHub; the private ones are marked.
        </Reveal>
      </section>

      <section className="wrap grid gap-5 pb-28">
        <Reveal className="grid gap-8 rounded-[22px] bg-soft p-5 md:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
          <div className="flex flex-col">
            <span className="self-start rounded-full bg-white px-3 py-1 text-[13px] text-muted">
              {moat.language} · {moat.year}
            </span>
            <h2 className="mt-6 text-[clamp(28px,3vw,44px)] tracking-[-0.04em]">{moat.title}</h2>
            <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed text-muted">{moat.summary}</p>
            <div className="relative mt-8 h-[178px] overflow-hidden rounded-[16px]">
              <CodePeek file="moat" code={moatCli} variant="shell" />
            </div>
            <div className="mt-6">
              <Links repo={moat.repo} />
            </div>
          </div>
          <div>
            <p className="mb-3 text-[13px] text-muted">
              Try it. Flip properties on an element and watch which threats Moat raises.
            </p>
            <MoatPlayground />
            <p className="mt-3 text-[12px] text-faint">
              Uses the baseline and context rules from Moat&apos;s README. The real tool reads a whole moat.yaml.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2">
          {rest.map((item) => {
            const peek = peeks[item.slug];
            return (
              <Reveal key={item.slug} className="flex flex-col rounded-[22px] bg-soft p-2.5 transition-colors duration-500 hover:bg-soft-2">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-soft-2">
                  {peek ? (
                    <CodePeek file={peek.file} code={peek.code} variant={peek.variant} />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-[13px] text-faint">Just an idea so far</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[20px] tracking-[-0.025em]">{item.title}</h3>
                    <span className="text-[13px] text-muted">
                      {item.language} · {item.year}
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-[15px] leading-[1.55] text-muted">{item.summary}</p>
                  <div className="mt-5">
                    <Links repo={item.repo} caseStudy={item.caseStudy} />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <a
          href={`${site.links.github}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
          className="group mt-4 flex items-center justify-between rounded-[22px] border border-line p-6 transition-colors duration-500 hover:bg-soft md:p-8"
        >
          <span className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-full bg-fg text-white">
              <GithubLogoIcon className="size-5" />
            </span>
            <span>
              <span className="block text-[20px] tracking-[-0.02em]">Everything else</span>
              <span className="block text-[15px] text-muted">100+ public repositories, from first commits to last week.</span>
            </span>
          </span>
          <ArrowUpRightIcon className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </section>
    </>
  );
}
