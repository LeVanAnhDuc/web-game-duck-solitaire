import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { deal } from "@/game/deal";
import { applyMove } from "@/game/moves";
import { findFoundationTarget } from "@/game/auto";
import { pileKey, type PileId } from "@/game/state";
import { placements } from "@/lib/layout";
import { MOVE_MS } from "@/lib/motion";
import { useBoardMotion } from "./useBoardMotion";

const SEED = 20260907;

/** happy-dom has no matchMedia, and this hook's whole job depends on the answer. */
function setReducedMotion(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    (query: string) => ({
      matches: reduced && query.includes("reduce"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  );
}

describe("useBoardMotion", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setReducedMotion(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("reports nothing in flight on the first render", () => {
    // Every card "arrived" at mount; treating that as movement would light up the
    // whole board.
    const board = placements(deal(SEED, 1));
    const { result } = renderHook(() => useBoardMotion(board, SEED));
    expect(result.current.flying.size).toBe(0);
    expect(result.current.accepted.size).toBe(0);
  });

  it("lifts a card that changed pile, then puts it back down", () => {
    const start = deal(SEED, 1);
    const { result, rerender } = renderHook(
      ({ board, seed }: { board: ReturnType<typeof placements>; seed: number }) =>
        useBoardMotion(board, seed),
      { initialProps: { board: placements(start), seed: SEED } },
    );

    const drawn = applyMove(start, { type: "draw" });
    const moved = start.stock[start.stock.length - 1]!;
    act(() => rerender({ board: placements(drawn), seed: SEED }));

    expect([...result.current.flying]).toEqual([moved.id]);

    act(() => {
      vi.advanceTimersByTime(MOVE_MS + 10);
    });
    expect(result.current.flying.size).toBe(0);
  });

  it("names the foundation a card landed on, so the pile can pulse", () => {
    // Seed 20260904 deals an ace onto a column top; ask the engine which one rather
    // than guessing, so the test does not depend on reading the deal by eye.
    const start = deal(20260904, 1);
    let move = null as ReturnType<typeof findFoundationTarget>;
    for (const index of [0, 1, 2, 3, 4, 5, 6] as const) {
      move = findFoundationTarget(start, { kind: "tableau", index });
      if (move) break;
    }
    expect(move, "this deal has no card ready to go up").not.toBeNull();
    const landedOn = pileKey((move as { to: PileId }).to);

    const { result, rerender } = renderHook(
      ({ board, seed }: { board: ReturnType<typeof placements>; seed: number }) =>
        useBoardMotion(board, seed),
      { initialProps: { board: placements(start), seed: 20260904 } },
    );
    act(() => rerender({ board: placements(applyMove(start, move!)), seed: 20260904 }));
    expect([...result.current.accepted]).toEqual([landedOn]);
  });

  it("deals on the frame a new seed arrives, and only that frame", () => {
    const { result, rerender } = renderHook(
      ({ board, seed }: { board: ReturnType<typeof placements>; seed: number }) =>
        useBoardMotion(board, seed),
      { initialProps: { board: placements(deal(1, 1)), seed: 1 } },
    );
    expect(result.current.dealing).toBe(false);

    act(() => rerender({ board: placements(deal(2, 1)), seed: 2 }));
    expect(result.current.dealing).toBe(true);

    // The timer is the way out when requestAnimationFrame is starved - a background
    // tab would otherwise leave the board sitting as one stack on the stock.
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.dealing).toBe(false);
    expect(result.current.dealStagger).toBe(true);
  });

  it("skips the deal and the lift entirely under reduced motion - NFR-A11Y-05", () => {
    setReducedMotion(true);
    const start = deal(SEED, 1);
    const { result, rerender } = renderHook(
      ({ board, seed }: { board: ReturnType<typeof placements>; seed: number }) =>
        useBoardMotion(board, seed),
      { initialProps: { board: placements(deal(1, 1)), seed: 1 } },
    );

    act(() => rerender({ board: placements(start), seed: SEED }));
    expect(result.current.dealing).toBe(false);

    act(() =>
      rerender({ board: placements(applyMove(start, { type: "draw" })), seed: SEED }),
    );
    // No lift means no card ever paints above the piles - and no card ever swallows a
    // tap aimed at the one below it.
    expect(result.current.flying.size).toBe(0);
  });
});
