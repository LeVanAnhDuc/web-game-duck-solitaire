import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
vi.mock("@/hooks/useDuckerAuth", () => ({ useDuckerAuth: () => auth.value }));

import { AccountButton } from "@/views/Home/components/AccountButton";

const base = {
  enabled: true,
  profileUrl: "http://localhost:3000/profile",
  signIn: vi.fn(),
  signOut: vi.fn(),
};
const signedIn = (profile: Record<string, unknown>) => ({
  ...base,
  status: "signed-in",
  profile: { sub: "u1", ...profile },
});
const full = signedIn({ name: "Lê Văn Anh Đức", email: "duc@ducker.id" });

function openMenu() {
  const trigger = screen.getByRole("button", { name: "Tài khoản Ducker ID" });
  fireEvent.click(trigger);
  return trigger;
}

describe("AccountButton", () => {
  beforeEach(() => {
    base.signIn.mockClear();
    base.signOut.mockClear();
  });

  it("renders nothing when the feature is disabled", () => {
    auth.value = { ...base, enabled: false, status: "idle", profile: null };
    const { container } = render(<AccountButton />);
    expect(container.innerHTML).toBe("");
  });

  it("shows the sign-in button when signed out and starts login on click", () => {
    auth.value = { ...base, status: "signed-out", profile: null };
    render(<AccountButton />);
    fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));
    expect(base.signIn).toHaveBeenCalledOnce();
  });

  it("disables the button while signing in", () => {
    auth.value = { ...base, status: "loading", profile: null };
    render(<AccountButton />);
    expect((screen.getByRole("button", { name: "Đang đăng nhập…" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it("opens the menu with a profile link and sign out; Esc closes and refocuses the trigger", () => {
    auth.value = full;
    render(<AccountButton />);
    const trigger = openMenu();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Lê Văn Anh Đức")).toBeTruthy();
    expect(screen.getByText("duc@ducker.id")).toBeTruthy();
    const link = screen.getByRole("menuitem", { name: "Mở hồ sơ Ducker ID" });
    expect(link.getAttribute("href")).toBe("http://localhost:3000/profile");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    act(() => {
      fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "Đăng xuất" }));
    expect(base.signOut).toHaveBeenCalledOnce();
  });

  it("closes on a pointerdown outside", () => {
    auth.value = full;
    render(<AccountButton />);
    const trigger = openMenu();
    fireEvent.pointerDown(document.body);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("moves between items with the arrow keys, wrapping, and Home / End", () => {
    auth.value = full;
    render(<AccountButton />);
    openMenu();
    const link = screen.getByRole("menuitem", { name: "Mở hồ sơ Ducker ID" });
    const out = screen.getByRole("menuitem", { name: "Đăng xuất" });
    expect(document.activeElement).toBe(link);
    fireEvent.keyDown(link, { key: "ArrowDown" });
    expect(document.activeElement).toBe(out);
    fireEvent.keyDown(out, { key: "ArrowDown" });
    expect(document.activeElement).toBe(link);
    fireEvent.keyDown(link, { key: "ArrowUp" });
    expect(document.activeElement).toBe(out);
    fireEvent.keyDown(out, { key: "Home" });
    expect(document.activeElement).toBe(link);
    fireEvent.keyDown(link, { key: "End" });
    expect(document.activeElement).toBe(out);
  });

  it("closes on Tab without pulling focus back to the trigger", () => {
    auth.value = full;
    render(<AccountButton />);
    const trigger = openMenu();
    const out = screen.getByRole("menuitem", { name: "Đăng xuất" });
    out.focus();
    fireEvent.keyDown(out, { key: "Tab" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).not.toBe(trigger);
  });

  it("closes when focus moves outside, but not when relatedTarget is null (Safari)", () => {
    auth.value = full;
    render(<AccountButton />);
    const trigger = openMenu();
    const link = screen.getByRole("menuitem", { name: "Mở hồ sơ Ducker ID" });
    fireEvent.blur(link, { relatedTarget: null });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const elsewhere = document.createElement("button");
    document.body.appendChild(elsewhere);
    fireEvent.blur(link, { relatedTarget: elsewhere });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    elsewhere.remove();
  });

  it("does not leak keys to the board's keyboard handler", () => {
    auth.value = full;
    const onBoardKey = vi.fn();
    render(
      <div onKeyDown={onBoardKey}>
        <AccountButton />
      </div>,
    );
    openMenu();
    fireEvent.keyDown(screen.getByRole("menuitem", { name: "Đăng xuất" }), { key: "ArrowDown" });
    expect(onBoardKey).not.toHaveBeenCalled();
  });

  it("puts focus on the sign-in button after signing out from the menu", () => {
    auth.value = full;
    const { rerender } = render(<AccountButton />);
    openMenu();
    base.signOut.mockImplementationOnce(() => {
      auth.value = { ...base, status: "signed-out", profile: null };
    });
    fireEvent.click(screen.getByRole("menuitem", { name: "Đăng xuất" }));
    rerender(<AccountButton />);
    const signIn = screen.getByRole("button", { name: "Đăng nhập" });
    expect(document.activeElement).toBe(signIn);
  });

  it("omits the email line when there is none, and leads with the email when there is no name", () => {
    auth.value = signedIn({ name: "Chỉ Tên" });
    const { unmount } = render(<AccountButton />);
    openMenu();
    expect(screen.getByText("Chỉ Tên")).toBeTruthy();
    expect(document.querySelectorAll('[data-account="email"]').length).toBe(0);
    unmount();

    auth.value = signedIn({ email: "chi@ducker.id" });
    render(<AccountButton />);
    openMenu();
    expect(screen.getByText("chi@ducker.id")).toBeTruthy();
    expect(document.querySelectorAll('[data-account="email"]').length).toBe(0);
  });

  it("falls back to an initial when there is no picture and shows the picture when there is", () => {
    auth.value = full;
    const { unmount } = render(<AccountButton />);
    expect(screen.getByText("L")).toBeTruthy();
    unmount();
    auth.value = signedIn({ name: "A", picture: "http://localhost:3000/a.png" });
    const { container } = render(<AccountButton />);
    expect(container.querySelector("img")?.getAttribute("src")).toBe("http://localhost:3000/a.png");
  });
});
