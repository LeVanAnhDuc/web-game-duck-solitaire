"use client";

// libs
import { useEffect } from "react";

// others
import { WIN_CELEBRATION_MS, prefersReducedMotion } from "@/lib/motion";

/**
 * The four foundations light up in turn before the overlay covers the board - the
 * board is what the player just finished, and it deserves the moment. Under reduced
 * motion there is nothing to watch, so the overlay comes straight up.
 *
 * Ghost: it renders nothing (R-04). It also stops any auto-complete run, because a
 * finished game has nothing left to auto-complete.
 */
export function CelebrateWin({
  won,
  onCelebrating,
  onStopAuto,
}: {
  won: boolean;
  onCelebrating: (celebrating: boolean) => void;
  onStopAuto: () => void;
}) {
  useEffect(() => {
    if (!won) {
      onCelebrating(false);
      return;
    }
    onStopAuto();
    if (prefersReducedMotion()) return;
    onCelebrating(true);
    const done = window.setTimeout(() => onCelebrating(false), WIN_CELEBRATION_MS);
    return () => window.clearTimeout(done);
    // Only `won` is a real signal; the two callbacks are stable at the call site and
    // listing them here would re-run the celebration on an unrelated render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  return null;
}
