// Fixed deals: ?van=<seed> makes the deal reproducible (FR-13, ADR-0006). Each seed below was picked for one property
// of its deal, observed through the UI - not by importing the game's dealer.

/** The suite's default deal, the one the old e2e suite used: nothing special about it. */
export const SEED = 20260904;

/**
 * Seed 1: column 2 shows a black three (Bích Ba / Tép Ba) that no foundation takes, and that fits column 7 (a red
 * four). So one tap only picks it up, two taps send it to column 7, and the move turns column 2's last face-down card
 * over.
 */
export const SEED_THREE_TO_COLUMN_7 = 1;

/** Seed 66725: the Ace of Hearts is face up on column 1 at the deal (Hearts is the second foundation). */
export const SEED_ACE_ON_COLUMN_1 = 66725;

/** Seeds outside 0..0xFFFFFFFF or not integers are "absent", never an error (client/src/lib/seedUrl.ts). */
export const MAX_SEED = 0xffffffff;

// The flag-on e2e export (../client/scripts/build-e2e-auth.mjs) signs in against this fake issuer. It is never resolved:
// the issuer fixture answers every request to it (ADR-0012).
export const DUCKER = {
  issuer: "http://ducker.test",
  profilePath: "/profile",
  user: { sub: "u1", name: "Lê Văn Anh Đức", email: "duc@ducker.id" },
  pkceKey: "ducker.pkce",
} as const;
