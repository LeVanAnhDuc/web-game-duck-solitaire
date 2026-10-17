import { test, expect } from "@/fixtures";
import type { Page } from "@playwright/test";
import { SEED, SEED_THREE_TO_COLUMN_7 } from "@/data/test-data";
import type { GamePage } from "@/pages/game.page";

// NFR-DATA-01 · NFR-REL-04 · invariant #10 · ADR-0005 (no game is saved) · overview Non-Goals (no account, no ads,
// nothing stored). With the Ducker ID flag off - the deployed build - the bounded exceptions of ADR-0012 do not apply.

/** A round of ordinary play touching every control: draws, a recycle, tap and drag moves, undo, restart, draw mode. */
async function playARound(gamePage: GamePage): Promise<void> {
  await gamePage.tapStock(25); // a whole pass and the recycle
  await gamePage.cardNamed("Tép Ba").dblclick();
  await gamePage.undoButton().click();
  await gamePage.dragTo(gamePage.cardNamed("Tép Ba"), "tableau-6");
  await gamePage.restartButton().click();
  await gamePage.drawModeSelect().selectOption("3");
  await gamePage.tapStock(3);
  await gamePage.newGameButton().click();
  await gamePage.tapStock(2);
}

const stored = (page: Page) =>
  page.evaluate(() => ({
    local: window.localStorage.length,
    session: window.sessionStorage.length,
    cookie: document.cookie,
  }));

test("tải trang không gọi tới đâu ngoài chính trang", { tag: ["@TC-PRIVACY-001", "@smoke"] }, async ({ page, gamePage, urls }) => {
  const origin = new URL(urls.webUrl).origin;
  const outside: string[] = [];
  page.on("request", (r) => {
    if (new URL(r.url()).origin !== origin) outside.push(r.url());
  });
  await gamePage.goto(SEED);
  await page.waitForLoadState("networkidle");
  expect(outside).toEqual([]);
});

test("sau khi tải xong, chơi không gọi mạng lần nào nữa", { tag: ["@TC-PRIVACY-002", "@smoke"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await page.waitForLoadState("networkidle");
  // Only what happens AFTER the page is up: the document and its bundle are the point of a static site; a request
  // during play is not.
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await playARound(gamePage);
  expect(requests).toEqual([]);
});

test("không lưu gì trên máy người chơi: localStorage, sessionStorage, cookie đều trống", { tag: ["@TC-PRIVACY-003", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await playARound(gamePage);
  expect(await stored(page)).toEqual({ local: 0, session: 0, cookie: "" });
  expect(await page.context().cookies()).toEqual([]);
});

test("tải lại trang là quên ván đang chơi", { tag: ["@TC-PRIVACY-004"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  const dealt = await gamePage.snapshot();
  await gamePage.tapStock(3);
  await gamePage.reload();
  // The address still names the deal, so the same deal comes back - from its start, with no move remembered.
  expect(await gamePage.snapshot()).toEqual(dealt);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
});

test("console không có lỗi hay cảnh báo nào suốt một lượt chơi", { tag: ["@TC-PRIVACY-005", "@smoke"] }, async ({ page, gamePage }) => {
  const noise: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") noise.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => noise.push(`pageerror: ${e.message}`));
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await playARound(gamePage);
  expect(noise).toEqual([]);
});

test("mất mạng sau khi tải xong vẫn chơi tiếp được, kể cả ván mới", { tag: ["@TC-PRIVACY-006"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await page.waitForLoadState("networkidle");
  await page.context().setOffline(true);
  await playARound(gamePage);
  await expect(gamePage.cards()).toHaveCount(52);
  // The new deal kept draw-3: two draws are six cards.
  await expect(gamePage.cardsIn("waste")).toHaveCount(6);
  await page.context().setOffline(false);
});
