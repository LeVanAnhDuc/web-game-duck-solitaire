"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, LogIn, LogOut } from "lucide-react";
import { useAccountMenu } from "@/hooks/useAccountMenu";
import { useDuckerAuth } from "@/hooks/useDuckerAuth";
import { initialOf } from "@/lib/auth/initials";
import type { DuckerProfile } from "@/lib/auth/types";
import { FLIGHT_Z } from "@/lib/layout";
import { strings } from "@/lib/strings";

/**
 * Optional Ducker ID sign-in, identity only (ADR-0012). Renders NOTHING while the
 * feature flag is off. Looks like a toolbar control: icon + text, 44px target, the
 * two-layer focus ring from MASTER.md, no transitions of its own (reduced motion).
 */

const CONTROL = "focus-ring inline-flex min-h-[44px] min-w-[44px] flex-none items-center justify-center gap-2 whitespace-nowrap rounded px-3 text-[14px] font-medium bg-toolbar text-fg";
const ITEM = "focus-ring flex min-h-[44px] w-full items-center gap-2 rounded px-3 text-left text-[14px] font-medium text-fg";

/** Picture from the issuer, which may be another host: no referrer, initial on failure. */
function Avatar({ profile }: { profile: DuckerProfile }) {
  const [failed, setFailed] = useState(false);
  if (profile.picture && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- avatar from the issuer, static export has no image optimiser
      <img
        src={profile.picture}
        alt=""
        width={32}
        height={32}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="rounded-full"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ring text-[14px] font-semibold text-toolbar"
    >
      {initialOf(profile)}
    </span>
  );
}

export function AccountButton() {
  const auth = useDuckerAuth();
  const menu = useAccountMenu();
  const signInRef = useRef<HTMLButtonElement>(null);
  const refocusSignIn = useRef(false);

  // After "Đăng xuất" the trigger unmounts; hand focus to the sign-in button that takes
  // its place instead of letting it fall to <body>.
  useEffect(() => {
    if (refocusSignIn.current && signInRef.current) {
      signInRef.current.focus();
      refocusSignIn.current = false;
    }
  });

  if (!auth.enabled) return null;

  if (auth.status !== "signed-in" || !auth.profile) {
    const loading = auth.status === "loading";
    const inert = loading || auth.status === "idle";
    return (
      <div onKeyDown={menu.onKeyDown}>
        <button
          ref={signInRef}
          type="button"
          onClick={auth.signIn}
          disabled={inert}
          aria-busy={loading}
          className={`${CONTROL} ${inert ? "opacity-50" : ""}`}
        >
          <LogIn aria-hidden="true" size={18} />
          {/* Icon-only below sm so idle / loading / signed-out never wrap the header at 320-375; the name stays. */}
          <span className="sr-only sm:not-sr-only">
            {loading ? strings.account.signingIn : strings.account.signIn}
          </span>
        </button>
      </div>
    );
  }

  const { profile } = auth;
  const title = profile.name?.trim() || profile.email?.trim() || "";
  const showEmail = Boolean(profile.name?.trim() && profile.email?.trim());

  return (
    <div className="relative" onKeyDown={menu.onKeyDown} onBlur={menu.onBlur}>
      <button
        ref={menu.triggerRef}
        type="button"
        onClick={menu.toggle}
        aria-haspopup="menu"
        aria-expanded={menu.open}
        aria-label={strings.account.menuLabel}
        className={CONTROL}
      >
        <Avatar profile={profile} />
      </button>
      {menu.open && (
        <div
          ref={menu.menuRef}
          role="menu"
          aria-label={strings.account.menuLabel}
          // Cards carry inline z-indexes up to FLIGHT_Z; the menu has to sit above all of them.
          style={{ zIndex: FLIGHT_Z + 1 }}
          className="absolute right-0 top-full mt-2 flex w-[min(280px,calc(100vw-16px))] flex-col gap-1 rounded border border-muted bg-toolbar p-2 text-fg"
        >
          <div role="none" className="px-3 py-2">
            <p className="break-words text-[14px] font-semibold">{title}</p>
            {showEmail && (
              <p data-account="email" className="break-words text-[12px] text-muted">
                {profile.email}
              </p>
            )}
          </div>
          <a
            role="menuitem"
            href={auth.profileUrl ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className={ITEM}
            onClick={() => menu.close(false)}
          >
            <ExternalLink aria-hidden="true" size={18} />
            <span>{strings.account.openProfile}</span>
          </a>
          <button
            role="menuitem"
            type="button"
            className={ITEM}
            onClick={() => {
              refocusSignIn.current = true;
              menu.close(false);
              auth.signOut();
            }}
          >
            <LogOut aria-hidden="true" size={18} />
            <span>{strings.account.signOut}</span>
          </button>
        </div>
      )}
    </div>
  );
}
