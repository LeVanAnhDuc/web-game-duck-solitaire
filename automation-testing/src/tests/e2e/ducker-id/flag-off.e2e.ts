import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED } from "@/data/test-data";

// FR-15 · ADR-0012 · invariant #10. The deployed build: the flag is off, so sign-in does not exist at all - no control,
// no storage, no callback handling, no request. Runs on project "app" (dev and prd alike).

test("cờ tắt thì không có nút đăng nhập, không đọc callback, không chạm storage", { tag: ["@TC-DUCKERID-001", "@smoke"] }, async ({
  page,
  gamePage,
  urls,
}) => {
  const origin = new URL(urls.webUrl).origin;
  const outside: string[] = [];
  page.on("request", (r) => {
    if (new URL(r.url()).origin !== origin) outside.push(r.url());
  });
  await page.goto(`./?van=${SEED}&code=x&state=y`);
  await gamePage.waitReady();

  await expect(gamePage.account.signInButton()).toHaveCount(0);
  await expect(gamePage.account.trigger()).toHaveCount(0);
  // The callback parameters are not the game's business when sign-in is off: left exactly where they were.
  expect(new URL(page.url()).searchParams.get("code")).toBe("x");
  await expect(gamePage.header().getByText(copy.tagline, { exact: true })).toBeVisible();
  const stored = await page.evaluate(() => ({ session: window.sessionStorage.length, local: window.localStorage.length }));
  expect(stored).toEqual({ session: 0, local: 0 });
  expect(outside).toEqual([]);
});
