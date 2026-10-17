// A black-box model of how many cards each pile holds, driven only by the moves themselves: every Klondike move says
// which piles change and by how many. The suite uses it to check a long replay move by move without importing the
// game's engine - the engine is what is under test.

export type PileRef = { kind: string; index?: number };

export type FixtureMove =
  | { type: "draw" }
  | { type: "recycle" }
  | { type: "move"; from: PileRef; to: PileRef; count: number };

/** "tableau-3", "foundation-0", "stock", "waste" - the key the board uses in data-pile / data-card-pile. */
export function pileKeyOf(pile: PileRef): string {
  return pile.index === undefined ? pile.kind : `${pile.kind}-${pile.index}`;
}

/** The counts after `move`, given the counts before it. Does not modify `counts`. */
export function applyToCounts(
  counts: Readonly<Record<string, number>>,
  move: FixtureMove,
  drawMode: 1 | 3,
): Record<string, number> {
  const next = { ...counts };
  if (move.type === "draw") {
    const n = Math.min(drawMode, next.stock ?? 0);
    next.stock = (next.stock ?? 0) - n;
    next.waste = (next.waste ?? 0) + n;
  } else if (move.type === "recycle") {
    next.stock = next.waste ?? 0;
    next.waste = 0;
  } else {
    const from = pileKeyOf(move.from);
    const to = pileKeyOf(move.to);
    next[from] = (next[from] ?? 0) - move.count;
    next[to] = (next[to] ?? 0) + move.count;
  }
  return next;
}
