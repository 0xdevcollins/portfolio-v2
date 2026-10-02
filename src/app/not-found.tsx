import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[75svh] content-center justify-items-start gap-6 pb-20 pt-40">
      <p className="text-[13px] text-faint">404</p>
      <h1 className="max-w-[20ch] text-[clamp(28px,3.3vw,44px)] leading-[1.2] tracking-[-0.03em]">
        This page doesn&apos;t exist yet. It might be on its way.
      </h1>
      <Link href="/" className="rounded-full bg-fg px-4 py-2 text-[14px] text-white">
        Back home
      </Link>
    </section>
  );
}
