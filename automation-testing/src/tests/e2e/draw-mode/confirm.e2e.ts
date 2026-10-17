import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED, STOCK_AT_DEAL } from "@/data/test-data";

// FR-10 · US-05 ("Đổi chế độ rút giữa ván → phải nói rõ là ván sẽ bắt đầu lại, và phải hỏi trước") · F-09.

test("trước nước đầu tiên, đổi chế độ rút có hiệu lực ngay, không hỏi", { tag: ["@TC-DRAWMODE-001", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  const dealt = await gamePage.snapshot();
  await gamePage.drawModeSelect().selectOption("3");
  await expect(gamePage.drawModeDialog.root()).toHaveCount(0);
  await expect(gamePage.drawModeSelect()).toHaveValue("3");
  // The same deal: the number decides the deal, the mode only how the stock is drawn.
  expect(await gamePage.snapshot()).toEqual(dealt);
  await gamePage.tapStock();
  await expect(gamePage.cardsIn("waste")).toHaveCount(3);
});

test("giữa ván, đổi chế độ rút thì hỏi trước và nói rõ ván sẽ bắt đầu lại", { tag: ["@TC-DRAWMODE-002", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await gamePage.tapStock();
  await gamePage.drawModeSelect().selectOption("3");
  const dialog = gamePage.drawModeDialog.root();
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(dialog).toContainText(copy.confirm.drawModeTitle);
  await expect(dialog).toContainText(copy.confirm.drawModeBody);
  // Nothing has happened yet: the drawn card is still on the waste.
  await expect(gamePage.cardsIn("waste")).toHaveCount(1);
});

test("\"Giữ ván hiện tại\" giữ nguyên ván và chế độ cũ", { tag: ["@TC-DRAWMODE-003"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.tapStock();
  const before = await gamePage.snapshot();
  await gamePage.drawModeSelect().selectOption("3");
  await gamePage.drawModeDialog.keepButton().click();

  await expect(gamePage.drawModeDialog.root()).toHaveCount(0);
  await expect(gamePage.drawModeSelect()).toHaveValue("1");
  expect(await gamePage.snapshot()).toEqual(before);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "false");
  await gamePage.tapStock();
  await expect(gamePage.cardsIn("waste")).toHaveCount(2);
});

test("\"Đổi và chia lại\" chia lại đúng ván này ở chế độ mới", { tag: ["@TC-DRAWMODE-004", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  const dealt = await gamePage.snapshot();
  await gamePage.tapStock();
  await gamePage.drawModeSelect().selectOption("3");
  await gamePage.drawModeDialog.accept();

  await expect(gamePage.drawModeDialog.root()).toHaveCount(0);
  await expect(gamePage.drawModeSelect()).toHaveValue("3");
  expect(await gamePage.snapshot()).toEqual(dealt);
  await expect(gamePage.seedLabel(SEED)).toBeVisible();
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
  await gamePage.tapStock();
  await expect(gamePage.cardsIn("waste")).toHaveCount(3);
  await expect(gamePage.cardsIn("stock")).toHaveCount(STOCK_AT_DEAL - 3);
});

test("hỏi lại sau khi đã giữ ván, rồi đồng ý thì mới chia lại", { tag: ["@TC-DRAWMODE-005"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.tapStock();
  await gamePage.drawModeSelect().selectOption("3");
  await gamePage.drawModeDialog.keepButton().click();
  await expect(gamePage.cardsIn("waste")).toHaveCount(1);

  await gamePage.drawModeSelect().selectOption("3");
  await expect(gamePage.drawModeDialog.root()).toBeVisible();
  await gamePage.drawModeDialog.accept();
  await expect(gamePage.cardsIn("waste")).toHaveCount(0);
  await gamePage.tapStock();
  await expect(gamePage.cardsIn("waste")).toHaveCount(3);
});

test("Escape đóng hộp thoại, giữ ván; tiêu điểm vào lựa chọn an toàn rồi trả về ô chế độ rút", { tag: ["@TC-DRAWMODE-006"] }, async ({
  page,
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await gamePage.tapStock();
  await gamePage.drawModeSelect().selectOption("3");
  await expect(gamePage.drawModeDialog.root()).toBeVisible();
  await expect(gamePage.drawModeDialog.keepButton()).toBeFocused();

  await page.keyboard.press("Escape");

  await expect(gamePage.drawModeDialog.root()).toHaveCount(0);
  await expect(gamePage.drawModeSelect()).toHaveValue("1");
  await expect(gamePage.drawModeSelect()).toBeFocused();
  await expect(gamePage.cardsIn("waste")).toHaveCount(1);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "false");
});

test("đổi từ rút 3 về rút 1 giữa ván cũng hỏi, và chia lại ở rút 1", { tag: ["@TC-DRAWMODE-007"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.drawModeSelect().selectOption("3");
  await gamePage.tapStock();
  await expect(gamePage.cardsIn("waste")).toHaveCount(3);
  await gamePage.drawModeSelect().selectOption("1");
  await gamePage.drawModeDialog.accept();
  await expect(gamePage.drawModeSelect()).toHaveValue("1");
  await expect(gamePage.cardsIn("waste")).toHaveCount(0);
  await gamePage.tapStock();
  await expect(gamePage.cardsIn("waste")).toHaveCount(1);
});

test("hộp thoại nằm trên bàn bài: bấm chuột vào \"Đổi và chia lại\" được", { tag: ["@TC-DRAWMODE-008"] }, async ({ gamePage }) => {
  // BUG: defects/draw-mode.md#bug-drawmode-01
  test.fail();
  await gamePage.goto(SEED);
  await gamePage.tapStock();
  await gamePage.drawModeSelect().selectOption("3");
  // A trial click only checks that the pointer would land on the button and not on something drawn over it.
  await gamePage.drawModeDialog.acceptButton().click({ trial: true, timeout: 3000 });
  await gamePage.drawModeDialog.keepButton().click({ trial: true, timeout: 3000 });
});

for (const key of ["Enter", "Space"] as const) {
  test(`bàn phím bấm được nút của hộp thoại (${key})`, { tag: ["@TC-DRAWMODE-009"] }, async ({ page, gamePage }) => {
    // BUG: defects/draw-mode.md#bug-drawmode-02
    test.fail();
    await gamePage.goto(SEED);
    await gamePage.tapStock();
    await gamePage.drawModeSelect().selectOption("3");
    await expect(gamePage.drawModeDialog.keepButton()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(gamePage.drawModeDialog.acceptButton()).toBeFocused();
    await page.keyboard.press(key);
    await expect(gamePage.drawModeDialog.root()).toHaveCount(0, { timeout: 2000 });
    await expect(gamePage.drawModeSelect()).toHaveValue("3");
  });
}
