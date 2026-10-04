import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  captureCallback,
  settleCallbackUrl,
  consumeCallback,
  resetCaptureForTests,
  resetLoginForTests,
  startLogin,
} from "@/lib/auth/duckerAuth";

const config = {
  issuer: "http://localhost:3000",
  clientId: "game-client",
  scope: "openid profile email",
  profileUrl: "http://localhost:3000/profile",
};

describe("consumeCallback", () => {
  beforeEach(() => sessionStorage.clear());

  it("returns null and leaves the URL alone when there is no callback", () => {
    window.history.replaceState(null, "", "/?van=7");
    expect(consumeCallback()).toBeNull();
    expect(window.location.search).toBe("?van=7");
  });

  it("returns code + verifier + returnTo when state matches, and strips only OAuth params", () => {
    sessionStorage.setItem(
      "ducker.pkce",
      JSON.stringify({ state: "s1", verifier: "v1", returnTo: "/?van=7" }),
    );
    window.history.replaceState(null, "", "/?van=7&code=c1&state=s1&iss=x");
    expect(consumeCallback()).toEqual({ code: "c1", verifier: "v1", returnTo: "/?van=7" });
    expect(window.location.search).toBe("?van=7");
    expect(sessionStorage.getItem("ducker.pkce")).toBeNull();
  });

  it("reports state_mismatch when the state differs", () => {
    sessionStorage.setItem(
      "ducker.pkce",
      JSON.stringify({ state: "s1", verifier: "v1", returnTo: "/" }),
    );
    window.history.replaceState(null, "", "/?code=c1&state=evil");
    expect(consumeCallback()).toEqual({ error: "state_mismatch" });
    expect(window.location.search).toBe("");
  });

  it("reports state_mismatch when there is no pending entry (other tab)", () => {
    window.history.replaceState(null, "", "/?code=c1&state=s1");
    expect(consumeCallback()).toEqual({ error: "state_mismatch" });
  });

  it("passes the IdP error through, cleans the URL and still returns returnTo", () => {
    sessionStorage.setItem(
      "ducker.pkce",
      JSON.stringify({ state: "s1", verifier: "v1", returnTo: "/?van=7" }),
    );
    window.history.replaceState(null, "", "/?error=access_denied&error_description=no&state=s1");
    expect(consumeCallback()).toEqual({ error: "access_denied", returnTo: "/?van=7" });
    expect(window.location.search).toBe("");
  });

  it("drops an unsafe returnTo", () => {
    sessionStorage.setItem(
      "ducker.pkce",
      JSON.stringify({ state: "s1", verifier: "v1", returnTo: "//evil.example/x" }),
    );
    window.history.replaceState(null, "", "/?code=c1&state=s1");
    expect(consumeCallback()).toEqual({ code: "c1", verifier: "v1", returnTo: undefined });
  });
});

describe("returnTo with a backslash", () => {
  it("is dropped", () => {
    sessionStorage.setItem(
      "ducker.pkce",
      JSON.stringify({ state: "s1", verifier: "v1", returnTo: "/\\evil" }),
    );
    window.history.replaceState(null, "", "/?code=c1&state=s1");
    expect(consumeCallback()).toEqual({ code: "c1", verifier: "v1", returnTo: undefined });
  });
});

describe("captureCallback", () => {
  beforeEach(() => {
    sessionStorage.clear();
    resetCaptureForTests();
  });

  it("restores returnTo once; a second call is a no-op", () => {
    sessionStorage.setItem(
      "ducker.pkce",
      JSON.stringify({ state: "s1", verifier: "v1", returnTo: "/?van=7" }),
    );
    window.history.replaceState(null, "", "/?code=c1&state=s1");
    captureCallback();
    expect(window.location.search).toBe("?van=7");
    window.history.replaceState(null, "", "/?van=9");
    captureCallback();
    expect(window.location.search).toBe("?van=9");
  });
});

describe("settleCallbackUrl", () => {
  beforeEach(() => {
    sessionStorage.clear();
    resetCaptureForTests();
  });

  it("puts returnTo back once after the router re-wrote the stale callback URL", () => {
    sessionStorage.setItem(
      "ducker.pkce",
      JSON.stringify({ state: "s1", verifier: "v1", returnTo: "/?van=7" }),
    );
    window.history.replaceState(null, "", "/?code=c1&state=s1");
    captureCallback();
    window.history.replaceState(null, "", "/?code=c1&state=s1"); // the router's rewrite
    settleCallbackUrl();
    expect(window.location.search).toBe("?van=7");
    // already clean: a second call leaves it alone
    settleCallbackUrl();
    expect(window.location.search).toBe("?van=7");
  });

  it("strips the OAuth params even when there is no returnTo", () => {
    window.history.replaceState(null, "", "/?code=c1&state=s1&van=3");
    captureCallback();
    window.history.replaceState(null, "", "/?code=c1&state=s1&van=3");
    settleCallbackUrl();
    expect(window.location.search).toBe("?van=3");
  });

  it("is one-shot: a second call is a no-op even if the URL changed meanwhile", () => {
    window.history.replaceState(null, "", "/?code=c1&state=s1&van=3");
    captureCallback();
    window.history.replaceState(null, "", "/?code=c1&state=s1&van=3");
    settleCallbackUrl();
    expect(window.location.search).toBe("?van=3");
    window.history.replaceState(null, "", "/?van=8");
    settleCallbackUrl();
    expect(window.location.search).toBe("?van=8");
  });

  it("does nothing when no callback was captured", () => {
    window.history.replaceState(null, "", "/?van=3");
    captureCallback();
    settleCallbackUrl();
    expect(window.location.search).toBe("?van=3");
  });
});

describe("startLogin", () => {
  const assign = vi.fn();
  beforeEach(() => {
    sessionStorage.clear();
    assign.mockClear();
    resetLoginForTests();
    vi.stubGlobal("location", {
      ...window.location,
      assign,
      origin: "http://localhost:4184",
      pathname: "/",
      search: "?van=7",
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("stores the pending entry and redirects to /oauth/authorize with PKCE", async () => {
    await startLogin(config);
    const pending = JSON.parse(sessionStorage.getItem("ducker.pkce")!);
    expect(pending.returnTo).toBe("/?van=7");
    const url = new URL(assign.mock.calls[0][0]);
    expect(url.origin + url.pathname).toBe("http://localhost:3000/oauth/authorize");
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("client_id")).toBe("game-client");
    expect(url.searchParams.get("redirect_uri")).toBe("http://localhost:4184/");
    expect(url.searchParams.get("scope")).toBe("openid profile email");
    expect(url.searchParams.get("state")).toBe(pending.state);
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("code_challenge")).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it("ignores a second click while the first is in flight", async () => {
    await Promise.all([startLogin(config), startLogin(config)]);
    expect(assign).toHaveBeenCalledTimes(1);
  });

  it("does nothing and stays retryable when sessionStorage throws", async () => {
    const real = window.sessionStorage;
    vi.stubGlobal("sessionStorage", {
      getItem: () => null,
      removeItem: () => undefined,
      setItem: () => {
        throw new Error("blocked");
      },
    });
    await startLogin(config);
    expect(assign).not.toHaveBeenCalled();
    vi.stubGlobal("sessionStorage", real);
    await startLogin(config);
    expect(assign).toHaveBeenCalledTimes(1);
  });

  it("removes the pending entry and stays retryable when the challenge cannot be computed", async () => {
    const digest = vi.spyOn(crypto.subtle, "digest").mockRejectedValueOnce(new Error("boom"));
    await expect(startLogin(config)).rejects.toThrow("boom");
    expect(sessionStorage.getItem("ducker.pkce")).toBeNull();
    expect(assign).not.toHaveBeenCalled();
    digest.mockRestore();
    await startLogin(config);
    expect(assign).toHaveBeenCalledTimes(1);
  });

  it("can start again after the page is restored from the back/forward cache", async () => {
    await startLogin(config);
    await startLogin(config);
    expect(assign).toHaveBeenCalledTimes(1);
    const event = new Event("pageshow");
    Object.defineProperty(event, "persisted", { value: true });
    window.dispatchEvent(event);
    await startLogin(config);
    expect(assign).toHaveBeenCalledTimes(2);
  });
});
