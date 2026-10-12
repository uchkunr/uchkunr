// Rewrites the two tables in README.md from the GitHub API: my most recently
// pushed repos, and pull requests I've had merged into other projects.
//
//   GITHUB_TOKEN=$(gh auth token) node scripts/update-readme.ts

import { readFile, writeFile } from "node:fs/promises";

const USER = "uchkunr";
const README = new URL("../README.md", import.meta.url);

const PROJECTS = 6;
const HIDDEN = new Set([USER, "dotfiles", "zmk-config"]);

const UPSTREAM = 8;
const MIN_STARS = 100;
const SKIP_PRS = new Set(["https://github.com/DefinitelyTyped/DefinitelyTyped/pull/72007"]);

type Repo = { name: string; url: string; description: string | null; pushedAt: string };
type PullRequest = {
  title: string;
  url: string;
  mergedAt: string;
  repository: { nameWithOwner: string; url: string; isPrivate: boolean; stargazerCount: number };
};

const QUERY = `
  query ($login: String!, $prs: String!) {
    user(login: $login) {
      repositories(first: 100, privacy: PUBLIC, isFork: false, isArchived: false, ownerAffiliations: OWNER) {
        nodes { name url description pushedAt }
      }
    }
    search(type: ISSUE, query: $prs, first: 100) {
      nodes {
        ... on PullRequest {
          title
          url
          mergedAt
          repository { nameWithOwner url isPrivate stargazerCount }
        }
      }
    }
  }
`;

const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error("GITHUB_TOKEN is not set");

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { authorization: `bearer ${token}`, "content-type": "application/json" },
  body: JSON.stringify({
    query: QUERY,
    variables: { login: USER, prs: `author:${USER} is:pr is:merged -user:${USER}` },
  }),
});
const body = await res.json();
if (!res.ok || body.errors) throw new Error(`GitHub API: ${JSON.stringify(body.errors ?? body)}`);

const repos: Repo[] = body.data.user.repositories.nodes;
const prs: PullRequest[] = body.data.search.nodes.filter((n: PullRequest) => n.url);

// Repo descriptions and PR titles are written for other places. Here they lose
// emoji, long dashes and conventional-commit prefixes, and can't break a table.
function clean(text: string): string {
  return text
    .replace(/\p{Extended_Pictographic}️?/gu, "")
    .replace(/\s+[–—-]\s+|\s*[–—]\s*/g, ": ")
    .replace(/\|/g, "\\|")
    .replace(/\s+/g, " ")
    .trim();
}

function prTitle(title: string): string {
  const t = clean(title.replace(/^\w+(\([^)]*\))?!?:\s*/, ""));
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function date(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function stars(n: number): string {
  return n < 1000 ? String(n) : `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

function table(header: string[], rows: string[][]): string {
  const line = (cells: string[]) => `| ${cells.join(" | ")} |`;
  return [line(header), line(header.map(() => "---")), ...rows.map(line)].join("\n");
}

const projects = table(
  ["Project", "What it does", "Updated"],
  repos
    .filter((r) => !HIDDEN.has(r.name))
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt))
    .slice(0, PROJECTS)
    .map((r) => [`[${r.name}](${r.url})`, clean(r.description ?? ""), date(r.pushedAt)]),
);

const upstream = table(
  ["Upstream", "Pull request", "Stars", "Merged"],
  prs
    .filter((pr) => !pr.repository.isPrivate && pr.repository.stargazerCount >= MIN_STARS && !SKIP_PRS.has(pr.url))
    .sort((a, b) => b.mergedAt.localeCompare(a.mergedAt))
    .slice(0, UPSTREAM)
    .map((pr) => [
      `[${pr.repository.nameWithOwner}](${pr.repository.url})`,
      `[${prTitle(pr.title)}](${pr.url})`,
      stars(pr.repository.stargazerCount),
      date(pr.mergedAt),
    ]),
);

function replace(md: string, name: string, content: string): string {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  const from = md.indexOf(start);
  const to = md.indexOf(end);
  if (from === -1 || to < from) throw new Error(`README has no ${name} section`);
  return `${md.slice(0, from + start.length)}\n${content}\n${md.slice(to)}`;
}

let md = await readFile(README, "utf8");
md = replace(md, "projects", projects);
md = replace(md, "upstream", upstream);
await writeFile(README, md);
