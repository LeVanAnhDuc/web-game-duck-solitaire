import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED, SEED_RUN, SEED_THREE_TO_COLUMN_7 } from "@/data/test-data";

// FR-02 · US-01 · invariant #7 · NFR-REL-03. Tap a card, then a pile: the tap path of the one MoveIntent.

test("chạm một lá rồi chạm chồng hợp lệ thì bài chuyển sang", { tag: ["@TC-MOVES-001", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  const three = gamePage.cardNamed("Tép Ba");
  await three.click();
  await expect(gamePage.selectedCards()).toHaveCount(1);
  await gamePage.tapPile("tableau-6");

  await expect(three).toHaveAttribute("data-card-pile", "tableau-6");
  await expect(gamePage.cardsIn("tableau-6")).toHaveCount(8);
  await expect(gamePage.selectedCards()).toHaveCount(0);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "false");
  await expect(gamePage.liveRegion()).toHaveText("");
});

test("nước không hợp lệ không đổi gì, bỏ chọn và báo là bị từ chối", { tag: ["@TC-MOVES-002", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  const before = await gamePage.snapshot();
  // Tép Ba onto Cơ Đầm (column 1): wrong rank.
  await gamePage.cardNamed("Tép Ba").click();
  await gamePage.tapPile("tableau-0");

  expect(await gamePage.snapshot()).toEqual(before);
  await expect(gamePage.selectedCards()).toHaveCount(0);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
  await expect(gamePage.liveRegion()).toHaveText(copy.a11y.moveRejected);
});

test("chạm lại lá đang chọn thì bỏ chọn, không có nước đi", { tag: ["@TC-MOVES-003"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  const three = gamePage.cardNamed("Tép Ba");
  await three.click();
  await expect(gamePage.selectedCards()).toHaveCount(1);
  await expect(three).toHaveAttribute("aria-pressed", "true");
  await three.click();
  await expect(gamePage.selectedCards()).toHaveCount(0);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
});

test("chạm lá khác trong cùng cột khi đang chọn thì đổi lựa chọn, không phải nước đi", { tag: ["@TC-MOVES-004"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED_RUN);
  // Build a two-card run on column 4: Cơ Bảy carrying Bích Sáu.
  await gamePage.cardNamed("Bích Sáu").click();
  await gamePage.tapPile("tableau-3");
  await expect(gamePage.cardsIn("tableau-3")).toHaveCount(5);
  const before = await gamePage.snapshot();

  await gamePage.cardNamed("Bích Sáu").click();
  await expect(gamePage.selectedCards()).toHaveCount(1);
  await gamePage.tapCard(gamePage.cardNamed("Cơ Bảy"));

  // The run from Cơ Bảy down is held now - two cards - and nothing moved.
  await expect(gamePage.selectedCards()).toHaveCount(2);
  expect(await gamePage.snapshot()).toEqual(before);
});

test("chạm vào khoảng trống giữa hai chồng thì bỏ chọn, không có nước đi", { tag: ["@TC-MOVES-005"] }, async ({ gamePage }) => {
  // BUG: defects/moves.md#bug-moves-03
  test.fail();
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  const before = await gamePage.snapshot();
  await gamePage.cardNamed("Tép Ba").click();
  await expect(gamePage.selectedCards()).toHaveCount(1);

  await gamePage.tapAt(await gamePage.gapBetween("tableau-4", "tableau-5"));

  await expect(gamePage.selectedCards()).toHaveCount(0);
  expect(await gamePage.snapshot()).toEqual(before);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
});

test("Escape đặt lá đang cầm xuống", { tag: ["@TC-MOVES-006"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await gamePage.cardNamed("Tép Ba").click();
  await expect(gamePage.selectedCards()).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(gamePage.selectedCards()).toHaveCount(0);
});

test("lá úp không chọn được", { tag: ["@TC-MOVES-007"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  // Column 7: six face-down cards under Tép Mười. A face-down card is never a source.
  await gamePage.cardAt("tableau-6", 0).click({ position: { x: 10, y: 4 } });
  await expect(gamePage.selectedCards()).toHaveCount(0);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
});

test("bỏ lá cuối cùng đang ngửa khỏi cột thì lá úp bên dưới lật lên", { tag: ["@TC-MOVES-008", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await expect(gamePage.cardAt("tableau-1", 0)).toHaveAttribute("data-face", "down");
  await gamePage.cardNamed("Tép Ba").click();
  await gamePage.tapPile("tableau-6");
  await expect(gamePage.cardsIn("tableau-1")).toHaveCount(1);
  await expect(gamePage.cardAt("tableau-1", 0)).toHaveAttribute("data-face", "up");
  await expect(gamePage.cardAt("tableau-1", 0)).toHaveAttribute("aria-label", "Tép Sáu");
});
