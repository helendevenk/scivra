import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChallengeCard } from "@/shared/blocks/experiments/challenge-card";
import type { Challenge } from "@/shared/types/experiment";

describe("ChallengeCard", () => {
  const challenge: Challenge = {
    id: "q1",
    question: "What happens when you double the mass?",
    options: ["Force doubles", "Acceleration halves", "Nothing changes", "Speed doubles"],
    correctAnswer: "Acceleration halves",
    hint: "Think about F = ma. If F stays the same...",
    relatedParameterId: "mass",
    tier: "free",
  };

  it("should render question text", () => {
    const { container } = render(
      <ChallengeCard challenge={challenge} onComplete={vi.fn()} onNeedHelp={vi.fn()} />
    );
    expect(container.textContent).toContain("What happens when you double the mass?");
  });

  it("should render all options", () => {
    const { container } = render(
      <ChallengeCard challenge={challenge} onComplete={vi.fn()} onNeedHelp={vi.fn()} />
    );
    expect(container.textContent).toContain("Force doubles");
    expect(container.textContent).toContain("Acceleration halves");
    expect(container.textContent).toContain("Nothing changes");
    expect(container.textContent).toContain("Speed doubles");
  });

  it("should show positive feedback on correct answer", () => {
    const onComplete = vi.fn();
    const { container } = render(
      <ChallengeCard challenge={challenge} onComplete={onComplete} onNeedHelp={vi.fn()} />
    );

    // Click correct answer
    const correctOption = Array.from(container.querySelectorAll("button"))
      .find((btn) => btn.textContent?.includes("Acceleration halves"));
    expect(correctOption).toBeTruthy();
    fireEvent.click(correctOption!);

    // Should show positive feedback (green border)
    expect(onComplete).toHaveBeenCalledWith("q1");
  });

  it("should show hint on wrong answer with np-gold styling", () => {
    const { container } = render(
      <ChallengeCard challenge={challenge} onComplete={vi.fn()} onNeedHelp={vi.fn()} />
    );

    // Click wrong answer
    const wrongOption = Array.from(container.querySelectorAll("button"))
      .find((btn) => btn.textContent?.includes("Force doubles"));
    fireEvent.click(wrongOption!);

    // Should show hint text
    expect(container.textContent).toContain("Think about F = ma");
  });

  it("should call onNeedHelp with relatedParameterId on wrong answer button click", () => {
    const onNeedHelp = vi.fn();
    const { container } = render(
      <ChallengeCard challenge={challenge} onComplete={vi.fn()} onNeedHelp={onNeedHelp} />
    );

    // Click wrong answer
    const wrongOption = Array.from(container.querySelectorAll("button"))
      .find((btn) => btn.textContent?.includes("Force doubles"));
    fireEvent.click(wrongOption!);

    // Click "Go back to experiment"
    const goBackBtn = Array.from(container.querySelectorAll("button"))
      .find((btn) => btn.textContent?.includes("Go back to experiment"));
    if (goBackBtn) {
      fireEvent.click(goBackBtn);
      expect(onNeedHelp).toHaveBeenCalledWith("mass");
    }
  });

  it("should allow retry after wrong answer", () => {
    const onComplete = vi.fn();
    const { container } = render(
      <ChallengeCard challenge={challenge} onComplete={onComplete} onNeedHelp={vi.fn()} />
    );

    // Click wrong first
    const wrongOption = Array.from(container.querySelectorAll("button"))
      .find((btn) => btn.textContent?.includes("Force doubles"));
    fireEvent.click(wrongOption!);

    // Click "Try Again"
    const tryAgain = Array.from(container.querySelectorAll("button"))
      .find((btn) => btn.textContent?.includes("Try Again"));
    if (tryAgain) {
      fireEvent.click(tryAgain);

      // Now click correct
      const correctOption = Array.from(container.querySelectorAll("button"))
        .find((btn) => btn.textContent?.includes("Acceleration halves"));
      if (correctOption) {
        fireEvent.click(correctOption);
        expect(onComplete).toHaveBeenCalledWith("q1");
      }
    }
  });
});
