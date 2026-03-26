import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExperimentHook } from "@/shared/blocks/experiments/experiment-hook";

describe("ExperimentHook", () => {
  const defaultHook = {
    question: "Which falls faster — a bowling ball or a feather?",
    context: "Most people get this wrong in a vacuum.",
    actionPrompt: "Drop them and find out →",
  };

  it("should render hook question", () => {
    render(<ExperimentHook hook={defaultHook} onStart={vi.fn()} />);
    const elements = screen.getAllByText("Which falls faster — a bowling ball or a feather?");
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should render context when provided", () => {
    render(<ExperimentHook hook={defaultHook} onStart={vi.fn()} />);
    const elements = screen.getAllByText("Most people get this wrong in a vacuum.");
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should not render context when not provided", () => {
    const hookNoContext = { ...defaultHook, context: undefined };
    const { container } = render(
      <ExperimentHook hook={hookNoContext} onStart={vi.fn()} />
    );
    expect(container.textContent).not.toContain("Most people");
  });

  it("should render action prompt as button text", () => {
    render(<ExperimentHook hook={defaultHook} onStart={vi.fn()} />);
    const buttons = screen.getAllByRole("button", { name: /Drop them and find out/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should call onStart when button is clicked", () => {
    const onStart = vi.fn();
    const { container } = render(<ExperimentHook hook={defaultHook} onStart={onStart} />);
    const button = container.querySelector("button");
    expect(button).toBeTruthy();
    fireEvent.click(button!);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("should render thumbnail as blurred background when provided", () => {
    const { container } = render(
      <ExperimentHook
        hook={defaultHook}
        onStart={vi.fn()}
        thumbnailUrl="/images/experiments/test.webp"
      />
    );
    const bgImg = container.querySelector("img");
    expect(bgImg).toBeTruthy();
  });
});
