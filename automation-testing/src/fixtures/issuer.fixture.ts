import type { Page } from "@playwright/test";
import { DUCKER } from "@/data/test-data";
import { test as core } from "./core.fixture";

export type IssuerMode = "ok" | "deny" | "tamper" | "hang";

export interface FakeIssuer {
  /** Every request the game made to the issuer, as "METHOD /path", in order. */
  calls(): string[];
}

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type",
};

/**
 * Plays Ducker ID for the flag-on export (../client/scripts/build-e2e-auth.mjs, issuer http://ducker.test, which never
 * resolves): /oauth/authorize redirects straight back with a code, an error or a tampered state; /oauth/token and
 * /oauth/userinfo answer - or, in "hang", the token endpoint never does.
 */
async function install(page: Page, mode: IssuerMode): Promise<FakeIssuer> {
  const calls: string[] = [];
  await page.route(`${DUCKER.issuer}/**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    calls.push(`${request.method()} ${url.pathname}`);
    if (request.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: CORS });
      return;
    }
    if (url.pathname === "/oauth/authorize") {
      const back = new URL(url.searchParams.get("redirect_uri")!);
      if (mode === "deny") back.searchParams.set("error", "access_denied");
      else back.searchParams.set("code", "code-1");
      back.searchParams.set("state", mode === "tamper" ? "not-the-state" : url.searchParams.get("state")!);
      await route.fulfill({ status: 302, headers: { location: back.toString() } });
      return;
    }
    if (url.pathname === "/oauth/token") {
      if (mode === "hang") return; // never answered: the client's own timeout has to end it
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: CORS,
        body: JSON.stringify({ access_token: "at-1", token_type: "Bearer", expires_in: 900 }),
      });
      return;
    }
    if (url.pathname === "/oauth/userinfo") {
      await route.fulfill({ status: 200, contentType: "application/json", headers: CORS, body: JSON.stringify(DUCKER.user) });
      return;
    }
    await route.fulfill({ status: 404 });
  });
  return { calls: () => [...calls] };
}

export const test = core.extend<{ fakeIssuer: (mode?: IssuerMode) => Promise<FakeIssuer> }>({
  fakeIssuer: async ({ page }, use) => use((mode = "ok") => install(page, mode)),
});
