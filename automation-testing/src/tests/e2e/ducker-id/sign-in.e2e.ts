import { test, expect } from "@/fixtures";
import type { Page } from "@playwright/test";
import { copy } from "@/data/copy";
import { DUCKER, SEED_THREE_TO_COLUMN_7 } from "@/data/test-data";

// FR-15 · US-06 · ADR-0012 · invariant #10. Runs on project "app-auth": the flag-on export built by
// `pnpm build:e2e-auth` against the fake issuer http://ducker.test, served on :4185. Nothing here reaches a real
// Ducker ID - the fakeIssuer fixture answers every request to it.

const SEED = SEED_THREE_TO_COLUMN_7;

const search = (page: Page) => page.evaluate(() => window.location.search);

/**
 * Next's router writes its hydration URL back into history AFTER the page is usable, so one early look can pass by
 * luck: poll until the clean URL is there, then make sure it stays there.
 */
async function expectSettledSearch(page: Page, expected: string): Promise<void> {
  await page.waitForLoadState("load");
  await expect.poll(() => search(page)).toBe(expected);
  await expect.poll(() => search(page), { intervals: [200, 200, 200] }).toBe(expected);
}

test("chưa bấm thì không gọi issuer, không lưu gì; câu cam kết nói \"không tài khoản riêng\"", { tag: ["@TC-DUCKERID-002"] }, async ({
  page,
  gamePage,
  fakeIssuer,
}) => {
  const issuer = await fakeIssuer();
  await gamePage.goto(SEED);
  await expect(gamePage.account.signInButton()).toBeVisible();
  await expect(gamePage.header().getByText(copy.taglineWithSignIn, { exact: true })).toBeVisible();
  expect(issuer.calls()).toEqual([]);
  expect(await page.evaluate(() => window.sessionStorage.length + window.localStorage.length)).toBe(0);
});

test("đăng nhập: thấy tài khoản, địa chỉ sạch, giữ ?van, đăng xuất trả lại nút", { tag: ["@TC-DUCKERID-003", "@smoke"] }, async ({
  page,
  gamePage,
  fakeIssuer,
}) => {
  const noise: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") noise.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => noise.push(`pageerror: ${e.message}`));
  const issuer = await fakeIssuer();
  await gamePage.goto(SEED);
  const dealt = await gamePage.snapshot();

  await gamePage.account.signInButton().click();
  await expect(gamePage.account.trigger()).toBeVisible();

  await expectSettledSearch(page, `?van=${SEED}`);
  await expect(gamePage.seedLabel(SEED)).toBeVisible();
  expect(await gamePage.snapshot()).toEqual(dealt);
  expect(issuer.calls()).toEqual(["GET /oauth/authorize", "POST /oauth/token", "GET /oauth/userinfo"]);
  // The PKCE entry is gone once the player is back, and the profile was never written down.
  expect(await page.evaluate(() => window.sessionStorage.length + window.localStorage.length)).toBe(0);

  await gamePage.account.trigger().click();
  await expect(gamePage.account.menu()).toContainText(DUCKER.user.name);
  await expect(gamePage.account.menu()).toContainText(DUCKER.user.email);
  await expect(gamePage.account.profileLink()).toHaveAttribute("href", `${DUCKER.issuer}${DUCKER.profilePath}`);
  await expect(gamePage.account.profileLink()).toHaveAttribute("target", "_blank");

  await gamePage.account.signOutItem().click();
  await expect(gamePage.account.signInButton()).toBeVisible();
  await expect(gamePage.account.signInButton()).toBeFocused();
  expect(noise).toEqual([]);
});

test("Esc đóng menu tài khoản và trả tiêu điểm về nút; phím trong menu không chạm tới bàn bài", { tag: ["@TC-DUCKERID-004"] }, async ({
  page,
  gamePage,
  fakeIssuer,
}) => {
  await fakeIssuer();
  await gamePage.goto(SEED);
  await gamePage.account.signInButton().click();
  await gamePage.account.trigger().click();
  await expect(gamePage.account.profileLink()).toBeFocused();
  const before = await gamePage.snapshot();

  await page.keyboard.press("ArrowDown");
  await expect(gamePage.account.signOutItem()).toBeFocused();
  await page.keyboard.press("Home");
  await expect(gamePage.account.profileLink()).toBeFocused();
  await page.keyboard.press("End");
  await expect(gamePage.account.signOutItem()).toBeFocused();
  expect(await gamePage.snapshot()).toEqual(before);

  await page.keyboard.press("Escape");
  await expect(gamePage.account.menu()).toHaveCount(0);
  await expect(gamePage.account.trigger()).toHaveAttribute("aria-expanded", "false");
  await expect(gamePage.account.trigger()).toBeFocused();
});

test("đã đăng nhập vẫn chơi như thường", { tag: ["@TC-DUCKERID-005"] }, async ({ gamePage, fakeIssuer }) => {
  await fakeIssuer();
  await gamePage.goto(SEED);
  await gamePage.account.signInButton().click();
  await expect(gamePage.account.trigger()).toBeVisible();
  await gamePage.cardNamed("Tép Ba").dblclick();
  await expect(gamePage.cardNamed("Tép Ba")).toHaveAttribute("data-card-pile", "tableau-6");
  await gamePage.tapStock();
  await expect(gamePage.cardsIn("waste")).toHaveCount(1);
});

test("tải lại khi đang đăng nhập là về chưa đăng nhập", { tag: ["@TC-DUCKERID-006", "@smoke"] }, async ({ page, gamePage, fakeIssuer }) => {
  await fakeIssuer();
  await gamePage.goto(SEED);
  await gamePage.account.signInButton().click();
  await expect(gamePage.account.trigger()).toBeVisible();
  await gamePage.reload();
  await expectSettledSearch(page, `?van=${SEED}`);
  await expect(gamePage.account.signInButton()).toBeVisible();
  await expect(gamePage.seedLabel(SEED)).toBeVisible();
});

test("từ chối ở Ducker ID thì về chưa đăng nhập, ván còn nguyên", { tag: ["@TC-DUCKERID-007"] }, async ({ page, gamePage, fakeIssuer }) => {
  const issuer = await fakeIssuer("deny");
  await gamePage.goto(SEED);
  await gamePage.account.signInButton().click();
  await expectSettledSearch(page, `?van=${SEED}`);
  await expect(gamePage.account.signInButton()).toBeVisible();
  await expect(gamePage.seedLabel(SEED)).toBeVisible();
  expect(issuer.calls()).toEqual(["GET /oauth/authorize"]);
});

test("state bị sửa thì bị từ chối, không bao giờ đổi code lấy token", { tag: ["@TC-DUCKERID-008", "@smoke"] }, async ({
  page,
  gamePage,
  fakeIssuer,
}) => {
  const issuer = await fakeIssuer("tamper");
  await gamePage.goto(SEED);
  await gamePage.account.signInButton().click();
  await expect(gamePage.account.signInButton()).toBeVisible();
  await page.waitForLoadState("load");
  await expect.poll(() => search(page)).not.toMatch(/code=|state=/);
  expect(issuer.calls()).toEqual(["GET /oauth/authorize"]);
});

test("issuer không trả lời thì sau tối đa 15 giây về chưa đăng nhập", { tag: ["@TC-DUCKERID-009"] }, async ({ gamePage, fakeIssuer }) => {
  // AbortSignal.timeout runs on the browser's real clock (page.clock cannot fake it), so this one waits for real.
  test.setTimeout(60_000);
  await fakeIssuer("hang");
  await gamePage.goto(SEED);
  await gamePage.account.signInButton().click();
  await expect(gamePage.account.signingInButton()).toBeVisible();
  await expect(gamePage.account.signInButton()).toBeVisible({ timeout: 20_000 });
  await expect(gamePage.seedLabel(SEED)).toBeVisible();
});

test("sessionStorage bị chặn thì bấm đăng nhập không đưa đi đâu, game vẫn chạy", { tag: ["@TC-DUCKERID-010"] }, async ({
  page,
  gamePage,
  fakeIssuer,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new DOMException("blocked", "SecurityError");
      },
    });
  });
  const issuer = await fakeIssuer();
  await gamePage.goto(SEED);
  const url = page.url();
  await gamePage.account.signInButton().click();
  await expect(gamePage.account.signInButton()).toBeEnabled();
  expect(page.url()).toBe(url);
  expect(issuer.calls()).toEqual([]);
  await gamePage.tapStock();
  await expect(gamePage.cardsIn("waste")).toHaveCount(1);
});

test("nút đăng nhập rộng 44px, không đè số hiệu ván, menu nằm trong màn hình và không làm header nhảy", { tag: ["@TC-DUCKERID-011"] }, async ({
  page,
  gamePage,
  fakeIssuer,
}) => {
  await fakeIssuer();
  await gamePage.goto(SEED);
  const button = (await gamePage.account.signInButton().boundingBox())!;
  const seed = (await gamePage.seedLabel(SEED).boundingBox())!;
  expect(button.width).toBeGreaterThanOrEqual(44);
  expect(button.height).toBeGreaterThanOrEqual(44);
  const apart =
    button.x >= seed.x + seed.width || seed.x >= button.x + button.width || button.y >= seed.y + seed.height || seed.y >= button.y + button.height;
  expect(apart).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);

  await gamePage.account.signInButton().click();
  await expect(gamePage.account.trigger()).toBeVisible();
  const header = await gamePage.header().boundingBox();
  await gamePage.account.trigger().click();
  await expect(gamePage.account.menu()).toBeVisible();
  expect(await gamePage.header().boundingBox()).toEqual(header);
  const menu = (await gamePage.account.menu().boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(menu.x).toBeGreaterThanOrEqual(0);
  expect(menu.x + menu.width).toBeLessThanOrEqual(viewport.width);
  // The menu sits above every card: a click on its item reaches the item.
  await gamePage.account.signOutItem().click({ trial: true });
});
