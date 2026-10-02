#!/usr/bin/env node
/**
 * Snapshots GitHub activity into src/content/github.json for the
 * open-source section. Uses the GitHub CLI's login (`gh auth login`).
 *
 *   node scripts/sync-github.mjs
 */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const USER = "0xdevcollins";
// Orgs that are my own companies or affiliated products, not third-party open source.
const OWN = ["0xdevcollins", "boundlessfi", "useroutr", "packradar", "gridape", "sumasrms", "threadflowhq", "threadify-me"];

const gh = (args) => JSON.parse(execFileSync("gh", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }));
const graphql = (query) => gh(["api", "graphql", "-f", `query=${query}`]).data;

// Contribution calendar for the last year + lifetime numbers.
const year = graphql(`query{user(login:"${USER}"){
  contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}
  pullRequests(states:MERGED){totalCount}
  repositoriesContributedTo(contributionTypes:[COMMIT,PULL_REQUEST]){totalCount}
}}`).user;

// Totals per calendar year since the account was created.
const now = new Date();
const yearly = [];
for (let y = 2022; y <= now.getUTCFullYear(); y++) {
  const to = y === now.getUTCFullYear() ? now.toISOString() : `${y}-12-31T23:59:59Z`;
  const r = graphql(`query{user(login:"${USER}"){contributionsCollection(from:"${y}-01-01T00:00:00Z",to:"${to}"){contributionCalendar{totalContributions}}}}`);
  yearly.push({ year: y, total: r.user.contributionsCollection.contributionCalendar.totalContributions });
}

// Merged PRs into repos outside my own orgs.
const exclude = OWN.map((o) => `-user:${o}`).join(" ");
const items = [];
for (let page = 1; page <= 10; page++) {
  const res = gh(["api", "-X", "GET", "search/issues", "-f", `q=is:pr author:${USER} is:merged ${exclude}`, "-f", "per_page=100", "-f", `page=${page}`]);
  items.push(...res.items);
  if (res.items.length < 100) break;
}

const byRepo = new Map();
for (const it of items) {
  const full = it.repository_url.replace("https://api.github.com/repos/", "");
  const entry = byRepo.get(full) ?? { repo: full, owner: full.split("/")[0], prs: [] };
  entry.prs.push({ title: it.title, url: it.html_url, mergedAt: it.closed_at });
  byRepo.set(full, entry);
}

const repos = [...byRepo.values()]
  .map((r) => {
    let meta = {};
    try {
      meta = gh(["api", `repos/${r.repo}`]);
    } catch {}
    // Never publish private repos, even if this login can see them.
    if (meta.private !== false) return null;
    r.prs.sort((a, b) => b.mergedAt.localeCompare(a.mergedAt));
    return {
      repo: r.repo,
      owner: r.owner,
      avatar: meta.owner?.avatar_url ?? `https://github.com/${r.owner}.png`,
      description: meta.description ?? "",
      language: meta.language ?? "",
      stars: meta.stargazers_count ?? 0,
      count: r.prs.length,
      latest: r.prs[0],
    };
  })
  .filter(Boolean)
  .sort((a, b) => b.count - a.count || b.stars - a.stars);

const calendar = year.contributionsCollection.contributionCalendar;
const out = {
  syncedAt: now.toISOString(),
  user: USER,
  lastYear: {
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((w) => w.contributionDays.map((d) => [d.date, d.contributionCount])),
  },
  yearly,
  mergedPRs: year.pullRequests.totalCount,
  reposContributedTo: year.repositoriesContributedTo.totalCount,
  openSource: {
    mergedPRs: repos.reduce((n, r) => n + r.count, 0),
    repos: repos.length,
    orgs: new Set(repos.map((r) => r.owner.toLowerCase())).size,
    list: repos,
  },
};

writeFileSync(new URL("../src/content/github.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(
  `Synced: ${out.lastYear.total} contributions last year, ${out.openSource.mergedPRs} OSS PRs in ${out.openSource.repos} repos.`,
);
