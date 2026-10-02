import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { LabTeaser } from "@/components/sections/lab-teaser";
import { Offline } from "@/components/sections/offline";
import { OpenSource } from "@/components/sections/open-source";
import { WorkGrid } from "@/components/sections/work-grid";
import { getGitHub } from "@/lib/github";

// Rebuild at most once an hour so the GitHub numbers stay fresh.
export const revalidate = 3600;

export default async function Home() {
  const github = await getGitHub();
  return (
    <>
      <Hero github={github} />
      <WorkGrid />
      <Experience />
      <OpenSource github={github} />
      <Offline />
      <LabTeaser />
    </>
  );
}
