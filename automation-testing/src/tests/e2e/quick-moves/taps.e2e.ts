import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED, SEED_ACE_ON_COLUMN_1, SEED_THREE_TO_COLUMN_7 } from "@/data/test-data";

// FR-14 (one tap puts a card up) · FR-05 (two taps look further) · US-03 · invariant #7.

const foundationCards = (gamePage: { page: import("@playwright/test").Page }) =>
  gamePage.page.locator('[data-card][data-card-pile^="foundation"]');

test("một chạm vào lá Át trên cột đưa nó lên đúng chồng đích", { tag: ["@TC-QUICKMOVES-001", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_ACE_ON_COLUMN_1);
  await gamePage.cardNamed("Cơ Át").click();
  // Hearts is the second foundation.
  await expect(gamePage.cardsIn("foundation-1")).toHaveCount(1);
  await expect(gamePage.cardsIn("tableau-0")).toHaveCount(0);
  await expect(gamePage.selectedCards()).toHaveCount(0);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "false");
});

test("một chạm vào lá Át trên bài đã rút cũng đưa nó lên", { tag: ["@TC-QUICKMOVES-002"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  const ace = await gamePage.drawUntilWasteShows(/^\S+ Át$/);
  expect(ace, "this deal shows an ace on the waste").not.toBeNull();
  await ace!.click();
  await expect(foundationCards(gamePage)).toHaveCount(1);
  await expect(gamePage.selectedCards()).toHaveCount(0);
});

test("một chạm vào lá chồng đích chưa nhận thì chỉ cầm lá lên, kể cả khi có cột nhận", { tag: ["@TC-QUICKMOVES-003", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  const before = await gamePage.snapshot();
  // Tép Ba fits column 7, but one tap only ever looks at the foundations.
  await gamePage.cardNamed("Tép Ba").click();
  await expect(gamePage.selectedCards()).toHaveCount(1);
  expect(await gamePage.snapshot()).toEqual(before);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
});

test("chạm đúp vào lá Át chỉ đi một nước, không cầm lá nằm dưới", { tag: ["@TC-QUICKMOVES-004"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  // Bích Át sits on top of column 4: the second click of the double tap lands on the card under it.
  await gamePage.cardNamed("Bích Át").dblclick();
  await expect(gamePage.cardsIn("foundation-0")).toHaveCount(1);
  await expect(gamePage.selectedCards()).toHaveCount(0);
  await expect(foundationCards(gamePage)).toHaveCount(1);
  await expect(gamePage.cardsIn("tableau-3")).toHaveCount(3);
});

test("chạm đúp đưa lá sang cột khi không chồng đích nào nhận", { tag: ["@TC-QUICKMOVES-005", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await gamePage.cardNamed("Tép Ba").dblclick();
  await expect(gamePage.cardNamed("Tép Ba")).toHaveAttribute("data-card-pile", "tableau-6");
  await expect(foundationCards(gamePage)).toHaveCount(0);
  await expect(gamePage.selectedCards()).toHaveCount(0);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "false");
});

test("chạm đúp lá Già khi có cột trống thì nó vào cột trống", { tag: ["@TC-QUICKMOVES-006"] }, async ({ page, gamePage }) => {
  // A one-tap move swallows taps for 300ms (the second half of a double tap); the clock steps past that window.
  await page.clock.install();
  await gamePage.goto(SEED_ACE_ON_COLUMN_1);
  await gamePage.cardNamed("Cơ Át").click();
  await expect(gamePage.cardsIn("tableau-0")).toHaveCount(0);
  await page.clock.runFor(400);

  await gamePage.cardNamed("Rô Già").dblclick();
  await expect(gamePage.cardNamed("Rô Già")).toHaveAttribute("data-card-pile", "tableau-0");
});

test("chạm đúp lá không có chỗ đi thì không có gì xảy ra và không ghi nước rỗng", { tag: ["@TC-QUICKMOVES-007", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  const before = await gamePage.snapshot();
  // Cơ Tám (column 1): no foundation, and no black nine face up anywhere.
  await gamePage.cardNamed("Cơ Tám").dblclick();
  expect(await gamePage.snapshot()).toEqual(before);
  await expect(gamePage.selectedCards()).toHaveCount(0);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
  await expect(gamePage.liveRegion()).toHaveText(copy.a11y.moveRejected);
});

test("\"Hoàn tất\" tắt khi còn lá úp và bấm vào cũng không làm gì", { tag: ["@TC-QUICKMOVES-008"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await expect(gamePage.autoCompleteButton()).toHaveAttribute("aria-disabled", "true");
  const before = await gamePage.snapshot();
  // aria-disabled, not disabled: the button still takes a click, which must do nothing.
  await gamePage.autoCompleteButton().click({ force: true });
  expect(await gamePage.snapshot()).toEqual(before);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
});
