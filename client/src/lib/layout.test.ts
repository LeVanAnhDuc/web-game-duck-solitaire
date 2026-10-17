import { describe, expect, it } from "vitest";
import { createDeck } from "@/game/cards";
import { deal } from "@/game/deal";
import { applyMove } from "@/game/moves";
import { DECK_SIZE, pileKey, type GameState, type PileId } from "@/game/state";
import { FLIGHT_Z, pileHeight, pileOrigin, placements } from "./layout";

const SEED = 20260907;

const T = (index: 0 | 1 | 2 | 3 | 4 | 5 | 6): PileId => ({ kind: "tableau", index });
const F = (index: 0 | 1 | 2 | 3): PileId => ({ kind: "foundation", index });
const STOCK: PileId = { kind: "stock" };
const WASTE: PileId = { kind: "waste" };

const byId = (state: GameState) => new Map(placements(state).map((p) => [p.card.id, p]));

describe("placements", () => {
  it("places all 52 cards, every one exactly once", () => {
    const list = placements(deal(SEED, 1));
    expect(list).toHaveLength(DECK_SIZE);
    expect(new Set(list.map((p) => p.card.id)).size).toBe(DECK_SIZE);
  });

  it("returns deck order, not board order - invariant #11", () => {
    const deckIds = createDeck().map((c) => c.id);
    // Two very different boards must still list the cards in the same order, or React
    // would reorder its nodes and lose transitions mid-flight.
    expect(placements(deal(SEED, 1)).map((p) => p.card.id)).toEqual(deckIds);
    expect(placements(deal(999, 3)).map((p) => p.card.id)).toEqual(deckIds);
  });

  it("keeps deck order after a move, so no node is ever reordered", () => {
    const start = deal(SEED, 1);
    const after = applyMove(start, { type: "draw" });
    expect(placements(after).map((p) => p.card.id)).toEqual(
      placements(start).map((p) => p.card.id),
    );
  });

  it("agrees with the state about which cards are face up - ADR-0002", () => {
    const state = deal(SEED, 1);
    const map = byId(state);
    state.tableau.forEach((column) => {
      for (const card of column.down) expect(map.get(card.id)!.faceUp).toBe(false);
      for (const card of column.up) expect(map.get(card.id)!.faceUp).toBe(true);
    });
    for (const card of state.stock) expect(map.get(card.id)!.faceUp).toBe(false);
  });

  it("assigns each card the pile the state says it is in", () => {
    const state = applyMove(deal(SEED, 1), { type: "draw" });
    const map = byId(state);
    for (const card of state.waste) expect(map.get(card.id)!.pile.kind).toBe("waste");
    state.tableau.forEach((column, index) => {
      for (const card of [...column.down, ...column.up]) {
        expect(pileKey(map.get(card.id)!.pile)).toBe(pileKey(T(index as 0)));
      }
    });
  });
});

describe("coordinates", () => {
  it("puts the top row at y 0 and the tableau one card plus a gap below it", () => {
    expect(pileOrigin(STOCK)).toEqual({ x: "0px", y: "0px" });
    expect(pileOrigin(WASTE).y).toBe("0px");
    expect(pileOrigin(T(0)).y).toBe("calc(var(--card-h) + var(--gap-y))");
  });

  it("lays the seven columns out on one step of card width plus gap", () => {
    expect(pileOrigin(T(0)).x).toBe("0px");
    expect(pileOrigin(T(3)).x).toBe("calc(3 * (var(--card-w) + var(--gap-x)))");
    // Top row: stock 0, waste 1, column 2 stays empty, foundations 3..6.
    expect(pileOrigin(WASTE).x).toBe("calc(1 * (var(--card-w) + var(--gap-x)))");
    expect(pileOrigin(F(0)).x).toBe("calc(3 * (var(--card-w) + var(--gap-x)))");
    expect(pileOrigin(F(3)).x).toBe("calc(6 * (var(--card-w) + var(--gap-x)))");
  });

  it("stacks a tableau column by the face-down overlap, then the face-up one", () => {
    // Column 6 of any deal holds six face-down cards and one face up.
    const state = deal(SEED, 1);
    const column = state.tableau[6]!;
    const map = byId(state);
    const rowY = "calc(var(--card-h) + var(--gap-y))";

    expect(map.get(column.down[0]!.id)!.y).toBe(rowY);
    expect(map.get(column.down[3]!.id)!.y).toBe(
      `calc(${rowY} + calc(3 * var(--overlap-down)))`,
    );
    expect(map.get(column.up[0]!.id)!.y).toBe(
      `calc(${rowY} + calc(6 * var(--overlap-down)))`,
    );
  });

  it("fans the waste by the face-up overlap in draw-3, and not at all in draw-1", () => {
    // One draw in draw-3 mode: exactly three cards in the waste, so all three are in
    // the fan window. Draw again and the older ones fall behind it.
    const three = applyMove(deal(SEED, 3), { type: "draw" });
    const map3 = byId(three);
    const wasteX = pileOrigin(WASTE).x;
    expect(map3.get(three.waste[0]!.id)!.x).toBe(wasteX);
    expect(map3.get(three.waste[1]!.id)!.x).toBe(`calc(${wasteX} + 1 * var(--overlap-up))`);
    expect(map3.get(three.waste[2]!.id)!.x).toBe(`calc(${wasteX} + 2 * var(--overlap-up))`);

    const one = applyMove(applyMove(deal(SEED, 1), { type: "draw" }), { type: "draw" });
    const map1 = byId(one);
    for (const card of one.waste) expect(map1.get(card.id)!.x).toBe(wasteX);
  });

  it("stacks stock and foundations with no offset at all", () => {
    const state = deal(SEED, 1);
    const map = byId(state);
    for (const card of state.stock) {
      expect(map.get(card.id)!.x).toBe("0px");
      expect(map.get(card.id)!.y).toBe("0px");
    }
  });
});

describe("paint order", () => {
  it("rises with position inside a pile", () => {
    const state = deal(SEED, 1);
    const map = byId(state);
    const column = [...state.tableau[6]!.down, ...state.tableau[6]!.up];
    const zs = column.map((c) => map.get(c.id)!.z);
    expect(zs).toEqual([...zs].sort((a, b) => a - b));
    expect(new Set(zs).size).toBe(zs.length);
  });

  it("gives every pile its own band, so bands never interleave", () => {
    const state = deal(SEED, 1);
    const map = byId(state);
    const bandOf = (pile: PileId) => {
      const cards = placements(state).filter((p) => pileKey(p.pile) === pileKey(pile));
      return cards.map((p) => p.z);
    };
    const tableau0 = bandOf(T(0));
    const tableau1 = bandOf(T(1));
    expect(Math.max(...tableau0)).toBeLessThan(Math.min(...tableau1));
    expect(map.get(state.stock[0]!.id)!.z).toBeGreaterThan(Math.max(...tableau1));
  });

  it("keeps the flight z above every band", () => {
    const state = deal(SEED, 1);
    for (const p of placements(state)) expect(p.z).toBeLessThan(FLIGHT_Z);
  });
});

describe("pileHeight", () => {
  it("is one card for every pile that does not stack", () => {
    const state = deal(SEED, 1);
    for (const pile of [STOCK, WASTE, F(0), F(3)]) {
      expect(pileHeight(state, pile)).toBe("var(--card-h)");
    }
  });

  it("is one card for a tableau column holding one card or none", () => {
    const state = deal(SEED, 1);
    expect(pileHeight(state, T(0))).toBe("var(--card-h)");
  });

  it("covers the whole column, including the drop area under the last card", () => {
    const state = deal(SEED, 1);
    expect(pileHeight(state, T(6))).toBe(
      "calc(var(--card-h) + calc(6 * var(--overlap-down)))",
    );
  });
});

describe("dealOrder", () => {
  it("is a permutation of 0..51", () => {
    const orders = placements(deal(SEED, 1))
      .map((p) => p.dealOrder)
      .sort((a, b) => a - b);
    expect(orders).toEqual(Array.from({ length: DECK_SIZE }, (_, i) => i));
  });

  it("deals across the columns rather than down them", () => {
    const state = deal(SEED, 1);
    const map = byId(state);
    // The first seven cards dealt are the bottom card of each column, left to right.
    const firstRow = state.tableau.map((c) => map.get([...c.down, ...c.up][0]!.id)!.dealOrder);
    expect(firstRow).toEqual([0, 1, 2, 3, 4, 5, 6]);
    // Column 6's second card comes after every column has one.
    const column6 = [...state.tableau[6]!.down, ...state.tableau[6]!.up];
    expect(map.get(column6[1]!.id)!.dealOrder).toBe(12);
  });

  it("puts the stock after the 28 dealt cards", () => {
    const state = deal(SEED, 1);
    const map = byId(state);
    expect(map.get(state.stock[0]!.id)!.dealOrder).toBe(28);
  });
});
