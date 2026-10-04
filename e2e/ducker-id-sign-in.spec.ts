import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { openGame } from "./helpers";

/**
 * Optional Ducker ID sign-in (ADR-0012), end to end.
 *
 * Two builds, two servers (playwright.config.ts): the ordinary flag-OFF `out/` on the
 * default baseURL, and `out-auth/` (pnpm build:e2e-auth) with the flag ON and the fake
 * issuer http://ducker.test on port 4185. Nothing here reaches a real Ducker ID: every
 * request to the issuer is answered by page.route.
 */

const AUTH_URL = "http://127.0.0.1:4185";
const ISSUER = "http://ducker.test";
const SEED = 12345;
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "*",
};

type Fake = { authorizeMode: "ok" | "denied" | "tampered"; issued: string[] };

async function fakeIssuer(page: Page, mode: Fake["authorizeMode"] = "ok"): Promise<Fake> {
  const fake: Fake = { authorizeMode: mode, issued: [] };
  await page.route(`${ISSUER}/**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    fake.issued.push(`${request.method()} ${url.pathname}`);
    if (request.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: CORS });
      return;
    }
    if (url.pathname === "/oauth/authorize") {
      const back = new URL(url.searchParams.get("redirect_uri")!);
      if (fake.authorizeMode === "denied") {
        back.searchParams.set("error", "access_denied");
      } else {
        back.searchParams.set("code", "code-1");
      }
      back.searchParams.set(
        "state",
        fake.authorizeMode === "tampered" ? "not-the-state" : url.searchParams.get("state")!,
      );
      await route.fulfill({ status: 302, headers: { location: back.toString() } });
      return;
    }
    if (url.pathname === "/oauth/token") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: CORS,
        body: JSON.stringify({ access_token: "at-1", token_type: "Bearer", expires_in: 900 }),
      });
      return;
    }
    if (url.pathname === "/oauth/userinfo") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: CORS,
        body: JSON.stringify({ sub: "u1", name: "Lê Văn Anh Đức", email: "duc@ducker.id" }),
      });
      return;
    }
    await route.fulfill({ status: 404 });
  });
  return fake;
}

const signInButton = (page: Page) => page.getByRole("button", { name: "Đăng nhập" });
const accountButton = (page: Page) => page.getByRole("button", { name: "Tài khoản Ducker ID" });
/**
 * Next's router writes its hydration URL back into history AFTER the page is already
 * usable, so a single early look can pass by luck. Look, let hydration finish, look again.
 */
async function expectSettledSearch(page: Page, search: string) {
  await page.waitForLoadState("load");
  await expect.poll(() => new URL(page.url()).search).toBe(search);
  await page.waitForTimeout(600);
  expect(new URL(page.url()).search).toBe(search);
}

const seedLabel = (page: Page) => page.getByText(`Ván số ${SEED}`);

test.describe("flag off (the deployed build)", () => {
  test("renders no sign-in control and keeps storage empty", async ({ page }) => {
    await openGame(page);
    await expect(signInButton(page)).toHaveCount(0);
    await expect(accountButton(page)).toHaveCount(0);
    const stored = await page.evaluate(() => ({
      session: window.sessionStorage.length,
      local: window.localStorage.length,
    }));
    expect(stored).toEqual({ session: 0, local: 0 });
  });
});

test.describe("flag on, fake issuer", () => {
  test.use({ baseURL: AUTH_URL });

  test("signed out: nothing is requested and nothing stored before the click", async ({ page }) => {
    const fake = await fakeIssuer(page);
    await openGame(page, SEED);
    await expect(signInButton(page)).toBeVisible();
    expect(fake.issued).toEqual([]);
    expect(await page.evaluate(() => window.sessionStorage.length)).toBe(0);
  });

  test("signs in, shows the account, keeps ?van and a clean URL, signs out", async ({ page }) => {
    const noise: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") noise.push(`${m.type()}: ${m.text()}`);
    });
    page.on("pageerror", (e) => noise.push(`pageerror: ${e.message}`));
    const fake = await fakeIssuer(page);

    await openGame(page, SEED);
    await signInButton(page).click();
    await expect(accountButton(page)).toBeVisible();

    await expectSettledSearch(page, `?van=${SEED}`);
    await expect(seedLabel(page)).toBeVisible();
    expect(await page.evaluate(() => window.sessionStorage.length)).toBe(0);
    expect(fake.issued).toEqual([
      "GET /oauth/authorize",
      "POST /oauth/token",
      "GET /oauth/userinfo",
    ]);

    await accountButton(page).click();
    await expect(page.getByText("Lê Văn Anh Đức")).toBeVisible();
    await expect(page.getByText("duc@ducker.id")).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Mở hồ sơ Ducker ID" })).toHaveAttribute(
      "href",
      `${ISSUER}/profile`,
    );

    await page.keyboard.press("Escape");
    await expect(accountButton(page)).toHaveAttribute("aria-expanded", "false");
    await expect(accountButton(page)).toBeFocused();

    await accountButton(page).click();
    await page.getByRole("menuitem", { name: "Đăng xuất" }).click();
    await expect(signInButton(page)).toBeVisible();
    await expect(signInButton(page)).toBeFocused();
    expect(noise).toEqual([]);
  });

  test("a reload while signed in is signed out again", async ({ page }) => {
    await fakeIssuer(page);
    await openGame(page, SEED);
    await signInButton(page).click();
    await expect(accountButton(page)).toBeVisible();
    await page.reload();
    await expectSettledSearch(page, `?van=${SEED}`);
    await expect(signInButton(page)).toBeVisible();
    await expect(seedLabel(page)).toBeVisible();
  });

  test("denying at the issuer lands signed out, with the deal intact", async ({ page }) => {
    await fakeIssuer(page, "denied");
    await openGame(page, SEED);
    await signInButton(page).click();
    await expect(signInButton(page)).toBeVisible();
    await expectSettledSearch(page, `?van=${SEED}`);
    await expect(seedLabel(page)).toBeVisible();
  });

  test("a tampered state is refused without exchanging the code", async ({ page }) => {
    const fake = await fakeIssuer(page, "tampered");
    await openGame(page, SEED);
    await signInButton(page).click();
    await expect(signInButton(page)).toBeVisible();
    expect(fake.issued).toEqual(["GET /oauth/authorize"]);
    await page.waitForLoadState("load");
    await page.waitForTimeout(600);
    expect(new URL(page.url()).search).not.toMatch(/code=|state=/);
  });

  test("the control is a 44px target that overlaps nothing and never scrolls sideways", async ({
    page,
  }) => {
    await fakeIssuer(page);
    await openGame(page, SEED);
    const button = await signInButton(page).boundingBox();
    const seed = await seedLabel(page).boundingBox();
    expect(button).not.toBeNull();
    expect(seed).not.toBeNull();
    expect(button!.width).toBeGreaterThanOrEqual(44);
    expect(button!.height).toBeGreaterThanOrEqual(44);
    const apart =
      button!.x >= seed!.x + seed!.width ||
      seed!.x >= button!.x + button!.width ||
      button!.y >= seed!.y + seed!.height ||
      seed!.y >= button!.y + button!.height;
    expect(apart).toBe(true);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    await signInButton(page).click();
    await expect(accountButton(page)).toBeVisible();
    const headerBox = () => page.locator("header").boundingBox();
    const before = await headerBox();
    await accountButton(page).click();
    await expect(page.getByRole("menu")).toBeVisible();
    expect(await headerBox()).toEqual(before);
    const position = await page.getByRole("menu").evaluate((el) => getComputedStyle(el).position);
    expect(position).toBe("absolute");
    const menu = await page.getByRole("menu").boundingBox();
    const viewport = page.viewportSize()!;
    expect(menu!.x).toBeGreaterThanOrEqual(0);
    expect(menu!.x + menu!.width).toBeLessThanOrEqual(viewport.width);
  });
});
