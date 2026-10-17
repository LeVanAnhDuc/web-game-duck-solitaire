import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { WINNABLE } from "@/data/winnable";
import { FOUNDATIONS, type GamePage, type PileKey } from "@/pages/game.page";
import { applyToCounts, pileKeyOf } from "@/utils/pile-counts";

// FR-06 · FR-08 · US-03 · invariant #9. One known winnable deal (src/data/winnable.ts) played through the real UI up to
// the first position where every card is face up; "Hoàn tất" does the rest.
//
// It replays by DRAGGING. One tap puts a card up (FR-14), so tapping a source card that has a foundation home would
// play a move of its own and the scripted line would go out of step; a drop names exactly one pile.

/** Plays the fixture line, checking every pile's count against the black-box model after each move. */
async function replayToAllFaceUp(gamePage: GamePage, beforeLast?: () => Promise<void>): Promise<void> {
  let expected: Record<string, number> = await gamePage.pileCounts();
  for (const [i, move] of WINNABLE.moves.entries()) {
    if (i === WINNABLE.moves.length - 1 && beforeLast) await beforeLast();
    try {
      if (move.type === "move") {
        const from = pileKeyOf(move.from) as PileKey;
        const count = await gamePage.cardCount(from);
        // The run being lifted is the last `count` cards: grab its lowest card and the rest come along.
        await gamePage.dragTo(gamePage.cardAt(from, count - move.count), pileKeyOf(move.to) as PileKey);
      } else {
        await gamePage.tapStock();
      }
    } catch (error) {
      throw new Error(`move ${i} of ${WINNABLE.moves.length} (${JSON.stringify(move)}) failed: ${String(error)}`);
    }
    expected = applyToCounts(expected, move, WINNABLE.drawMode);
    expect(await gamePage.pileCounts(), `move ${i} (${JSON.stringify(move)})`).toEqual(expected);
  }
}

const onFoundations = async (gamePage: GamePage) =>
  (await Promise.all(FOUNDATIONS.map((f) => gamePage.cardCount(f)))).reduce((a, b) => a + b, 0);

test.describe("một ván thắng được, chơi tới cuối", () => {
  test.setTimeout(600_000);
  // Tall enough for the whole board, including a column of thirteen.
  test.use({ viewport: { width: 1440, height: 1600 } });

  test("\"Hoàn tất\" bật đúng lúc lá úp cuối cùng lật lên và đưa ván tới màn thắng", { tag: ["@TC-WIN-001", "@smoke"] }, async ({
    gamePage,
  }) => {
    await gamePage.goto(WINNABLE.seed);
    await expect(gamePage.autoCompleteButton()).toHaveAttribute("aria-disabled", "true");

    await replayToAllFaceUp(gamePage, async () => {
      // One move before the end a face-down card is still on the board: the button is still off.
      await expect(gamePage.autoCompleteButton()).toHaveAttribute("aria-disabled", "true");
    });
    await expect(gamePage.autoCompleteButton()).toHaveAttribute("aria-disabled", "false");
    const upBefore = await onFoundations(gamePage);

    await gamePage.autoCompleteButton().click();

    const dialog = gamePage.winDialog.root();
    await expect(dialog).toBeVisible({ timeout: 60_000 });
    for (const f of FOUNDATIONS) await expect(gamePage.cardsIn(f)).toHaveCount(13);
    // Each foundation is one suit, Át at the bottom and Già on top.
    for (const [i, f] of FOUNDATIONS.entries()) {
      const suit = ["Bích", "Cơ", "Rô", "Tép"][i]!;
      await expect(gamePage.cardAt(f, 0)).toHaveAttribute("aria-label", `${suit} Át`);
      await expect(gamePage.cardAt(f, 12)).toHaveAttribute("aria-label", `${suit} Già`);
    }

    // "Xong ván trong N nước đi.": the scripted line plus at least one move per card still to go up.
    await expect(dialog).toContainText(copy.win.title);
    const body = (await dialog.textContent()) ?? "";
    const moves = Number(body.match(/Xong ván trong (\d+) nước đi\./)?.[1]);
    expect(moves).toBeGreaterThanOrEqual(WINNABLE.moves.length + (52 - upBefore));
    await expect(dialog).toContainText(copy.win.body(moves));
  });

  test("hoàn lại hay ván mới giữa chuỗi tự hoàn tất thì chuỗi dừng ngay", { tag: ["@TC-WIN-002"] }, async ({ page, gamePage }) => {
    // The chain plays one move every 110ms on a window timer; the fake clock decides exactly how many it gets.
    await page.clock.install();
    await gamePage.goto(WINNABLE.seed);
    await replayToAllFaceUp(gamePage);
    const start = await onFoundations(gamePage);

    await gamePage.autoCompleteButton().click();
    await page.clock.runFor(400);
    const running = await onFoundations(gamePage);
    expect(running).toBeGreaterThan(start);

    await gamePage.undoButton().click();
    const afterUndo = await gamePage.snapshot();
    await page.clock.runFor(3000);
    // Stopped: nothing else moved, and the game is not won behind the player's back.
    expect(await gamePage.snapshot()).toEqual(afterUndo);
    await expect(gamePage.winDialog.root()).toHaveCount(0);

    // Started again, then a new deal mid-chain: the chain must not carry on into the new game.
    await gamePage.autoCompleteButton().click();
    await page.clock.runFor(400);
    await gamePage.newGameButton().click();
    const dealt = await gamePage.snapshot();
    await page.clock.runFor(3000);
    expect(await gamePage.snapshot()).toEqual(dealt);
    await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
  });

  test("\"Chơi ván mới\" trên màn thắng chia một ván khác", { tag: ["@TC-WIN-003"] }, async ({ gamePage }) => {
    await gamePage.goto(WINNABLE.seed);
    await replayToAllFaceUp(gamePage);
    await gamePage.autoCompleteButton().click();
    await expect(gamePage.winDialog.root()).toBeVisible({ timeout: 60_000 });
    await expect(gamePage.winDialog.root()).toBeFocused();

    await gamePage.winDialog.playAgainButton().click();

    await expect(gamePage.winDialog.root()).toHaveCount(0);
    await expect(gamePage.seedLabel(WINNABLE.seed)).toHaveCount(0);
    for (const f of FOUNDATIONS) await expect(gamePage.cardsIn(f)).toHaveCount(0);
    await expect(gamePage.cardsIn("stock")).toHaveCount(24);
    await expect(gamePage.undoButton()).toHaveAttribute("aria-disabled", "true");
  });
});
