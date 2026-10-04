import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * NFR-DATA-01 / invariant #10 as an executable grep, with the ONE bounded exception of
 * ADR-0012: the session-scoped store in duckerAuth.ts and fetch in duckerRequests.ts -
 * and nowhere else. A third file reaching for browser storage or the network has to
 * change this list on purpose.
 */

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const sources = walk(SRC)
  .filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f))
  .map((f) => ({ path: relative(SRC, f).split(sep).join("/"), text: readFileSync(f, "utf8") }));

const ALLOWED: Record<string, string[]> = {
  sessionStorage: ["lib/auth/duckerAuth.ts"],
  "fetch(": ["lib/auth/duckerRequests.ts"],
  localStorage: [],
  "document.cookie": [],
  indexedDB: [],
};

describe("browser storage and network stay in the two Ducker ID auth files", () => {
  it("scans real files", () => {
    expect(sources.length).toBeGreaterThan(20);
  });

  it.each(Object.entries(ALLOWED))("%s appears only in the allowlist", (token, allowed) => {
    const hits = sources.filter((s) => s.text.includes(token)).map((s) => s.path);
    expect(hits.sort()).toEqual([...allowed].sort());
  });
});
