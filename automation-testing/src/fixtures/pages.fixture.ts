import { GamePage } from "@/pages/game.page";
import { test as core } from "./core.fixture";

// One fixture per page object, named like the class in camelCase. The game is a single screen: GamePage carries its
// overlays (draw-mode confirm, win dialog, account menu) as properties.
export const test = core.extend<{ gamePage: GamePage }>({
  gamePage: async ({ page }, use) => use(new GamePage(page)),
});
