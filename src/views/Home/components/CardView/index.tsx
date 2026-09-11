"use client";

import type { PointerEvent, KeyboardEvent, MouseEvent } from "react";
import { colorOf, type Card } from "@/game/cards";
import { RANK_LABELS, SUIT_GLYPHS, strings } from "@/lib/strings";

/**
 * One playing card. Purely presentational: it takes props and emits callbacks, and
 * never asks whether a move is legal - that is moves.ts's job, and a component
 * answering it would be a second copy of the rules (invariant #6).
 *
 * Every card lives in BoardLayer, not in the pile that holds it, and is placed with
 * `transform: translate()` from lib/layout.ts. That is the whole reason a card can be
 * seen moving from one pile to another: the same DOM node gets new coordinates instead
 * of being unmounted from one subtree and mounted into another.
 *
 * `transform` rather than `top/left` on purpose - moving 52 elements by their offsets
 * makes the browser lay the page out again on every frame, which is exactly the budget
 * NFR-PERF-02 protects.
 */

/** The DOM id a PileSlot's aria-owns points at. */
export function cardElementId(cardId: string): string {
  return `card-${cardId}`;
}

/** NFR-A11Y-03. At 320px a drawn card is ~41px wide, so the hit area cannot be the
 *  card: it is a transparent overlay that spills over the neighbours instead. */
const MIN_TOUCH_PX = 44;

export function CardView({
  card,
  faceUp,
  x,
  y,
  z,
  selected = false,
  stackCount = 1,
  pileKey,
  indexInPile,
  delay,
  instant = false,
  rejected = false,
  interactive = true,
  onPointerDown,
  onClick,
  onDoubleClick,
  onKeyDown,
  tabIndex = -1,
}: {
  card: Card;
  faceUp: boolean;
  /** CSS lengths, normally `calc()` expressions from lib/layout.ts. */
  x: string;
  y: string;
  z: number;
  selected?: boolean;
  /** How many cards move with this one; only affects the aria-label. */
  stackCount?: number;
  /**
   * Which pile it belongs to, as a stable key. Exposed as `data-card-pile` rather
   * than `data-pile`: the PileSlot owns that name, and one attribute meaning both
   * "this is a pile" and "this card is in a pile" makes every selector ambiguous.
   */
  pileKey?: string;
  /**
   * Position in that pile, counting from the bottom. Needed because DOM order is deck
   * order now, not stacking order - so "the last one in the DOM" stopped meaning "the
   * one on top", and both the drag layer and the e2e suite need a way to say it.
   */
  indexInPile?: number;
  /** Delay before this card starts moving, so a run reads as a sequence. */
  delay?: string;
  /** Set while the opening deal has not started, to suppress the first transition. */
  instant?: boolean;
  /** Shakes once: this card is the one that could not go anywhere. */
  rejected?: boolean;
  /**
   * False for the card that follows the pointer while dragging. It must not be
   * hit-testable: the drop target is found with elementFromPoint, and a preview under
   * the pointer would answer instead of the pile being dropped on - which is a drag
   * that silently never lands.
   */
  interactive?: boolean;
  onPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onDoubleClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  tabIndex?: number;
}) {
  const base = faceUp
    ? strings.card.label(card.suit, card.rank, stackCount)
    : strings.card.faceDown;
  const label = selected ? `${base}, ${strings.card.selected}` : base;

  return (
    <div
      role="button"
      aria-label={label}
      aria-pressed={selected}
      id={cardElementId(card.id)}
      data-card={card.id}
      data-face={faceUp ? "up" : "down"}
      data-card-pile={pileKey}
      data-index={indexInPile}
      data-selected={selected ? "true" : undefined}
      tabIndex={tabIndex}
      className={`focus-ring absolute left-0 top-0 select-none${
        interactive ? " pointer-events-auto" : ""
      }${rejected ? " card-reject" : ""}${selected ? " card-selected" : ""}`}
      style={{
        width: "var(--card-w)",
        height: "var(--card-h)",
        zIndex: z,
        pointerEvents: interactive ? undefined : "none",
        // A held card is lifted rather than moved, so the lift rides along in the same
        // transform chain instead of fighting it.
        transform: `translate(${x}, ${y})${selected ? " scale(1.04)" : ""}`,
        transition: instant ? "none" : "transform var(--dur-move) var(--ease-move)",
        transitionDelay: delay,
        // The lift and the ring both live in `.card-selected` (globals.css), because
        // MASTER.md is the only place a visual value is allowed to be decided.
        // The browser must not claim the gesture, or a drag turns into a scroll.
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
    >
      {/* Both faces always exist, told apart by backface-visibility. That turns the
          reveal into one rotation instead of a DOM swap in the middle of it, and the
          flip is on its own element so it never has to share a transform with the
          card's position. */}
      <div
        aria-hidden="true"
        data-card-inner="true"
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          transform: faceUp ? "rotateY(0deg)" : "rotateY(180deg)",
          transition: instant ? "none" : "transform var(--dur-flip) ease-in-out",
        }}
      >
        <CardSide back={false}>
          <CardFace card={card} />
        </CardSide>
        <CardSide back>
          <CardBack />
        </CardSide>
      </div>

      <span
        aria-hidden="true"
        data-hit-area="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          minWidth: `${MIN_TOUCH_PX}px`,
          minHeight: `${MIN_TOUCH_PX}px`,
        }}
      />
    </div>
  );
}

/** One side of the card. The border lives here rather than on the outer element so it
 *  turns with the face; a border on the wrapper would stay put while the card flips. */
function CardSide({ back, children }: { back: boolean; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
        borderRadius: "var(--radius-card)",
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "var(--edge-card)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

function CardFace({ card }: { card: Card }) {
  const tone = colorOf(card.suit) === "red" ? "text-card-red" : "text-card-black";
  const rank = RANK_LABELS[card.rank];
  const glyph = SUIT_GLYPHS[card.suit];

  return (
    <div className={`relative h-full w-full bg-card ${tone}`}>
      <Corner rank={rank} glyph={glyph} className="left-[2px] top-[1px]" />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[18px] leading-none md:text-[28px] xl:text-[38px]"
      >
        {glyph}
      </span>
      <Corner rank={rank} glyph={glyph} className="bottom-[1px] right-[2px] rotate-180" />
    </div>
  );
}

function Corner({
  rank,
  glyph,
  className,
}: {
  rank: string;
  glyph: string;
  className: string;
}) {
  return (
    <span aria-hidden="true" className={`absolute flex flex-col items-center ${className}`}>
      <span className="font-num text-[14px] font-bold leading-none md:text-[20px] xl:text-[26px]">
        {rank}
      </span>
      <span className="text-[12px] leading-none md:text-[16px] xl:text-[20px]">{glyph}</span>
    </span>
  );
}

/** No image: a CSS pattern keeps the bundle empty of assets and stays sharp at any
 *  pixel density (design.md section 4). */
function CardBack() {
  return (
    <div
      className="h-full w-full bg-card-back"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, var(--fg-card-back) 0 2px, transparent 2px 6px)",
      }}
    />
  );
}
