import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ExperimentSummary } from "@/shared/blocks/experiments/experiment-summary";

describe("ExperimentSummary", () => {
  // Without explicit cleanup, mounted ExperimentSummary instances leak
  // between tests; a deferred React 19 commit can fire on an unmounted
  // tree at vitest teardown and produce 'ReferenceError: window is not
  // defined' from React's scheduler. Same root cause + fix as gallery
  // (commit e42790d).
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    title: "Projectile Motion",
    description: "You explored how angle and velocity affect projectile range.",
    formulas: [
      { latex: "R = \\frac{v^2 \\sin 2\\theta}{g}", description: "Range formula" },
    ],
    challengesCompleted: 3,
    totalChallenges: 3,
    relatedExperiments: [
      { slug: "newtons-laws", title: "Newton's Laws", subject: "physics", standard: "ap-physics-1" },
    ],
    shareUrl: "https://neonphysics.com/labs/physics/ap-physics-1/projectile-motion",
  };

  it("should render experiment title", () => {
    const { container } = render(<ExperimentSummary {...defaultProps} />);
    expect(container.textContent).toContain("Projectile Motion");
  });

  it("should render completion message", () => {
    const { container } = render(<ExperimentSummary {...defaultProps} />);
    expect(container.textContent).toContain("Lab Complete");
  });

  it("should render challenge score", () => {
    const { container } = render(<ExperimentSummary {...defaultProps} />);
    expect(container.textContent).toContain("3/3");
  });

  it("should render related experiment links", () => {
    const { container } = render(<ExperimentSummary {...defaultProps} />);
    expect(container.textContent).toContain("Newton's Laws");
  });

  it("should render share section", () => {
    const { container } = render(<ExperimentSummary {...defaultProps} />);
    expect(container.textContent).toContain("Share");
  });
});
