import { test, expect } from "@/fixtures";
import { copy, FOUNDATION_SUITS } from "@/data/copy";
import { SEED, SEED_RUN, STOCK_AT_DEAL } from "@/data/test-data";
import { FOUNDATIONS, PILES, TABLEAU } from "@/pages/game.page";

// NFR-A11Y-04 (named cards and piles) · NFR-A11Y-06 (state indicators with a non-motion channel) · F-01 / F-02 / F-03.
// The suite runs with motion OFF, and for the announcement that is the whole point: reduced motion is exactly the
// setting where the flash and the shake do not happen, so the live region is the only channel left.

test("mỗi lá có nhãn đọc được: tên lá khi ngửa, \"Lá úp\" khi úp, số lá đi kèm khi là đầu dãy", { tag: ["@TC-ACCESSIBILITY-001", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED_RUN);
  const snap = await gamePage.snapshot();
  for (const card of snap) {
    if (card.face === "down") expect(card.label, card.id).toBe(copy.card.faceDown);
    else expect(card.label, card.id).toMatch(/^(Bích|Cơ|Rô|Tép) (Át|Hai|Ba|Bốn|Năm|Sáu|Bảy|Tám|Chín|Mười|Bồi|Đầm|Già)$/);
  }
  await gamePage.cardNamed("Bích Sáu").click();
  await gamePage.tapPile("tableau-3");
  await expect(gamePage.cardNamed("Cơ Bảy")).toHaveAttribute("aria-label", copy.card.label("hearts", 7, 2));
  await expect(gamePage.cardNamed("Bích Sáu")).toHaveAttribute("aria-label", copy.card.label("spades", 6, 1));
});

test("lá đang cầm được đọc là \"đang chọn\" và có trạng thái nhấn", { tag: ["@TC-ACCESSIBILITY-002"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  const card = gamePage.cardNamed("Cơ Tám");
  await expect(card).toHaveAttribute("aria-pressed", "false");
  await card.click();
  await expect(card).toHaveAttribute("aria-label", `Cơ Tám, đang chọn`);
  await expect(card).toHaveAttribute("aria-pressed", "true");
});

test("mỗi chồng là một vùng có tên, bàn bài và thanh điều khiển cũng vậy", { tag: ["@TC-ACCESSIBILITY-003", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await expect(gamePage.board()).toBeVisible();
  await expect(gamePage.toolbar()).toBeVisible();
  await expect(page.getByRole("group", { name: copy.pile.stock, exact: true })).toHaveAttribute("data-pile", "stock");
  await expect(page.getByRole("group", { name: copy.pile.waste, exact: true })).toHaveAttribute("data-pile", "waste");
  for (const [i, key] of FOUNDATIONS.entries()) {
    await expect(page.getByRole("group", { name: copy.pile.foundation(FOUNDATION_SUITS[i]!), exact: true })).toHaveAttribute(
      "data-pile",
      key,
    );
    // An empty pile says so.
    await expect(gamePage.slot(key)).toContainText("trống");
  }
  for (const [i, key] of TABLEAU.entries()) {
    await expect(page.getByRole("group", { name: copy.pile.tableau(i), exact: true })).toHaveAttribute("data-pile", key);
  }
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
});

test("mỗi chồng nhận đúng các lá của nó qua aria-owns", { tag: ["@TC-ACCESSIBILITY-004"] }, async ({ page, gamePage }) => {
  // The cards are not their pile's DOM children (one flat layer), so this is what keeps the accessibility tree
  // from losing which pile a card belongs to.
  await gamePage.goto(SEED);
  await gamePage.tapStock(3);
  for (const key of PILES) {
    const owns = (await gamePage.slot(key).getAttribute("aria-owns"))?.split(" ").filter(Boolean) ?? [];
    expect(owns, key).toHaveLength(await gamePage.cardCount(key));
    for (const id of owns) await expect(page.locator(`[id="${id}"]`)).toHaveAttribute("data-card-pile", key);
  }
});

test("chồng rút cạn tự đổi tên và hiện dấu lật lại; chồng đích trống thì không", { tag: ["@TC-ACCESSIBILITY-005"] }, async ({
  page,
  gamePage,
}) => {
  await gamePage.goto(SEED);
  const recycleMark = (key: Parameters<typeof gamePage.slot>[0]) => gamePage.slot(key).locator("[data-recyclable]");
  await expect(recycleMark("stock")).toHaveCount(0);

  await gamePage.tapStock(STOCK_AT_DEAL);

  await expect(recycleMark("stock")).toHaveCount(1);
  await expect(page.getByRole("group", { name: copy.pile.stockEmpty, exact: true })).toHaveCount(1);
  // The mark means "tapping here does something"; tapping an empty foundation does nothing.
  for (const key of FOUNDATIONS) await expect(recycleMark(key)).toHaveCount(0);

  await gamePage.tapStock(); // the invitation works
  await expect(recycleMark("stock")).toHaveCount(0);
  await expect(page.getByRole("group", { name: copy.pile.stock, exact: true })).toHaveCount(1);
});

test("nước bị từ chối được đọc lên qua vùng thông báo, kể cả khi chuyển động tắt và hai lần liền", { tag: ["@TC-ACCESSIBILITY-006", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  await gamePage.goto(SEED);
  const live = gamePage.liveRegion();
  await expect(live).toHaveText("");
  await expect(live).toHaveAttribute("aria-live", "polite");

  await gamePage.focusPile("foundation-0"); // empty at the deal: nothing to pick up, so it is refused
  await page.keyboard.press("Space");
  await expect(live).toHaveText(copy.a11y.moveRejected);

  // The same words again must be a NEW announcement: the region's content is replaced, not left as it was.
  const first = await live.locator("span").elementHandle();
  await page.keyboard.press("Space");
  await expect.poll(async () => first!.evaluate((el) => el.isConnected)).toBe(false);
  await expect(live).toHaveText(copy.a11y.moveRejected);
});

test("lá đang cầm đeo vòng màu vẽ thật, không chỉ một cái bóng", { tag: ["@TC-ACCESSIBILITY-007"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Space"); // pick up column 1's card
  const held = gamePage.selectedCards();
  await expect(held).toHaveCount(1);
  // --ring-selected #FFD166: a painted ring, not an inherited "none" or a dark shadow on a dark table.
  const shadow = await held.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(shadow).toContain("rgb(255, 209, 102)");
});

test("chuyển động tắt thì không lá nào có transition, lá ở ngay chỗ của nó", { tag: ["@TC-ACCESSIBILITY-008", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  const properties = await gamePage.cards().evaluateAll((els) => els.map((el) => getComputedStyle(el).transitionProperty));
  expect(new Set(properties)).toEqual(new Set(["none"]));
  // The deal is instant: column 7's top card already sits on column 7, not on the stock it was dealt from.
  const card = (await gamePage.cardAt("tableau-6", 6).boundingBox())!;
  const column = (await gamePage.slot("tableau-6").boundingBox())!;
  expect(Math.abs(card.x - column.x)).toBeLessThan(2);
  // A move lands at once too.
  await gamePage.tapStock();
  const waste = (await gamePage.slot("waste").boundingBox())!;
  const drawn = (await gamePage.cardAt("waste", 0).boundingBox())!;
  expect(Math.abs(drawn.x - waste.x)).toBeLessThan(2);
});
