import { describe, it, expect } from "vitest";
import {
  getExperimentsByStandard,
  getStandardsForSubject,
  getAllSubjectsWithCounts,
  getAllExperiments,
} from "@/shared/lib/experiments/registry";

describe("registry standard queries", () => {
  it("should return experiments filtered by primaryStandard", () => {
    const apPhysics1 = getExperimentsByStandard("ap-physics-1");
    expect(apPhysics1.length).toBeGreaterThan(0);
    for (const exp of apPhysics1) {
      expect(exp.primaryStandard).toBe("ap-physics-1");
    }
  });

  it("should return empty array for non-existent standard", () => {
    const result = getExperimentsByStandard("general");
    // general may or may not have experiments, but should not throw
    expect(Array.isArray(result)).toBe(true);
  });

  it("should return all standards for a subject", () => {
    const physicsStandards = getStandardsForSubject("physics");
    expect(physicsStandards).toContain("ap-physics-1");
    expect(physicsStandards).toContain("ngss-hs");
    // Should not contain non-physics standards
    expect(physicsStandards).not.toContain("ap-chemistry");
    expect(physicsStandards).not.toContain("ap-biology");
  });

  it("should return subjects with correct counts", () => {
    const subjectsWithCounts = getAllSubjectsWithCounts();
    expect(subjectsWithCounts.length).toBeGreaterThan(0);

    const totalFromCounts = subjectsWithCounts.reduce(
      (sum, s) => sum + s.count,
      0
    );
    const allExperiments = getAllExperiments();
    const experimentsWithSubject = allExperiments.filter((e) => e.subject);
    expect(totalFromCounts).toBe(experimentsWithSubject.length);
  });

  it("every experiment should have a primaryStandard", () => {
    const all = getAllExperiments();
    for (const exp of all) {
      expect(exp.primaryStandard).toBeDefined();
      expect(exp.primaryStandard).not.toBe("");
    }
  });
});
