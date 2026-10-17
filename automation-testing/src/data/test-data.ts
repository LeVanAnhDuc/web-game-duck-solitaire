// Fixed deals: ?van=<seed> makes the deal reproducible (FR-13, ADR-0006). Each seed below was picked for one property
// of its deal, read off the board through the UI (labels of the face-up cards) - not by importing the game's dealer.

/** The suite's default deal, the one the old e2e suite used. Face up at the deal: Bích Át on column 4, Rô Át on 5. */
export const SEED = 20260904;

/**
 * Seed 1: column 2 shows Tép Ba, which no foundation takes and which fits column 7's Cơ Bốn. So one tap only picks it
 * up, two taps send it to column 7, and the move turns column 2's last face-down card (Tép Sáu) over.
 */
export const SEED_THREE_TO_COLUMN_7 = 1;

/**
 * Seed 23: column 7's Bích Sáu fits column 4's Cơ Bảy, and Cơ Bảy fits column 1's Bích Tám - so after the first move,
 * Cơ Bảy carrying Bích Sáu is a two-card run that can move as one.
 */
export const SEED_RUN = 23;

/**
 * Seed 4: Rô Át alone on column 1 and Bích Hai on column 4. Rô Át goes up with one tap, which empties column 1 and
 * leaves a foundation card that may come back down onto Bích Hai.
 */
export const SEED_ACE_AND_TWO = 4;

/**
 * Seed 66725: Cơ Át alone on column 1 (Hearts is the second foundation) and Rô Già on top of column 7. One tap empties
 * column 1, and the king is the only card an empty column takes.
 */
export const SEED_ACE_ON_COLUMN_1 = 66725;

/** Seeds outside 0..0xFFFFFFFF or not integers are "absent", never an error (client/src/lib/seedUrl.ts). */
export const MAX_SEED = 0xffffffff;

/** Cards in the stock at the deal: 52 - (1 + 2 + … + 7). */
export const STOCK_AT_DEAL = 24;

// The flag-on e2e export (../client/scripts/build-e2e-auth.mjs) signs in against this fake issuer. It is never resolved:
// the issuer fixture answers every request to it (ADR-0012).
export const DUCKER = {
  issuer: "http://ducker.test",
  profilePath: "/profile",
  user: { sub: "u1", name: "Lê Văn Anh Đức", email: "duc@ducker.id" },
  pkceKey: "ducker.pkce",
} as const;
