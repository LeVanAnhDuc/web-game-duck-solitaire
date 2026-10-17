"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import type { CardId } from "@/game/cards";
import { pileKey } from "@/game/state";
import { FLIGHT_Z, pileOrigin, type CardPlacement } from "@/lib/layout";
import type { BoardMotion } from "@/hooks/useBoardMotion";
import { CardView } from "../../components/CardView";

/**
 * All 52 cards, in one absolutely positioned layer.
 *
 * They are rendered in deck order and never reordered - lib/layout.ts guarantees it -
 * so React never inserts, removes or moves a node for the whole game. That is what
 * makes a move something a CSS transition can follow (invariant #11).
 *
 * The layer itself takes no pointer events, so a click on bare felt reaches the
 * PileSlot underneath; each card switches them back on. It is NOT aria-hidden: the
 * cards are the accessible content, and each pile claims its own through aria-owns.
 *
 * This component knows nothing about the rules or about gestures.
 */

export type BoardLayerProps = {
  placements: readonly CardPlacement[];
  /** The card the player is holding, plus everything stacked on it. */
  selected: ReadonlySet<CardId>;
  /** The card that just failed to move, if any. */
  rejectedCardId?: CardId | null;
  motion: BoardMotion;
  onCardPointerDown?: (placement: CardPlacement, event: ReactPointerEvent<HTMLDivElement>) => void;
  onCardClick?: (placement: CardPlacement) => void;
  onCardDoubleClick?: (placement: CardPlacement) => void;
};

/**
 * How far behind the card above it a card starts moving. A run moved as a unit reads
 * as a sequence rather than a slab, and the delay counts from the lowest card of the
 * run so the shape of the run is preserved.
 */
function runDelay(
  placement: CardPlacement,
  flying: ReadonlySet<CardId>,
  placements: readonly CardPlacement[],
): string | undefined {
  if (!flying.has(placement.card.id)) return undefined;
  const key = pileKey(placement.pile);
  let lowest = placement.indexInPile;
  for (const other of placements) {
    if (!flying.has(other.card.id) || pileKey(other.pile) !== key) continue;
    lowest = Math.min(lowest, other.indexInPile);
  }
  const depth = placement.indexInPile - lowest;
  return depth === 0 ? undefined : `calc(${depth} * var(--stagger-run))`;
}

export function BoardLayer({
  placements,
  selected,
  rejectedCardId,
  motion,
  onCardPointerDown,
  onCardClick,
  onCardDoubleClick,
}: BoardLayerProps) {
  const stock = pileOrigin({ kind: "stock" });

  return (
    <div data-board-layer="true" className="pointer-events-none absolute inset-0">
      {placements.map((placement) => {
        const flying = motion.flying.has(placement.card.id);
        const held = selected.has(placement.card.id);

        // While dealing, every card sits face down on the stock; the frame after, they
        // travel to their places and turn over on the way. Both halves fall out of the
        // same two properties, so there is no separate deal animation to maintain.
        const x = motion.dealing ? stock.x : placement.x;
        const y = motion.dealing ? stock.y : placement.y;
        const faceUp = motion.dealing ? false : placement.faceUp;

        // The deal's stagger is windowed. Left switched on, every later move would
        // inherit a delay of up to 700ms and the board would feel broken.
        const delay = motion.dealing
          ? undefined
          : motion.dealStagger
            ? `calc(${placement.dealOrder} * var(--stagger-deal))`
            : runDelay(placement, motion.flying, placements);

        return (
          <CardView
            key={placement.card.id}
            card={placement.card}
            faceUp={faceUp}
            x={x}
            y={y}
            z={held ? FLIGHT_Z + 1 : flying ? FLIGHT_Z : placement.z}
            selected={held}
            stackCount={placement.stackCount}
            pileKey={pileKey(placement.pile)}
            indexInPile={placement.indexInPile}
            delay={delay}
            instant={motion.dealing}
            rejected={rejectedCardId === placement.card.id}
            // A card in flight is lifted above every pile so it is not painted behind
            // the ones it crosses - and that lift would otherwise make it swallow taps
            // aimed at the cards it now covers. Something in mid-air is not something
            // to grab, so for the length of the move it takes no pointer events.
            interactive={!flying}
            onPointerDown={(event) => onCardPointerDown?.(placement, event)}
            onClick={(event) => {
              // Exactly one callback per click: without this the PileSlot behind the
              // layer fires too, and the parent cannot tell "tapped a card" from
              // "tapped the empty slot".
              event.stopPropagation();
              onCardClick?.(placement);
            }}
            onDoubleClick={(event) => {
              event.stopPropagation();
              onCardDoubleClick?.(placement);
            }}
          />
        );
      })}
    </div>
  );
}
