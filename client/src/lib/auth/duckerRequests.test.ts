import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { exchangeCode, fetchProfile } from "@/lib/auth/duckerRequests";

const config = {
  issuer: "http://localhost:3000",
  clientId: "game-client",
  scope: "openid",
  profileUrl: "http://localhost:3000/profile",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("duckerRequests", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("posts the public-client token form and never a secret", async () => {
    fetchMock.mockResolvedValue(json({ access_token: "at-1" }));
    await expect(exchangeCode(config, "c1", "v1")).resolves.toEqual({ accessToken: "at-1" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("http://localhost:3000/oauth/token");
    expect(init.method).toBe("POST");
    const body = init.body as URLSearchParams;
    expect(Object.fromEntries(body)).toEqual({
      grant_type: "authorization_code",
      code: "c1",
      code_verifier: "v1",
      redirect_uri: expect.stringMatching(/^http:\/\/[^/]+\/$/),
      client_id: "game-client",
    });
    expect(body.has("client_secret")).toBe(false);
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("sends the bearer to userinfo with an abort signal", async () => {
    fetchMock.mockResolvedValue(json({ sub: "u1", name: "Đức" }));
    await expect(fetchProfile(config, "at-1")).resolves.toEqual({ sub: "u1", name: "Đức" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("http://localhost:3000/oauth/userinfo");
    expect(init.headers.Authorization).toBe("Bearer at-1");
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("rejects a malformed userinfo and accepts a minimal one", async () => {
    fetchMock.mockResolvedValue(json(null));
    await expect(fetchProfile(config, "t")).rejects.toThrow("userinfo_invalid");
    fetchMock.mockResolvedValue(json({ sub: "u1", name: 42 }));
    await expect(fetchProfile(config, "t")).rejects.toThrow("userinfo_invalid");
    fetchMock.mockResolvedValue(json({ sub: "" }));
    await expect(fetchProfile(config, "t")).rejects.toThrow("userinfo_invalid");
    fetchMock.mockResolvedValue(json({ sub: "u1" }));
    await expect(fetchProfile(config, "t")).resolves.toEqual({ sub: "u1" });
  });

  it("throws on a non-ok response", async () => {
    fetchMock.mockResolvedValue(json({}, 400));
    await expect(exchangeCode(config, "c", "v")).rejects.toThrow("token_exchange_failed_400");
    fetchMock.mockResolvedValue(json({}, 401));
    await expect(fetchProfile(config, "t")).rejects.toThrow("userinfo_failed_401");
  });

  it("throws when a 200 token response has no string access_token", async () => {
    fetchMock.mockResolvedValue(json({ token_type: "Bearer" }));
    await expect(exchangeCode(config, "c", "v")).rejects.toThrow("token_response_invalid");
    fetchMock.mockResolvedValue(json({ access_token: 5 }));
    await expect(exchangeCode(config, "c", "v")).rejects.toThrow("token_response_invalid");
  });
});
