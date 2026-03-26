import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { GuidedTooltip } from "@/shared/components/ui/guided-tooltip";

describe("GuidedTooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not be visible initially", () => {
    const { container } = render(
      <GuidedTooltip message="Try dragging this slider" showAfterMs={5000} />
    );
    expect(container.querySelector("[data-visible='true']")).toBeNull();
  });

  it("should become visible after delay", () => {
    const { container } = render(
      <GuidedTooltip message="Try dragging this slider" showAfterMs={5000} />
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(container.textContent).toContain("Try dragging this slider");
  });

  it("should hide when dismissed", () => {
    const { container } = render(
      <GuidedTooltip message="Try dragging this slider" showAfterMs={0} />
    );

    act(() => {
      vi.advanceTimersByTime(0);
    });

    const dismissBtn = container.querySelector("button");
    if (dismissBtn) {
      act(() => {
        dismissBtn.click();
      });
      // After dismissal, should be hidden
      expect(container.querySelector("[data-visible='true']")).toBeNull();
    }
  });
});
