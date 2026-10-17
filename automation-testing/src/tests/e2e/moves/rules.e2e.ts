import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED, SEED_ACE_AND_TWO, SEED_ACE_ON_COLUMN_1, SEED_RUN } from "@/data/test-data";

// FR-02 · klondike design §1 (what each pile takes and gives). Each rule is played through the UI on a deal picked so
// the situation is on the board at the start (src/data/test-data.ts).

test("cột trống chỉ nhận lá Già", { tag: ["@TC-MOVES-014"] }, async ({ page, gamePage }) => {
  // A one-tap move swallows taps for 300ms (the second half of a double tap); the clock steps past that window.
  await page.clock.install();
  await gamePage.goto(SEED_ACE_ON_COLUMN_1);
  await gamePage.cardNamed("Cơ Át").click(); // one tap: up to its foundation, column 1 is empty
  await expect(gamePage.cardsIn("tableau-0")).toHaveCount(0);
  await page.clock.runFor(400);

  // Rô Năm (column 2) is not a king: refused.
  await gamePage.cardNamed("Rô Năm").click();
  await gamePage.tapPile("tableau-0");
  await expect(gamePage.cardsIn("tableau-0")).toHaveCount(0);
  await expect(gamePage.liveRegion()).toHaveText(copy.a11y.moveRejected);

  // Rô Già (top of column 7) is: it moves, and column 7's next card turns over.
  await gamePage.cardNamed("Rô Già").click();
  await gamePage.tapPile("tableau-0");
  await expect(gamePage.cardNamed("Rô Già")).toHaveAttribute("data-card-pile", "tableau-0");
  await expect(gamePage.cardAt("tableau-6", 5)).toHaveAttribute("data-face", "up");
});

test("chồng đích chỉ nhận đúng chất, bắt đầu từ Át, tăng đúng một bậc", { tag: ["@TC-MOVES-015"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_ACE_AND_TWO);
  // Bích Hai onto the empty Spades foundation: not an ace, refused.
  await gamePage.cardNamed("Bích Hai").click();
  await gamePage.tapPile("foundation-0");
  await expect(gamePage.cardsIn("foundation-0")).toHaveCount(0);
  await expect(gamePage.liveRegion()).toHaveText(copy.a11y.moveRejected);

  // Rô Át onto the Spades foundation (wrong suit), by dragging - a drag names exactly one pile.
  await gamePage.dragTo(gamePage.cardNamed("Rô Át"), "foundation-0");
  await expect(gamePage.cardsIn("foundation-0")).toHaveCount(0);

  // Onto its own (Diamonds, the third): accepted.
  await gamePage.dragTo(gamePage.cardNamed("Rô Át"), "foundation-2");
  await expect(gamePage.cardsIn("foundation-2")).toHaveCount(1);
});

test("lá trên cùng của chồng đích được đưa về cột", { tag: ["@TC-MOVES-016"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_ACE_AND_TWO);
  await gamePage.cardNamed("Rô Át").click(); // one tap: up to the Diamonds foundation
  await expect(gamePage.cardsIn("foundation-2")).toHaveCount(1);

  // Back down onto Bích Hai (column 4): one lower, other colour.
  await gamePage.dragTo(gamePage.cardNamed("Rô Át"), "tableau-3");
  await expect(gamePage.cardsIn("foundation-2")).toHaveCount(0);
  await expect(gamePage.cardNamed("Rô Át")).toHaveAttribute("data-card-pile", "tableau-3");
});

test("cột chỉ nhận lá kém một bậc và khác màu", { tag: ["@TC-MOVES-017"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  const before = await gamePage.snapshot();
  // Rô Tám (column 3) onto Cơ Tám (column 1): same rank, same colour.
  await gamePage.cardNamed("Rô Tám").click();
  await gamePage.tapPile("tableau-0");
  // Tép Bốn (column 2) onto Tép Mười (column 7): wrong rank, same colour.
  await gamePage.cardNamed("Tép Bốn").click();
  await gamePage.tapPile("tableau-6");
  expect(await gamePage.snapshot()).toEqual(before);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
});

test("một dãy đã xếp đúng đi cùng nhau khi chọn lá đầu dãy", { tag: ["@TC-MOVES-018", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_RUN);
  await gamePage.cardNamed("Bích Sáu").click();
  await gamePage.tapPile("tableau-3"); // onto Cơ Bảy
  await expect(gamePage.cardNamed("Cơ Bảy")).toHaveAttribute("aria-label", copy.card.label("hearts", 7, 2));

  // Cơ Bảy carries Bích Sáu onto Bích Tám (column 1).
  await gamePage.tapCard(gamePage.cardNamed("Cơ Bảy"));
  await expect(gamePage.selectedCards()).toHaveCount(2);
  await gamePage.tapPile("tableau-0");

  await expect(gamePage.cardsIn("tableau-0")).toHaveCount(3);
  await expect(gamePage.cardAt("tableau-0", 1)).toHaveAttribute("aria-label", /^Cơ Bảy/);
  await expect(gamePage.cardAt("tableau-0", 2)).toHaveAttribute("aria-label", /^Bích Sáu/);
  await expect(gamePage.cardsIn("tableau-3")).toHaveCount(3);
  await expect(gamePage.cardAt("tableau-3", 2)).toHaveAttribute("data-face", "up");
});
