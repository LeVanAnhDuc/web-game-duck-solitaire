import { test } from "@/fixtures";
import { SEED } from "@/data/test-data";

// Seed for the playwright-test agents (planner / generator): a fresh browser on a fixed deal, motion off.
// Point it at the screen the next module starts from (e.g. a page object's goto()).
test("seed", async ({ gamePage }) => {
  await gamePage.goto(SEED);
});
