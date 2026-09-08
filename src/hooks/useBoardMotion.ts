"use client";

import { useEffect, useRef, useState } from "react";
import type { CardId } from "@/game/cards";
import { pileKey } from "@/game/state";
import type { CardPlacement } from "@/lib/layout";
import { MOVE_MS, prefersReducedMotion } from "@/lib/motion";

/**
 * The only place in the whole drawing layer that knows something is moving.
 *
 * Everything else about the board is a pure function of the current state. Three
 * effects cannot be: a card in flight has to paint above every pile it crosses, a
 * foundation pulses because a card just landed on it, and the opening deal needs a
 * first frame where no card is where it belongs yet. All three are answers about the
 * PREVIOUS state, so they live here and nowhere else.
 *
 * None of it reaches the rules. Nothing here enters `history`, and if it all stopped
 * working the game would still be correct - only dull.
 */

export type BoardMotion = {
  /** Cards that just changed pile; they get lifted above every band while they fly. */
  flying: ReadonlySet<CardId>;
  /** Piles a card just landed on, keyed by pileKey. */
  accepted: ReadonlySet<string>;
  /** True for the one frame where a new deal is still stacked on the stock. */
  dealing: boolean;
  /** True while the deal is still playing out, so cards keep their staggered delays. */
  dealStagger: boolean;
};

/** 28 cards at 25ms apart, plus the flight itself, plus a little slack. */
const DEAL_MS = 28 * 25 + MOVE_MS + 100;

const NOTHING: ReadonlySet<never> = new Set();

export function useBoardMotion(placements: readonly CardPlacement[], seed: number): BoardMotion {
  const [flying, setFlying] = useState<ReadonlySet<CardId>>(NOTHING);
  const [accepted, setAccepted] = useState<ReadonlySet<string>>(NOTHING);

  // Adjusting state during render rather than in an effect: `dealing` has to be true
  // in the very first render of a new deal, or the board paints the finished layout
  // for one frame and the cards visibly jump back to the stock before dealing out.
  const [dealtSeed, setDealtSeed] = useState(seed);
  const [dealing, setDealing] = useState(false);
  const [dealStagger, setDealStagger] = useState(false);
  if (dealtSeed !== seed) {
    setDealtSeed(seed);
    setDealing(!prefersReducedMotion());
  }

  useEffect(() => {
    if (!dealStagger) return;
    // The stagger belongs to the deal and nothing else. Left switched on, every later
    // move would inherit a delay of up to 700ms and the board would feel broken.
    const done = window.setTimeout(() => setDealStagger(false), DEAL_MS);
    return () => window.clearTimeout(done);
  }, [dealStagger]);

  useEffect(() => {
    if (!dealing) return;

    const start = () => {
      setDealing(false);
      setDealStagger(true);
    };

    // Two frames: one to commit the stacked-on-the-stock layout with transitions off,
    // the next to switch the real coordinates on so they animate to them.
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(start);
    });

    // And a timer as the way out. requestAnimationFrame does not fire in a background
    // tab, and a browser that is not painting can starve it for a second or more - a
    // board left sitting as one stack on the stock until the player comes back. A
    // timer keeps running either way, and calling start() twice costs nothing.
    const fallback = window.setTimeout(start, 50);

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      window.clearTimeout(fallback);
    };
  }, [dealing]);

  const previous = useRef(new Map<CardId, string>());

  useEffect(() => {
    const now = new Map(placements.map((p) => [p.card.id, pileKey(p.pile)]));
    const moved = new Set<CardId>();
    const landed = new Set<string>();

    for (const [id, pile] of now) {
      const before = previous.current.get(id);
      // `undefined` is the first render, not a move - the whole board would otherwise
      // count as flying on mount.
      if (before !== undefined && before !== pile) {
        moved.add(id);
        if (pile.startsWith("foundation")) landed.add(pile);
      }
    }
    previous.current = now;

    // Nothing is in flight when nothing animates, and the lift exists only to paint a
    // card above the piles it crosses. Skipping it here keeps a reduced-motion board
    // completely static, hit-testing included.
    if (moved.size === 0 || prefersReducedMotion()) return;
    setFlying(moved);
    setAccepted(landed);
    const clear = window.setTimeout(() => {
      setFlying(NOTHING);
      setAccepted(NOTHING);
    }, MOVE_MS);
    return () => window.clearTimeout(clear);
  }, [placements]);

  return { flying, accepted, dealing, dealStagger };
}
