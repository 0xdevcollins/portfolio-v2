import { ArrowRightIcon, FlaskIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

export function LabTeaser() {
  return (
    <section className="wrap pb-24">
      <Reveal>
        <Link
          href="/experiments"
          className="group flex flex-col gap-6 rounded-[22px] border border-line p-6 transition-colors duration-500 hover:bg-soft md:flex-row md:items-center md:justify-between md:p-8"
        >
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-fg text-white transition-[transform,background-color] duration-500 group-hover:bg-accent ease-[var(--ease-out-expo)] group-hover:rotate-[-12deg]">
              <FlaskIcon weight="duotone" className="size-5" />
            </span>
            <div>
              <h2 className="text-[20px] tracking-[-0.02em]">The lab</h2>
              <p className="mt-0.5 text-[15px] text-muted">
                Where ideas get a weekend: Moat, stellar-dvn, nivoui and friends.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 text-[14px]">
            Explore the lab
            <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
