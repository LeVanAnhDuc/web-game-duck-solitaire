import { test, expect } from "@/fixtures";
import { SEED_RUN, SEED_THREE_TO_COLUMN_7 } from "@/data/test-data";

// FR-04 · US-02 · invariant #6 (tap and drag build the same Move) · NFR-REL-03 (no stuck gesture).

test("kéo thả cho đúng kết quả như chạm", { tag: ["@TC-MOVES-019", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await gamePage.cardNamed("Tép Ba").click();
  await gamePage.tapPile("tableau-6");
  const byTap = await gamePage.snapshot();

  await gamePage.restartButton().click();
  await expect(gamePage.cardNamed("Tép Ba")).toHaveAttribute("data-card-pile", "tableau-1");
  await gamePage.dragTo(gamePage.cardNamed("Tép Ba"), "tableau-6");

  await expect(gamePage.cardNamed("Tép Ba")).toHaveAttribute("data-card-pile", "tableau-6");
  expect(await gamePage.snapshot()).toEqual(byTap);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "false");
});

test("thả vào chỗ không hợp lệ thì bài về chỗ cũ, không đổi gì", { tag: ["@TC-MOVES-020"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  const before = await gamePage.snapshot();
  await gamePage.dragTo(gamePage.cardNamed("Tép Ba"), "tableau-0"); // onto Cơ Đầm
  expect(await gamePage.snapshot()).toEqual(before);
  await expect(gamePage.cards()).toHaveCount(52); // no copy left following the pointer
  await expect(gamePage.selectedCards()).toHaveCount(0);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
});

test("kéo lá đầu dãy thì cả dãy đi theo", { tag: ["@TC-MOVES-021"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_RUN);
  await gamePage.dragTo(gamePage.cardNamed("Bích Sáu"), "tableau-3");
  await expect(gamePage.cardsIn("tableau-3")).toHaveCount(5);
  await gamePage.dragTo(gamePage.cardNamed("Cơ Bảy"), "tableau-0");
  await expect(gamePage.cardsIn("tableau-0")).toHaveCount(3);
  await expect(gamePage.cardNamed("Bích Sáu")).toHaveAttribute("data-card-pile", "tableau-0");
});

test("kéo rồi thả lại đúng chỗ cũ thì không có nước đi và không kẹt lại gì", { tag: ["@TC-MOVES-022"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  const before = await gamePage.snapshot();
  const box = (await gamePage.cardNamed("Tép Ba").boundingBox())!;
  const start = { x: box.x + box.width / 2, y: box.y + 10 };
  await gamePage.dragBetween(start, { x: start.x + 1, y: start.y + 1 });

  expect(await gamePage.snapshot()).toEqual(before);
  await expect(gamePage.cards()).toHaveCount(52);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
});

test("nhả chuột ngoài cửa sổ thì huỷ kéo, bài về chỗ cũ, không kẹt gì", { tag: ["@TC-MOVES-023"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  const before = await gamePage.snapshot();
  const box = (await gamePage.cardNamed("Tép Ba").boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + 10);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 20, box.y + 40, { steps: 3 });
  await expect(gamePage.cards()).toHaveCount(53); // the copy under the pointer: a drag is under way
  await page.mouse.move(-20, -20, { steps: 3 });
  await page.mouse.up();

  await expect(gamePage.cards()).toHaveCount(52);
  expect(await gamePage.snapshot()).toEqual(before);
  await expect(gamePage.selectedCards()).toHaveCount(0);
  await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
});

for (const end of ["thả hợp lệ", "thả bị từ chối"] as const) {
  test(`cú chạm đầu tiên sau một lần kéo vẫn có tác dụng (${end})`, { tag: ["@TC-MOVES-026"] }, async ({ gamePage }) => {
    // BUG: defects/moves.md#bug-moves-02
    test.fail();
    await gamePage.goto(SEED_THREE_TO_COLUMN_7);
    await gamePage.dragTo(gamePage.cardNamed("Tép Ba"), end === "thả hợp lệ" ? "tableau-6" : "tableau-0");
    await gamePage.cardNamed("Cơ Đầm").click();
    await expect(gamePage.selectedCards()).toHaveCount(1, { timeout: 2000 });
  });
}

test("rung tay dưới 6px vẫn là một cú chạm chọn bài", { tag: ["@TC-MOVES-024"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  const box = (await gamePage.cardNamed("Tép Ba").boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + 10;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 3, y + 3);
  await page.mouse.up();
  await expect(gamePage.selectedCards()).toHaveCount(1);
  await expect(gamePage.cards()).toHaveCount(52);
});

test("thả lên vùng chồng lấn giữa hai cột thì chọn cột lấn nhiều hơn", { tag: ["@TC-MOVES-025"] }, async ({ gamePage }) => {
  // BUG: defects/moves.md#bug-moves-01
  test.fail();
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  const card = (await gamePage.cardNamed("Tép Ba").boundingBox())!;
  const col6 = (await gamePage.slot("tableau-5").boundingBox())!;
  const col7 = (await gamePage.slot("tableau-6").boundingBox())!;
  // Grab Tép Ba by its left edge and let go with the pointer 3px inside column 6's right edge: the dropped card then
  // covers a sliver of column 6 and almost all of column 7 (Cơ Bốn, where it legally fits).
  const grabX = 3;
  const pointer = { x: col6.x + col6.width - 3, y: col7.y + 20 };
  const overlap6 = col6.x + col6.width - (pointer.x - grabX);
  const overlap7 = pointer.x - grabX + card.width - col7.x;
  expect(overlap7).toBeGreaterThan(overlap6 * 4);

  await gamePage.dragBetween({ x: card.x + grabX, y: card.y + 10 }, pointer);
  await expect(gamePage.cardNamed("Tép Ba")).toHaveAttribute("data-card-pile", "tableau-6", { timeout: 2000 });
});
