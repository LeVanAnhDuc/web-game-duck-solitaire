import type { FixtureMove } from "@/utils/pile-counts";
import fixture from "./files/winnable.json";

/**
 * A deal that can be won, and the moves that win it up to the first position where every card is face up - from
 * there "Hoàn tất" (or a keyboard player pressing Enter pile by pile) finishes the game.
 *
 * Roughly a fifth of Klondike deals have no solution and the rest are not solvable greedily, so the line was found by
 * search: ../client/scripts/find-winnable.ts, which writes ./files/winnable.json. Changing the dealer (mulberry32, deck
 * order, shuffle) points the seed at another deal and this fixture goes red - on purpose (ADR-0001).
 */
export const WINNABLE = {
  seed: fixture.seed,
  drawMode: fixture.drawMode as 1 | 3,
  moves: fixture.moves as unknown as FixtureMove[],
};
