"use client";

import { useEffect, useSyncExternalStore } from "react";
import { DUCKER_CONFIG } from "@/lib/auth/config";
import { settleCallbackUrl } from "@/lib/auth/duckerAuth";
import {
  getServerSnapshot,
  getSnapshot,
  signIn,
  signOut,
  subscribe,
} from "@/lib/auth/duckerSession";
import type { AuthSnapshot } from "@/lib/auth/types";

/**
 * Optional Ducker ID sign-in as seen by React. The server snapshot is always `idle`,
 * so the static HTML and the first client render agree and hydration stays quiet.
 */
export function useDuckerAuth(): AuthSnapshot & {
  enabled: boolean;
  profileUrl: string | null;
  signIn: () => void;
  signOut: () => void;
} {
  useEffect(() => settleCallbackUrl(), []);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    ...snapshot,
    enabled: DUCKER_CONFIG !== null,
    profileUrl: DUCKER_CONFIG ? DUCKER_CONFIG.profileUrl : null,
    signIn,
    signOut,
  };
}
