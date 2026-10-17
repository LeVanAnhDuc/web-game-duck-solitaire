import { test, expect } from "@/fixtures";
import { SEED, SEED_ACE_ON_COLUMN_1, SEED_RUN, SEED_THREE_TO_COLUMN_7 } from "@/data/test-data";
import type { Locator } from "@playwright/test";

// board-motion design §3 + §5 (the ten effects) · NFR-PERF-02 · invariant #13. The only module that runs with motion ON.
//
// It checks that each animation is ARMED - the right property, duration, delay or keyframes on the right element -
// rather than watching it play: a headless page that is not painting does not advance a CSS transition, so observing
// one would measure the harness. Timers (the deal window, the flight window, the reject flash) run on page.clock, so
// "during the flight" is a state the test holds still, not a race.

test.use({ motion: "on" });

const style = (el: Locator) =>
  el.evaluate((node) => {
    const cs = getComputedStyle(node);
    return {
      transitionProperty: cs.transitionProperty,
      transitionDuration: cs.transitionDuration,
      transitionDelay: cs.transitionDelay,
      animationName: cs.animationName,
      pointerEvents: cs.pointerEvents,
      zIndex: Number(cs.zIndex),
      top: cs.top,
      left: cs.left,
      inlineTransform: (node as HTMLElement).style.transform,
    };
  });

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

/** Jumps past the opening deal and stops the page's clock there: from now on time moves only through runFor. */
const settle = (page: import("@playwright/test").Page) => page.clock.pauseAt(Date.now() + 5000);

test("chia bài đầu ván bay ra so le, lá sau chờ lá trước theo thứ tự chia", { tag: ["@TC-MOTION-001"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await page.clock.runFor(100); // the frame after the first: cards leave the stock with their deal delays
  const delays = await gamePage.cardsIn("tableau-6").evaluateAll((els) =>
    els
      .map((el) => ({ index: Number(el.getAttribute("data-index")), delay: Number.parseFloat(getComputedStyle(el).transitionDelay) }))
      .sort((a, b) => a.index - b.index)
      .map((row) => row.delay),
  );
  expect(delays).toHaveLength(7);
  expect(Math.max(...delays)).toBeGreaterThan(0);
  // Klondike deals across the columns, so column 7 gets its cards later and later.
  expect(delays).toEqual([...delays].sort((a, b) => a - b));
});

test("độ trễ của lần chia chỉ thuộc về lần chia; nước đi sau đó không bị trễ", { tag: ["@TC-MOTION-002"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await settle(page); // the deal window closes
  await gamePage.tapStock();
  const drawn = await style(gamePage.cardAt("waste", 0));
  expect(drawn.transitionDelay).toBe("0s");
});

test("lá di chuyển bằng transform có thời lượng, không bằng top/left", { tag: ["@TC-MOTION-003", "@smoke"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await settle(page);
  const card = await style(gamePage.cardAt("tableau-6", 6));
  expect(card.transitionProperty).toContain("transform");
  expect(card.transitionDuration).not.toBe("0s");
  expect(card.top).toBe("0px");
  expect(card.left).toBe("0px");
  expect(card.inlineTransform).toMatch(/^translate\(/);
});

test("lá úp được lật bằng một phép quay, không bị tráo", { tag: ["@TC-MOTION-004"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await settle(page);
  const inner = (index: number) => style(gamePage.cardAt("tableau-1", index).locator("[data-card-inner]"));
  const down = await inner(0);
  expect(down.inlineTransform).toBe("rotateY(180deg)");
  expect(down.transitionDuration).not.toBe("0s");

  await gamePage.cardNamed("Tép Ba").dblclick();
  // The same element, turned: the face-up side is the other side of one node, not a new node.
  await expect(gamePage.cardAt("tableau-1", 0)).toHaveAttribute("data-face", "up");
  expect((await inner(0)).inlineTransform).toBe("rotateY(0deg)");
});

test("lá đang bay được nâng lên trên và không nhận thao tác cho tới khi đáp", { tag: ["@TC-MOTION-005", "@smoke"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await settle(page);
  const resting = await style(gamePage.cardAt("tableau-0", 0));
  await gamePage.tapStock();
  const card = gamePage.cardAt("waste", 0);
  // The flight starts in the effect after the move renders; the frozen clock then holds it in the air.
  await expect.poll(async () => (await style(card)).pointerEvents).toBe("none");
  expect((await style(card)).zIndex).toBeGreaterThan(resting.zIndex);

  await page.clock.runFor(300); // the flight is over
  const landed = await style(card);
  expect(landed.pointerEvents).not.toBe("none");
});

test("một dãy bay so le theo độ sâu", { tag: ["@TC-MOTION-006"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_RUN);
  await settle(page);
  await gamePage.cardNamed("Bích Sáu").click();
  await gamePage.tapPile("tableau-3");
  await page.clock.runFor(300);
  await gamePage.tapCard(gamePage.cardNamed("Cơ Bảy"));
  await gamePage.tapPile("tableau-0");
  const head = await style(gamePage.cardNamed("Cơ Bảy"));
  const tail = await style(gamePage.cardNamed("Bích Sáu"));
  expect(Number.parseFloat(tail.transitionDelay)).toBeGreaterThan(Number.parseFloat(head.transitionDelay));
});

test("lá đang cầm được nâng lên", { tag: ["@TC-MOTION-007"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await settle(page);
  const card = gamePage.cardNamed("Cơ Tám");
  expect((await style(card)).inlineTransform).not.toContain("scale(");
  await card.click();
  expect((await style(card)).inlineTransform).toContain("scale(1.04)");
});

test("nước bị từ chối: lá nguồn lắc, chồng đích nháy đỏ, rồi thôi", { tag: ["@TC-MOTION-008"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_THREE_TO_COLUMN_7);
  await settle(page);
  await gamePage.cardNamed("Tép Ba").click();
  await gamePage.tapPile("tableau-0"); // onto Cơ Đầm: refused
  await expect.poll(async () => (await style(gamePage.cardNamed("Tép Ba"))).animationName).not.toBe("none");
  await expect.poll(async () => (await style(gamePage.slot("tableau-0"))).animationName).not.toBe("none");
  await page.clock.runFor(500);
  expect((await style(gamePage.cardNamed("Tép Ba"))).animationName).toBe("none");
  expect((await style(gamePage.slot("tableau-0"))).animationName).toBe("none");
});

test("chồng đích nảy lên khi nhận lá", { tag: ["@TC-MOTION-009"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED_ACE_ON_COLUMN_1);
  await settle(page);
  expect((await style(gamePage.slot("foundation-1"))).animationName).toBe("none");
  await gamePage.cardNamed("Cơ Át").click();
  await expect.poll(async () => (await style(gamePage.slot("foundation-1"))).animationName).not.toBe("none");
  await page.clock.runFor(300);
  expect((await style(gamePage.slot("foundation-1"))).animationName).toBe("none");
});
