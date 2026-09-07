import { createDeck, type Card } from "@/game/cards";
import {
  DECK_SIZE,
  pileKey,
  FOUNDATION_COUNT,
  TABLEAU_COUNT,
  type FoundationIndex,
  type GameState,
  type PileId,
  type TableauIndex,
} from "@/game/state";

/**
 * Where every card sits on the board. Pure geometry over a GameState - no React, no
 * DOM, no measuring (see invariant #12).
 *
 * Cards used to be children of the pile that held them, which made a card moving from
 * one pile to another unmount and remount: nothing for a CSS transition to interpolate
 * between, so the board had no motion at all. Now one flat layer owns all 52, and a
 * move is the same DOM node getting new coordinates.
 *
 * Every coordinate is a `calc()` expression over the tokens in MASTER.md rather than a
 * pixel number. That is what keeps the board responsive without a resize listener, and
 * it is why this file can be tested without rendering anything.
 */

export type CardPlacement = {
  card: Card;
  /** Which pile the card belongs to - drives aria-owns and the e2e selectors. */
  pile: PileId;
  /** Position within that pile, counting from the bottom. */
  indexInPile: number;
  faceUp: boolean;
  /** How many cards move with this one - the aria-label says so. */
  stackCount: number;
  x: string;
  y: string;
  z: number;
  /** Order the opening deal plays this card in, 0..51. */
  dealOrder: number;
};

/**
 * Paint order, one 100-wide band per pile. Bands only matter while a card is in
 * flight: piles do not overlap where they sit, so within-pile order is all the static
 * board needs. BoardLayer lifts a moving card above every band for the duration of
 * its move.
 */
const PILE_ORDER: readonly PileId[] = [
  ...Array.from({ length: TABLEAU_COUNT }, (_, i) => ({
    kind: "tableau" as const,
    index: i as TableauIndex,
  })),
  { kind: "waste" },
  { kind: "stock" },
  ...Array.from({ length: FOUNDATION_COUNT }, (_, i) => ({
    kind: "foundation" as const,
    index: i as FoundationIndex,
  })),
];

const Z_BAND = 100;

const BANDS = new Map(PILE_ORDER.map((pile, at) => [pileKey(pile), at * Z_BAND]));

function bandOf(pile: PileId): number {
  return BANDS.get(pileKey(pile)) ?? 0;
}

/** Which of the seven columns a pile lives in. Column 2 of the top row stays empty. */
function columnOf(pile: PileId): number {
  switch (pile.kind) {
    case "stock":
      return 0;
    case "waste":
      return 1;
    case "foundation":
      return 3 + pile.index;
    case "tableau":
      return pile.index;
  }
}

const TOP_ROW_Y = "0px";
const TABLEAU_ROW_Y = "calc(var(--card-h) + var(--gap-y))";

function rowY(pile: PileId): string {
  return pile.kind === "tableau" ? TABLEAU_ROW_Y : TOP_ROW_Y;
}

function columnX(column: number): string {
  return column === 0 ? "0px" : `calc(${column} * (var(--card-w) + var(--gap-x)))`;
}

/** The offset of a tableau card below the top of its column. */
function stackOffset(indexInPile: number, downCount: number): string {
  const down = Math.min(indexInPile, downCount);
  const up = Math.max(0, indexInPile - downCount);
  if (down === 0 && up === 0) return "0px";
  const parts: string[] = [];
  if (down > 0) parts.push(`${down} * var(--overlap-down)`);
  if (up > 0) parts.push(`${up} * var(--overlap-up)`);
  return `calc(${parts.join(" + ")})`;
}

function addLengths(a: string, b: string): string {
  if (b === "0px") return a;
  if (a === "0px") return b;
  return `calc(${a} + ${b})`;
}

/** The slot a pile occupies - the position of its bottom card. */
export function pileOrigin(pile: PileId): { x: string; y: string } {
  return { x: columnX(columnOf(pile)), y: rowY(pile) };
}

/**
 * How tall a pile's drop zone has to be. It cannot be guessed: the zone must cover the
 * whole column including the gap below the last card, and the grid cell must reserve
 * enough room that the longest column does not run under the toolbar.
 */
export function pileHeight(state: GameState, pile: PileId): string {
  if (pile.kind !== "tableau") return "var(--card-h)";
  const column = state.tableau[pile.index];
  const total = column.down.length + column.up.length;
  if (total <= 1) return "var(--card-h)";
  return `calc(var(--card-h) + ${stackOffset(total - 1, column.down.length)})`;
}

/**
 * Klondike deals across, not down: one card to each of the seven columns, then to six
 * of them, and so on. This reproduces that order so the opening animation looks like
 * a deal rather than seven columns filling one at a time.
 */
function tableauDealOrder(column: number, indexInPile: number): number {
  const pass = indexInPile;
  const before = 7 * pass - (pass * (pass - 1)) / 2;
  return before + (column - pass);
}

const TABLEAU_DEALT = 28;

/**
 * All 52 cards, always, and always in deck order rather than board order. A fixed
 * order is what stops React from ever reordering the nodes, which is what stops a
 * transition from being lost mid-flight (invariant #11).
 */
export function placements(state: GameState): CardPlacement[] {
  const out = new Map<string, CardPlacement>();

  const add = (
    card: Card,
    pile: PileId,
    indexInPile: number,
    faceUp: boolean,
    offset: string,
    dealOrder: number,
    stackCount: number,
    xOverride?: string,
  ) => {
    const origin = pileOrigin(pile);
    out.set(card.id, {
      card,
      pile,
      indexInPile,
      faceUp,
      stackCount,
      x: xOverride ?? origin.x,
      y: addLengths(origin.y, offset),
      z: bandOf(pile) + indexInPile,
      dealOrder,
    });
  };

  state.tableau.forEach((column, index) => {
    const pile: PileId = { kind: "tableau", index: index as TableauIndex };
    const cards = [...column.down, ...column.up];
    cards.forEach((card, i) => {
      add(
        card,
        pile,
        i,
        i >= column.down.length,
        stackOffset(i, column.down.length),
        tableauDealOrder(index, i),
        cards.length - i,
      );
    });
  });

  // Face-down and stacked, as a real deck is: the old board drew only the top card,
  // but the deal animation needs somewhere for all 24 to start from.
  const stock: PileId = { kind: "stock" };
  state.stock.forEach((card, i) => {
    add(card, stock, i, false, "0px", TABLEAU_DEALT + i, 1);
  });

  // The waste fans out by up to drawMode cards. Anything behind the fan sits under its
  // first card, hidden by z-order rather than by not being rendered.
  const waste: PileId = { kind: "waste" };
  const fanStart = Math.max(0, state.waste.length - Math.max(1, state.drawMode));
  const wasteOrigin = pileOrigin(waste);
  state.waste.forEach((card, i) => {
    const step = Math.max(0, i - fanStart);
    const x =
      step === 0 ? wasteOrigin.x : `calc(${wasteOrigin.x} + ${step} * var(--overlap-up))`;
    add(card, waste, i, true, "0px", TABLEAU_DEALT + i, 1, x);
  });

  state.foundations.forEach((cards, index) => {
    const pile: PileId = { kind: "foundation", index: index as FoundationIndex };
    cards.forEach((card, i) => {
      add(card, pile, i, true, "0px", TABLEAU_DEALT + i, 1);
    });
  });

  // Deck order, not board order. Reading it back through createDeck() also proves
  // every card was placed exactly once - a card missing here would otherwise surface
  // much later as a hole on the board.
  return createDeck().map((card) => {
    const placement = out.get(card.id);
    if (!placement) throw new Error(`layout: ${card.id} is not on the board`);
    return placement;
  });
}

/** The z a card gets while it is moving: above every band, and above the one before. */
export const FLIGHT_Z = PILE_ORDER.length * Z_BAND + DECK_SIZE;
