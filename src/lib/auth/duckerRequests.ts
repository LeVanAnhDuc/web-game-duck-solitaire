import type { DuckerConfig, DuckerProfile } from "@/lib/auth/types";
import { redirectUri } from "@/lib/auth/duckerAuth";

/**
 * The only module that talks to the network - the bounded exception to NFR-DATA-01
 * (ADR-0012): requests go to the configured issuer only, and only after the player
 * clicked "Đăng nhập" and came back with a code.
 */

/** A hung issuer must end in signed-out, not in a button that stays disabled forever. */
const REQUEST_TIMEOUT_MS = 15_000;

/** Public client: no client_secret exists anywhere in this app. */
export async function exchangeCode(
  config: DuckerConfig,
  code: string,
  verifier: string,
): Promise<{ accessToken: string }> {
  const response = await fetch(new URL("/oauth/token", config.issuer), {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      code_verifier: verifier,
      redirect_uri: redirectUri(),
      client_id: config.clientId,
    }),
  });
  if (!response.ok) throw new Error(`token_exchange_failed_${response.status}`);
  const data = (await response.json()) as { access_token?: unknown };
  if (typeof data.access_token !== "string" || !data.access_token) {
    throw new Error("token_response_invalid");
  }
  return { accessToken: data.access_token };
}

export async function fetchProfile(
  config: DuckerConfig,
  accessToken: string,
): Promise<DuckerProfile> {
  const response = await fetch(new URL("/oauth/userinfo", config.issuer), {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`userinfo_failed_${response.status}`);
  const data: unknown = await response.json();
  if (!isProfile(data)) throw new Error("userinfo_invalid");
  return data;
}

const optionalString = (value: unknown) =>
  value === undefined || value === null || typeof value === "string";

/** A malformed userinfo must end in signed-out, never crash rendering. */
function isProfile(data: unknown): data is DuckerProfile {
  if (typeof data !== "object" || data === null) return false;
  const p = data as Record<string, unknown>;
  return (
    typeof p.sub === "string" &&
    p.sub !== "" &&
    optionalString(p.name) &&
    optionalString(p.email) &&
    optionalString(p.picture) &&
    (p.email_verified === undefined || typeof p.email_verified === "boolean")
  );
}
