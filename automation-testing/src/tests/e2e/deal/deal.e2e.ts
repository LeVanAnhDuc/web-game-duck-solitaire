import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { MAX_SEED, SEED } from "@/data/test-data";
import { FOUNDATIONS, tableauKey } from "@/pages/game.page";

// FR-01 · FR-09 · FR-13 · US-01 · US-05 · ADR-0001 · ADR-0006. A deal is compared through the DOM only: id, pile, depth
// and face of all 52 cards - the suite never imports the game's dealer.

test("mở trang là có ngay ván đã chia đúng luật Klondike", { tag: ["@TC-DEAL-001", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await expect(gamePage.board()).toBeVisible();
  const snap = await gamePage.snapshot();
  for (let i = 0; i < 7; i++) {
    const column = snap.filter((c) => c.pile === tableauKey(i));
    expect(column, `column ${i + 1}`).toHaveLength(i + 1);
    expect(column.filter((c) => c.face === "up").map((c) => c.index)).toEqual([i]);
  }
  const stock = snap.filter((c) => c.pile === "stock");
  expect(stock).toHaveLength(24);
  expect(stock.every((c) => c.face === "down")).toBe(true);
  expect(snap.filter((c) => c.pile === "waste")).toHaveLength(0);
  for (const key of FOUNDATIONS) expect(snap.filter((c) => c.pile === key)).toHaveLength(0);
  expect(snap).toHaveLength(52);
  expect(new Set(snap.map((c) => c.id)).size).toBe(52);
});

test("cùng số hiệu ván, tải lại vẫn ra đúng thế bài", { tag: ["@TC-DEAL-002", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(4242);
  const first = await gamePage.snapshot();
  await gamePage.reload();
  expect(await gamePage.snapshot()).toEqual(first);
});

test("hai số hiệu khác nhau cho hai thế bài khác nhau", { tag: ["@TC-DEAL-003"] }, async ({ gamePage }) => {
  await gamePage.goto(1);
  const one = await gamePage.snapshot();
  await gamePage.goto(2);
  expect(await gamePage.snapshot()).not.toEqual(one);
});

for (const raw of ["khong-phai-so", "-1", "1.5", String(MAX_SEED + 1)]) {
  test(`số hiệu không dùng được thì chia ván ngẫu nhiên, không lỗi, địa chỉ ghi số thật (?van=${raw})`, { tag: ["@TC-DEAL-004"] }, async ({
    page,
    gamePage,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await gamePage.goto(raw);
    await expect(gamePage.cards()).toHaveCount(52);
    const shown = await gamePage.shownSeed();
    expect(shown).toBeGreaterThanOrEqual(0);
    expect(shown).toBeLessThanOrEqual(MAX_SEED);
    await expect.poll(() => gamePage.seedInUrl()).toBe(String(shown));
    expect(errors).toEqual([]);
  });
}

test("hai biên 0 và 4294967295 là số hiệu hợp lệ", { tag: ["@TC-DEAL-005"] }, async ({ gamePage }) => {
  for (const seed of [0, MAX_SEED]) {
    await gamePage.goto(seed);
    await expect(gamePage.seedLabel(seed)).toBeVisible();
    expect(await gamePage.seedInUrl()).toBe(String(seed));
  }
});

test("không có số hiệu thì ván ngẫu nhiên tự ghi số lên địa chỉ, mở lại ra đúng ván", { tag: ["@TC-DEAL-006"] }, async ({
  gamePage,
}) => {
  await gamePage.goto();
  await expect.poll(() => gamePage.seedInUrl()).not.toBeNull();
  const seed = await gamePage.seedInUrl();
  expect(seed).toBe(String(await gamePage.shownSeed()));
  const dealt = await gamePage.snapshot();
  await gamePage.goto(seed!);
  expect(await gamePage.snapshot()).toEqual(dealt);
});

test("số hiệu ván và câu giải thích đọc được ngay trên màn hình", { tag: ["@TC-DEAL-007"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await expect(gamePage.seedLabel(SEED)).toBeVisible();
  await expect(gamePage.header().getByText(copy.seed.hint, { exact: true })).toBeVisible();
  // The hint used to live in a `title`, which a phone can never show (F-05).
  await expect(gamePage.header().locator("[title]")).toHaveCount(0);
});

test(
  "\"Ván mới\" chia ván khác, đổi số trên màn hình và địa chỉ, không thêm lịch sử trình duyệt",
  { tag: ["@TC-DEAL-008", "@smoke"] },
  async ({ page, gamePage }) => {
    await gamePage.goto(777);
    const dealt = await gamePage.snapshot();
    await gamePage.tapStock(2);
    const historyLength = await page.evaluate(() => window.history.length);

    await gamePage.newGameButton().click();

    await expect(gamePage.seedLabel(777)).toHaveCount(0);
    const shown = await gamePage.shownSeed();
    expect(await gamePage.seedInUrl()).toBe(String(shown));
    expect(await gamePage.snapshot()).not.toEqual(dealt);
    await expect(gamePage.cardsIn("waste")).toHaveCount(0);
    await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
    expect(await page.evaluate(() => window.history.length)).toBe(historyLength);
  },
);

test("trang tự giới thiệu: tên, câu cam kết, tiêu đề tab, biểu tượng", { tag: ["@TC-DEAL-009"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await expect(gamePage.header().getByText(copy.appTitle, { exact: true })).toBeVisible();
  await expect(gamePage.header().getByText(copy.tagline, { exact: true })).toBeVisible();
  await expect(page).toHaveTitle(copy.appTitle);
  const href = await page.locator('link[rel="icon"]').first().getAttribute("href");
  expect(href).toContain("icon");
});
