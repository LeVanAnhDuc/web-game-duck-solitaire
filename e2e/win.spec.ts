import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import fixture from "./fixtures/winnable.json";
import { cardAt, cardCount, slot, tapStock, type PileKey } from "./helpers";
import { deal } from "@/game/deal";
import { applyMove, type Move as EngineMove } from "@/game/moves";
import { cardsOf, type GameState, type PileId } from "@/game/state";

/**
 * FR-08: one deal played all the way to the win screen, through the real UI.
 *
 * Roughly a fifth of Klondike deals cannot be won at all and the winnable ones are not
 * winnable by playing greedily, so this line was found by search - see
 * scripts/find-winnable.ts. The fixture stops at the first position where every card is
 * face up, and the game's own "Hoàn tất" plays the rest: that is the button's whole
 * purpose, and it keeps the replay to something a browser test can afford.
 *
 * It replays by DRAGGING, and that is now required rather than a preference. One tap
 * puts a card up (FR-14), so clicking a source card that has a foundation home plays a
 * move of its own and the scripted line goes out of step immediately. Dragging says
 * exactly one thing. It also means this test covers a full game played with the drag
 * gesture, which is what the drag half of FR-04 was missing.
 *
 * It runs on one viewport. The point is the rules and the win path, and neither varies
 * by screen width; the layout suite is what covers the widths.
 */

type Move = (typeof fixture.moves)[number];

const pileOf = (pile: { kind: string; index?: number }): PileKey =>
  (pile.index === undefined ? pile.kind : `${pile.kind}-${pile.index}`) as PileKey;

async function dragMove(page: Page, move: Extract<Move, { type: "move" }>) {
  const from = pileOf(move.from);
  const count = await cardCount(page, from);
  // The run being lifted is the last `count` cards, so its lowest card is the one to
  // grab - everything above it comes along.
  const source = cardAt(page, from, count - move.count);
  // A mouse drag is raw coordinates, and raw coordinates do not scroll. Late in a game
  // a column is long enough to run past the fold, and a drag aimed below it goes
  // nowhere at all - which is what made this replay stop at move 432.
  await source.scrollIntoViewIfNeeded();
  const start = await source.boundingBox();
  const target = await slot(page, pileOf(move.to)).boundingBox();
  if (!start || !target) throw new Error(`no box for ${from} -> ${pileOf(move.to)}`);

  // Aim at the top strip of the card: cards in a column overlap, so a covered card's
  // centre is under the card above it. That is where a player aims too.
  await page.mouse.move(start.x + start.width / 2, start.y + 8);
  await page.mouse.down();
  // The first step crosses the 6px threshold that separates a tap from a drag.
  await page.mouse.move(start.x + start.width / 2 + 12, start.y + 24);
  await page.mouse.move(
    target.x + target.width / 2,
    target.y + Math.min(target.height / 2, 24),
    { steps: 3 },
  );
  await page.mouse.up();
}

test.describe("a game played to the end - FR-08", () => {
  test.setTimeout(600_000);
  // Tall enough for the whole board, including a column of thirteen. This test is
  // about the rules and the win path; the widths are layout.spec.ts's job.
  test.use({ viewport: { width: 1440, height: 1600 } });

  test("replaying a known solution reaches the win screen", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "runs once, on the widest board");

    await page.goto(`/?van=${fixture.seed}`);
    await expect(page.locator("[data-card]").first()).toBeVisible();

    const autoComplete = page.getByRole("button", { name: "Hoàn tất" });
    // Nothing is finishable at the deal: every column still hides cards.
    await expect(autoComplete).toHaveAttribute("aria-disabled", "true");

    // The engine is the reference. Replaying the same moves here and comparing pile
    // counts after every step means a drag that quietly did nothing is caught on the
    // move it happened, not four hundred moves later where it is unreadable.
    let expected: GameState = deal(fixture.seed, fixture.drawMode as 1 | 3);

    const PILES: { key: PileKey; id: PileId }[] = [
      { key: "stock", id: { kind: "stock" } },
      { key: "waste", id: { kind: "waste" } },
      ...([0, 1, 2, 3] as const).map((i) => ({
        key: `foundation-${i}` as PileKey,
        id: { kind: "foundation", index: i } as PileId,
      })),
      ...([0, 1, 2, 3, 4, 5, 6] as const).map((i) => ({
        key: `tableau-${i}` as PileKey,
        id: { kind: "tableau", index: i } as PileId,
      })),
    ];

    const moves = fixture.moves as Move[];
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i]!;
      try {
        if (move.type === "draw" || move.type === "recycle") await tapStock(page);
        else await dragMove(page, move);
      } catch (error) {
        throw new Error(
          `move ${i} of ${moves.length} (${JSON.stringify(move)}) failed: ${String(error)}`,
        );
      }

      expected = applyMove(expected, move as EngineMove);
      for (const pile of PILES) {
        expect(
          await cardCount(page, pile.key),
          `move ${i} (${JSON.stringify(move)}): ${pile.key} is wrong`,
        ).toBe(cardsOf(expected, pile.id).length);
      }
    }

    // Every card is face up now, which is exactly when the button turns on.
    await expect(autoComplete).not.toHaveAttribute("aria-disabled", "true");
    await autoComplete.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 60_000 });
    await expect(dialog).toContainText("Thắng rồi!");

    await dialog.getByRole("button", { name: "Chơi ván mới" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
