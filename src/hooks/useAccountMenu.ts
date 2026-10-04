"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";

const ITEMS = '[role="menuitem"]';

/**
 * Behaviour of the account popover, no styling: open/close, Esc, outside click,
 * arrow/Home/End roving focus, and closing when focus leaves.
 *
 * `onKeyDown` also STOPS every key from bubbling: the board listens for arrows, space
 * and Enter on `<main>` and would otherwise move its cursor (and swallow Enter on a
 * menu item) while the player is only using the menu.
 */
export function useAccountMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        close(false);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    menuRef.current?.querySelector<HTMLElement>(ITEMS)?.focus();
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, close]);

  const onKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation();
    if (!open) return;
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>(ITEMS) ?? []);
    const index = items.indexOf(document.activeElement as HTMLElement);
    const focusAt = (next: number) => {
      event.preventDefault();
      items[(next + items.length) % items.length]?.focus();
    };
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        close(true);
        break;
      case "ArrowDown":
        focusAt(index + 1);
        break;
      case "ArrowUp":
        focusAt(index < 0 ? items.length - 1 : index - 1);
        break;
      case "Home":
        focusAt(0);
        break;
      case "End":
        focusAt(items.length - 1);
        break;
      case "Tab":
        close(false); // focus carries on to the next control; never pulled back
        break;
    }
  };

  /**
   * Closes only when focus lands on a known element outside menu and trigger. Safari
   * does not focus a button on click, so a null relatedTarget must NOT close the menu
   * (it would close and then reopen on the same click). Outside clicks are the
   * pointerdown handler's job.
   */
  const onBlur = (event: FocusEvent) => {
    if (!open) return;
    const next = event.relatedTarget as Node | null;
    if (!next) return;
    if (menuRef.current?.contains(next) || triggerRef.current?.contains(next)) return;
    close(false);
  };

  return { open, toggle: () => setOpen((value) => !value), close, triggerRef, menuRef, onKeyDown, onBlur };
}
