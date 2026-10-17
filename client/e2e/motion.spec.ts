import { expect, test } from "./fixtures";
import { cardAt, openGame, slot } from "./helpers";

/**
 * The only tests that run with motion switched on.
 *
 * They check that the animation is ARMED - the right transition on the right property,
 * the deal starting on the stock, the flip turning the inner element - rather than
 * watching it play. A headless page that is not painting does not advance a CSS
 * transition at all, so observing one here would be measuring the harness. Whether the
 * browser then interpolates correctly is the browser's job.
 *
 * The rest of the suite runs with motion off for exactly that reason; see
 * e2e/fixtures.ts.
 */

test.describe("with motion on", () => {
  test.use({ motion: "on" });

  test("the opening deal goes out staggered, card after card", async ({ page }) => {
    // Not "catch the frame where every card is on the stock": that frame lasts two
    // frames and chasing it measures the harness. What is observable for most of a
    // second is the stagger - each card waits its turn, in deal order.
    await page.goto("/?van=20260904");
    await expect(page.locator("[data-card]").first()).toBeVisible();

    const delays = await page
      .locator('[data-card][data-card-pile="tableau-6"]')
      .evaluateAll((els) =>
        els
          .map((el) => ({
            index: Number(el.getAttribute("data-index")),
            delay: Number.parseFloat(getComputedStyle(el).transitionDelay),
          }))
          .sort((a, b) => a.index - b.index)
          .map((row) => row.delay),
      );

    expect(delays).toHaveLength(7);
    expect(Math.max(...delays)).toBeGreaterThan(0);
    // Klondike deals across the columns, so column 7 gets its cards later and later.
    expect(delays).toEqual([...delays].sort((a, b) => a - b));
  });

  test("cards move by transform, not by their offsets - NFR-PERF-02", async ({ page }) => {
    // Animating top/left makes the browser lay the page out again on every frame for
    // 52 elements. transform is composited, and that is the whole budget.
    await page.goto("/?van=20260904");
    await expect(page.locator("[data-card]").first()).toBeVisible();
    const style = await cardAt(page, "tableau-6", 6).evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        property: cs.transitionProperty,
        duration: cs.transitionDuration,
        top: cs.top,
        left: cs.left,
      };
    });
    expect(style.property).toContain("transform");
    expect(style.duration).not.toBe("0s");
    expect(style.top).toBe("0px");
    expect(style.left).toBe("0px");
  });

  test("a face-down card is turned over rather than swapped - the flip", async ({ page }) => {
    await openGame(page, 1);
    for (let i = 0; i < 60; i++) await page.screenshot({ type: "jpeg", quality: 20 });

    const inner = (index: number) =>
      cardAt(page, "tableau-1", index)
        .locator("[data-card-inner]")
        .evaluate((el) => {
          const cs = getComputedStyle(el);
          return { transform: cs.transform, duration: cs.transitionDuration };
        });

    // Index 1 is the face-up card, index 0 is still hidden underneath it.
    const up = await inner(1);
    const down = await inner(0);
    expect(up.transform).not.toBe(down.transform);
    expect(up.duration).not.toBe("0s");
  });
});

test.describe("with motion off - NFR-A11Y-05", () => {
  test.use({ motion: "off" });

  test("the deal is instant: no card ever sits on the stock", async ({ page }) => {
    await page.goto("/?van=20260904");
    await expect(page.locator("[data-card]").first()).toBeVisible();
    const card = cardAt(page, "tableau-6", 6);
    const column = await slot(page, "tableau-6").boundingBox();
    const at = await card.boundingBox();
    expect(Math.abs((at?.x ?? 0) - (column?.x ?? -1))).toBeLessThan(2);
  });

  test("no transition is started at all, not even a short one", async ({ page }) => {
    // Not "a very short duration": a transition that starts has a value being
    // interpolated, so a card that just moved would report where it came from until
    // the next frame. With none, a card is always where the state says it is.
    await openGame(page);
    const properties = await page
      .locator("[data-card]")
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).transitionProperty));
    for (const property of properties) expect(property).toBe("none");
  });
});
