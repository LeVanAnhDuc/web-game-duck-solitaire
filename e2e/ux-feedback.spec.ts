import { expect, test } from "./fixtures";
import { FIXED_SEED, board, button, openGame, slot, stockSlot, tapStock } from "./helpers";

/**
 * The fixes that came out of the persona review on 2026-09-12.
 * See docs/ux-reviews/2026-09-12-duck-solitaire.md and docs/specs/ux-feedback-2026-09/.
 *
 * These run with motion OFF, which is the default of this suite - and for F-02 that is
 * not incidental, it is the whole point: reduced motion is exactly the setting where
 * the flash and the shake do not happen, so the live region is the only channel left.
 */

/** A deal where the Ace of Hearts is face up on the first column at deal time. */
const ACE_ON_COLUMN_1 = 66725;

test.describe("F-01 · a held card is visibly held", () => {
  test("carries a ring, not just a shadow in the dark", async ({ page }) => {
    await openGame(page);

    // The stock accepts nothing, so picking a card up and aiming at it is the one move
    // guaranteed to be refused on any deal. Here we only need the pick-up.
    await page.keyboard.press("Tab");
    await page.keyboard.press(" ");

    const held = page.locator('[data-selected="true"]').first();
    await expect(held).toHaveCount(1);
    await expect(held).toHaveClass(/card-selected/);

    // The ring has to be a real painted colour, not an inherited "none". Until the fix
    // this computed to a lone dark shadow and a player could not see it at all.
    const shadow = await held.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).toContain("255, 209, 102"); // --ring-selected #FFD166
  });
});

test.describe("F-02 · a refused move says so", () => {
  test("announces itself even with motion switched off", async ({ page }) => {
    await openGame(page);

    const live = page.locator('[role="status"][aria-live="polite"]');
    await expect(live).toHaveText("");

    // Walk the cursor to an empty foundation and try to pick a card up from it. There
    // is nothing to pick up, so it is refused - on every deal and at every width.
    //
    // Deliberately keyboard-only. A tap aimed at the stock also gets refused, but only
    // at the widths where the tap lands on a card; see backlog.md, "cầm bài rồi chạm
    // chồng rút ở 320/375px". A test for the announcement must not depend on that.
    await page.keyboard.press("Tab"); // tableau-0
    await page.keyboard.press("ArrowUp"); // stock
    await page.keyboard.press("ArrowRight"); // waste
    await page.keyboard.press("ArrowRight"); // foundation-0, empty at deal
    await page.keyboard.press(" ");

    await expect(live).toHaveText("Nước đi không hợp lệ");
  });
});

test.describe("F-03 · an exhausted stock does not look like an empty foundation", () => {
  test("shows the recycle mark, and renames itself", async ({ page }) => {
    await openGame(page);

    await expect(stockSlot(page).locator("[data-recyclable]")).toHaveCount(0);

    // 24 cards in the stock at a draw-1 deal; empty it.
    for (let i = 0; i < 24; i += 1) await tapStock(page);

    await expect(stockSlot(page).locator("[data-recyclable]")).toHaveCount(1);
    await expect(
      page.getByRole("group", { name: "Chồng rút đã cạn, chạm để lật lại" }),
    ).toHaveCount(1);

    // An empty foundation must NOT carry the mark: it means "tapping here does
    // something", and tapping an empty foundation does nothing.
    await expect(slot(page, "foundation-0").locator("[data-recyclable]")).toHaveCount(0);

    // And the mark is an invitation that works.
    await tapStock(page);
    await expect(stockSlot(page).locator("[data-recyclable]")).toHaveCount(0);
  });
});

test.describe("F-04 + F-05 · the page says what it is", () => {
  test("names itself and explains the seed on screen, not on hover", async ({ page }) => {
    await openGame(page);

    await expect(page.getByText("Duck Solitaire")).toBeVisible();
    await expect(page.getByText(`Ván số ${FIXED_SEED}`)).toBeVisible();
    await expect(page.getByText("Cùng số hiệu ván luôn cho cùng thế bài")).toBeVisible();
    await expect(page.getByText("Không tài khoản · không quảng cáo · không lưu gì")).toBeVisible();

    // The hint used to live in a `title`, which a phone can never show.
    await expect(page.locator("header [title]")).toHaveCount(0);
  });
});

test.describe("F-06 · the keyboard map reaches the eye", () => {
  test("stays hidden for a mouse, appears for a keyboard", async ({ page }) => {
    await openGame(page);

    const map = page.locator(".keyboard-map");
    await expect(map).toBeHidden();

    await page.keyboard.press("Tab");
    await expect(map).toBeVisible();
    await expect(map).toContainText("phím mũi tên");
  });
});

test.describe("F-07 · the cursor follows the card", () => {
  test("lands on the pile the card flew to", async ({ page }) => {
    await openGame(page, ACE_ON_COLUMN_1);

    await page.keyboard.press("Tab");
    await expect(slot(page, "tableau-0")).toHaveAttribute("tabindex", "0");

    // Enter sends the Ace of Hearts up. Hearts is the second foundation.
    await page.keyboard.press("Enter");

    await expect(page.locator('[data-card-pile="foundation-1"]')).toHaveCount(1);
    await expect(slot(page, "foundation-1")).toHaveAttribute("tabindex", "0");
    await expect(slot(page, "tableau-0")).toHaveAttribute("tabindex", "-1");
  });
});

test.describe("F-09 · the confirm dialog can be escaped", () => {
  test("Escape closes it and keeps the game", async ({ page }) => {
    await openGame(page);
    await tapStock(page); // a move, so changing draw mode has something to warn about

    await page.getByLabel("Chế độ rút").selectOption("3");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Focus is inside the dialog, on the safe choice - not left behind it.
    await expect(page.getByRole("button", { name: "Giữ ván hiện tại" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);

    // Escape means "keep my game": the mode is unchanged and so is the board.
    await expect(page.getByLabel("Chế độ rút")).toHaveValue("1");
    await expect(page.getByLabel("Chế độ rút")).toBeFocused();
    await expect(button(page, "Hoàn lại")).toHaveAttribute("aria-disabled", "false");
  });
});

test.describe("F-10 · the tab has an icon", () => {
  test("declares one, so the browser stops guessing at /favicon.ico", async ({ page }) => {
    await openGame(page);
    const href = await page.locator('link[rel="icon"]').first().getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toContain("icon");
  });
});

test.describe("the board still works", () => {
  test("keeps its accessible name and its seven columns", async ({ page }) => {
    await openGame(page);
    await expect(board(page)).toBeVisible();
    for (let i = 0; i < 7; i += 1) await expect(slot(page, `tableau-${i}`)).toBeVisible();
  });
});
