import { expect, type Locator, type Page } from "@playwright/test";

/**
 * The suite addresses the board through its Vietnamese accessible labels and through
 * the pile a card says it is in. Labels rather than test ids (design.md section 5): a
 * passing move assertion is then also proof the label a screen reader needs is there.
 *
 * Cards live in one flat layer now, not inside their pile, so a card is found by
 * `[data-card-pile]` rather than by nesting - and because DOM order is deck order, the
 * card on top of a pile is the one with the highest `data-index`, never "the last one".
 */

/** A deal the whole suite shares, so a failure is always reproducible - FR-13. */
export const FIXED_SEED = 20260904;

export type PileKey =
  | "stock"
  | "waste"
  | `foundation-${0 | 1 | 2 | 3}`
  | `tableau-${0 | 1 | 2 | 3 | 4 | 5 | 6}`;

export async function openGame(page: Page, seed: number = FIXED_SEED) {
  await page.goto(`/?van=${seed}`);
  // The deal happens on mount, so wait for a card rather than for load state.
  await expect(page.locator("[data-card]").first()).toBeVisible();
}

export const board = (page: Page) => page.getByRole("group", { name: "Bàn bài Klondike" });

/** The pile's own slot: its drop area, its name, its outline when empty. */
export const slot = (page: Page, key: PileKey) => page.locator(`[data-pile="${key}"]`);

export const tableau = (page: Page, index: number) =>
  slot(page, `tableau-${index}` as PileKey);
export const stockSlot = (page: Page) => slot(page, "stock");
export const wasteSlot = (page: Page) => slot(page, "waste");

/** The cards of a pile. Order is deck order, not stacking order - use topCard for that. */
export const cardsIn = (page: Page, key: PileKey) =>
  page.locator(`[data-card][data-card-pile="${key}"]`);

export const cardCount = (page: Page, key: PileKey) => cardsIn(page, key).count();

/** The playable card of a pile, or null when the pile is empty. */
export async function topCard(page: Page, key: PileKey): Promise<Locator | null> {
  const count = await cardCount(page, key);
  if (count === 0) return null;
  return page.locator(`[data-card][data-card-pile="${key}"][data-index="${count - 1}"]`);
}

/** The card at a known depth, counting from the bottom of the pile. */
export const cardAt = (page: Page, key: PileKey, index: number) =>
  page.locator(`[data-card][data-card-pile="${key}"][data-index="${index}"]`);

/**
 * Tapping the stock means tapping the card on top of it - the deck covers its own
 * slot, exactly as a real one does. Only an exhausted stock exposes the slot, and
 * that tap is the recycle.
 */
export async function tapStock(page: Page) {
  const top = await topCard(page, "stock");
  if (top) await top.click();
  else await stockSlot(page).click();
}

/**
 * Puts a held card down on a pile. A pile with cards on it covers its own slot, so the
 * tap has to land on the card sitting there - which is what a player does too. Only an
 * empty pile is tapped on the slot.
 */
export async function dropOnPile(page: Page, key: PileKey) {
  const top = await topCard(page, key);
  if (top) await top.click();
  else await slot(page, key).click();
}

/** Moves by dragging: the gesture that means "put it exactly here". */
export async function dragToPile(page: Page, source: Locator, to: PileKey) {
  const start = await source.boundingBox();
  const end = await slot(page, to).boundingBox();
  if (!start || !end) throw new Error(`cannot drag onto ${to}: no box`);
  await page.mouse.move(start.x + start.width / 2, start.y + 8);
  await page.mouse.down();
  // Two steps: the first crosses the 6px threshold that separates a tap from a drag.
  await page.mouse.move(start.x + start.width / 2 + 20, start.y + 28);
  await page.mouse.move(end.x + end.width / 2, end.y + Math.min(end.height / 2, 20), {
    steps: 4,
  });
  await page.mouse.up();
}

export const button = (page: Page, name: string) => page.getByRole("button", { name });
