"use client";

// libs
import { useEffect } from "react";

// types
import type { GameState } from "@/game/state";
import type { Move } from "@/game/moves";

// game
import { autoCompleteMoves } from "@/game/auto";

/** One tick of the auto-complete run. */
const AUTO_STEP_MS = 110;

/**
 * Drives an auto-complete run, one move per tick. Ghost: it renders nothing (R-04).
 *
 * It re-asks the engine for the next move on every tick rather than running a
 * precomputed list. That is what makes it cancellable: the moment the player touches
 * anything, `running` goes false and the sequence simply stops (invariant #9).
 *
 * `onPlay` and `onExhausted` must be stable (`useCallback`) at the call site - an
 * inline arrow restarts the timer on every render, which stretches every step.
 */
export function AutoCompleteRunner({
  running,
  state,
  onPlay,
  onExhausted,
}: {
  running: boolean;
  state: GameState;
  onPlay: (move: Move) => void;
  /** No legal auto-move left: the run is over. */
  onExhausted: () => void;
}) {
  useEffect(() => {
    if (!running) return;
    const next = autoCompleteMoves(state)[0];
    if (!next) {
      onExhausted();
      return;
    }
    const id = window.setTimeout(() => onPlay(next), AUTO_STEP_MS);
    return () => window.clearTimeout(id);
  }, [running, state, onPlay, onExhausted]);

  return null;
}
