import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED, SEED_THREE_TO_COLUMN_7, STOCK_AT_DEAL } from "@/data/test-data";

// FR-03 · US-01. The stock gives cards only through a draw, and takes them back only through a recycle.

test("chạm chồng rút thì một lá ngửa sang bài đã rút", { tag: ["@TC-MOVES-009", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.tapStock();
  await expect(gamePage.cardsIn("waste")).toHaveCount(1);
  await expect(gamePage.cardAt("waste", 0)).toHaveAttribute("data-face", "up");
  await expect(gamePage.cardsIn("stock")).toHaveCount(STOCK_AT_DEAL - 1);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "false");
});

test("chồng rút cạn thì chạm là lật lại toàn bộ, đúng thứ tự, lặp được mãi", { tag: ["@TC-MOVES-010", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  const dealtStock = (await gamePage.snapshot()).filter((c) => c.pile === "stock").sort((a, b) => a.index - b.index);

  for (let round = 0; round < 2; round++) {
    await gamePage.tapStock(STOCK_AT_DEAL);
    await expect(gamePage.cardsIn("stock")).toHaveCount(0);
    await expect(gamePage.cardsIn("waste")).toHaveCount(STOCK_AT_DEAL);
    // The last card drawn is on top of the waste: the card that was at the bottom of the stock.
    await expect(gamePage.cardAt("waste", STOCK_AT_DEAL - 1)).toHaveAttribute("data-card", dealtStock[0]!.id);

    await gamePage.tapStock(); // the exposed slot: the recycle
    await expect(gamePage.cardsIn("waste")).toHaveCount(0);
    const stock = (await gamePage.snapshot()).filter((c) => c.pile === "stock").sort((a, b) => a.index - b.index);
    // Turned back over, not reshuffled: the same order as at the deal, all face down.
    expect(stock.map((c) => c.id)).toEqual(dealtStock.map((c) => c.id));
    expect(stock.every((c) => c.face === "down")).toBe(true);
  }
});

test("chế độ rút 3 lá: mỗi lần chạm ba lá sang, chỉ lá trên cùng chơi được", { tag: ["@TC-MOVES-011"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.drawModeSelect().selectOption("3");
  await gamePage.tapStock();
  await expect(gamePage.cardsIn("waste")).toHaveCount(3);
  await expect(gamePage.cardsIn("stock")).toHaveCount(STOCK_AT_DEAL - 3);

  // The two cards under the top of the fan are not sources: tapping one picks nothing up.
  await gamePage.cardAt("waste", 0).click({ position: { x: 4, y: 10 } });
  await expect(gamePage.selectedCards()).toHaveCount(0);

  // 24 = 8 × 3: the eighth tap empties the stock exactly, the ninth recycles.
  await gamePage.tapStock(7);
  await expect(gamePage.cardsIn("stock")).toHaveCount(0);
  await expect(gamePage.cardsIn("waste")).toHaveCount(STOCK_AT_DEAL);
  await gamePage.tapStock();
  await expect(gamePage.cardsIn("stock")).toHaveCount(STOCK_AT_DEAL);
});

test("cầm một lá rồi chạm chồng rút là nước bị từ chối, không phải một lần rút", { tag: ["@TC-MOVES-012"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  const before = await gamePage.snapshot();
  await gamePage.cardNamed("Tép Ba").click();
  await gamePage.tapStock();
  expect(await gamePage.snapshot()).toEqual(before);
  await expect(gamePage.selectedCards()).toHaveCount(0);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
  await expect(gamePage.liveRegion()).toHaveText(copy.a11y.moveRejected);
});

test("bài đã rút không nhận lá nào", { tag: ["@TC-MOVES-013"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await gamePage.tapStock();
  const before = await gamePage.snapshot();
  await gamePage.cardNamed("Tép Ba").click();
  await gamePage.tapPile("waste");
  expect(await gamePage.snapshot()).toEqual(before);
  await expect(gamePage.liveRegion()).toHaveText(copy.a11y.moveRejected);
});
