import { execFileSync } from "node:child_process";

/**
 * Enforces NFR-SEC-05 - "no dependency vulnerability at high or above".
 *
 * It asks GitHub for this repository's Dependabot alerts rather than running
 * `yarn audit`. Yarn 1's audit endpoint
 * (registry.yarnpkg.com/-/npm/v1/security/audits) times out on every call now, both
 * on a laptop and on a GitHub runner - and the version of this script ported from
 * web-game-minesweeper printed "no high or critical advisory (0 total)" and exited 0
 * when that happened. Its audit step has never actually run. A security gate that
 * goes green when it never ran is worse than no gate at all, so this one asks a
 * source that answers, and fails loudly when it cannot.
 *
 * GitHub builds the alert list from the committed yarn.lock, so what is checked is
 * what is installed - closer to the truth than an npm-side resolution of
 * package.json would be.
 *
 *   yarn check:audit
 *
 * Locally it uses your `gh` login. In CI it uses GITHUB_TOKEN, which needs
 * `security-events: read` on the job.
 *
 * The blind spot, covered separately: an alert only exists after GitHub has scanned
 * a pushed lockfile, so a brand-new vulnerable dependency on a feature branch is not
 * here yet. That window is what dependency-review-action guards on pull requests.
 */
const BLOCKING = new Set(["high", "critical"]);

const repo =
  process.env.GITHUB_REPOSITORY ??
  (() => {
    try {
      return execFileSync("gh", ["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"], {
        encoding: "utf8",
      }).trim();
    } catch {
      return "";
    }
  })();

if (!repo) {
  console.error("NFR-SEC-05 could not be checked: no repository to ask about.");
  console.error("Set GITHUB_REPOSITORY, or run this inside a checkout with `gh` logged in.");
  process.exit(1);
}

let alerts;
try {
  const raw = execFileSync(
    "gh",
    ["api", "--paginate", `repos/${repo}/dependabot/alerts?state=open&per_page=100`],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  // --paginate concatenates one JSON array per page; join them into one list.
  alerts = raw
    .split("\n")
    .filter((line) => line.trim().startsWith("["))
    .flatMap((line) => JSON.parse(line));
} catch (error) {
  console.error("NFR-SEC-05 could not be checked: the Dependabot alerts API did not answer.");
  console.error("");
  console.error(`  repo: ${repo}`);
  console.error(`  ${String(error.stderr ?? error.message).trim()}`);
  console.error("");
  console.error("Dependabot alerts must be enabled on the repository, and the caller needs");
  console.error("security-events read access. Do not treat this as a pass.");
  process.exit(1);
}

const rows = alerts.map((a) => ({
  severity: a.security_advisory?.severity ?? "unknown",
  pkg: a.dependency?.package?.name ?? "?",
  range: a.security_vulnerability?.vulnerable_version_range ?? "?",
  fixed: a.security_vulnerability?.first_patched_version?.identifier ?? "no patch yet",
  title: a.security_advisory?.summary ?? "",
  url: a.html_url ?? "",
}));

const blocking = rows.filter((r) => BLOCKING.has(r.severity));
const rest = rows.filter((r) => !BLOCKING.has(r.severity));

if (rest.length > 0) {
  console.log(`${rest.length} open alert(s) below high, not blocking:`);
  for (const r of rest) console.log(`  ${r.severity.padEnd(8)} ${r.pkg}  ${r.title}`);
  console.log("");
}

if (blocking.length === 0) {
  console.log(`NFR-SEC-05: no open alert at high or above (${rows.length} open in total).`);
  process.exit(0);
}

console.error(`NFR-SEC-05 violated: ${blocking.length} open alert(s) at high or above`);
console.error("");
for (const r of blocking) {
  console.error(`  ${r.severity.toUpperCase()}  ${r.pkg} ${r.range}`);
  console.error(`    ${r.title}`);
  console.error(`    fixed in ${r.fixed}`);
  if (r.url) console.error(`    ${r.url}`);
  console.error("");
}
console.error("Upgrade it, or pin the patched range with a resolutions entry in package.json.");
process.exit(1);
