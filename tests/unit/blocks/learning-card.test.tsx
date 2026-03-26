import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LearningCardList } from "@/shared/blocks/experiments/learning-card";
import type { LearningCard } from "@/shared/types/experiment";

// Mock katex to avoid CSS import issues in tests
vi.mock("katex", () => ({
  default: {
    renderToString: (latex: string) => `<span class="katex">${latex}</span>`,
  },
}));

vi.mock("katex/dist/katex.min.css", () => ({}));

describe("LearningCardList", () => {
  const cards: LearningCard[] = [
    {
      id: "card-1",
      title: "Newton's Second Law",
      content: "F = ma describes the relationship between force, mass, and acceleration.",
      formula: { latex: "F = ma", description: "Net force equals mass times acceleration" },
      relatedParameterId: "mass",
    },
    {
      id: "card-2",
      title: "Kinetic Energy",
      content: "Energy of motion depends on mass and velocity squared.",
      formula: { latex: "KE = \\frac{1}{2}mv^2", description: "Kinetic energy formula" },
    },
    {
      id: "card-3",
      title: "Momentum",
      content: "Product of mass and velocity.",
    },
  ];

  it("should render all card titles", () => {
    render(<LearningCardList cards={cards} onAllExpanded={vi.fn()} />);
    expect(screen.getAllByText("Newton's Second Law").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Kinetic Energy").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Momentum").length).toBeGreaterThan(0);
  });

  it("should call onAllExpanded when all cards have been viewed", () => {
    const onAllExpanded = vi.fn();
    const { container } = render(
      <LearningCardList cards={cards} onAllExpanded={onAllExpanded} />
    );

    // Click each accordion trigger to expand
    const triggers = container.querySelectorAll("[data-slot='accordion-trigger']");
    triggers.forEach((trigger) => fireEvent.click(trigger));

    expect(onAllExpanded).toHaveBeenCalled();
  });

  it("should render formula when card has one", () => {
    const { container } = render(
      <LearningCardList cards={[cards[0]]} onAllExpanded={vi.fn()} />
    );

    // Expand the card first
    const trigger = container.querySelector("[data-slot='accordion-trigger']");
    if (trigger) fireEvent.click(trigger);

    expect(container.textContent).toContain("F = ma");
  });

  it("should show related parameter hint when provided", () => {
    const { container } = render(
      <LearningCardList cards={[cards[0]]} onAllExpanded={vi.fn()} />
    );

    const trigger = container.querySelector("[data-slot='accordion-trigger']");
    if (trigger) fireEvent.click(trigger);

    expect(container.textContent).toContain("mass");
  });
});
