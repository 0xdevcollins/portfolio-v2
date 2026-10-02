import { unstable_cache } from "next/cache";
import snapshot from "@/content/github.json";

/**
 * Live GitHub activity for the open-source section.
 *
 * With GITHUB_TOKEN set (any token works; public data needs no scopes), the
 * server reads GitHub's GraphQL API and caches the result for an hour. Without
 * a token, or if GitHub fails, it falls back to src/content/github.json
 * (refresh that with `pnpm sync:github`).
 */
export type GitHubData = typeof snapshot & { source: "live" | "snapshot" };

const USER = "0xdevcollins";
// My own companies and affiliated products. Everything else counts as open source.
const OWN = ["0xdevcollins", "boundlessfi", "useroutr", "packradar", "gridape", "sumasrms", "threadflowhq", "threadify-me"];
const OSS_QUERY = `is:pr author:${USER} is:merged ${OWN.map((o) => `-user:${o}`).join(" ")}`;

type PRNode = {
  title: string;
  url: string;
  mergedAt: string;
  repository: {
    nameWithOwner: string;
    isPrivate: boolean;
    description: string | null;
    stargazerCount: number;
    primaryLanguage: { name: string } | null;
    owner: { login: string; avatarUrl: string };
  };
};

async function graphql<T>(token: string, query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors ?? res.status));
  return json.data as T;
}

async function fetchLive(token: string): Promise<GitHubData> {
  const now = new Date();
  const years: number[] = [];
  for (let y = 2022; y <= now.getUTCFullYear(); y++) years.push(y);

  const yearFields = years
    .map((y) => {
      const to = y === now.getUTCFullYear() ? now.toISOString() : `${y}-12-31T23:59:59Z`;
      return `y${y}: contributionsCollection(from: "${y}-01-01T00:00:00Z", to: "${to}") { contributionCalendar { totalContributions } }`;
    })
    .join("\n");

  type Profile = {
    user: {
      lastYear: {
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
        };
      };
      pullRequests: { totalCount: number };
      repositoriesContributedTo: { totalCount: number };
    } & Record<string, { contributionCalendar: { totalContributions: number } }>;
  };

  const profile = await graphql<Profile>(
    token,
    `query($login: String!) { user(login: $login) {
      lastYear: contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } }
      ${yearFields}
      pullRequests(states: MERGED) { totalCount }
      repositoriesContributedTo(contributionTypes: [COMMIT, PULL_REQUEST]) { totalCount }
    } }`,
    { login: USER },
  );

  // Merged PRs outside my own orgs, newest first, paged 100 at a time.
  const prs: PRNode[] = [];
  let after: string | null = null;
  for (let page = 0; page < 10; page++) {
    type Search = { search: { pageInfo: { hasNextPage: boolean; endCursor: string }; nodes: (PRNode | Record<string, never>)[] } };
    const data: Search = await graphql<Search>(
      token,
      `query($q: String!, $after: String) { search(query: $q, type: ISSUE, first: 100, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes { ... on PullRequest { title url mergedAt repository {
          nameWithOwner isPrivate description stargazerCount primaryLanguage { name } owner { login avatarUrl }
        } } }
      } }`,
      { q: OSS_QUERY, after },
    );
    // Never publish private repos, even if the token can see them.
    prs.push(...(data.search.nodes.filter((n) => "url" in n && !n.repository.isPrivate) as PRNode[]));
    if (!data.search.pageInfo.hasNextPage) break;
    after = data.search.pageInfo.endCursor;
  }

  const byRepo = new Map<string, { node: PRNode["repository"]; prs: PRNode[] }>();
  for (const pr of prs) {
    const key = pr.repository.nameWithOwner;
    const entry = byRepo.get(key) ?? { node: pr.repository, prs: [] };
    entry.prs.push(pr);
    byRepo.set(key, entry);
  }

  const list = [...byRepo.values()]
    .map(({ node, prs }) => {
      const latest = [...prs].sort((a, b) => b.mergedAt.localeCompare(a.mergedAt))[0];
      return {
        repo: node.nameWithOwner,
        owner: node.owner.login,
        avatar: node.owner.avatarUrl,
        description: node.description ?? "",
        language: node.primaryLanguage?.name ?? "",
        stars: node.stargazerCount,
        count: prs.length,
        latest: { title: latest.title, url: latest.url, mergedAt: latest.mergedAt },
      };
    })
    .sort((a, b) => b.count - a.count || b.stars - a.stars);

  const cal = profile.user.lastYear.contributionCalendar;
  return {
    source: "live",
    syncedAt: now.toISOString(),
    user: USER,
    lastYear: {
      total: cal.totalContributions,
      weeks: cal.weeks.map((w) => w.contributionDays.map((d) => [d.date, d.contributionCount])),
    },
    yearly: years.map((y) => ({ year: y, total: profile.user[`y${y}`].contributionCalendar.totalContributions })),
    mergedPRs: profile.user.pullRequests.totalCount,
    reposContributedTo: profile.user.repositoriesContributedTo.totalCount,
    openSource: {
      mergedPRs: prs.length,
      repos: list.length,
      orgs: new Set(list.map((r) => r.owner.toLowerCase())).size,
      list,
    },
  } as GitHubData;
}

// Only successful live results are cached; a missing token never reaches the cache.
const cachedLive = unstable_cache(async () => fetchLive(process.env.GITHUB_TOKEN as string), ["github-activity-v2"], {
  revalidate: 3600,
  tags: ["github"],
});

export async function getGitHub(): Promise<GitHubData> {
  if (process.env.GITHUB_TOKEN) {
    try {
      return await cachedLive();
    } catch (err) {
      console.warn("[github] live fetch failed, using snapshot:", err instanceof Error ? err.message : err);
    }
  }
  return { ...snapshot, source: "snapshot" };
}
