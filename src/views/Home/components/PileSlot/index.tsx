"use client";

import type { KeyboardEvent, MouseEvent } from "react";
import type { CardId } from "@/game/cards";
import { pileKey, type PileId } from "@/game/state";
import { strings } from "@/lib/strings";
import { cardElementId } from "../CardView";

/**
 * The place a pile occupies: its drop area, its name, the outline when it is empty,
 * and the keyboard focus target. It does not draw cards - BoardLayer does, in one flat
 * layer - and it does not know what a legal move is.
 *
 * Because the cards are no longer its DOM children, the accessibility tree would
 * otherwise lose the "this pile contains these cards" relationship entirely. That is
 * what `aria-owns` restores, and it is the reason every CardView carries a stable id.
 */

export type PileSlotProps = {
  pileId: PileId;
  label: string;
  /** A CSS length from lib/layout.ts - the drop area must cover the whole column. */
  height: string;
  /** Bottom card first, so a screen reader walks the pile in the same order it looks. */
  cardIds: readonly CardId[];
  /** Flashes the pile for one beat after an illegal move (design.md section 4). */
  rejected?: boolean;
  /** Pulses once when a card lands here. */
  accepted?: boolean;
  /** Lights up in sequence on a win. */
  celebrating?: boolean;
  celebrationIndex?: number;
  onClick?: (pileId: PileId, event: MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  /** Reports real focus, so the keyboard's idea of "here" cannot drift from the DOM's. */
  onFocus?: (pileId: PileId) => void;
  tabIndex?: number;
};

export function PileSlot({
  pileId,
  label,
  height,
  cardIds,
  rejected = false,
  accepted = false,
  celebrating = false,
  celebrationIndex = 0,
  onClick,
  onKeyDown,
  onFocus,
  tabIndex,
}: PileSlotProps) {
  const empty = cardIds.length === 0;
  const classes = [
    "focus-ring relative shrink-0",
    rejected ? "reject-flash" : "",
    accepted ? "pile-accept" : "",
    celebrating ? "pile-celebrate" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="group"
      aria-label={label}
      aria-owns={empty ? undefined : cardIds.map(cardElementId).join(" ")}
      data-pile={pileKey(pileId)}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      onFocus={() => onFocus?.(pileId)}
      onClick={(event) => onClick?.(pileId, event)}
      className={classes}
      style={{
        width: "var(--card-w)",
        height,
        minHeight: "var(--card-h)",
        borderRadius: "var(--radius-card)",
        animationDelay: celebrating ? `calc(${celebrationIndex} * 120ms)` : undefined,
      }}
    >
      {empty && (
        <>
          <span className="sr-only">{strings.pile.empty}</span>
          <div
            aria-hidden="true"
            data-empty="true"
            className="absolute inset-0"
            style={{
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: "var(--edge-empty)",
              borderRadius: "var(--radius-card)",
            }}
          />
        </>
      )}
    </div>
  );
}
