"use client";

// libs
import { useEffect } from "react";

// types
import type { RefObject } from "react";

/**
 * Roving tabindex: move DOM focus onto the pile the keyboard cursor points at.
 *
 * Ghost: it renders nothing (R-04).
 *
 * `active` is false until the player has actually used the keyboard, so loading the
 * page does not steal focus from wherever the browser put it. `pileKey` is `null` when
 * the cursor is not over a real pile - focusing a fallback would move the player
 * somewhere they did not ask to go.
 */
export function FocusActivePile({
  active,
  pileKey,
  container,
}: {
  active: boolean;
  pileKey: string | null;
  container: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!active || pileKey === null) return;
    container.current
      ?.querySelector<HTMLElement>(`[data-pile="${pileKey}"]`)
      ?.focus({ preventScroll: true });
  }, [active, pileKey, container]);

  return null;
}
