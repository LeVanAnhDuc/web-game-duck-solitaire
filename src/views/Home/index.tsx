"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { Card, CardId } from "@/game/cards";
import { findAutoTarget, findFoundationTarget } from "@/game/auto";
import {
  FOUNDATION_SUITS,
  cardsOf,
  pileKey,
  type DrawMode,
  type FoundationIndex,
  type GameState,
  type PileId,
  type TableauIndex,
} from "@/game/state";
import { useGame } from "@/hooks/useGame";
import { useBoardMotion } from "@/hooks/useBoardMotion";
import { useSelection, type DragSource } from "@/hooks/useSelection";
import type { MoveIntent } from "@/hooks/moveIntent";
import { pileHeight, placements, type CardPlacement } from "@/lib/layout";

import { strings } from "@/lib/strings";
import { BoardLayer } from "./mains/BoardLayer";
import { CardView } from "./components/CardView";
import { PileSlot } from "./components/PileSlot";
import { Toolbar } from "./mains/Toolbar";
import { WinOverlay } from "./components/WinOverlay";

// ghosts
import { AutoCompleteRunner } from "./ghosts/AutoCompleteRunner";
import { CelebrateWin } from "./ghosts/CelebrateWin";
import { FocusActivePile } from "./ghosts/FocusActivePile";

/**
 * The board: the only place that knows how the piles are arranged, how the keyboard
 * walks between them, and how an auto-complete run is paced. It holds no rules - every
 * question about legality goes to useGame, which asks the engine.
 *
 * Two layers, not two rows of a grid: PileSlots mark the places and take the drops,
 * BoardLayer draws all 52 cards. See docs/specs/board-motion/design.md.
 */

const STOCK: PileId = { kind: "stock" };
const WASTE: PileId = { kind: "waste" };
const FOUNDATIONS: PileId[] = [0, 1, 2, 3].map((i) => ({
  kind: "foundation",
  index: i as FoundationIndex,
}));
const TABLEAU: PileId[] = [0, 1, 2, 3, 4, 5, 6].map((i) => ({
  kind: "tableau",
  index: i as TableauIndex,
}));

/** Two rows, and the keyboard walks along them. Matches the visual layout exactly. */
const ROWS: PileId[][] = [[STOCK, WASTE, ...FOUNDATIONS], TABLEAU];

const ALL_PILES = ROWS.flat();

/** Where a pile sits in the keyboard grid, so the cursor can be sent to follow a card. */
function gridPosOf(pile: PileId): { row: number; col: number } {
  const key = pileKey(pile);
  const row = ROWS.findIndex((r) => r.some((p) => pileKey(p) === key));
  return row < 0 ? { row: 1, col: 0 } : { row, col: ROWS[row]!.findIndex((p) => pileKey(p) === key) };
}

/** Long enough to see a card land, short enough not to feel like waiting. Shorter than
 *  the flight itself, so consecutive cards overlap into one stream. */
const REJECT_FLASH_MS = 420;

/**
 * `stockEmpty` is not decoration: an exhausted stock and an empty foundation are the
 * same outline, and a player who cannot tell them apart concludes the game is over.
 * The name has to carry what the picture cannot - report F-03.
 */
function labelFor(pile: PileId, empty: boolean): string {
  switch (pile.kind) {
    case "stock":
      return empty ? strings.pile.stockEmpty : strings.pile.stock;
    case "waste":
      return strings.pile.waste;
    case "foundation":
      return strings.pile.foundation(FOUNDATION_SUITS[pile.index]!);
    case "tableau":
      return strings.pile.tableau(pile.index);
  }
}

function faceDownCountOf(state: GameState, pile: PileId): number {
  if (pile.kind === "tableau") return state.tableau[pile.index]?.down.length ?? 0;
  return pile.kind === "stock" ? state.stock.length : 0;
}

export function Home() {
  const game = useGame();
  const [rejected, setRejected] = useState<{ pile: string; card: CardId | null }>({
    pile: "",
    card: null,
  });
  /**
   * The spoken half of a refusal, kept apart from the flashing half on purpose.
   *
   * The flash is a 420ms animation. The announcement must not inherit that clock: a
   * live region is read when its text CHANGES, so the change is the event and wiping
   * the text afterwards buys nothing - it only risks the reader being mid-sentence when
   * the words vanish. So this is never cleared, only replaced. The counter is what makes
   * two identical refusals in a row two separate announcements.
   */
  const [announced, setAnnounced] = useState<{ text: string; count: number }>({
    text: "",
    count: 0,
  });
  const [autoRunning, setAutoRunning] = useState(false);
  const [pendingDrawMode, setPendingDrawMode] = useState<DrawMode | null>(null);
  const [keyboardActive, setKeyboardActive] = useState(false);
  const [focus, setFocus] = useState<{ row: number; col: number }>({ row: 1, col: 0 });
  const [celebrating, setCelebrating] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const drawModeRef = useRef<HTMLSelectElement>(null);

  const board = useMemo(() => placements(game.state), [game.state]);
  const byId = useMemo(() => new Map(board.map((p) => [p.card.id, p])), [board]);
  const motion = useBoardMotion(board, game.seed);

  /**
   * A refused move is announced twice on purpose: the pile flashes "not here", and the
   * card that stayed put shakes. The pile alone leaves it ambiguous which card was
   * being moved, which matters most in a long column.
   */
  const flashReject = useCallback((pile: PileId, card: CardId | null = null) => {
    setRejected({ pile: pileKey(pile), card });
    setAnnounced((prev) => ({ text: strings.a11y.moveRejected, count: prev.count + 1 }));
    window.setTimeout(() => setRejected({ pile: "", card: null }), REJECT_FLASH_MS);
  }, []);

  const stopAuto = useCallback(() => setAutoRunning(false), []);

  /**
   * Closing the dialog also hands focus back to the select that opened it. Without
   * that, focus falls to the document body and a keyboard player has to tab in from
   * the top of the page to get back to where they were.
   */
  const closeDrawModeDialog = useCallback(() => {
    setPendingDrawMode(null);
    drawModeRef.current?.focus();
  }, []);

  const handleIntent = useCallback(
    (intent: MoveIntent) => {
      stopAuto();
      if (game.play(intent) !== "rejected") return;
      // The lifted card is the lowest of the run being moved; it is the one that did
      // not go anywhere, so it is the one that shakes.
      const cards = cardsOf(game.state, intent.from);
      flashReject(intent.to, cards[cards.length - intent.count]?.id ?? null);
    },
    [game, flashReject, stopAuto],
  );

  const pileByKey = useCallback(
    (key: string) => ALL_PILES.find((p) => pileKey(p) === key) ?? null,
    [],
  );

  const selection = useSelection(handleIntent, pileByKey);



  /*
   * Ba việc nền của màn này nằm trong ghosts/: AutoCompleteRunner · CelebrateWin ·
   * FocusActivePile (R-04). Callback truyền cho chúng phải ỔN ĐỊNH — arrow inline sẽ
   * khởi động lại timer mỗi render, làm mỗi bước auto-complete dài ra.
   */
  const setCelebratingStable = useCallback((on: boolean) => setCelebrating(on), []);

  /** `null` khi con trỏ không nằm trên một chồng thật — khi đó không dịch focus. */
  const focusTarget = ROWS[focus.row]?.[focus.col];
  const focusTargetKey = focusTarget ? pileKey(focusTarget) : null;

  const focusedPile = ROWS[focus.row]?.[focus.col] ?? TABLEAU[0]!;

  const tapStock = useCallback(() => {
    stopAuto();
    selection.clear();
    game.playMove(game.state.stock.length > 0 ? { type: "draw" } : { type: "recycle" });
  }, [game, selection, stopAuto]);

  /**
   * Tapping the stock while holding a card is an attempt to put it there, and the
   * stock accepts nothing (design.md section 1) - so it is refused, visibly, rather
   * than quietly turning into a draw. Drawing is what an empty hand means.
   */
  const tapOrDropOnStock = useCallback(() => {
    if (selection.selection.kind !== "idle") selection.dropOn(STOCK);
    else tapStock();
  }, [selection, tapStock]);

  /** Two taps, or Enter: put this card wherever it legally fits. */
  const autoMoveFrom = useCallback(
    (from: PileId, count: number, followFocus = false) => {
      stopAuto();
      const move = findAutoTarget(game.state, from, count);
      if (move) {
        game.playMove(move);
        // The card flew to another pile; the keyboard cursor stayed where the card used
        // to be. A player who cannot see the board has no way to tell, and the next
        // arrow key then acts somewhere they did not intend - report F-07. Taps and
        // drags pass `followFocus: false`: there is no keyboard cursor to carry.
        // `findAutoTarget` only ever returns a "move"; the narrowing is for the type,
        // not for a case that happens.
        if (followFocus && move.type === "move") setFocus(gridPosOf(move.to));
      } else {
        const cards = cardsOf(game.state, from);
        flashReject(from, cards[cards.length - count]?.id ?? null);
      }
      selection.clear();
    },
    [game, selection, stopAuto, flashReject],
  );

  /**
   * One tap: put this card UP, or fall back to picking it up (FR-14).
   *
   * Deliberately narrower than two taps. One tap is the gesture a player makes
   * hundreds of times without looking, so it may only make the move that is almost
   * never wrong. Sending a card to a tableau column nobody chose is a decision, and a
   * decision needs the second tap.
   */
  const tapCard = useCallback(
    (source: DragSource) => {
      const up = findFoundationTarget(game.state, source.from);
      if (up && source.count === 1) {
        stopAuto();
        if (game.playMove(up) === "ok") {
          selection.clear();
          // The card just left the spot being tapped, so the second click of a double
          // tap would land on whatever is underneath and pick it up - one more tap and
          // that is a move nobody asked for.
          selection.suppressNextTap();
          return;
        }
      }
      selection.onCardTap(source);
    },
    [game, selection, stopAuto],
  );

  /** The source a card represents: itself plus everything stacked on top of it. */
  const sourceAt = useCallback(
    (pile: PileId, index: number): DragSource | null => {
      const cards = cardsOf(game.state, pile);
      const card = cards[index];
      if (!card) return null;
      if (index < faceDownCountOf(game.state, pile)) return null;
      const count = pile.kind === "tableau" ? cards.length - index : 1;
      if (pile.kind !== "tableau" && index !== cards.length - 1) return null;
      return { from: pile, count, cardId: card.id };
    },
    [game.state],
  );

  const sourceOf = useCallback(
    (placement: CardPlacement): DragSource | null =>
      sourceAt(placement.pile, placement.indexInPile),
    [sourceAt],
  );

  const onBoardKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const held = selection.selection;
      const rowLength = ROWS[focus.row]?.length ?? 1;
      let handled = true;

      switch (e.key) {
        case "ArrowLeft":
          setFocus((f) => ({ ...f, col: (f.col - 1 + rowLength) % rowLength }));
          break;
        case "ArrowRight":
          setFocus((f) => ({ ...f, col: (f.col + 1) % rowLength }));
          break;
        case "ArrowUp":
        case "ArrowDown": {
          // While holding a run from a tableau column, up and down change how deep the
          // grab goes. Idle, they switch rows. The hint text says so.
          if (held.kind === "selected" && held.from.kind === "tableau") {
            const cards = cardsOf(game.state, held.from);
            const down = faceDownCountOf(game.state, held.from);
            const maxCount = cards.length - down;
            const next = held.count + (e.key === "ArrowUp" ? 1 : -1);
            const count = Math.min(Math.max(next, 1), Math.max(maxCount, 1));
            const card = cards[cards.length - count];
            if (card) selection.selectSource({ from: held.from, count, cardId: card.id });
          } else {
            setFocus((f) => {
              const row = f.row === 0 ? 1 : 0;
              return { row, col: Math.min(f.col, (ROWS[row]?.length ?? 1) - 1) };
            });
          }
          break;
        }
        case " ":
        case "Spacebar": {
          if (focusedPile.kind === "stock") {
            tapOrDropOnStock();
            break;
          }
          if (held.kind === "idle") {
            const cards = cardsOf(game.state, focusedPile);
            const source = sourceAt(focusedPile, cards.length - 1);
            if (source) selection.selectSource(source);
            else flashReject(focusedPile);
          } else {
            selection.dropOn(focusedPile);
          }
          break;
        }
        case "Enter": {
          // The keyboard deliberately has no one-tap/two-tap split: that distinction
          // belongs to fingers, and Enter already means "find this card a home".
          if (held.kind !== "idle") autoMoveFrom(held.from, held.count, true);
          else {
            const cards = cardsOf(game.state, focusedPile);
            const source = sourceAt(focusedPile, cards.length - 1);
            if (source) autoMoveFrom(source.from, source.count, true);
          }
          break;
        }
        default:
          handled = false;
      }

      if (handled) {
        e.preventDefault();
        setKeyboardActive(true);
        stopAuto();
      }
    },
    [
      focus.row,
      focusedPile,
      game.state,
      selection,
      sourceAt,
      tapOrDropOnStock,
      autoMoveFrom,
      flashReject,
      stopAuto,
    ],
  );

  const wonCards: readonly Card[] = useMemo(
    () => game.state.foundations.flatMap((f) => [...f]),
    [game.state.foundations],
  );

  /** Everything the held card carries with it, for the lift. */
  const heldCardIds = useMemo<ReadonlySet<CardId>>(() => {
    const held = selection.selection;
    if (held.kind === "idle") return new Set();
    const cards = cardsOf(game.state, held.from);
    return new Set(cards.slice(cards.length - held.count).map((c) => c.id));
  }, [selection.selection, game.state]);

  const slotProps = (pile: PileId) => {
    const cards = game.ready ? cardsOf(game.state, pile) : [];
    return {
      pileId: pile,
      label: labelFor(pile, cards.length === 0),
      height: pileHeight(game.state, pile),
      cardIds: cards.map((c) => c.id),
      // Only the stock earns the recycle mark, and only once it is empty: the mark
      // means "tapping here does something", so it must not appear on a pile where
      // tapping does nothing.
      recyclable: pile.kind === "stock",
      rejected: rejected.pile === pileKey(pile),
      accepted: motion.accepted.has(pileKey(pile)),
      celebrating: celebrating && pile.kind === "foundation",
      celebrationIndex: pile.kind === "foundation" ? pile.index : 0,
      tabIndex: pileKey(focusedPile) === pileKey(pile) ? 0 : -1,
      // Focus is normally driven the other way - state moves it - but anything else can
      // focus a slot too (a click, a screen reader, a test). Following real focus is
      // what keeps "the pile the keyboard acts on" and "the pile that has focus" from
      // being two different piles.
      onFocus: (focused: PileId) => {
        const row = ROWS.findIndex((r) => r.some((p) => pileKey(p) === pileKey(focused)));
        if (row < 0) return;
        const col = ROWS[row]!.findIndex((p) => pileKey(p) === pileKey(focused));
        setFocus((current) =>
          current.row === row && current.col === col ? current : { row, col },
        );
      },
      onClick: () => (pile.kind === "stock" ? tapOrDropOnStock() : selection.onPileTap(pile)),
    };
  };

  const gridStyle = {
    gridTemplateColumns: "repeat(7, var(--card-w))",
    gap: "var(--gap-x)",
    justifyContent: "center",
  } as const;

  return (
    <main
      className="flex min-h-screen flex-col"
      onKeyDown={onBoardKeyDown}
      ref={boardRef}
      style={{ padding: 0 }}
    >
      {/*
        Ghost: chỉ chạy side-effect, không vẽ gì. Render VÔ ĐIỀU KIỆN và giữ đúng thứ
        tự ba effect từng nằm trong file này — effect của con chạy trước effect của
        cha, theo đúng thứ tự con (R-04).
      */}
      <AutoCompleteRunner
        running={autoRunning}
        state={game.state}
        onPlay={game.playMove}
        onExhausted={stopAuto}
      />
      <CelebrateWin
        won={game.won}
        onCelebrating={setCelebratingStable}
        onStopAuto={stopAuto}
      />
      <FocusActivePile
        active={keyboardActive}
        pileKey={focusTargetKey}
        container={boardRef}
      />

      {/* The seed is the only thing that makes this Solitaire different from any other,
          and it used to be the smallest type on the page with its explanation hidden in
          a `title` - visible on hover, which phones do not have. Three personas read it
          three different wrong ways, one of them as a score. Report F-04, F-05. */}
      <header
        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
        style={{ padding: "var(--pad-board)" }}
      >
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold text-fg">{strings.appTitle}</span>
          <span className="text-[12px] text-muted">{strings.tagline}</span>
        </div>
        <div className="flex flex-col sm:items-end">
          <span className="font-num text-[15px] text-fg">{strings.seed.label(game.seed)}</span>
          <span className="text-[12px] text-muted">{strings.seed.hint}</span>
        </div>
      </header>

      {/* Two channels for one message, because neither alone reaches everyone.
          `sr-only` is read aloud; `.keyboard-map` appears the moment something inside
          the board takes keyboard focus, which is the only way a sighted keyboard user
          was ever going to learn that the arrow keys exist - report F-06. */}
      <span className="sr-only">{strings.a11y.keyboardHint}</span>

      <div className="board-area">
        <p
          aria-hidden="true"
          className="keyboard-map text-[12px] text-muted"
          style={{ paddingInline: "var(--pad-board)" }}
        >
          {strings.a11y.keyboardHint}
        </p>

      <div
        aria-label={strings.a11y.board}
        className="relative"
        role="group"
        style={{ paddingInline: "var(--pad-board)" }}
      >
        <div className="flex flex-col" style={{ gap: "var(--gap-y)" }}>
          <div className="grid" style={gridStyle}>
            <PileSlot {...slotProps(STOCK)} />
            <PileSlot {...slotProps(WASTE)} />
            <div aria-hidden="true" />
            {FOUNDATIONS.map((pile) => (
              <PileSlot key={pileKey(pile)} {...slotProps(pile)} />
            ))}
          </div>

          <div className="grid items-start" style={gridStyle}>
            {TABLEAU.map((pile) => (
              <PileSlot key={pileKey(pile)} {...slotProps(pile)} />
            ))}
          </div>
        </div>

        {/* The cards sit above the slots, in a layer of their own, so a move is one
            node changing coordinates instead of a remount between two subtrees. */}
        <div
          className="absolute inset-0"
          style={{ paddingInline: "var(--pad-board)", pointerEvents: "none" }}
        >
          <div
            className="relative mx-auto h-full"
            style={{ width: "calc(7 * var(--card-w) + 6 * var(--gap-x))" }}
          >
            {game.ready && (
              <BoardLayer
                placements={board}
                selected={heldCardIds}
                rejectedCardId={rejected.card}
                motion={motion}
                onCardPointerDown={(placement, event) => {
                  const source = sourceOf(placement);
                  if (source) selection.onCardPointerDown(source, event);
                }}
                onCardClick={(placement) => {
                  if (placement.pile.kind === "stock") return tapOrDropOnStock();
                  const source = sourceOf(placement);
                  if (source) tapCard(source);
                  else selection.onPileTap(placement.pile);
                }}
                onCardDoubleClick={(placement) => {
                  const source = sourceOf(placement);
                  if (source) autoMoveFrom(source.from, source.count);
                }}
              />
            )}
          </div>
        </div>
      </div>
      </div>

      {/* A refused move has to leave a trace that survives every setting. The flash and
          the shake are animations, and NFR-A11Y-05 switches animations OFF for anyone
          who asked not to be animated - so until now that player got no feedback at
          all. This region does not animate, so it is the one channel that always
          arrives. The counter is the `key`, not the text: two refusals in a row say the
          same words, and a live region stays silent when the text does not change.
          Remounting the node is what makes the second one heard. Report F-02, NFR-A11Y-06. */}
      <div aria-live="polite" className="sr-only" role="status">
        <span key={announced.count}>{announced.text}</span>
      </div>

      <div className="mt-auto">
        <Toolbar
          canAutoComplete={game.autoCompleteAvailable}
          canUndo={game.canUndo}
          drawMode={game.drawMode}
          drawModeRef={drawModeRef}
          onAutoComplete={() => setAutoRunning(true)}
          onDrawModeChange={(mode) => {
            // Changing draw mode redeals, so it needs consent when a game is under way.
            if (game.moveCount === 0) game.setDrawMode(mode);
            else setPendingDrawMode(mode);
          }}
          onNewGame={() => {
            stopAuto();
            selection.clear();
            game.newGame();
          }}
          onRestart={() => {
            stopAuto();
            selection.clear();
            game.restart();
          }}
          onUndo={() => {
            stopAuto();
            selection.clear();
            game.undo();
          }}
        />
      </div>

      {/* The dragged card follows the pointer outside the board, so it lives here
          rather than in the layer. pointer-events: none keeps it from hit-testing
          itself when the drop target is looked up. */}
      {selection.selection.kind === "dragging" && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50"
          style={{
            left: selection.selection.x - selection.selection.dx,
            top: selection.selection.y - selection.selection.dy,
          }}
        >
          <DraggedCard cardId={selection.selection.cardId} byId={byId} />
        </div>
      )}

      {pendingDrawMode !== null && (
        /* `aria-modal` without moving focus is the classic half-implementation: the
           screen reader is confined to the dialog while the keyboard cursor stays
           outside it, so the player hears a dialog they cannot reach. Escape closing it
           is the same promise from the other side - a persona tried it and nothing
           happened. Report F-09. Escape means "keep my game", the safe branch. */
        <div
          aria-labelledby="draw-mode-title"
          aria-modal="true"
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
          onKeyDown={(event) => {
            if (event.key !== "Escape") return;
            event.stopPropagation();
            closeDrawModeDialog();
          }}
          role="dialog"
        >
          <div className="max-w-sm rounded bg-toolbar p-4 text-fg">
            <h2 className="text-[16px] font-semibold" id="draw-mode-title">
              {strings.confirm.drawModeTitle}
            </h2>
            <p className="mt-2 text-[14px] text-muted">{strings.confirm.drawModeBody}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                autoFocus
                className="focus-ring min-h-[44px] rounded px-3 text-[14px]"
                onClick={closeDrawModeDialog}
                type="button"
              >
                {strings.confirm.cancel}
              </button>
              <button
                className="focus-ring min-h-[44px] rounded bg-card px-3 text-[14px] text-card-black"
                onClick={() => {
                  game.setDrawMode(pendingDrawMode);
                  closeDrawModeDialog();
                }}
                type="button"
              >
                {strings.confirm.accept}
              </button>
            </div>
          </div>
        </div>
      )}

      {game.won && !celebrating && (
        <WinOverlay
          cards={wonCards}
          moveCount={game.moveCount}
          onPlayAgain={() => {
            selection.clear();
            game.newGame();
          }}
        />
      )}
    </main>
  );
}

/** The card under the cursor while dragging. Face up by definition - a face-down card
 *  is never a legal source, so sourceAt refuses to build one. */
function DraggedCard({
  cardId,
  byId,
}: {
  cardId: string;
  byId: Map<string, CardPlacement>;
}) {
  const placement = byId.get(cardId);
  if (!placement) return null;
  return <CardView card={placement.card} faceUp interactive={false} x="0px" y="0px" z={0} />;
}
