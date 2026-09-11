import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { cardId, type Card } from "@/game/cards";
import { strings } from "@/lib/strings";
import { CardView } from "./index";

// Props viết inline trong signature (R-16), nên test lấy kiểu từ chính component.
type CardViewProps = Parameters<typeof CardView>[0];

const queenOfHearts: Card = { id: cardId("hearts", 12), suit: "hearts", rank: 12 };
const sevenOfSpades: Card = { id: cardId("spades", 7), suit: "spades", rank: 7 };

/** Position is required now that BoardLayer places every card; default it away so the
 *  tests stay about labels, hit areas and callbacks. */
const at = (props: Partial<CardViewProps> & { card: Card; faceUp: boolean }) => (
  <CardView x="0px" y="0px" z={0} {...props} />
);

describe("CardView", () => {
  it("labels a face-up card with its Vietnamese name", () => {
    render(at({ card: queenOfHearts, faceUp: true }));
    expect(screen.getByLabelText("Cơ Đầm")).toBeTruthy();
  });

  it("says how many cards move with it", () => {
    render(at({ card: sevenOfSpades, faceUp: true, stackCount: 3 }));
    expect(screen.getByLabelText(strings.card.label("spades", 7, 3))).toBeTruthy();
  });

  it("hides the identity of a face-down card", () => {
    render(at({ card: queenOfHearts, faceUp: false }));
    expect(screen.getByLabelText(strings.card.faceDown)).toBeTruthy();
    expect(screen.queryByLabelText("Cơ Đầm")).toBeNull();
  });

  it("announces the selected state in the label", () => {
    render(at({ card: queenOfHearts, faceUp: true, selected: true }));
    const el = screen.getByLabelText(`Cơ Đầm, ${strings.card.selected}`);
    expect(el.getAttribute("aria-pressed")).toBe("true");
  });

  it("keeps a 44px hit area even though the drawn card is narrower - NFR-A11Y-03", () => {
    const { container } = render(at({ card: queenOfHearts, faceUp: true }));
    const hit = container.querySelector<HTMLElement>("[data-hit-area]");
    expect(hit).not.toBeNull();
    expect(hit?.style.minWidth).toBe("44px");
    expect(hit?.style.minHeight).toBe("44px");
    // The drawn card itself is untouched: still one --card-w wide.
    const card = screen.getByLabelText("Cơ Đầm");
    expect(card.style.width).toBe("var(--card-w)");
  });

  it("emits the pointer and click callbacks it is given", () => {
    const onPointerDown = vi.fn();
    const onClick = vi.fn();
    const onDoubleClick = vi.fn();
    render(
      at({ card: queenOfHearts, faceUp: true, onPointerDown, onClick, onDoubleClick }),
    );
    const el = screen.getByLabelText("Cơ Đầm");
    fireEvent.pointerDown(el);
    fireEvent.click(el);
    fireEvent.doubleClick(el);
    expect(onPointerDown).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onDoubleClick).toHaveBeenCalledTimes(1);
  });

  it("carries its stable card id, which is what animations key off", () => {
    render(at({ card: sevenOfSpades, faceUp: true }));
    expect(screen.getByLabelText("Bích Bảy").getAttribute("data-card")).toBe("spades-7");
  });

  it("keeps both faces in the DOM so the reveal is one rotation, not a DOM swap", () => {
    const { container } = render(at({ card: queenOfHearts, faceUp: false }));
    const inner = container.querySelector<HTMLElement>("[data-card-inner]");
    expect(inner).not.toBeNull();
    expect(inner?.style.transform).toBe("rotateY(180deg)");
    // Both faces are in the DOM at once, so the whole subtree is hidden from the
    // accessibility tree: a screen reader must never be able to read the face that is
    // currently turned away.
    expect(inner?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelectorAll("[data-card-inner] > div")).toHaveLength(2);
  });

  it("turns the inner element back over when the card is face up", () => {
    const { container } = render(at({ card: queenOfHearts, faceUp: true }));
    expect(container.querySelector<HTMLElement>("[data-card-inner]")?.style.transform).toBe(
      "rotateY(0deg)",
    );
  });

  it("places itself with a transform, and adds the lift when it is held", () => {
    const plain = render(at({ card: queenOfHearts, faceUp: true, x: "10px", y: "20px" }));
    expect(screen.getByLabelText("Cơ Đầm").style.transform).toBe("translate(10px, 20px)");
    plain.unmount();

    render(at({ card: queenOfHearts, faceUp: true, x: "10px", y: "20px", selected: true }));
    const held = screen.getByLabelText(`Cơ Đầm, ${strings.card.selected}`);
    expect(held.style.transform).toBe("translate(10px, 20px) scale(1.04)");
  });

  // NFR-A11Y-06. Until 2026-09-12 the lift shadow was the ONLY mark of a held card -
  // dark on a dark table, invisible in practice. The ring is what makes the state
  // visible; the shadow rides along inside it.
  it("rings a held card so the state is visible, not just lifted", () => {
    const plain = render(at({ card: queenOfHearts, faceUp: true }));
    expect(screen.getByLabelText("Cơ Đầm").className).not.toContain("card-selected");
    plain.unmount();

    render(at({ card: queenOfHearts, faceUp: true, selected: true }));
    const held = screen.getByLabelText(`Cơ Đầm, ${strings.card.selected}`);
    expect(held.className).toContain("card-selected");
    // The shadow is no longer written inline: MASTER.md owns the value now.
    expect(held.style.boxShadow).toBe("");
  });

  it("drops its transition while the deal is still stacked on the stock", () => {
    render(at({ card: queenOfHearts, faceUp: true, instant: true }));
    expect(screen.getByLabelText("Cơ Đầm").style.transition).toBe("none");
  });

  it("exposes the pile it belongs to, which is how the e2e suite finds it", () => {
    render(at({ card: sevenOfSpades, faceUp: true, pileKey: "tableau-3", indexInPile: 4 }));
    const el = screen.getByLabelText("Bích Bảy");
    expect(el.getAttribute("data-card-pile")).toBe("tableau-3");
    // DOM order is deck order, so the position in the pile has to be stated.
    expect(el.getAttribute("data-index")).toBe("4");
    expect(el.getAttribute("id")).toBe("card-spades-7");
  });
});
