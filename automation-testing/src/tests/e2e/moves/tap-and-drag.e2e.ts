import type { Page } from "@playwright/test";
import { expect, test } from "@/fixtures";
import {
  cardAt,
  cardCount,
  cardsIn,
  dropOnPile,
  openGame,
  slot,
  tapStock,
  topCard,
} from "@/pages/game.page";

/**
 * US-01, US-02, US-03, US-04, US-05. Tapping, dragging and the keyboard get the same
 * assertions on purpose: all three funnel into one MoveIntent (board-motion design
 * section 4), and these tests are what would catch them drifting apart.
 */

const undo = (page: Page) => page.getByRole("button", { name: "Hoàn lại" });

const foundationCards = (page: Page) => page.locator('[data-card][data-card-pile^="foundation"]');

const selected = (page: Page) => page.locator('[data-selected="true"]');

/** Cycles the stock until the named rank shows on the waste. */
async function drawUntilWasteLabelContains(page: Page, needle: string, limit = 26) {
  for (let i = 0; i < limit; i++) {
    const top = await topCard(page, "waste");
    if (top) {
      const label = await top.getAttribute("aria-label");
      if (label?.includes(needle)) return top;
    }
    await tapStock(page);
  }
  return null;
}

test.describe("keyboard play - FR-12", () => {
  test("arrows move between piles and space picks a card up and puts it down", async ({
    page,
  }) => {
    await openGame(page);
    await page.locator('[data-pile="tableau-0"]').focus();
    await page.keyboard.press("Space");
    await expect(selected(page)).toHaveCount(1);
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Space");
    // Legal or not, the gesture is over and nothing is left held.
    await expect(selected(page)).toHaveCount(0);
  });

  test("focus is always visible while walking the board - NFR-A11Y-02", async ({ page }) => {
    await openGame(page);
    await page.locator('[data-pile="tableau-0"]').focus();
    await page.keyboard.press("ArrowRight");
    // Focus moves in an effect after the state update, so this has to be an assertion
    // that retries rather than a one-shot read of document.activeElement.
    await expect(page.locator('[data-pile="tableau-1"]')).toBeFocused();
  });

  test("Enter looks everywhere, like a double tap", async ({ page }) => {
    await openGame(page, 1);
    const before = await cardCount(page, "tableau-6");
    await page.locator('[data-pile="tableau-1"]').focus();
    await expect(page.locator('[data-pile="tableau-1"]')).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(cardsIn(page, "tableau-6")).toHaveCount(before + 1);
  });
});
