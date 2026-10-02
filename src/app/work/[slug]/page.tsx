import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/reading-progress";
import { CodePeek, dvnSnippet } from "@/components/ui/code-peek";
import { ParallaxMedia } from "@/components/ui/parallax-media";
import { Reveal } from "@/components/ui/reveal";
import { caseStudies } from "@/content/case-studies";
import { categoryLabel, getProject, projects, type Project } from "@/content/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  return project ? { title: project.title, description: project.summary } : {};
}

function Mark({ project, size = "size-12" }: { project: Project; size?: string }) {
  return (
    <span
      className={`relative grid ${size} shrink-0 place-items-center overflow-hidden rounded-[14px] border border-line bg-white text-[17px] font-medium text-muted`}
    >
      {project.logo ? (
        <Image src={project.logo} alt="" fill sizes="48px" className="object-cover" />
      ) : (
        project.title[0].toUpperCase()
      )}
    </span>
  );
}

function Media({ project }: { project: Project }) {
  if (project.image) {
    return (
      <Image
        src={project.image.src}
        alt={`${project.title} screenshot`}
        fill
        priority
        sizes="(min-width: 1280px) 1180px, 100vw"
        className="object-cover"
        style={{ objectPosition: project.image.focus }}
      />
    );
  }
  if (project.slug === "stellar-dvn") return <CodePeek file="contracts/dvn/src/multisig.rs" code={dvnSnippet} />;
  return null;
}

export default async function CaseStudy(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  const study = caseStudies[slug];
  if (!project || !study) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  const links = [...(study.links ?? [])];
  if (project.live && !links.some((l) => l.href === project.live)) {
    links.unshift({ label: project.live.replace("https://", ""), href: project.live });
  }

  return (
    <article className="pb-28">
      <ReadingProgress />

      <header className="wrap pt-36 md:pt-44">
        <Link href="/#work" className="group inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-fg">
          <ArrowLeftIcon className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          All work
        </Link>

        <Reveal className="mt-10 flex items-center gap-3">
          <Mark project={project} />
          <span className="rounded-full bg-soft px-3 py-1 text-[13px] text-muted">
            {categoryLabel[project.category]} · {study.timeline ?? project.year}
          </span>
        </Reveal>
        <Reveal
          as="h1"
          mode="words"
          className="mt-6 text-[clamp(40px,5.6vw,80px)] leading-[1.02] tracking-[-0.045em]"
        >
          {project.title}
        </Reveal>
        <Reveal
          as="p"
          delay={0.1}
          className="mt-5 max-w-[58ch] text-[clamp(17px,1.6vw,21px)] leading-[1.5] text-muted"
        >
          {project.summary}
        </Reveal>
      </header>

      <div className="wrap mt-14">
        <ParallaxMedia className="aspect-[16/9] rounded-[22px] bg-soft">
          <Media project={project} />
        </ParallaxMedia>
      </div>

      <div className="wrap mt-20 grid gap-14 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
        <aside className="self-start lg:sticky lg:top-28">
          <dl className="grid gap-6 text-[14px]">
            <div>
              <dt className="text-faint">Role</dt>
              <dd className="mt-1">{project.role}</dd>
            </div>
            <div>
              <dt className="text-faint">Timeline</dt>
              <dd className="mt-1">{study.timeline ?? project.year}</dd>
            </div>
            <div>
              <dt className="text-faint">Stack</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <span key={s} className="rounded-full border border-line px-2.5 py-1 text-[12px] text-muted">
                    {s}
                  </span>
                ))}
              </dd>
            </div>
            {links.length > 0 && (
              <div>
                <dt className="text-faint">Links</dt>
                <dd className="mt-1 grid gap-1">
                  {links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1 underline decoration-line underline-offset-4 transition-colors hover:decoration-fg"
                    >
                      {l.label}
                      <ArrowUpRightIcon className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </aside>

        <div className="min-w-0">
          <Reveal className="grid max-w-[64ch] gap-5 text-[clamp(18px,1.5vw,21px)] leading-[1.6]">
            {study.overview.map((p, i) => (
              <p key={i} className={i ? "text-muted" : ""}>
                {p}
              </p>
            ))}
          </Reveal>

          {study.facts && (
            <dl className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-3">
              {study.facts.map((f) => (
                <div key={f.label} className="bg-white p-6">
                  <dd className="text-[clamp(28px,2.6vw,38px)] tracking-[-0.04em]">{f.value}</dd>
                  <dt className="mt-1 text-[13px] leading-snug text-muted">{f.label}</dt>
                </div>
              ))}
            </dl>
          )}

          <h2 className="mt-20 text-[clamp(24px,2.2vw,30px)] tracking-[-0.03em]">What I built</h2>
          <ul className="mt-6 border-t border-line">
            {study.built.map((b) => (
              <Reveal as="li" key={b.title} className="grid gap-2 border-b border-line py-7 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-10">
                <h3 className="text-[19px] leading-snug tracking-[-0.02em]">{b.title}</h3>
                <p className="text-[16px] leading-[1.65] text-muted">{b.body}</p>
              </Reveal>
            ))}
          </ul>

          {study.gallery && (
            <div className="mt-20 grid gap-5 sm:grid-cols-2">
              {study.gallery.map((g) => (
                <Reveal key={g.src}>
                  <figure>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-soft">
                      <Image src={g.src} alt={g.caption} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-left-top" />
                    </div>
                    <figcaption className="mt-3 text-[13px] text-muted">{g.caption}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="wrap mt-28">
        <Link
          href={`/work/${next.slug}`}
          className="group grid items-center gap-6 rounded-[22px] bg-soft p-4 transition-colors duration-500 hover:bg-soft-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,320px)] md:p-6"
        >
          <div className="flex items-center gap-4 px-2">
            <Mark project={next} />
            <div>
              <p className="text-[13px] text-muted">Next project</p>
              <p className="text-[clamp(24px,2.6vw,36px)] tracking-[-0.035em]">{next.title}</p>
            </div>
            <ArrowRightIcon className="ml-auto size-6 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5" />
          </div>
          <div className="relative hidden aspect-[16/10] overflow-hidden rounded-[14px] bg-soft-2 sm:block">
            {next.image ? (
              <Image
                src={next.image.src}
                alt=""
                fill
                sizes="320px"
                className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                style={{ objectPosition: next.image.focus }}
              />
            ) : next.slug === "stellar-dvn" ? (
              <CodePeek file="multisig.rs" code={dvnSnippet} />
            ) : null}
          </div>
        </Link>
      </div>
    </article>
  );
}
