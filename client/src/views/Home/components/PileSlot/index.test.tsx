import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { cardId } from "@/game/cards";
import type { PileId } from "@/game/state";
import { strings } from "@/lib/strings";
import { PileSlot } from "./index";

const T3: PileId = { kind: "tableau", index: 3 };
const F0: PileId = { kind: "foundation", index: 0 };

const props = {
  pileId: T3,
  label: strings.pile.tableau(3),
  height: "var(--card-h)",
  cardIds: [] as string[],
};

describe("PileSlot", () => {
  it("names itself, and says it is empty when it is", () => {
    render(<PileSlot {...props} />);
    const slot = screen.getByRole("group", { name: strings.pile.tableau(3) });
    expect(slot.getAttribute("data-pile")).toBe("tableau-3");
    expect(screen.getByText(strings.pile.empty)).toBeTruthy();
  });

  it("draws the outline only while it is empty", () => {
    const empty = render(<PileSlot {...props} />);
    expect(empty.container.querySelector("[data-empty]")).not.toBeNull();
    empty.unmount();

    const filled = render(<PileSlot {...props} cardIds={[cardId("spades", 1)]} />);
    expect(filled.container.querySelector("[data-empty]")).toBeNull();
  });

  // An exhausted stock and an empty foundation were the same rectangle until
  // 2026-09-12. A player hesitated in front of it, thought the game had broken, and
  // only went on because he risked a tap - report F-03.
  it("marks an exhausted stock apart from every other empty pile", () => {
    const stock = render(
      <PileSlot {...props} pileId={{ kind: "stock" }} label={strings.pile.stockEmpty} recyclable />,
    );
    expect(stock.container.querySelector("[data-recyclable]")).not.toBeNull();
    expect(screen.getByRole("group", { name: strings.pile.stockEmpty })).toBeTruthy();
    stock.unmount();

    // Every other empty pile keeps the bare outline: the mark means "tapping here does
    // something", so it must not appear where tapping does nothing.
    const foundation = render(<PileSlot {...props} pileId={F0} label={strings.pile.foundation("spades")} />);
    expect(foundation.container.querySelector("[data-recyclable]")).toBeNull();
    expect(foundation.container.querySelector("[data-empty]")).not.toBeNull();
  });

  it("drops the recycle mark as soon as the stock has cards again", () => {
    const { container } = render(
      <PileSlot
        {...props}
        pileId={{ kind: "stock" }}
        label={strings.pile.stock}
        cardIds={[cardId("spades", 1)]}
        recyclable
      />,
    );
    expect(container.querySelector("[data-recyclable]")).toBeNull();
  });

  it("claims its cards through aria-owns, since they are no longer its children", () => {
    // The cards live in BoardLayer now. Without this the accessibility tree would have
    // no idea which pile a card belongs to.
    render(
      <PileSlot {...props} cardIds={[cardId("spades", 1), cardId("hearts", 13)]} />,
    );
    const slot = screen.getByRole("group", { name: strings.pile.tableau(3) });
    expect(slot.getAttribute("aria-owns")).toBe("card-spades-1 card-hearts-13");
  });

  it("owns nothing when it holds nothing", () => {
    render(<PileSlot {...props} />);
    const slot = screen.getByRole("group", { name: strings.pile.tableau(3) });
    expect(slot.getAttribute("aria-owns")).toBeNull();
  });

  it("takes the height it is given, so the drop area covers the whole column", () => {
    render(<PileSlot {...props} height="calc(var(--card-h) + 60px)" />);
    const slot = screen.getByRole("group", { name: strings.pile.tableau(3) });
    expect(slot.style.height).toBe("calc(var(--card-h) + 60px)");
  });

  it("flashes when a move is refused - NFR-REL-03", () => {
    render(<PileSlot {...props} rejected />);
    expect(
      screen.getByRole("group", { name: strings.pile.tableau(3) }).className,
    ).toContain("reject-flash");
  });

  it("pulses when a card lands on it, and lights up in turn on a win", () => {
    const accepted = render(
      <PileSlot {...props} pileId={F0} label={strings.pile.foundation("spades")} accepted />,
    );
    expect(
      screen.getByRole("group", { name: strings.pile.foundation("spades") }).className,
    ).toContain("pile-accept");
    accepted.unmount();

    render(
      <PileSlot
        {...props}
        pileId={F0}
        label={strings.pile.foundation("spades")}
        celebrating
        celebrationIndex={2}
      />,
    );
    const slot = screen.getByRole("group", { name: strings.pile.foundation("spades") });
    expect(slot.className).toContain("pile-celebrate");
    expect(slot.style.animationDelay).toBe("calc(2 * 120ms)");
  });

  it("reports a click with the pile it is", () => {
    const onClick = vi.fn();
    render(<PileSlot {...props} onClick={onClick} />);
    fireEvent.click(screen.getByRole("group", { name: strings.pile.tableau(3) }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[0]).toEqual(T3);
  });
});
