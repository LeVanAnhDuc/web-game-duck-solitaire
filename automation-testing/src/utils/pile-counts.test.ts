import { test, expect } from "@playwright/test";
import { applyToCounts, pileKeyOf } from "./pile-counts";

const dealt = { stock: 24, waste: 0, "tableau-0": 1, "tableau-6": 7, "foundation-0": 0 };

test("pileKeyOf names piles the way the board does", () => {
  expect(pileKeyOf({ kind: "stock" })).toBe("stock");
  expect(pileKeyOf({ kind: "tableau", index: 3 })).toBe("tableau-3");
});

test("a draw moves drawMode cards, or what is left", () => {
  expect(applyToCounts(dealt, { type: "draw" }, 1)).toMatchObject({ stock: 23, waste: 1 });
  expect(applyToCounts({ ...dealt, stock: 2 }, { type: "draw" }, 3)).toMatchObject({ stock: 0, waste: 2 });
});

test("a recycle turns the whole waste back", () => {
  expect(applyToCounts({ ...dealt, stock: 0, waste: 24 }, { type: "recycle" }, 1)).toMatchObject({ stock: 24, waste: 0 });
});

test("a move takes count from one pile and gives it to the other, leaving the input alone", () => {
  const move = { type: "move", from: { kind: "tableau", index: 6 }, to: { kind: "foundation", index: 0 }, count: 1 } as const;
  expect(applyToCounts(dealt, move, 1)).toMatchObject({ "tableau-6": 6, "foundation-0": 1 });
  expect(dealt["tableau-6"]).toBe(7);
});
