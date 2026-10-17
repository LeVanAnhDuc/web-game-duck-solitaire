import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED, SEED_THREE_TO_COLUMN_7 } from "@/data/test-data";

// FR-11 · NFR-A11Y-03 · NFR-REL-03 · klondike design §3. Every claim that depends on the window width lives here, one
// test per width: 320 is the narrowest width the layout promises, 1440 the widest the design names.

const WIDTHS = [
  { width: 320, height: 720 },
  { width: 375, height: 720 },
  { width: 768, height: 900 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
] as const;

for (const viewport of WIDTHS) {
  test.describe(`${viewport.width}px`, () => {
    test.use({ viewport });

    test(`không bao giờ cuộn ngang (${viewport.width}px)`, { tag: ["@TC-RESPONSIVE-001", "@smoke"] }, async ({ page, gamePage }) => {
      await gamePage.goto(SEED);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test(`mỗi lá và mỗi nút có vùng bấm tối thiểu 44px (${viewport.width}px)`, { tag: ["@TC-RESPONSIVE-002", "@smoke"] }, async ({
      page,
      gamePage,
    }) => {
      await gamePage.goto(SEED);
      const boxes = await page.locator("[data-hit-area]").evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          return { w: Math.round(r.width), h: Math.round(r.height) };
        }),
      );
      expect(boxes).toHaveLength(52);
      for (const box of boxes) {
        expect(box.w).toBeGreaterThanOrEqual(44);
        expect(box.h).toBeGreaterThanOrEqual(44);
      }
      for (const control of await gamePage.toolbar().locator("button, select").all()) {
        expect((await control.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
      }
    });

    test(`bảy cột nằm trọn trong màn hình, hai lề bằng nhau, hàng trên thẳng cột (${viewport.width}px)`, { tag: ["@TC-RESPONSIVE-003"] }, async ({
      gamePage,
    }) => {
      await gamePage.goto(SEED);
      const first = (await gamePage.slot("tableau-0").boundingBox())!;
      const last = (await gamePage.slot("tableau-6").boundingBox())!;
      const left = first.x;
      const right = viewport.width - (last.x + last.width);
      expect(left).toBeGreaterThan(0);
      expect(Math.abs(left - right)).toBeLessThanOrEqual(1);
      const stock = (await gamePage.slot("stock").boundingBox())!;
      const f4 = (await gamePage.slot("foundation-3").boundingBox())!;
      expect(Math.round(stock.x)).toBe(Math.round(first.x));
      expect(Math.round(f4.x)).toBe(Math.round(last.x));
    });

    test(`chơi được bằng chạm: chọn rồi đặt một lá (${viewport.width}px)`, { tag: ["@TC-RESPONSIVE-004"] }, async ({ gamePage }) => {
      await gamePage.goto(SEED_THREE_TO_COLUMN_7);
      await gamePage.cardNamed("Tép Ba").click();
      await gamePage.tapPile("tableau-6");
      await expect(gamePage.cardNamed("Tép Ba")).toHaveAttribute("data-card-pile", "tableau-6");
      await gamePage.tapStock();
      await expect(gamePage.cardsIn("waste")).toHaveCount(1);
    });

    test(`cầm một lá rồi chạm chồng rút thì bị từ chối và bỏ lựa chọn (${viewport.width}px)`, { tag: ["@TC-RESPONSIVE-005"] }, async ({
      page,
      gamePage,
    }) => {
      // BUG: defects/responsive.md#bug-responsive-01
      test.fail(viewport.width < 768, "known: backlog.md, 'Cầm bài rồi chạm chồng rút ở 320/375px'");
      await gamePage.goto(SEED);
      const before = await gamePage.snapshot();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Space");
      await expect(gamePage.selectedCards()).toHaveCount(1);
      await gamePage.tapStock();
      await expect(gamePage.selectedCards()).toHaveCount(0, { timeout: 2000 });
      await expect(gamePage.liveRegion()).toHaveText(copy.a11y.moveRejected);
      expect(await gamePage.snapshot()).toEqual(before);
    });
  });
}
