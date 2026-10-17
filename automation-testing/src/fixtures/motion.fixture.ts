import { test as core } from "./core.fixture";

/**
 * Whether the board animates. The default is motion OFF, and that is a correctness requirement rather than a speed
 * one: a headless page that is not painting never advances a CSS transition, so a card would sit at the place it is
 * travelling FROM while Playwright computes its box and clicks - landing the click on whatever else is there.
 *
 * That only holds because reduced motion means `transition-property: none` in the app's globals.css rather than a
 * very short duration: with motion off there is no transition at all, so every card is exactly where the state says.
 *
 * A fixture rather than `use: { reducedMotion: "reduce" }`: that option was not applied on the old suite's Playwright
 * (1.62.1, checked at config and project level - matchMedia still reported no preference), while page.emulateMedia
 * works. The motion module opts back in with `test.use({ motion: "on" })`.
 */
export const test = core.extend<{ motion: "on" | "off" }>({
  motion: ["off", { option: true }],
  page: async ({ page, motion }, use) => {
    await page.emulateMedia({ reducedMotion: motion === "off" ? "reduce" : "no-preference" });
    await use(page);
  },
});
