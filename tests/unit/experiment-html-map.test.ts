import { describe, it, expect } from "vitest";
import {
  EXPERIMENT_HTML_MAP,
  getExperimentHtmlPath,
} from "@/shared/lib/experiments/html-map";

describe("EXPERIMENT_HTML_MAP", () => {
  it("should be a non-empty record", () => {
    expect(Object.keys(EXPERIMENT_HTML_MAP).length).toBeGreaterThan(0);
  });

  it("should have all values ending with .html", () => {
    for (const path of Object.values(EXPERIMENT_HTML_MAP)) {
      expect(path).toMatch(/\.html$/);
    }
  });
});

describe("getExperimentHtmlPath", () => {
  it("should return the path for a known experiment", () => {
    const path = getExperimentHtmlPath("simple-harmonic-motion");
    expect(path).toBe("/experiments-v2/ap-physics/shm-simple-harmonic-motion.html");
  });

  it("should return null for an unknown experiment", () => {
    expect(getExperimentHtmlPath("nonexistent-experiment")).toBeNull();
  });
});
