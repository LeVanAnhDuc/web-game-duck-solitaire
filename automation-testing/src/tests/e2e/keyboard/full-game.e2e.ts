import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { WINNABLE } from "@/data/winnable";
import { FOUNDATIONS, TABLEAU, type GamePage, type PileKey } from "@/pages/game.page";
import { applyToCounts, pileKeyOf, type FixtureMove } from "@/utils/pile-counts";

// NFR-A11Y-02: "thử tay + E2E chơi hết ván chỉ bằng phím". The winnable deal (src/data/winnable.ts) is played from the
// deal to the win dialog with nothing but the keyboard: arrows to walk, Space to pick up and put down, ↑ to grab a
// deeper run, Enter to send a card home. No mouse event and no toolbar button is used.

async function playByKeyboard(gamePage: GamePage, move: FixtureMove): Promise<void> {
  const { page } = gamePage;
  if (move.type !== "move") {
    await gamePage.moveCursorTo("stock");
    await page.keyboard.press("Space");
    return;
  }
  const from = pileKeyOf(move.from) as PileKey;
  const to = pileKeyOf(move.to) as PileKey;
  await gamePage.moveCursorTo(from);
  if (move.to.kind === "foundation") {
    // Holding a column card, ↑/↓ change the grab instead of the row - Enter is the keyboard's way up.
    await page.keyboard.press("Enter");
    return;
  }
  await page.keyboard.press("Space");
  for (let i = 1; i < move.count; i++) await page.keyboard.press("ArrowUp");
  await gamePage.moveCursorTo(to);
  await page.keyboard.press("Space");
}

test("chơi trọn một ván tới màn thắng chỉ bằng bàn phím", { tag: ["@TC-KEYBOARD-013"] }, async ({ page, gamePage }) => {
  test.setTimeout(600_000);
  // Tall enough for the longest column, so no pile ever sits below the fold.
  await page.setViewportSize({ width: 1440, height: 1600 });
  await gamePage.goto(WINNABLE.seed);
  if (WINNABLE.drawMode === 3) await gamePage.drawModeSelect().selectOption("3");
  await page.keyboard.press("Tab");
  await gamePage.waitFocusOn("tableau-0");

  let expected: Record<string, number> = await gamePage.pileCounts();
  for (const [i, move] of WINNABLE.moves.entries()) {
    await playByKeyboard(gamePage, move);
    expected = applyToCounts(expected, move, WINNABLE.drawMode);
    await expect
      .poll(() => gamePage.pileCounts(), { message: `move ${i} (${JSON.stringify(move)})`, timeout: 5000 })
      .toEqual(expected);
  }
  await expect(gamePage.cards().and(page.locator('[data-face="down"][data-card-pile^="tableau"]'))).toHaveCount(0);

  // Every card is face up. Finish the way a keyboard player would: Enter on each pile in turn, and the stock when a
  // round sends nothing up.
  const sources: PileKey[] = ["waste", ...TABLEAU];
  for (let round = 0; round < 60; round++) {
    const up = async () => (await Promise.all(FOUNDATIONS.map((f) => gamePage.cardCount(f)))).reduce((a, b) => a + b, 0);
    if ((await up()) === 52) break;
    const before = await up();
    for (const pile of sources) {
      if ((await gamePage.cardCount(pile)) === 0) continue;
      await gamePage.moveCursorTo(pile);
      await page.keyboard.press("Enter");
    }
    if ((await up()) === before) {
      await gamePage.moveCursorTo("stock");
      await page.keyboard.press("Space");
    }
  }

  await expect(gamePage.winDialog.root()).toBeVisible();
  await expect(gamePage.winDialog.root()).toContainText(copy.win.title);
});
