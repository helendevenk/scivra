import { describe, it, expect } from "vitest";
import { checkEasterEgg } from "@/shared/blocks/experiments/easter-egg-utils";
import type { EasterEgg } from "@/shared/types/experiment";

describe("checkEasterEgg", () => {
  const eggs: EasterEgg[] = [
    {
      parameterId: "angle",
      condition: "specific",
      triggerValue: 90,
      effect: "ball-goes-straight-up",
      message: "Straight up! The ball will land right where it started.",
    },
    {
      parameterId: "velocity",
      condition: "max",
      triggerValue: undefined,
      effect: "escape-velocity",
      message: "At this speed, the ball would leave Earth's atmosphere! 🚀",
    },
    {
      parameterId: "mass",
      condition: "min",
      triggerValue: undefined,
      effect: "feather-weight",
      message: "Nearly massless — like a neutrino!",
    },
  ];

  const parameterRanges = {
    angle: { min: 0, max: 90 },
    velocity: { min: 0, max: 100 },
    mass: { min: 0.1, max: 100 },
  };

  it("should trigger specific condition egg", () => {
    const result = checkEasterEgg(eggs, "angle", 90, parameterRanges);
    expect(result).toBeTruthy();
    expect(result?.message).toContain("Straight up");
  });

  it("should trigger max condition egg", () => {
    const result = checkEasterEgg(eggs, "velocity", 100, parameterRanges);
    expect(result).toBeTruthy();
    expect(result?.message).toContain("leave Earth");
  });

  it("should trigger min condition egg", () => {
    const result = checkEasterEgg(eggs, "mass", 0.1, parameterRanges);
    expect(result).toBeTruthy();
    expect(result?.message).toContain("neutrino");
  });

  it("should return null when no egg matches", () => {
    const result = checkEasterEgg(eggs, "angle", 45, parameterRanges);
    expect(result).toBeNull();
  });

  it("should return null for unknown parameter", () => {
    const result = checkEasterEgg(eggs, "gravity", 9.8, parameterRanges);
    expect(result).toBeNull();
  });
});
