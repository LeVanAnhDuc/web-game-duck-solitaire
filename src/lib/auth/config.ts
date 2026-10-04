import type { DuckerConfig, DuckerEnv } from "@/lib/auth/types";

/**
 * Optional Ducker ID sign-in is shipped dark: it only exists when the flag is exactly
 * "true" AND all four values are set. There is no default for any of them here - a
 * missing value turns the feature off, it is never guessed (ADR-0012).
 */
export function readDuckerConfig(raw: DuckerEnv): DuckerConfig | null {
  if (raw.enabled !== "true") return null;
  const { issuer, clientId, scope, profilePath } = raw;
  if (!issuer || !clientId || !scope || !profilePath) return null;
  // "localhost:3000" parses as a URL with the scheme "localhost:" - reject it by hand.
  if (!/^https?:\/\//.test(issuer)) return null;
  try {
    return {
      issuer: new URL(issuer).origin,
      clientId,
      scope,
      profileUrl: new URL(profilePath, issuer).toString(),
    };
  } catch {
    return null; // malformed issuer: treated as not configured, the game still runs
  }
}

// Read by their LITERAL names so Next inlines them at build time.
export const DUCKER_CONFIG = readDuckerConfig({
  enabled: process.env.NEXT_PUBLIC_FEATURE_DUCKER_SIGN_IN,
  issuer: process.env.NEXT_PUBLIC_DUCKER_ISSUER,
  clientId: process.env.NEXT_PUBLIC_DUCKER_CLIENT_ID,
  scope: process.env.NEXT_PUBLIC_DUCKER_SCOPE,
  profilePath: process.env.NEXT_PUBLIC_DUCKER_PROFILE_PATH,
});

/** The app root - redirect_uri must match the URI registered at Ducker ID exactly. */
export function appRootPath(): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH;
  return base ? `${base}/` : "/";
}
