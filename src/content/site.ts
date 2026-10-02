/**
 * Site-wide copy and links. Values wrapped in [brackets] are placeholders.
 */
export const site = {
  name: "Collins Ikechukwu",
  firstName: "Collins",
  role: "Full-stack engineer",
  avatar: "https://avatars.githubusercontent.com/u/90073781?v=4",
  description:
    "Collins Ikechukwu is a full-stack engineer and co-founder of Boundless, building products end to end with TypeScript, NestJS and Next.js, and a regular open-source contributor.",
  location: "Enugu, Nigeria",
  /** IANA zone for the clock. */
  timeZone: "Africa/Lagos",
  available: true,
  email: "collinschristroa@gmail.com",
  links: {
    github: "https://github.com/0xdevcollins",
    linkedin: "https://www.linkedin.com/in/collins-chikangwu/",
    x: "https://x.com/0xdevcollins",
    strava: "https://strava.app.link/IMJKxR0iU6b",
    /** Set to "/resume.pdf" once the file is in /public. Hidden while null. */
    resume: null as string | null,
  },
} as const;

export const nav = [
  { href: "/", label: "Work" },
  { href: "/me", label: "About" },
  { href: "/experiments", label: "Lab" },
] as const;

export type Role = {
  org: string;
  title: string;
  /** Decimal years, e.g. 2023.67 = Sep 2023. `null` end = present. */
  start: number;
  end: number | null;
  period: string;
  logo?: string;
  /** Two marks side by side, for a joint contract. */
  logos?: string[];
  monogram?: string;
  kind?: "contract" | "freelance";
  note?: string;
};

/** Work history, newest first. From LinkedIn and Collins's own notes. */
export const experience: Role[] = [
  {
    org: "Boundless",
    title: "Co-founder",
    start: 2024.92,
    end: null,
    period: "Dec 2024 — Now",
    logo: "/logos/boundless.svg",
  },
  {
    org: "Threadify",
    title: "Chief Technology Officer",
    start: 2023.83,
    end: null,
    period: "Nov 2023 — Now",
    logo: "/logos/threadify.png",
    note: "Formerly Threadflow.",
  },
  {
    org: "GridApe",
    title: "Team Lead, Frontend",
    start: 2023.67,
    end: 2026.25,
    period: "Sep 2023 — Apr 2026",
    logo: "/logos/gridape.png",
    note: "Led the frontend team building GridApe's dashboard.",
  },
  {
    org: "Freelance",
    title: "Web Developer",
    start: 2026.25,
    end: 2026.34,
    period: "Apr 2026",
    monogram: "F",
    kind: "freelance",
  },
  {
    org: "UNICEF & Enugu State Ministry of Education",
    title: "Web Developer & Graphic Designer",
    start: 2019.67,
    end: 2022.17,
    period: "Sep 2019 — Mar 2022",
    logos: ["/logos/unicef.png", "/logos/enugu-moe.png"],
    kind: "contract",
    note: "One joint contract. Built and shipped an education website used by over 2,000 schools.",
  },
  {
    org: "Oracus NG",
    title: "Full-stack Web Developer Assistant",
    start: 2020.58,
    end: 2023,
    period: "Aug 2020 — Jan 2023",
    monogram: "O",
  },
];

/** Life outside the editor. */
export const offline = [
  { kind: "run" as const, title: "Running", stat: "Up to 20K", body: "Every kilometre logged on Strava." },
  { kind: "game" as const, title: "Gaming", stat: "Fortnite", body: "Drop in. Build fast. Repeat." },
  { kind: "anime" as const, title: "Anime", stat: "Black Clover", body: "170 episodes, rated 79% on AniList." },
];

/** Cover art served by AniList's CDN. */
export const anime = {
  title: "Black Clover",
  cover: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx97940-fyh8o7gNbha0.png",
  url: "https://anilist.co/anime/97940",
  score: 79,
  episodes: 170,
};

type Evidence = { label: string; href: string };

const oss = {
  starkludo: { label: "starkludo (Cairo)", href: "https://github.com/sivicstudios/starkludo" },
  cairoBook: { label: "The Cairo Book", href: "https://github.com/cairo-book/cairo-book" },
  starkFinder: { label: "StarkFinder, an on-chain AI agent", href: "https://github.com/Shonen-Labs/StarkFinder" },
  bsvAgent: { label: "bsv-ai-agent", href: "https://github.com/bitcoin-sv/bsv-ai-agent" },
  brandqo: { label: "BrandqoAI", href: "https://github.com/Techabode/BrandqoAI" },
  starknetQuest: { label: "starknet.quest", href: "https://github.com/lfglabs-dev/starknet.quest" },
  stellopay: { label: "stellopay-core (Soroban)", href: "https://github.com/Stellopay/stellopay-core" },
} satisfies Record<string, Evidence>;

/**
 * What I work with. `projects` = case studies, `lab` = Lab entries,
 * `oss` = public repos where my pull requests were merged.
 */
export const skills: {
  group: string;
  items: { name: string; projects?: string[]; lab?: string[]; oss?: Evidence[] }[];
}[] = [
  {
    group: "Languages",
    items: [
      { name: "TypeScript", projects: ["useroutr", "boundless", "gridape", "threadify", "sumas"] },
      { name: "JavaScript", lab: ["querymaster"] },
      { name: "Rust", projects: ["useroutr", "stellar-dvn"], oss: [oss.stellopay] },
      { name: "Cairo", oss: [oss.starkludo, oss.cairoBook] },
      { name: "PHP" },
      { name: "Python" },
      { name: "C++" },
      { name: "Dart" },
      { name: "Solidity" },
      { name: "SQL", projects: ["useroutr", "boundless", "sumas"] },
    ],
  },
  {
    group: "Systems & theory",
    items: [
      { name: "System design", projects: ["useroutr", "boundless", "stellar-dvn"] },
      { name: "Idempotency", projects: ["useroutr"] },
      { name: "Exactly-once processing", projects: ["useroutr"] },
      { name: "Double-entry accounting", projects: ["useroutr"] },
      { name: "Event-driven architecture", projects: ["useroutr", "boundless"] },
      { name: "Caching", projects: ["boundless"] },
      { name: "Rate limiting", projects: ["boundless", "sumas"] },
      { name: "Least privilege", projects: ["boundless", "sumas"] },
      { name: "Quorum & multisig", projects: ["stellar-dvn"] },
      { name: "Threat modelling", lab: ["moat"] },
      { name: "API design", projects: ["useroutr", "boundless", "sumas"] },
      { name: "Monorepos", projects: ["useroutr"], lab: ["nivoui"] },
      { name: "Property-based testing" },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "NestJS", projects: ["boundless", "sumas"] },
      { name: "Fastify", projects: ["useroutr"] },
      { name: "Express", projects: ["threadify"], lab: ["querymaster"] },
      { name: "Laravel" },
      { name: "PostgreSQL", projects: ["useroutr", "boundless", "sumas"] },
      { name: "Prisma", projects: ["useroutr", "boundless", "sumas"], oss: [oss.starkFinder] },
      { name: "Redis", projects: ["useroutr", "boundless"] },
      { name: "BullMQ", projects: ["useroutr", "boundless"] },
      { name: "GraphQL", projects: ["boundless"] },
      { name: "OpenAPI", projects: ["sumas"] },
      { name: "WebSockets" },
    ],
  },
  {
    group: "AI",
    items: [
      { name: "OpenAI API", lab: ["querymaster"] },
      { name: "Claude API", oss: [oss.brandqo] },
      { name: "Embeddings & RAG", lab: ["querymaster"] },
      { name: "Pinecone", lab: ["querymaster"] },
      { name: "AI agents", lab: ["stellarmind"], oss: [oss.bsvAgent, oss.starkFinder] },
      { name: "AI coding agents" },
    ],
  },
  {
    group: "Frontend & mobile",
    items: [
      { name: "Next.js", projects: ["useroutr", "gridape", "threadify", "sumas"] },
      { name: "React", projects: ["gridape", "threadify", "sumas"], lab: ["querymaster"] },
      { name: "Tailwind CSS", lab: ["querymaster"] },
      { name: "Radix UI", projects: ["sumas"] },
      { name: "React Konva", projects: ["threadify"] },
      { name: "React Query" },
      { name: "GSAP" },
      { name: "Flutter" },
    ],
  },
  {
    group: "Blockchain",
    items: [
      { name: "Stellar SDK", projects: ["useroutr", "boundless", "stellar-dvn"] },
      { name: "Soroban", projects: ["useroutr", "stellar-dvn"], oss: [oss.stellopay] },
      { name: "Starknet", oss: [oss.starkludo, oss.starknetQuest, oss.starkFinder] },
      { name: "LayerZero", projects: ["stellar-dvn"] },
      { name: "Circle CCTP", projects: ["useroutr"] },
      { name: "HTLC settlement" },
      { name: "Wormhole" },
      { name: "Layerswap" },
      { name: "OpenZeppelin" },
    ],
  },
  {
    group: "Cloud & tooling",
    items: [
      { name: "Zoho Catalyst", lab: ["querymaster"] },
      { name: "Docker", projects: ["useroutr", "sumas"] },
      { name: "Turborepo", projects: ["useroutr"], lab: ["nivoui"] },
      { name: "GitHub Actions" },
      { name: "Vercel" },
      { name: "Railway" },
      { name: "AWS KMS" },
    ],
  },
  {
    group: "Auth & security",
    items: [
      { name: "better-auth", projects: ["sumas"] },
      { name: "Passkeys", projects: ["sumas"] },
      { name: "RBAC", projects: ["sumas"] },
      { name: "JWT" },
      { name: "Passport" },
      { name: "STRIDE", lab: ["moat"] },
    ],
  },
];

/** From GitHub's language detection across every repo I own. */
export const languageStats = { repos: 117, languages: 25 };

/** How I think about systems. Each one points at work that shows it. */
export const principles: { title: string; body: string; tags: string[]; seen: string[] }[] = [
  {
    title: "Money moves exactly once",
    body: "Retries are a fact of life. Payment paths should be safe to run twice, with explicit states and deterministic logic, so a repeated job can never double-charge or double-credit.",
    tags: ["Idempotency", "Exactly-once", "State machines"],
    seen: ["useroutr"],
  },
  {
    title: "Ledgers only grow",
    body: "Balances are derived, never edited. Entries are append-only and mistakes get compensating entries, so the history always adds up and every posting balances.",
    tags: ["Double-entry", "Append-only logs", "Auditability"],
    seen: ["useroutr"],
  },
  {
    title: "Least power, by default",
    body: "Indexers that can read the chain but can't move money. Seven university roles that each see exactly what they should. If a part gets compromised, it can't do much.",
    tags: ["Least privilege", "RBAC", "Blast radius"],
    seen: ["boundless", "sumas"],
  },
  {
    title: "Trust the quorum",
    body: "No single signer should approve a cross-chain message. Require two of three, reject duplicates, and refuse junk before doing anything expensive.",
    tags: ["Multisig", "Signature verification", "DoS resistance"],
    seen: ["stellar-dvn"],
  },
  {
    title: "Queues absorb the chaos",
    body: "Webhooks fail, chains stall and providers time out. Durable background jobs keep the work moving and make every step safe to retry.",
    tags: ["Event-driven", "Background workers", "Retries"],
    seen: ["useroutr", "boundless"],
  },
  {
    title: "Threats belong in version control",
    body: "A threat model in a diagram drifts. Next to the code, it gets reviewed in pull requests and enforced in CI like everything else.",
    tags: ["STRIDE", "Threat modelling", "Shift-left security"],
    seen: ["moat"],
  },
  {
    title: "Contracts only where they earn it",
    body: "On-chain code is expensive to run and hard to change. Keep it for what has to be trustless, and run everything else off-chain.",
    tags: ["On-chain vs off-chain", "Smart contract design"],
    seen: ["useroutr"],
  },
  {
    title: "One contract between client and server",
    body: "Shared types and OpenAPI specs mean the API, the SDK and the UI can't quietly disagree about what a payment or a student looks like.",
    tags: ["API design", "OpenAPI", "Type safety"],
    seen: ["useroutr", "sumas"],
  },
];

/** Lab entries. `repo: null` = private repo, shown without a source link. */
export const lab: {
  slug: string;
  title: string;
  year: string;
  language: string;
  summary: string;
  repo: string | null;
  caseStudy?: string;
}[] = [
  {
    slug: "moat",
    title: "Moat",
    year: "2026",
    language: "TypeScript",
    summary:
      "Threat models usually live in a diagram nobody updates. Moat keeps one in a moat.yaml next to the code, turns it into a STRIDE threat register, and fails CI when a new risk shows up unhandled.",
    repo: "https://github.com/0xdevcollins/moat",
  },
  {
    slug: "stellar-dvn",
    title: "stellar-dvn",
    year: "2026",
    language: "Rust",
    summary:
      "An independent LayerZero V2 verifier for Stellar, built for the fun of it and working end to end against LayerZero's real testnet contracts.",
    repo: "https://github.com/0xdevcollins/stellar-dvn",
    caseStudy: "/work/stellar-dvn",
  },
  {
    slug: "nivoui",
    title: "nivoui",
    year: "2025",
    language: "TypeScript",
    summary:
      "shadcn, but for Stellar apps. A component registry, React hooks and providers, a CLI that copies components into your project, plus a visual studio and docs.",
    repo: "https://github.com/0xdevcollins/nivoui",
  },
  {
    slug: "querymaster",
    title: "QueryMaster",
    year: "2024",
    language: "JavaScript",
    summary:
      "Drop files into a project, then ask them questions. QueryMaster embeds everything with OpenAI, keeps the vectors in Pinecone and answers through a chat window, with the backend running on Zoho Catalyst functions.",
    repo: null,
  },
  {
    slug: "stellarmind",
    title: "StellarMind",
    year: "2025",
    language: "Early idea",
    summary: "An AI chatbot and code helper for Soroban smart contract developers. Still a sketch on paper.",
    repo: "https://github.com/0xdevcollins/StellarMind",
  },
];
