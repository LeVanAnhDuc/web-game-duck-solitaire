import { expect, test } from "@/fixtures";
import { openGame } from "@/pages/game.page";

// The deployed build (flag off) - split out of the old ducker-id-sign-in.spec.ts so it runs on project "app".
const signInButton = (page: import("@playwright/test").Page) => page.getByRole("button", { name: "Đăng nhập" });
const accountButton = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: "Tài khoản Ducker ID" });

test.describe("flag off (the deployed build)", () => {
  test("renders no sign-in control and keeps storage empty", async ({ page }) => {
    await openGame(page);
    await expect(signInButton(page)).toHaveCount(0);
    await expect(accountButton(page)).toHaveCount(0);
    const stored = await page.evaluate(() => ({
      session: window.sessionStorage.length,
      local: window.localStorage.length,
    }));
    expect(stored).toEqual({ session: 0, local: 0 });
  });
});

