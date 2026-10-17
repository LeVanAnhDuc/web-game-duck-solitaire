import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import {
  cardAt,
  cardCount,
  cardsIn,
  dropOnPile,
  openGame,
  slot,
  tapStock,
  topCard,
} from "./helpers";

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

test.describe("drawing from the stock - FR-03", () => {
  test("a tap moves a card to the waste, and the stock recycles when it runs out", async ({
    page,
  }) => {
    await openGame(page);
    await tapStock(page);
    await expect(cardsIn(page, "waste")).toHaveCount(1);

    // 24 stock cards, one at a time; the 25th tap lands on the exposed slot and is
    // the recycle.
    for (let i = 0; i < 23; i++) await tapStock(page);
    await expect(cardsIn(page, "stock")).toHaveCount(0);
    await tapStock(page);
    await expect(cardsIn(page, "waste")).toHaveCount(0);
    await expect(cardsIn(page, "stock")).toHaveCount(24);
  });
});

test.describe("one tap puts a card up - FR-14", () => {
  test("tapping an ace once sends it to its foundation", async ({ page }) => {
    await openGame(page);
    await expect(foundationCards(page)).toHaveCount(0);

    const ace = await drawUntilWasteLabelContains(page, "Át");
    expect(ace, "this deal never shows an ace in the stock").not.toBeNull();
    await ace!.click();

    await expect(foundationCards(page)).toHaveCount(1);
    await expect(selected(page)).toHaveCount(0);
  });

  test("tapping a card with nowhere to go up only picks it up", async ({ page }) => {
    // Seed 1, column 2: a black three, which no foundation can take yet.
    await openGame(page, 1);
    const three = await topCard(page, "tableau-1");
    await three!.click();
    await expect(selected(page)).toHaveCount(1);
    await expect(foundationCards(page)).toHaveCount(0);
    await expect(undo(page)).toHaveAttribute("aria-disabled", "true");
  });

  test("a second tap right after a one-tap move does not make a second move", async ({
    page,
  }) => {
    // The ace leaves the spot being tapped, so the second half of a double tap lands
    // on the card underneath. Picking that up is harmless; being one tap from moving
    // it is not.
    await openGame(page);
    const ace = await drawUntilWasteLabelContains(page, "Át");
    await ace!.dblclick();
    await expect(foundationCards(page)).toHaveCount(1);
    await expect(selected(page)).toHaveCount(0);
  });
});

test.describe("two taps look further - FR-05", () => {
  test("a double tap moves a card to a tableau column when no foundation wants it", async ({
    page,
  }) => {
    // Seed 1: the black three on column 2 fits column 7 and no foundation.
    await openGame(page, 1);
    const before = await cardCount(page, "tableau-6");
    const three = await topCard(page, "tableau-1");
    await three!.dblclick();

    await expect(cardsIn(page, "tableau-6")).toHaveCount(before + 1);
    await expect(foundationCards(page)).toHaveCount(0);
    await expect(selected(page)).toHaveCount(0);
    await expect(undo(page)).not.toHaveAttribute("aria-disabled", "true");
  });
});

test.describe("moving cards", () => {
  test("tapping a card and then a pile plays the move - US-01", async ({ page }) => {
    await openGame(page);
    const before = await cardCount(page, "tableau-6");
    const top = await topCard(page, "tableau-6");
    await top!.click();
    await dropOnPile(page, "tableau-0");
    await expect(selected(page)).toHaveCount(0);
    const after = await cardCount(page, "tableau-6");
    expect([before, before - 1]).toContain(after);
  });

  test("dragging plays the same move tapping does - US-02", async ({ page }) => {
    await openGame(page);
    const ace = await drawUntilWasteLabelContains(page, "Át");
    // A drop says exactly one pile, so it has to be the foundation of the ace's own
    // suit - unlike a tap, which asks the engine to find one.
    const label = (await ace!.getAttribute("aria-label")) ?? "";
    const suits = ["Bích", "Cơ", "Rô", "Tép"];
    const index = suits.findIndex((suit) => label.startsWith(suit));
    expect(index).toBeGreaterThanOrEqual(0);

    const box = await ace!.boundingBox();
    const target = await slot(page, `foundation-${index}` as "foundation-0").boundingBox();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + 8);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 + 20, box!.y + 28);
    await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2, {
      steps: 4,
    });
    await page.mouse.up();
    await expect(foundationCards(page)).toHaveCount(1);
  });

  test("an illegal move changes nothing - invariant #7", async ({ page }) => {
    await openGame(page);
    const snapshot = () =>
      page
        .locator("[data-card]")
        .evaluateAll((els) =>
          els.map((e) => `${e.getAttribute("data-card")}:${e.getAttribute("data-card-pile")}`),
        );
    const before = await snapshot();
    // Nothing may ever be dropped onto the stock.
    const top = await topCard(page, "tableau-6");
    await top!.click();
    await tapStock(page);
    expect(await snapshot()).toEqual(before);
    await expect(undo(page)).toHaveAttribute("aria-disabled", "true");
  });

  test("Escape puts a picked-up card back down - NFR-REL-03", async ({ page }) => {
    await openGame(page, 1);
    const three = await topCard(page, "tableau-1");
    await three!.click();
    await expect(selected(page)).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(selected(page)).toHaveCount(0);
  });
});

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

test.describe("undo and restart - US-04, US-05", () => {
  test("undo walks all the way back to the deal", async ({ page }) => {
    await openGame(page);
    const snapshot = () =>
      page
        .locator("[data-card]")
        .evaluateAll((els) =>
          els.map(
            (e) =>
              `${e.getAttribute("data-card")}:${e.getAttribute("data-card-pile")}:${e.getAttribute("data-face")}`,
          ),
        );
    const dealt = await snapshot();

    for (let i = 0; i < 6; i++) await tapStock(page);
    expect(await snapshot()).not.toEqual(dealt);

    for (let i = 0; i < 6; i++) await undo(page).click();
    expect(await snapshot()).toEqual(dealt);
    await expect(undo(page)).toHaveAttribute("aria-disabled", "true");
  });

  test("undo turns a revealed card back over", async ({ page }) => {
    // The most silent way this can go wrong: the board is right but a card that was
    // flipped stays face up.
    await openGame(page, 1);
    const three = await topCard(page, "tableau-1");
    await three!.dblclick();
    await expect(cardAt(page, "tableau-1", 0)).toHaveAttribute("data-face", "up");
    await undo(page).click();
    await expect(cardAt(page, "tableau-1", 0)).toHaveAttribute("data-face", "down");
  });

  test("restart redeals the same game, not a different one", async ({ page }) => {
    await openGame(page);
    const ids = () =>
      page
        .locator("[data-card]")
        .evaluateAll((els) =>
          els.map((e) => `${e.getAttribute("data-card")}:${e.getAttribute("data-card-pile")}`),
        );
    const dealt = await ids();
    for (let i = 0; i < 4; i++) await tapStock(page);
    await page.getByRole("button", { name: "Chơi lại" }).click();
    expect(await ids()).toEqual(dealt);
  });

  test("a new game changes the deal number in the address - FR-13", async ({ page }) => {
    await openGame(page, 777);
    await page.getByRole("button", { name: "Ván mới" }).click();
    await expect(page).not.toHaveURL(/van=777\b/);
    await expect(page).toHaveURL(/van=\d+/);
  });
});

test.describe("changing draw mode asks first - US-05", () => {
  test("it redeals only after the player agrees", async ({ page }) => {
    await openGame(page);
    await tapStock(page);
    await page.getByLabel("Chế độ rút").selectOption("3");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Giữ ván hiện tại" }).click();
    await expect(cardsIn(page, "waste")).toHaveCount(1);

    await page.getByLabel("Chế độ rút").selectOption("3");
    await page.getByRole("dialog").getByRole("button", { name: "Đổi và chia lại" }).click();
    await expect(cardsIn(page, "waste")).toHaveCount(0);
    await tapStock(page);
    await expect(cardsIn(page, "waste")).toHaveCount(3);
  });

  test("no dialog before the first move, because nothing would be lost", async ({ page }) => {
    await openGame(page);
    await page.getByLabel("Chế độ rút").selectOption("3");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
