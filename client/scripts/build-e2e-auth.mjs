import { existsSync, renameSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";

/**
 * Builds the flag-ON static export the Ducker ID e2e spec runs against, into out-auth/,
 * and leaves the ordinary flag-off out/ exactly as it was.
 *
 * The values are test fixtures, not defaults: the issuer is a fake host that the spec
 * answers through page.route and that never resolves. They live here, in the test
 * tooling, and nowhere in the app code or in deploy.yml (ADR-0012).
 *
 * `next build` empties out/, so a flag-off build is parked while this one runs.
 */
const AUTH_ENV = {
  NEXT_PUBLIC_BASE_PATH: "",
  NEXT_PUBLIC_FEATURE_DUCKER_SIGN_IN: "true",
  NEXT_PUBLIC_DUCKER_ISSUER: "http://ducker.test",
  NEXT_PUBLIC_DUCKER_CLIENT_ID: "e2e-client",
  NEXT_PUBLIC_DUCKER_SCOPE: "openid profile email",
  NEXT_PUBLIC_DUCKER_PROFILE_PATH: "/profile",
};

const PARKED = "out-flagoff";
if (existsSync(PARKED)) rmSync(PARKED, { recursive: true, force: true });
if (existsSync("out-auth")) rmSync("out-auth", { recursive: true, force: true });
if (existsSync("out")) renameSync("out", PARKED);

const result = spawnSync("pnpm", ["exec", "next", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, ...AUTH_ENV },
});

if (existsSync("out")) renameSync("out", "out-auth");
if (existsSync(PARKED)) renameSync(PARKED, "out");
process.exit(result.status ?? 1);
