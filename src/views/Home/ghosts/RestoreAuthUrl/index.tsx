"use client";

// libs
import { useLayoutEffect } from "react";

// others
import { restoreCapturedUrl } from "@/lib/auth/duckerAuth";

/**
 * Puts the address back to what the player had before signing in (game params kept,
 * OAuth params gone) once Next's router has finished rewriting it - see
 * restoreCapturedUrl. A layout effect so it runs before useGame's passive effect reads
 * ?van. A no-op unless a Ducker ID callback was captured.
 *
 * Ghost: it renders nothing (R-04).
 */
export function RestoreAuthUrl() {
  useLayoutEffect(() => {
    restoreCapturedUrl();
  }, []);
  return null;
}
