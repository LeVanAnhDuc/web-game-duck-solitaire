import { test as base } from "@playwright/test";

/**
 * The suite's own `test`, which decides whether the board animates.
 *
 * The default is motion OFF, and that is a correctness requirement rather than a speed
 * one: a headless page that is not painting never advances a CSS transition, so a card
 * would sit at the place it is travelling FROM while Playwright computes its box and
 * clicks - landing the click on whatever else happens to be at those coordinates.
 *
 * That only holds because reduced motion means `transition-property: none` in
 * globals.css rather than a very short duration. A short duration still starts a
 * transition, and a started transition has an interpolated value; with motion off
 * there is no transition at all, so every card is exactly where the state says it is.
 *
 * It is a fixture rather than `use: { reducedMotion: "reduce" }` in the config because
 * that option is not applied here (Playwright 1.62.1, checked at both config and
 * project level: window.matchMedia still reported no preference). page.emulateMedia
 * does work, so the emulation is done explicitly, once, for every test. A config line
 * that quietly does nothing is worse than none.
 *
 * motion.spec.ts opts back in with `test.use({ motion: "on" })`.
 */
export const test = base.extend<{ motion: "on" | "off" }>({
  motion: ["off", { option: true }],
  page: async ({ page, motion }, use) => {
    await page.emulateMedia({
      reducedMotion: motion === "off" ? "reduce" : "no-preference",
    });
    await use(page);
  },
});

export { expect } from "@playwright/test";
