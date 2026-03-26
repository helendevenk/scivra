import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StageProgress } from "@/shared/blocks/experiments/stage-progress";
import type { ExperimentStage } from "@/shared/types/experiment";

describe("StageProgress", () => {
  const defaultStages: ExperimentStage[] = ["hook", "explore", "learn", "challenge", "summary"];
  const defaultGetStatus = (stage: ExperimentStage) => {
    if (stage === "hook") return "completed" as const;
    if (stage === "explore") return "current" as const;
    return "locked" as const;
  };

  it("should render all stage labels", () => {
    render(
      <StageProgress
        stages={defaultStages}
        currentStage="explore"
        getStageStatus={defaultGetStatus}
        onStageClick={vi.fn()}
      />
    );

    expect(screen.getAllByText("Hook").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Explore").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Learn").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Challenge").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Summary").length).toBeGreaterThan(0);
  });

  it("should call onStageClick for completed stages", () => {
    const onClick = vi.fn();
    const { container } = render(
      <StageProgress
        stages={defaultStages}
        currentStage="explore"
        getStageStatus={defaultGetStatus}
        onStageClick={onClick}
      />
    );

    // First button is Hook (completed)
    const buttons = container.querySelectorAll("button");
    fireEvent.click(buttons[0]);
    expect(onClick).toHaveBeenCalledWith("hook");
  });

  it("should not call onStageClick for locked stages", () => {
    const onClick = vi.fn();
    render(
      <StageProgress
        stages={defaultStages}
        currentStage="explore"
        getStageStatus={defaultGetStatus}
        onStageClick={onClick}
      />
    );

    const learnButtons = screen.getAllByText("Learn");
    fireEvent.click(learnButtons[0]);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("should have aria-current for current stage", () => {
    render(
      <StageProgress
        stages={defaultStages}
        currentStage="explore"
        getStageStatus={defaultGetStatus}
        onStageClick={vi.fn()}
      />
    );

    const exploreButtons = screen.getAllByText("Explore");
    const exploreButton = exploreButtons[0].closest("button");
    expect(exploreButton).toHaveAttribute("aria-current", "step");
  });

  it("should render skip button and call onSkip", () => {
    const onSkip = vi.fn();
    render(
      <StageProgress
        stages={defaultStages}
        currentStage="explore"
        getStageStatus={defaultGetStatus}
        onStageClick={vi.fn()}
        onSkip={onSkip}
      />
    );

    const skipBtn = screen.getByText("Skip");
    fireEvent.click(skipBtn);
    expect(onSkip).toHaveBeenCalled();
  });

  it("should not render skip button on summary stage", () => {
    const { container } = render(
      <StageProgress
        stages={defaultStages}
        currentStage="summary"
        getStageStatus={(s) => s === "summary" ? "current" as const : "completed" as const}
        onStageClick={vi.fn()}
        onSkip={vi.fn()}
      />
    );

    // Skip button should not exist when currentStage is summary
    const skipButton = container.querySelector("button:last-child");
    const hasSkip = Array.from(container.querySelectorAll("button"))
      .some((btn) => btn.textContent === "Skip");
    expect(hasSkip).toBe(false);
  });
});
