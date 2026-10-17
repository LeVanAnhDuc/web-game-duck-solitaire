import { test, expect } from "@/fixtures";
import { SEED, SEED_THREE_TO_COLUMN_7, STOCK_AT_DEAL } from "@/data/test-data";

// FR-07 · FR-09 (Chơi lại) · US-04 · US-05 · ADR-0001 (undo is a replay of the history from the seed).

test("hoàn lại từng nước về tận lúc chia, đến đầu ván thì nút tắt", { tag: ["@TC-UNDORESTART-001", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  const dealt = await gamePage.snapshot();
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");

  // 30 moves: a whole pass of the stock, its recycle, five more draws and a tableau move - more than any fixed cap.
  await gamePage.tapStock(STOCK_AT_DEAL + 1 + 4);
  await gamePage.cardNamed("Tép Ba").dblclick();
  await expect(gamePage.cardNamed("Tép Ba")).toHaveAttribute("data-card-pile", "tableau-6");

  for (let i = 0; i < 29; i++) await gamePage.undoButton().click();
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "false");
  await gamePage.undoButton().click();

  expect(await gamePage.snapshot()).toEqual(dealt);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
});

test("hoàn lại một nước trả bàn về đúng thế trước nước đó", { tag: ["@TC-UNDORESTART-002"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.tapStock(3);
  const beforeMove = await gamePage.snapshot();
  await gamePage.tapStock();
  await gamePage.undoButton().click();
  expect(await gamePage.snapshot()).toEqual(beforeMove);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "false");
});

test("hoàn lại qua nước đã lật một lá thì lá đó úp trở lại", { tag: ["@TC-UNDORESTART-003", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await gamePage.cardNamed("Tép Ba").dblclick();
  await expect(gamePage.cardAt("tableau-1", 0)).toHaveAttribute("data-face", "up");
  await gamePage.undoButton().click();
  await expect(gamePage.cardAt("tableau-1", 0)).toHaveAttribute("data-face", "down");
  await expect(gamePage.cardAt("tableau-1", 1)).toHaveAttribute("aria-label", "Tép Ba");
});

test("hoàn lại một lần rút 3 lá trả cả ba lá về chồng rút đúng thứ tự", { tag: ["@TC-UNDORESTART-004"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.drawModeSelect().selectOption("3");
  const dealt = await gamePage.snapshot();
  await gamePage.tapStock();
  const afterFirst = await gamePage.snapshot();
  await gamePage.tapStock();
  await gamePage.undoButton().click();
  expect(await gamePage.snapshot()).toEqual(afterFirst);
  await gamePage.undoButton().click();
  expect(await gamePage.snapshot()).toEqual(dealt);
});

test("hoàn lại lần lật lại chồng rút trả bài đã rút về như cũ", { tag: ["@TC-UNDORESTART-005"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.tapStock(STOCK_AT_DEAL);
  const exhausted = await gamePage.snapshot();
  await gamePage.tapStock(); // the recycle
  await expect(gamePage.cardsIn("waste")).toHaveCount(0);
  await gamePage.undoButton().click();
  expect(await gamePage.snapshot()).toEqual(exhausted);
});

test("bấm hoàn lại khi đang cầm một lá thì bỏ lựa chọn", { tag: ["@TC-UNDORESTART-006"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await gamePage.tapStock();
  await gamePage.cardNamed("Tép Ba").click();
  await expect(gamePage.selectedCards()).toHaveCount(1);
  await gamePage.undoButton().click();
  await expect(gamePage.selectedCards()).toHaveCount(0);
  await expect(gamePage.cardsIn("waste")).toHaveCount(0);
});

test("\"Chơi lại\" chia lại đúng ván đang chơi từ đầu, giữ số hiệu và chế độ rút", { tag: ["@TC-UNDORESTART-007", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await gamePage.drawModeSelect().selectOption("3");
  const dealt = await gamePage.snapshot();
  await gamePage.tapStock(2);
  await gamePage.cardNamed("Bích Át").click();
  expect(await gamePage.snapshot()).not.toEqual(dealt);

  await gamePage.restartButton().click();

  expect(await gamePage.snapshot()).toEqual(dealt);
  await expect(gamePage.seedLabel(SEED)).toBeVisible();
  expect(await gamePage.seedInUrl()).toBe(String(SEED));
  await expect(gamePage.drawModeSelect()).toHaveValue("3");
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
  await expect(gamePage.drawModeDialog.root()).toHaveCount(0);
});

test("hoàn lại và chơi lại không đổi số hiệu ván trên địa chỉ", { tag: ["@TC-UNDORESTART-008"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.tapStock(2);
  await gamePage.undoButton().click();
  expect(await gamePage.seedInUrl()).toBe(String(SEED));
  await gamePage.restartButton().click();
  expect(await gamePage.seedInUrl()).toBe(String(SEED));
  await expect(gamePage.seedLabel(SEED)).toBeVisible();
});
