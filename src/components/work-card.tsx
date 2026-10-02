import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { categoryLabel, type Project } from "@/content/projects";
import { CodePeek, dvnSnippet } from "./ui/code-peek";

export function WorkCard({ project }: { project: Project }) {
  return (
    <article
      className="work-card group relative rounded-[22px] bg-soft p-2 transition-colors duration-500 hover:bg-soft-2"
      data-category={project.category}
    >
      <div className="work-card-inner">
        <div className="work-media relative aspect-[16/10] overflow-hidden rounded-[16px] bg-soft-2" data-tilt="">
          <div className="work-media-inner absolute inset-0">
            {project.image ? (
              <Image
                src={project.image.src}
                alt={`${project.title} screenshot`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: project.image.focus }}
              />
            ) : project.slug === "stellar-dvn" ? (
              <CodePeek file="contracts/dvn/src/multisig.rs" code={dvnSnippet} chipSpace />
            ) : null}
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[12px] text-fg backdrop-blur">
            {categoryLabel[project.category]} · {project.year}
          </span>
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 grid size-9 translate-y-1 place-items-center rounded-full bg-accent text-white opacity-0 shadow-sm transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ArrowUpRightIcon weight="bold" className="size-4" />
          </span>
        </div>

        <div className="work-copy flex flex-col px-3 pb-3 pt-5">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-[21px] tracking-[-0.025em]">
              <Link href={`/work/${project.slug}`} className="after:absolute after:inset-0 after:rounded-[22px] after:content-['']">
                {project.title}
              </Link>
            </h3>
            <span className="shrink-0 text-[13px] text-muted">{project.role}</span>
          </div>
          <p className="mt-2 max-w-[54ch] text-[15px] leading-[1.55] text-muted">{project.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            {project.stack.map((s) => (
              <span key={s} className="rounded-full border border-line bg-white px-2.5 py-1 text-[12px] text-muted">
                {s}
              </span>
            ))}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="relative z-10 ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] text-fg underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
              >
                Live site <ArrowUpRightIcon className="size-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
