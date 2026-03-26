import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExperimentFlow } from "@/shared/blocks/experiments/use-experiment-flow";

describe("useExperimentFlow", () => {
  const STAGES = ["hook", "explore", "learn", "challenge", "summary"] as const;

  describe("initial state", () => {
    it("should start at hook stage when experiment has a hook", () => {
      const { result } = renderHook(() =>
        useExperimentFlow({ hasHook: true, hasChallenges: true })
      );
      expect(result.current.currentStage).toBe("hook");
      expect(result.current.completedStages).toEqual(new Set());
    });

    it("should start at explore stage when experiment has no hook", () => {
      const { result } = renderHook(() =>
        useExperimentFlow({ hasHook: false, hasChallenges: true })
      );
      expect(result.current.currentStage).toBe("explore");
    });
  });

  describe("advanceStage", () => {
    it("should advance hook → explore", () => {
      const { result } = renderHook(() =>
        useExperimentFlow({ hasHook: true, hasChallenges: true })
      );
      act(() => result.current.advanceStage());
      expect(result.current.currentStage).toBe("explore");
      expect(result.current.completedStages).toContain("hook");
    });

    it("should advance through all 5 stages in order", () => {
      const { result } = renderHook(() =>
        useExperimentFlow({ hasHook: true, hasChallenges: true })
      );

      // hook → explore
      act(() => result.current.advanceStage());
      expect(result.current.currentStage).toBe("explore");

      // explore → learn
      act(() => result.current.advanceStage());
      expect(result.current.currentStage).toBe("learn");

      // learn → challenge
      act(() => result.current.advanceStage());
      expect(result.current.currentStage).toBe("challenge");

      // challenge → summary
      act(() => result.current.advanceStage());
      expect(result.current.currentStage).toBe("summary");

      expect(result.current.completedStages.size).toBe(4);
    });

    it("should skip challenge stage when experiment has no challenges", () => {
      const { result } = renderHook(() =>
        useExperimentFlow({ hasHook: true, hasChallenges: false })
      );

      act(() => result.current.advanceStage()); // hook → explore
      act(() => result.current.advanceStage()); // explore → learn
      act(() => result.current.advanceStage()); // learn → summary (skip challenge)
      expect(result.current.currentStage).toBe("summary");
    });

    it("should not advance past summary", () => {
      const { result } = renderHook(() =>
        useExperimentFlow({ hasHook: false, hasChallenges: false })
      );

      act(() => result.current.advanceStage()); // explore → learn
      act(() => result.current.advanceStage()); // learn → summary
      act(() => result.current.advanceStage()); // should stay at summary
      expect(result.current.currentStage).toBe("summary");
    });
  });

  describe("goToStage", () => {
    it("should allow going back to a completed stage", () => {
      const { result } = renderHook(() =>
        useExperimentFlow({ hasHook: true, hasChallenges: true })
      );

      act(() => result.current.advanceStage()); // → explore
      act(() => result.current.advanceStage()); // → learn
      act(() => result.current.goToStage("hook"));
      expect(result.current.currentStage).toBe("hook");
    });

    it("should allow going to current stage", () => {
      const { result } = renderHook(() =>
        useExperimentFlow({ hasHook: true, hasChallenges: true })
      );

      act(() => result.current.advanceStage()); // → explore
      act(() => result.current.goToStage("explore"));
      expect(result.current.currentStage).toBe("explore");
    });

    it("should not allow going to an uncompleted future stage", () => {
      const { result } = renderHook(() =>
        useExperimentFlow({ hasHook: true, hasChallenges: true })
      );

      act(() => result.current.goToStage("learn"));
      expect(result.current.currentStage).toBe("hook"); // unchanged
    });
  });

  describe("skipStage", () => {
    it("should skip current stage and advance", () => {
      const { result } = renderHook(() =>
        useExperimentFlow({ hasHook: true, hasChallenges: true })
      );

      act(() => result.current.skipStage());
      expect(result.current.currentStage).toBe("explore");
      // skipped stages are marked completed
      expect(result.current.completedStages).toContain("hook");
    });
  });

  describe("stage status helpers", () => {
    it("should correctly report stage status", () => {
      const { result } = renderHook(() =>
        useExperimentFlow({ hasHook: true, hasChallenges: true })
      );

      expect(result.current.getStageStatus("hook")).toBe("current");
      expect(result.current.getStageStatus("explore")).toBe("locked");
      expect(result.current.getStageStatus("learn")).toBe("locked");

      act(() => result.current.advanceStage()); // → explore

      expect(result.current.getStageStatus("hook")).toBe("completed");
      expect(result.current.getStageStatus("explore")).toBe("current");
      expect(result.current.getStageStatus("learn")).toBe("locked");
    });
  });

  describe("active stages", () => {
    it("should return correct active stages based on config", () => {
      const { result: withAll } = renderHook(() =>
        useExperimentFlow({ hasHook: true, hasChallenges: true })
      );
      expect(withAll.current.activeStages).toEqual(STAGES);

      const { result: noHook } = renderHook(() =>
        useExperimentFlow({ hasHook: false, hasChallenges: true })
      );
      expect(noHook.current.activeStages).toEqual(["explore", "learn", "challenge", "summary"]);

      const { result: noChallenge } = renderHook(() =>
        useExperimentFlow({ hasHook: true, hasChallenges: false })
      );
      expect(noChallenge.current.activeStages).toEqual(["hook", "explore", "learn", "summary"]);

      const { result: minimal } = renderHook(() =>
        useExperimentFlow({ hasHook: false, hasChallenges: false })
      );
      expect(minimal.current.activeStages).toEqual(["explore", "learn", "summary"]);
    });
  });
});
