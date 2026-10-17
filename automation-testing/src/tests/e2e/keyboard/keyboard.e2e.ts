import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED, SEED_ACE_ON_COLUMN_1, SEED_RUN, SEED_THREE_TO_COLUMN_7 } from "@/data/test-data";

// FR-12 · NFR-A11Y-02 · klondike design §2 (the keyboard reuses the "selected" state) · F-06 · F-07.

test("Tab vào bàn bài ở cột 1, cả bàn chỉ là một điểm dừng Tab", { tag: ["@TC-KEYBOARD-001", "@smoke"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await page.keyboard.press("Tab");
  await gamePage.waitFocusOn("tableau-0");
  // Roving tabindex: exactly one pile is in the tab order.
  await expect(page.locator('[data-pile][tabindex="0"]')).toHaveCount(1);
  await page.keyboard.press("Tab");
  await expect(gamePage.undoButton()).toBeFocused();
});

test("phím mũi tên đi dọc hàng, quay vòng ở hai đầu, lên xuống đổi hàng giữ cột", { tag: ["@TC-KEYBOARD-002"] }, async ({
  page,
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await page.keyboard.press("Tab");
  await gamePage.waitFocusOn("tableau-0");
  await page.keyboard.press("ArrowLeft"); // wraps to the last column
  await gamePage.waitFocusOn("tableau-6");
  await page.keyboard.press("ArrowRight"); // and back round
  await gamePage.waitFocusOn("tableau-0");
  await page.keyboard.press("ArrowUp");
  await gamePage.waitFocusOn("stock");
  await page.keyboard.press("ArrowLeft"); // the top row has six piles: stock, waste, four foundations
  await gamePage.waitFocusOn("foundation-3");
  await page.keyboard.press("ArrowDown");
  await gamePage.waitFocusOn("tableau-5");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowUp"); // column 7 has no pile above it: the cursor stops at the last foundation
  await gamePage.waitFocusOn("foundation-3");
});

test("tiêu điểm bàn phím luôn nhìn thấy được", { tag: ["@TC-KEYBOARD-003"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await page.keyboard.press("Tab");
  await page.keyboard.press("ArrowRight");
  await gamePage.waitFocusOn("tableau-1");
  const ring = await gamePage.slot("tableau-1").evaluate((el) => {
    const cs = getComputedStyle(el);
    return { outline: cs.outlineStyle, width: cs.outlineWidth, shadow: cs.boxShadow };
  });
  expect(ring.outline !== "none" && ring.width !== "0px" ? "outline" : ring.shadow).not.toBe("none");
});

test("Space cầm lá trên cùng lên rồi đặt xuống chồng khác", { tag: ["@TC-KEYBOARD-004", "@smoke"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await gamePage.focusPile("tableau-1");
  await page.keyboard.press("Space");
  await expect(gamePage.selectedCards()).toHaveCount(1);
  await expect(gamePage.cardNamed("Tép Ba")).toHaveAttribute("data-selected", "true");
  await gamePage.moveCursorTo("tableau-6");
  await page.keyboard.press("Space");
  await expect(gamePage.cardNamed("Tép Ba")).toHaveAttribute("data-card-pile", "tableau-6");
  await expect(gamePage.selectedCards()).toHaveCount(0);
});

test("Space trên chồng rút là rút bài; đang cầm lá thì bị từ chối", { tag: ["@TC-KEYBOARD-005"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await gamePage.focusPile("stock");
  await page.keyboard.press("Space");
  await expect(gamePage.cardsIn("waste")).toHaveCount(1);

  const before = await gamePage.snapshot();
  await gamePage.moveCursorTo("tableau-1");
  await page.keyboard.press("Space"); // pick Tép Ba up
  await page.keyboard.press("ArrowUp"); // holding a column card: ↑ deepens the grab, it does not leave the row
  await page.keyboard.press("Escape");
  await page.keyboard.press("ArrowUp");
  await gamePage.waitFocusOn("waste");
  await page.keyboard.press("Space"); // pick the waste card up
  await page.keyboard.press("ArrowLeft");
  await gamePage.waitFocusOn("stock");
  await page.keyboard.press("Space"); // and try to put it on the stock
  expect(await gamePage.snapshot()).toEqual(before);
  await expect(gamePage.liveRegion()).toHaveText(copy.a11y.moveRejected);
});

test("Space trên chồng không có gì để cầm thì bị từ chối và được đọc lên", { tag: ["@TC-KEYBOARD-006"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await expect(gamePage.liveRegion()).toHaveText("");
  await gamePage.focusPile("foundation-0"); // empty at the deal
  await page.keyboard.press("Space");
  await expect(gamePage.liveRegion()).toHaveText(copy.a11y.moveRejected);
  await expect(gamePage.selectedCards()).toHaveCount(0);
});

test("Enter tự tìm chỗ như chạm đúp", { tag: ["@TC-KEYBOARD-007", "@smoke"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await gamePage.focusPile("tableau-1");
  await page.keyboard.press("Enter");
  await expect(gamePage.cardNamed("Tép Ba")).toHaveAttribute("data-card-pile", "tableau-6");
});

test("con trỏ bàn phím đi theo lá vừa bay tới chồng mới", { tag: ["@TC-KEYBOARD-008"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_ACE_ON_COLUMN_1);
  await page.keyboard.press("Tab");
  await gamePage.waitFocusOn("tableau-0");
  await page.keyboard.press("Enter"); // Cơ Át goes up to the Hearts foundation, the second one
  await expect(gamePage.cardsIn("foundation-1")).toHaveCount(1);
  await gamePage.waitFocusOn("foundation-1");
  await expect(gamePage.slot("foundation-1")).toHaveAttribute("tabindex", "0");
  await expect(gamePage.slot("tableau-0")).toHaveAttribute("tabindex", "-1");
});

test("Escape bỏ lá đang cầm", { tag: ["@TC-KEYBOARD-009"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await gamePage.focusPile("tableau-1");
  await page.keyboard.press("Space");
  await expect(gamePage.selectedCards()).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(gamePage.selectedCards()).toHaveCount(0);
});

test("đang cầm một dãy, ↑ ↓ đổi độ sâu, không vượt quá các lá ngửa", { tag: ["@TC-KEYBOARD-010"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_RUN);
  await gamePage.cardNamed("Bích Sáu").click();
  await gamePage.tapPile("tableau-3"); // column 4: Cơ Bảy carrying Bích Sáu, three face-down cards under them
  await gamePage.focusPile("tableau-3");
  await page.keyboard.press("Space");
  await expect(gamePage.selectedCards()).toHaveCount(1);
  await page.keyboard.press("ArrowUp");
  await expect(gamePage.selectedCards()).toHaveCount(2);
  await page.keyboard.press("ArrowUp"); // the next card down is face down: the grab stops at two
  await expect(gamePage.selectedCards()).toHaveCount(2);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown"); // and never below one
  await expect(gamePage.selectedCards()).toHaveCount(1);
  await gamePage.moveCursorTo("tableau-0");
  await page.keyboard.press("ArrowUp"); // carry the run of two onto Bích Tám
  await page.keyboard.press("Space");
  await expect(gamePage.cardsIn("tableau-0")).toHaveCount(3);
});

test("bản đồ phím ẩn khi dùng chuột, hiện khi dùng bàn phím", { tag: ["@TC-KEYBOARD-011"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await expect(gamePage.keyboardMap()).toBeHidden();
  await page.keyboard.press("Tab");
  await expect(gamePage.keyboardMap()).toBeVisible();
  await expect(gamePage.keyboardMap()).toHaveText(copy.a11y.keyboardHint);
  // Back to the mouse: a tap on the board takes focus without a visible focus ring, and the map goes away.
  await gamePage.tapStock();
  await expect(gamePage.keyboardMap()).toBeHidden();
  // The same words are always there for a screen reader.
  await expect(page.locator(".sr-only", { hasText: copy.a11y.keyboardHint })).toHaveCount(1);
});

for (const control of ["Hoàn lại · Enter", "Ván mới · Space", "Chế độ rút · ArrowDown"] as const) {
  test(`nút trên thanh điều khiển dùng được bằng bàn phím (${control})`, { tag: ["@TC-KEYBOARD-012"] }, async ({ page, gamePage }) => {
    // BUG: defects/keyboard.md#bug-keyboard-01
    test.fail();
    await gamePage.goto(SEED);
    await gamePage.tapStock();
    const before = await gamePage.snapshot();
    if (control.startsWith("Hoàn lại")) {
      await gamePage.undoButton().focus();
      await page.keyboard.press("Enter");
      await expect(gamePage.cardsIn("waste")).toHaveCount(0, { timeout: 2000 });
    } else if (control.startsWith("Ván mới")) {
      await gamePage.newGameButton().focus();
      await page.keyboard.press("Space");
      await expect(gamePage.seedLabel(SEED)).toHaveCount(0, { timeout: 2000 });
    } else {
      await gamePage.drawModeSelect().focus();
      await page.keyboard.press("ArrowDown");
      await expect(gamePage.drawModeDialog.root()).toBeVisible({ timeout: 2000 });
    }
    expect(before).toHaveLength(52);
  });
}
