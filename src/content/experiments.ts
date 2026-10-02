export type Experiment = {
  slug: string;
  title: string;
  summary: string;
  status: "live" | "building";
};

export const experiments: Experiment[] = [
  {
    slug: "settle-or-refund",
    title: "Settle or refund",
    summary: "An HTLC you drive. Reveal the secret before the timer runs out, or watch it refund.",
    status: "building",
  },
  {
    slug: "path-finder",
    title: "Path finder",
    summary: "A payment routing across assets to the cheapest path.",
    status: "building",
  },
  {
    slug: "balanced",
    title: "Balanced",
    summary: "A double-entry ledger that refuses to post an entry that doesn't balance.",
    status: "building",
  },
  {
    slug: "hash-type",
    title: "Hash type",
    summary: "The intro's scramble effect as a playground.",
    status: "building",
  },
];
