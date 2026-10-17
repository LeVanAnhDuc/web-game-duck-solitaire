import { test, expect } from "@/fixtures";
import { SEED } from "@/data/test-data";

// ADR-0004 (static export, same mould as the sibling games) · deploy.yml (NEXT_PUBLIC_BASE_PATH=/<repo>). Both cases run
// unchanged on dev (served at the root) and on prd (GitHub Pages under /web-game-duck-solitaire/).

test("mọi tài nguyên của trang đều tải được", { tag: ["@TC-DEPLOY-001", "@smoke"] }, async ({ page, gamePage }) => {
  const failed: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  page.on("requestfailed", (r) => failed.push(`failed ${r.url()}`));
  await gamePage.goto(SEED);
  await page.waitForLoadState("networkidle");
  await expect(gamePage.cards()).toHaveCount(52);
  expect(failed).toEqual([]);
});

test("mọi request của trang nằm dưới đường dẫn gốc của site", { tag: ["@TC-DEPLOY-002"] }, async ({ page, gamePage, urls }) => {
  const base = `${urls.webUrl}/`;
  const outside: string[] = [];
  page.on("request", (r) => {
    if (!r.url().startsWith(base)) outside.push(r.url());
  });
  await gamePage.goto(SEED);
  await page.waitForLoadState("networkidle");
  expect(outside).toEqual([]);
  // The deal number survives the base path: the address is still <base>?van=<seed>.
  expect(page.url()).toBe(`${base}?van=${SEED}`);
});
