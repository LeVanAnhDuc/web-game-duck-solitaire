import { expect, test } from "./fixtures";
import { board, cardCount, cardsIn, openGame, tapStock } from "./helpers";

test.describe("the board loads and stays quiet", () => {
  test("deals seven columns of 1..7 cards and a stock of 24", async ({ page }) => {
    await openGame(page);
    await expect(board(page)).toBeVisible();
    for (let i = 0; i < 7; i++) {
      await expect(cardsIn(page, `tableau-${i}` as "tableau-0")).toHaveCount(i + 1);
    }
    // All 24 stock cards exist in the DOM now, stacked as a real deck: the flat layer
    // needs somewhere for every card to be, and the deal animation starts them here.
    await expect(cardsIn(page, "stock")).toHaveCount(24);
    await expect(cardsIn(page, "waste")).toHaveCount(0);
    await expect(page.locator("[data-card]")).toHaveCount(52);
  });

  test("the same deal number always gives the same deal - FR-13", async ({ page }) => {
    await openGame(page, 4242);
    const snapshot = () =>
      page
        .locator("[data-card]")
        .evaluateAll((els) =>
          els.map(
            (el) =>
              `${el.getAttribute("data-card")}:${el.getAttribute("data-card-pile")}:${el.getAttribute("data-face")}`,
          ),
        );
    const first = await snapshot();
    await page.reload();
    await expect(page.locator("[data-card]").first()).toBeVisible();
    expect(await snapshot()).toEqual(first);
  });

  test("an unusable deal number falls back to a random deal, without an error", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/?van=khong-phai-so");
    await expect(page.locator("[data-card]").first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("every card says which pile it is in, and where in the pile", async ({ page }) => {
    // DOM order is deck order now, so this pair of attributes is the only way anything
    // outside the board can tell which card is on top.
    await openGame(page);
    const indices = await cardsIn(page, "tableau-6").evaluateAll((els) =>
      els.map((el) => Number(el.getAttribute("data-index"))).sort((a, b) => a - b),
    );
    expect(indices).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  test("each pile claims its cards through aria-owns - NFR-A11Y-04", async ({ page }) => {
    // The cards are not the pile's DOM children any more, so this is what keeps the
    // accessibility tree from losing which pile a card belongs to.
    await openGame(page);
    const owns = await page
      .locator('[data-pile="tableau-6"]')
      .getAttribute("aria-owns");
    expect(owns?.split(" ")).toHaveLength(7);
    for (const id of owns!.split(" ")) {
      await expect(page.locator(`[id="${id}"]`)).toHaveAttribute(
        "data-card-pile",
        "tableau-6",
      );
    }
  });

  test("the console stays clean through a handful of moves - NFR-REL-04", async ({ page }) => {
    const noise: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") noise.push(`${m.type()}: ${m.text()}`);
    });
    page.on("pageerror", (e) => noise.push(`pageerror: ${e.message}`));

    await openGame(page);
    for (let i = 0; i < 5; i++) await tapStock(page);
    await page.getByRole("button", { name: "Hoàn lại" }).click();
    await page.getByRole("button", { name: "Chơi lại" }).click();

    expect(noise).toEqual([]);
  });

  test("nothing is stored and nothing is fetched - NFR-DATA-01", async ({ page }) => {
    const requests: string[] = [];
    await openGame(page);
    // Only what happens AFTER the page is up: the document and its bundle are the
    // point of a static site; a request during play is not.
    page.on("request", (r) => requests.push(r.url()));
    for (let i = 0; i < 3; i++) await tapStock(page);

    expect(requests).toEqual([]);
    const stored = await page.evaluate(() => ({
      local: window.localStorage.length,
      session: window.sessionStorage.length,
      cookie: document.cookie,
    }));
    expect(stored).toEqual({ local: 0, session: 0, cookie: "" });
    expect(await cardCount(page, "waste")).toBe(3);
  });
});
