/**
 * One answer to "should this animate?", shared by everything that has to decide it in
 * JavaScript rather than in CSS.
 *
 * globals.css already flattens every transition and animation under
 * `prefers-reduced-motion: reduce`, so a CSS-only effect needs nothing from here. Two
 * effects are state machines instead - the opening deal and the win sequence - and
 * they have to be skipped rather than shortened, because a zero-duration deal still
 * renders a frame with every card stacked on the stock (NFR-A11Y-05).
 */
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Durations that JavaScript has to know as numbers, mirroring MASTER.md section 4.
 * MASTER.md is the source; these exist only because a setTimeout cannot read a CSS
 * variable. If they ever disagree with the tokens in globals.css, the tokens win.
 */
export const MOVE_MS = 180;
export const WIN_CELEBRATION_MS = 500;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** Calls back whenever the setting changes; returns the unsubscribe. */
export function onReducedMotionChange(handler: (reduced: boolean) => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  const listener = () => handler(query.matches);
  query.addEventListener?.("change", listener);
  return () => query.removeEventListener?.("change", listener);
}
