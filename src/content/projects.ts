export type ProjectCategory = "company" | "startup" | "personal" | "hobby";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  year: string;
  role: string;
  summary: string;
  stack: string[];
  /** Screenshot in /public/work. focus = CSS object-position. */
  image?: { src: string; focus?: string };
  /** Small brand mark in /public/logos, used in chips and lists. */
  logo?: string;
  live?: string;
};

export const categories: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "company", label: "Company" },
  { id: "startup", label: "Startups" },
  { id: "personal", label: "Personal" },
  { id: "hobby", label: "Hobby" },
];

export const categoryLabel: Record<ProjectCategory, string> = {
  company: "Company",
  startup: "Startup",
  personal: "Personal",
  hobby: "Hobby",
};

export const projects: Project[] = [
  {
    slug: "useroutr",
    title: "Useroutr",
    category: "company",
    year: "2026",
    role: "Backend & contracts",
    logo: "/logos/useroutr.svg",
    summary:
      "Users pay with whatever they already have. Apps receive exactly what they asked for. Everything settles on Stellar in between.",
    stack: ["Fastify", "Prisma", "BullMQ", "Rust", "Soroban"],
    image: { src: "/work/useroutr.jpg", focus: "50% 0%" },
    live: "https://useroutr.com",
  },
  {
    slug: "boundless",
    title: "Boundless",
    category: "company",
    year: "2025",
    role: "Co-founder",
    logo: "/logos/boundless.svg",
    summary:
      "Hackathons, bounties, grants and crowdfunding in one place, all paying out on Stellar. I co-founded it and built the backend that moves the money.",
    stack: ["NestJS", "GraphQL", "PostgreSQL", "BullMQ"],
    image: { src: "/work/boundless.jpg", focus: "0% 0%" },
    live: "https://boundlessfi.xyz",
  },
  {
    slug: "gridape",
    title: "GridApe",
    category: "startup",
    year: "2023",
    role: "Frontend team lead",
    logo: "/logos/gridape.png",
    summary:
      "Campaigns, automations, sign-up forms and a drag-and-drop email editor in one dashboard. I led the frontend team, and 77 of my pull requests shipped in it.",
    stack: ["Next.js", "TypeScript", "REST API"],
    image: { src: "/work/gridape-dashboard.png", focus: "0% 0%" },
  },
  {
    slug: "threadify",
    title: "Threadify",
    category: "startup",
    year: "2025",
    role: "CTO",
    logo: "/logos/threadify.png",
    summary:
      "Creators design merch on a canvas, open a store and start selling. Threadify prints and ships the rest. I'm the CTO.",
    stack: ["Next.js", "React Konva", "Express"],
    image: { src: "/work/threadify.jpg", focus: "50% 0%" },
  },
  {
    slug: "sumas",
    title: "Sumas",
    category: "personal",
    year: "2026",
    role: "Full stack",
    summary:
      "One system for a whole university, from the Senate down to first-year students. Seven roles, one source of truth, and sign-in with passkeys.",
    stack: ["Next.js", "NestJS", "better-auth"],
    image: { src: "/work/sumas.png", focus: "50% 40%" },
  },
  {
    slug: "stellar-dvn",
    title: "stellar-dvn",
    category: "hobby",
    year: "2026",
    role: "Builder",
    summary:
      "Could one person build a LayerZero verifier for Stellar? I built one for fun to find out. It works end to end on testnet.",
    stack: ["Rust", "Soroban", "LayerZero"],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
