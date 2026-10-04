import type { CallbackResult, DuckerConfig, PendingAuth } from "@/lib/auth/types";
import { DUCKER_CONFIG, appRootPath } from "@/lib/auth/config";
import { challengeOf, randomUrlSafeToken } from "@/lib/auth/pkce";

/**
 * The only module that touches browser storage - the bounded exception to NFR-DATA-01
 * and invariant #10 (ADR-0012): ONE session-scoped key, deleted when the player comes
 * back, and never touched at all while the feature flag is off.
 */

const PKCE_KEY = "ducker.pkce";
const CALLBACK_PARAMS = ["code", "state", "error", "error_description", "iss"];

export function redirectUri(): string {
  return new URL(appRootPath(), window.location.origin).toString();
}

function readPending(): PendingAuth | null {
  try {
    const raw = sessionStorage.getItem(PKCE_KEY);
    return raw ? (JSON.parse(raw) as PendingAuth) : null;
  } catch {
    return null;
  }
}

function clearPending(): void {
  try {
    sessionStorage.removeItem(PKCE_KEY);
  } catch {
    // storage is blocked - there is no pending sign-in to clear
  }
}

/** True from the first click until we either bail out or leave the page. */
let starting = false;

/**
 * Coming back with the Back button restores the page from the back/forward cache with
 * module state intact, so a guard left at `true` would make the button dead.
 */
if (typeof window !== "undefined") {
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) starting = false;
  });
}

/** Builds the authorize URL and sends the whole page to Ducker ID. */
export async function startLogin(config: DuckerConfig): Promise<void> {
  if (starting) return;
  starting = true;
  try {
    const verifier = randomUrlSafeToken();
    const state = randomUrlSafeToken();
    const pending: PendingAuth = {
      state,
      verifier,
      returnTo: window.location.pathname + window.location.search,
    };
    try {
      sessionStorage.setItem(PKCE_KEY, JSON.stringify(pending));
    } catch {
      starting = false; // no place for the verifier means the callback could never succeed
      return;
    }
    const url = new URL("/oauth/authorize", config.issuer);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", config.clientId);
    url.searchParams.set("redirect_uri", redirectUri());
    url.searchParams.set("scope", config.scope);
    url.searchParams.set("state", state);
    url.searchParams.set("code_challenge", await challengeOf(verifier));
    url.searchParams.set("code_challenge_method", "S256");
    window.location.assign(url.toString());
  } catch (error) {
    starting = false;
    throw error;
  }
}

/** Only a same-origin path may be fed to replaceState ("//evil" would throw at load). */
function isSafeReturnTo(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
}

/**
 * Reads ?code / ?error and removes EXACTLY the OAuth params from the URL - the game's
 * own ?van survives. A code is single-use, so leaving it in the address would make a
 * reload try to spend it again.
 */
export function consumeCallback(): CallbackResult | null {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const error = params.get("error");
  const state = params.get("state");
  if (!code && !error) return null;

  const pending = readPending();
  clearPending();
  for (const key of CALLBACK_PARAMS) params.delete(key);
  const query = params.toString();
  window.history.replaceState(
    window.history.state,
    "",
    window.location.pathname + (query ? `?${query}` : "") + window.location.hash,
  );

  // returnTo is restored on success AND on an IdP error: redirect_uri is the bare app
  // root, so without it a cancelled sign-in would drop ?van. Not on state_mismatch.
  const returnTo = pending && isSafeReturnTo(pending.returnTo) ? pending.returnTo : undefined;
  if (error) return { error, returnTo };
  if (!pending || pending.state !== state) return { error: "state_mismatch" };
  return { code: code ?? undefined, verifier: pending.verifier, returnTo };
}

let captured: CallbackResult | null = null;
let didCapture = false;

/** Runs once at module load in the browser, before any game code reads the URL. */
export function captureCallback(): void {
  if (didCapture) return;
  didCapture = true;
  captured = consumeCallback();
  if (captured?.returnTo) {
    try {
      window.history.replaceState(window.history.state, "", captured.returnTo);
    } catch {
      // a bad returnTo must never blank the game at load
    }
  }
}

export function capturedCallback(): CallbackResult | null {
  return captured;
}

/** Tests only. */
export function resetCaptureForTests(): void {
  captured = null;
  didCapture = false;
}

/** Tests only. */
export function resetLoginForTests(): void {
  starting = false;
}

if (typeof window !== "undefined" && DUCKER_CONFIG) captureCallback();
