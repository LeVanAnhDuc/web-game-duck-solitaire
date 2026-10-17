import type { AuthSnapshot, CallbackResult, DuckerConfig } from "@/lib/auth/types";
import { exchangeCode, fetchProfile } from "@/lib/auth/duckerRequests";
import { DUCKER_CONFIG } from "@/lib/auth/config";
import { capturedCallback, startLogin } from "@/lib/auth/duckerAuth";

/**
 * In-memory sign-in state as an external store: React reads it through
 * useSyncExternalStore, nothing here persists (reload = signed out).
 */

const IDLE: AuthSnapshot = { status: "idle", profile: null };
const SIGNED_OUT: AuthSnapshot = { status: "signed-out", profile: null };

let snapshot: AuthSnapshot = IDLE;
let started = false;
const listeners = new Set<() => void>();

function set(next: AuthSnapshot): void {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): AuthSnapshot {
  return snapshot;
}

/** The static HTML knows nothing about a session - the first render is always idle. */
export function getServerSnapshot(): AuthSnapshot {
  return IDLE;
}

/**
 * Exchanges the code for a profile exactly ONCE per page load (StrictMode and remounts
 * are safe). Every failure only drops to signed-out: sign-in is optional, not a gate.
 * The default parameters are injection points for tests, not config defaults.
 */
export function startSession(
  config: DuckerConfig | null = DUCKER_CONFIG,
  callback: CallbackResult | null = capturedCallback(),
): void {
  if (started || !config) return;
  started = true;
  if (!callback || callback.error || !callback.code || !callback.verifier) {
    set(SIGNED_OUT);
    return;
  }
  set({ status: "loading", profile: null });
  exchangeCode(config, callback.code, callback.verifier)
    .then((tokens) => fetchProfile(config, tokens.accessToken))
    .then(
      (profile) => set({ status: "signed-in", profile }),
      () => set(SIGNED_OUT),
    );
}

export function signIn(): void {
  if (!DUCKER_CONFIG) return;
  startLogin(DUCKER_CONFIG).catch(() => {
    // silent: sign-in is optional, the button simply stays available
  });
}

/** Forgets the profile in memory. The Ducker ID session stays - that is what SSO means. */
export function signOut(): void {
  set(SIGNED_OUT);
}

/** Tests only. */
export function resetSessionForTests(): void {
  snapshot = IDLE;
  started = false;
  listeners.clear();
}

if (typeof window !== "undefined") startSession();
