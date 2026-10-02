/**
 * Long-form content for /work/[slug]. Every claim comes from the project's
 * README or docs, Collins's CV or LinkedIn, or his GitHub history.
 *
 * Kept off the public site on purpose: private repo links, internal
 * roadmaps, security and key-handling design, admin URLs, customer data.
 */
export type CaseStudy = {
  overview: string[];
  /** Short numbers worth calling out. */
  facts?: { value: string; label: string }[];
  built: { title: string; body: string }[];
  gallery?: { src: string; caption: string }[];
  links?: { label: string; href: string }[];
  timeline?: string;
};

export const caseStudies: Record<string, CaseStudy> = {
  useroutr: {
    timeline: "2026",
    overview: [
      "Every app wants to be paid in a particular way. Every user wants to pay with whatever is already in their wallet. Useroutr sits in the middle and makes both of them right.",
      "An app describes what it needs: an amount, an asset, a network. Useroutr quotes it, finds a route, spots the payment, settles it on Stellar, reconciles, credits the app's ledger and tells the app it's done. I build the backend that does all of that, and the Soroban contracts underneath it.",
    ],
    facts: [
      { value: "Once", label: "Every financial effect lands exactly once, however often a job retries" },
      { value: "7", label: "Background jobs working behind every payment" },
      { value: "1", label: "Network where everything settles: Stellar" },
    ],
    built: [
      {
        title: "Funding intents",
        body: "Apps don't wire up payment methods one by one. They declare the outcome they need, and Useroutr works out how each user can get them there.",
      },
      {
        title: "Money moves exactly once",
        body: "Retries happen and networks hiccup. Every financial effect is applied once, every state is explicit, and the money logic is deterministic, so the same inputs always produce the same ledger.",
      },
      {
        title: "No favourite provider",
        body: "Payment rails like Circle's CCTP plug in behind one interface. A provider can change without the core ever noticing.",
      },
      {
        title: "A worker that never clocks out",
        body: "Payment monitoring, settlement, refunds, reconciliation and webhooks run as background jobs on BullMQ, so a payment keeps moving even when nobody is watching.",
      },
      {
        title: "Contracts only where they earn it",
        body: "Soroban contracts handle what has to be trustless. Everything else stays off-chain, where it's cheaper to run and easier to change.",
      },
    ],
    links: [{ label: "useroutr.com", href: "https://useroutr.com" }],
  },

  boundless: {
    timeline: "Dec 2024 — now",
    overview: [
      "Builders need funding and communities want to back them. Boundless brings hackathons, bounties, grants and crowdfunding into one place, with payouts that land on-chain.",
      "I co-founded it and built the backend: the part that has to be right every single time money moves.",
    ],
    facts: [
      { value: "350+", label: "Merged pull requests across the backend and platform" },
      { value: "4", label: "Ways to fund builders: hackathons, bounties, grants and crowdfunding" },
    ],
    built: [
      {
        title: "One backend, four ways to get funded",
        body: "Hackathons, bounties, grants and crowdfunding share one NestJS service, with authentication, organisations and smart wallets built in.",
      },
      {
        title: "Indexers that can only watch",
        body: "On-chain indexers follow Stellar and report what they see, but they have no write access to business state. Even a compromised indexer can't move funds.",
      },
      {
        title: "Built to stay up",
        body: "GraphQL and REST APIs backed by BullMQ queues, Redis caching, rate limiting and health checks, over PostgreSQL and Prisma.",
      },
    ],
    links: [{ label: "boundlessfi.xyz", href: "https://boundlessfi.xyz" }],
  },

  gridape: {
    timeline: "Sep 2023 — Apr 2026",
    overview: [
      "GridApe puts everything an email marketer needs into one dashboard: campaigns, automations, sign-up forms, landing pages, and a drag-and-drop editor for the emails themselves.",
      "I led the frontend team for almost three years. Most of my 77 merged pull requests went into the dashboard customers work in.",
    ],
    facts: [
      { value: "77", label: "Merged pull requests across the dashboard, frontend, content and API" },
      { value: "2 yrs 8 mos", label: "Leading the frontend team" },
    ],
    built: [
      {
        title: "Leading from the frontend",
        body: "Led the developers building GridApe's web apps, held the line on quality, and kept frontend, design and backend pulling in the same direction.",
      },
      {
        title: "Faster by choice",
        body: "Moved the team onto newer frameworks and tooling wherever they made the product quicker and the experience better.",
      },
      {
        title: "The dashboard",
        body: "Campaign and audience performance, the template library and editor, form widgets and plan limits, all in one place.",
      },
    ],
    gallery: [
      { src: "/work/gridape-template-design.png", caption: "Template editor" },
      { src: "/work/gridape-template-gallery.png", caption: "Template library" },
      { src: "/work/gridape-forms.png", caption: "Form widgets" },
    ],
  },

  threadify: {
    timeline: "Nov 2023 — now",
    overview: [
      "Got an audience? Threadify turns it into a merch line. Creators design on a canvas, open a store and sell, and Threadify takes care of printing and shipping.",
      "I've been CTO since the company was still called Threadflow, and I've worked hands-on on the product editor and the backend.",
    ],
    facts: [
      { value: "6", label: "Products to design: T-shirt, hoodie, tote bag, mug, phone case, cap" },
      { value: "2", label: "Sides to design on, front and back" },
    ],
    built: [
      {
        title: "A design studio in a browser tab",
        body: "A canvas built on React Konva. Start from a template or a blank product, add text, shapes and your own images, arrange layers, pick the product colour, and undo anything.",
      },
      {
        title: "Designs land where the printer expects",
        body: "Every product has print zones. Artwork snaps to areas like centre, top middle or bottom centre, and can be dragged, resized and rotated inside them.",
      },
      {
        title: "The engine room",
        body: "A TypeScript and Express service behind the stores and the editor.",
      },
    ],
  },

  sumas: {
    timeline: "2026",
    overview: [
      "A university runs on approvals: courses, grades, policies, people. Sumas gives the State University of Medical and Applied Sciences (SUMAS) in Enugu State one system for all of it.",
      "I built it full stack, with a Next.js and Radix UI frontend over a NestJS API.",
    ],
    facts: [
      { value: "7", label: "Roles, each with its own permissions" },
      { value: "35", label: "Merged pull requests" },
    ],
    built: [
      {
        title: "Seven roles, one source of truth",
        body: "Admin, Faculty Dean, HOD, Senate, Lecturer, Student and Staff, with hierarchical permissions. Lecturers grade and take attendance, HODs approve courses, and students enrol and see their grades.",
      },
      {
        title: "Passwords optional",
        body: "better-auth with email and password, plus passkeys for people who'd rather not remember another one.",
      },
      {
        title: "An API with its guard up",
        body: "NestJS on PostgreSQL and Prisma, auto-generated OpenAPI docs, and Helmet, CORS, rate limiting and input validation on every route.",
      },
    ],
  },

  "stellar-dvn": {
    timeline: "2026",
    overview: [
      "A cross-chain message on LayerZero is only as trustworthy as the verifiers who sign off on it. Apps on Stellar can pick several. I wanted to know whether one person could build one.",
      "Turns out you can. It's a Soroban contract plus the off-chain service that feeds it, working end to end against LayerZero's real Stellar testnet contracts. It's a hobby project: unaudited and not on mainnet.",
    ],
    facts: [
      { value: "85", label: "Tests across the contracts and the verifier" },
      { value: "2 of 3", label: "Signatures needed to verify a message" },
      { value: "~7 XLM", label: "Fee quoted for a real message sent from Stellar" },
    ],
    built: [
      {
        title: "Signing off on a message",
        body: "An app names this DVN as its required verifier. A 2-of-3 quorum signs, LayerZero's ULN302 marks the packet verifiable, the endpoint emits PacketVerified, and the app gets its message.",
      },
      {
        title: "Knowing when to say no",
        body: "A repeat delivery is rejected. One signature against a 2-of-3 threshold is rejected on chain. More signatures than signers is refused before any expensive signature recovery runs.",
      },
      {
        title: "One real message, sent",
        body: "A message left Stellar through LayerZero's endpoint with this DVN in the send stack, paying its fee through the real DvnFeeLib. The verifier then picked that packet up from Stellar RPC and attested it.",
      },
    ],
    links: [{ label: "Source on GitHub", href: "https://github.com/0xdevcollins/stellar-dvn" }],
  },
};
