import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { copy } from "@/data/copy";

/** A pile as the board names it in `data-pile` (slot) and `data-card-pile` (card). */
export type PileKey =
  | "stock"
  | "waste"
  | `foundation-${0 | 1 | 2 | 3}`
  | `tableau-${0 | 1 | 2 | 3 | 4 | 5 | 6}`;

export const FOUNDATIONS = [0, 1, 2, 3].map((i) => `foundation-${i}` as PileKey);
export const TABLEAU = [0, 1, 2, 3, 4, 5, 6].map((i) => `tableau-${i}` as PileKey);
export const PILES: PileKey[] = ["stock", "waste", ...FOUNDATIONS, ...TABLEAU];

export const tableauKey = (index: number) => `tableau-${index}` as PileKey;
export const foundationKey = (index: number) => `foundation-${index}` as PileKey;

/** One card as the DOM exposes it: its stable id, the pile it is in, its depth there, and which face shows. */
export interface CardInfo {
  id: string;
  pile: string;
  index: number;
  face: "up" | "down";
  label: string;
}

/**
 * The game is one screen: header (name, deal number), board (13 pile slots + one flat layer of 52 cards), toolbar,
 * and two overlays (draw-mode confirm, win). Every URL is relative ("./…") so the same object works under GitHub
 * Pages' /web-game-duck-solitaire/ base path.
 *
 * Cards are found through `data-card-pile` / `data-index` rather than DOM nesting: the cards live in one flat layer in
 * deck order, so the card on top of a pile is the one with the highest `data-index`, never "the last element".
 */
export class GamePage extends BasePage {
  readonly drawModeDialog: DrawModeDialog;
  readonly winDialog: WinDialog;
  readonly account: AccountMenu;

  constructor(page: Page) {
    super(page);
    this.drawModeDialog = new DrawModeDialog(page);
    this.winDialog = new WinDialog(page);
    this.account = new AccountMenu(page);
  }

  // ── navigation ──────────────────────────────────────────────────────────

  /** Opens the game on a fixed deal (`?van=`), or on a random one, and waits until the board answers input. */
  async goto(seed?: number | string): Promise<void> {
    await this.page.goto(seed === undefined ? "./" : `./?van=${seed}`);
    await this.waitReady();
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitReady();
  }

  /**
   * The deal happens on mount, and a tap that lands before hydration is lost (no listener yet). React marks every
   * hydrated DOM node with a __reactFiber$… key, so its presence on a card is the moment the board starts answering.
   */
  async waitReady(): Promise<void> {
    await this.cards().first().waitFor();
    await this.page.waitForFunction(() => {
      const card = document.querySelector("[data-card]");
      return !!card && Object.keys(card).some((k) => k.startsWith("__reactFiber"));
    });
  }

  /** The deal number the address bar carries, or null. */
  seedInUrl(): Promise<string | null> {
    return this.page.evaluate(() => new URLSearchParams(window.location.search).get("van"));
  }

  // ── header ──────────────────────────────────────────────────────────────

  header(): Locator {
    return this.page.locator("header");
  }

  /** "Ván số <n>" - the number is read back with `shownSeed()`. */
  seedLabel(seed?: number): Locator {
    return seed === undefined
      ? this.header().getByText(/^Ván số \d+$/)
      : this.header().getByText(copy.seed.label(seed), { exact: true });
  }

  async shownSeed(): Promise<number> {
    const text = (await this.seedLabel().textContent()) ?? "";
    return Number(text.replace(/\D/g, ""));
  }

  // ── board ───────────────────────────────────────────────────────────────

  board(): Locator {
    return this.page.getByRole("group", { name: copy.a11y.board });
  }

  /** The pile's own slot: its drop area, its accessible name, its outline when empty. */
  slot(key: PileKey): Locator {
    return this.page.locator(`[data-pile="${key}"]`);
  }

  cards(): Locator {
    return this.page.locator("[data-card]");
  }

  /** The cards of a pile, in deck order - use topCard / cardAt for stacking order. */
  cardsIn(key: PileKey): Locator {
    return this.page.locator(`[data-card][data-card-pile="${key}"]`);
  }

  cardCount(key: PileKey): Promise<number> {
    return this.cardsIn(key).count();
  }

  /** The card at a depth, counting from the bottom of the pile (0 = the bottom card). */
  cardAt(key: PileKey, index: number): Locator {
    return this.page.locator(`[data-card][data-card-pile="${key}"][data-index="${index}"]`);
  }

  /** The playable card of a pile, or null when the pile is empty. */
  async topCard(key: PileKey): Promise<Locator | null> {
    const count = await this.cardCount(key);
    return count === 0 ? null : this.cardAt(key, count - 1);
  }

  /** A face-up card by its readable name, e.g. "Cơ Át" - matched as the start of its label. */
  cardNamed(name: string): Locator {
    return this.page.locator(`[data-card][data-face="up"][aria-label^="${name}"]`);
  }

  selectedCards(): Locator {
    return this.page.locator('[data-card][data-selected="true"]');
  }

  /** Every card, in one read: id, pile, depth, face and label. */
  snapshot(): Promise<CardInfo[]> {
    return this.cards().evaluateAll((els) =>
      els.map((el) => ({
        id: el.getAttribute("data-card") ?? "",
        pile: el.getAttribute("data-card-pile") ?? "",
        index: Number(el.getAttribute("data-index")),
        face: (el.getAttribute("data-face") ?? "down") as "up" | "down",
        label: el.getAttribute("aria-label") ?? "",
      })),
    );
  }

  /** How many cards each pile holds, in one read. */
  async pileCounts(): Promise<Record<PileKey, number>> {
    const snap = await this.snapshot();
    const counts = Object.fromEntries(PILES.map((p) => [p, 0])) as Record<PileKey, number>;
    for (const card of snap) counts[card.pile as PileKey] += 1;
    return counts;
  }

  /** The live region that announces a refused move (F-02, NFR-A11Y-06). */
  liveRegion(): Locator {
    return this.page.locator('[role="status"][aria-live="polite"]');
  }

  /** The on-screen keyboard map that appears once the board takes keyboard focus (F-06). */
  keyboardMap(): Locator {
    return this.page.locator("p.keyboard-map");
  }

  // ── toolbar ─────────────────────────────────────────────────────────────

  toolbar(): Locator {
    return this.page.getByRole("toolbar", { name: copy.a11y.toolbar });
  }

  undoButton(): Locator {
    return this.toolbar().getByRole("button", { name: copy.toolbar.undo, exact: true });
  }

  restartButton(): Locator {
    return this.toolbar().getByRole("button", { name: copy.toolbar.restart, exact: true });
  }

  newGameButton(): Locator {
    return this.toolbar().getByRole("button", { name: copy.toolbar.newGame, exact: true });
  }

  autoCompleteButton(): Locator {
    return this.toolbar().getByRole("button", { name: copy.toolbar.autoComplete, exact: true });
  }

  drawModeSelect(): Locator {
    return this.page.getByLabel(copy.toolbar.drawMode);
  }

  // ── actions ─────────────────────────────────────────────────────────────

  /**
   * Taps the stock: the deck covers its own slot as a real one does, so the tap lands on its top card. Only an
   * exhausted stock exposes the slot, and that tap is the recycle.
   */
  async tapStock(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      const top = await this.topCard("stock");
      if (top) await top.click();
      else await this.slot("stock").click();
    }
  }

  /** Taps a pile: on its top card when it has one (that card covers the slot), on the slot when it is empty. */
  async tapPile(key: PileKey): Promise<void> {
    const top = await this.topCard(key);
    if (top) await top.click();
    else await this.slot(key).click();
  }

  /** Draws until the waste shows a card whose label starts with `name` (e.g. "Át" anywhere: pass a RegExp). */
  async drawUntilWasteShows(match: RegExp, limit = 30): Promise<Locator | null> {
    for (let i = 0; i < limit; i++) {
      const top = await this.topCard("waste");
      if (top && match.test((await top.getAttribute("aria-label")) ?? "")) return top;
      await this.tapStock();
    }
    return null;
  }

  /**
   * Drags `source` (and whatever is stacked on it) by the mouse and lets go over `to`'s slot. `grab` is where on the
   * card the pointer presses, from its top-left corner; the top strip by default, because cards in a column overlap and
   * a covered card's centre is under the card above it - where a player aims too.
   */
  async dragTo(source: Locator, to: PileKey, grab: { x?: number; y?: number } = {}): Promise<void> {
    await source.scrollIntoViewIfNeeded();
    const start = await source.boundingBox();
    const target = await this.slot(to).boundingBox();
    if (!start || !target) throw new Error(`cannot drag onto ${to}: no box`);
    await this.dragBetween(
      { x: start.x + (grab.x ?? start.width / 2), y: start.y + (grab.y ?? 8) },
      { x: target.x + target.width / 2, y: target.y + Math.min(target.height / 2, 24) },
    );
  }

  /** Presses at `from`, crosses the 6px tap/drag threshold, moves to `to` and releases there. */
  async dragBetween(from: { x: number; y: number }, to: { x: number; y: number }): Promise<void> {
    await this.page.mouse.move(from.x, from.y);
    await this.page.mouse.down();
    await this.page.mouse.move(from.x + 12, from.y + 16);
    await this.page.mouse.move(to.x, to.y, { steps: 4 });
    await this.page.mouse.up();
  }

  /** Moves keyboard focus onto a pile, the way a click or a screen reader would. */
  async focusPile(key: PileKey): Promise<void> {
    await this.slot(key).focus();
  }
}

/** "Đổi chế độ rút sẽ bắt đầu lại ván" - asked before a draw-mode change throws a game away. */
export class DrawModeDialog {
  constructor(readonly page: Page) {}

  root(): Locator {
    return this.page.getByRole("dialog", { name: copy.confirm.drawModeTitle });
  }

  keepButton(): Locator {
    return this.root().getByRole("button", { name: copy.confirm.cancel, exact: true });
  }

  acceptButton(): Locator {
    return this.root().getByRole("button", { name: copy.confirm.accept, exact: true });
  }
}

/** "Thắng rồi!" - the dialog over the finished board. */
export class WinDialog {
  constructor(readonly page: Page) {}

  root(): Locator {
    return this.page.getByRole("dialog", { name: copy.win.title });
  }

  playAgainButton(): Locator {
    return this.root().getByRole("button", { name: copy.win.playAgain, exact: true });
  }
}

/** Ducker ID sign-in button and account menu - only rendered by the flag-on export (ADR-0012). */
export class AccountMenu {
  constructor(readonly page: Page) {}

  /** Matched exactly: the in-flight label "Đang đăng nhập…" also contains the words. */
  signInButton(): Locator {
    return this.page.getByRole("button", { name: copy.account.signIn, exact: true });
  }

  signingInButton(): Locator {
    return this.page.getByRole("button", { name: copy.account.signingIn, exact: true });
  }

  trigger(): Locator {
    return this.page.getByRole("button", { name: copy.account.menuLabel, exact: true });
  }

  menu(): Locator {
    return this.page.getByRole("menu", { name: copy.account.menuLabel });
  }

  profileLink(): Locator {
    return this.menu().getByRole("menuitem", { name: copy.account.openProfile });
  }

  signOutItem(): Locator {
    return this.menu().getByRole("menuitem", { name: copy.account.signOut });
  }
}

// ── legacy helpers ────────────────────────────────────────────────────────
// The function API of client/e2e/helpers.ts, kept only until every migrated spec is normalised onto GamePage.

export const FIXED_SEED = 20260904;
const legacy = (page: Page) => new GamePage(page);
export const openGame = (page: Page, seed: number = FIXED_SEED) => legacy(page).goto(seed);
export const board = (page: Page) => legacy(page).board();
export const slot = (page: Page, key: PileKey) => legacy(page).slot(key);
export const tableau = (page: Page, index: number) => legacy(page).slot(tableauKey(index));
export const stockSlot = (page: Page) => legacy(page).slot("stock");
export const cardsIn = (page: Page, key: PileKey) => legacy(page).cardsIn(key);
export const cardCount = (page: Page, key: PileKey) => legacy(page).cardCount(key);
export const topCard = (page: Page, key: PileKey) => legacy(page).topCard(key);
export const cardAt = (page: Page, key: PileKey, index: number) => legacy(page).cardAt(key, index);
export const tapStock = (page: Page) => legacy(page).tapStock();
export const dropOnPile = (page: Page, key: PileKey) => legacy(page).tapPile(key);
export const button = (page: Page, name: string) => page.getByRole("button", { name });
