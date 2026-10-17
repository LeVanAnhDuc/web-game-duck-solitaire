import { expect, test } from "./fixtures";
import { openGame, slot, tableau } from "./helpers";

/**
 * These run at all four project viewports, so each assertion is really four - which is
 * the point: FR-11 promises the board fits from 320px up, and a promise made at one
 * width is not a promise.
 */
test.describe("the board fits its viewport", () => {
  test("never scrolls sideways - FR-11", async ({ page }) => {
    await openGame(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("every card offers a 44px touch target - NFR-A11Y-03", async ({ page }) => {
    await openGame(page);
    const boxes = await page.locator("[data-hit-area]").evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      }),
    );
    expect(boxes.length).toBeGreaterThan(0);
    for (const box of boxes) {
      expect(box.w).toBeGreaterThanOrEqual(44);
      expect(box.h).toBeGreaterThanOrEqual(44);
    }
  });

  test("every toolbar control is at least 44px tall - NFR-A11Y-03", async ({ page }) => {
    await openGame(page);
    const controls = page.getByRole("toolbar").locator("button, select");
    for (const control of await controls.all()) {
      const box = await control.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });

  test("the seven columns stay inside the viewport, with equal margins", async ({ page }) => {
    await openGame(page);
    const width = page.viewportSize()?.width ?? 0;
    const first = await tableau(page, 0).boundingBox();
    const last = await tableau(page, 6).boundingBox();
    const left = first?.x ?? -1;
    const right = width - ((last?.x ?? 0) + (last?.width ?? 0));
    expect(left).toBeGreaterThan(0);
    // The card width is derived from the padding and the gaps, so the board fits
    // exactly - the two margins have to come out the same.
    expect(Math.abs(left - right)).toBeLessThanOrEqual(1);
  });

  test("the top row lines up with the columns underneath it", async ({ page }) => {
    await openGame(page);
    const stock = await slot(page, "stock").boundingBox();
    const column0 = await tableau(page, 0).boundingBox();
    expect(Math.round(stock?.x ?? -1)).toBe(Math.round(column0?.x ?? -2));
    const foundation3 = await slot(page, "foundation-3").boundingBox();
    const column6 = await tableau(page, 6).boundingBox();
    expect(Math.round(foundation3?.x ?? -1)).toBe(Math.round(column6?.x ?? -2));
  });
});
