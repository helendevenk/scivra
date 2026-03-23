import { describe, it, expect } from "vitest";
import { scoreStep } from "@/shared/lib/quest/scoring";

describe("quest/scoring.ts", () => {
  // Test 1: knowledge auto full points
  it("knowledge: auto full points", () => {
    const result = scoreStep("knowledge", null, "", null, 10);
    expect(result.score).toBe(10);
    expect(result.maxScore).toBe(10);
    expect(result.feedback).toBe("Knowledge reviewed");
  });

  // Test 2: predict/numeric within tolerance = full points
  it("predict/numeric: within tolerance = full points", () => {
    const config = JSON.stringify({
      predictionType: "numeric",
      numericTarget: 100,
      numericTolerance: 10,
    });
    const result = scoreStep("predict", config, "numeric", "105", 10);
    expect(result.score).toBe(10);
    expect(result.feedback).toBe("Prediction within tolerance");
  });

  // Test 3: predict/numeric outside tolerance = partial credit
  it("predict/numeric: outside tolerance = partial credit", () => {
    const config = JSON.stringify({
      predictionType: "numeric",
      numericTarget: 100,
      numericTolerance: 10,
    });
    const result = scoreStep("predict", config, "numeric", "150", 10);
    expect(result.score).toBeLessThan(10);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.feedback).toContain("Prediction off by");
  });

  // Test 4: predict/numeric invalid number = 0
  it("predict/numeric: invalid number = 0", () => {
    const config = JSON.stringify({
      predictionType: "numeric",
      numericTarget: 100,
    });
    const result = scoreStep("predict", config, "numeric", "abc", 10);
    expect(result.score).toBe(0);
    expect(result.feedback).toBe("Invalid number");
  });

  // Test 5: predict/multiple_choice correct index = full
  it("predict/multiple_choice: correct index = full", () => {
    const config = JSON.stringify({
      predictionType: "multiple_choice",
      correctIndex: 2,
    });
    const result = scoreStep("predict", config, "multiple_choice", "2", 10);
    expect(result.score).toBe(10);
    expect(result.feedback).toBe("Correct prediction");
  });

  // Test 6: predict/multiple_choice wrong index = 0
  it("predict/multiple_choice: wrong index = 0", () => {
    const config = JSON.stringify({
      predictionType: "multiple_choice",
      correctIndex: 2,
    });
    const result = scoreStep("predict", config, "multiple_choice", "1", 10);
    expect(result.score).toBe(0);
    expect(result.feedback).toBe("Incorrect prediction");
  });

  // Test 7: predict/open_ended auto full points
  it("predict/open_ended: auto full points", () => {
    const config = JSON.stringify({ predictionType: "open_ended" });
    const result = scoreStep(
      "predict",
      config,
      "open_ended",
      "I think it will go up",
      10
    );
    expect(result.score).toBe(10);
    expect(result.feedback).toBe("Prediction recorded");
  });

  // Test 8: predict no response = 0
  it("predict: no response = 0", () => {
    const config = JSON.stringify({ predictionType: "numeric" });
    const result = scoreStep("predict", config, "numeric", null, 10);
    expect(result.score).toBe(0);
    expect(result.feedback).toBe("No response provided");
  });

  // Test 9: experiment auto full points
  it("experiment: auto full points", () => {
    const result = scoreStep("experiment", null, "", null, 10);
    expect(result.score).toBe(10);
    expect(result.maxScore).toBe(10);
    expect(result.feedback).toBe("Observation confirmed");
  });

  // Test 10: compare deviation < 10% = full
  it("compare: deviation < 10% = full points", () => {
    const response = JSON.stringify({ deviationPercent: 5 });
    const result = scoreStep("compare", null, "", response, 10);
    expect(result.score).toBe(10);
    expect(result.feedback).toContain("Excellent");
  });

  // Test 11: compare deviation 10-25% = 70%
  it("compare: deviation 10-25% = 70%", () => {
    const response = JSON.stringify({ deviationPercent: 15 });
    const result = scoreStep("compare", null, "", response, 10);
    expect(result.score).toBe(7);
    expect(result.feedback).toContain("Good");
  });

  // Test 12: compare deviation 25-50% = 40%
  it("compare: deviation 25-50% = 40%", () => {
    const response = JSON.stringify({ deviationPercent: 30 });
    const result = scoreStep("compare", null, "", response, 10);
    expect(result.score).toBe(4);
    expect(result.feedback).toContain("Fair");
  });

  // Test 13: compare deviation > 50% = 20%
  it("compare: deviation > 50% = 20%", () => {
    const response = JSON.stringify({ deviationPercent: 80 });
    const result = scoreStep("compare", null, "", response, 10);
    expect(result.score).toBe(2);
    expect(result.feedback).toContain("far from");
  });

  // Test 14: compare no response = 20% participation
  it("compare: no response = 20% participation", () => {
    const result = scoreStep("compare", null, "", null, 10);
    expect(result.score).toBe(2);
    expect(result.feedback).toBe("No comparison data");
  });

  // Test 15: compare invalid JSON = 20% participation
  it("compare: invalid JSON = 20% participation", () => {
    const result = scoreStep("compare", null, "", "not-json", 10);
    expect(result.score).toBe(2);
    expect(result.feedback).toContain("participation");
  });

  // Test 16: explain/multiple_choice correct = full
  it("explain/multiple_choice: correct = full", () => {
    const config = JSON.stringify({
      explanationType: "multiple_choice",
      correctIndex: 1,
    });
    const result = scoreStep("explain", config, "multiple_choice", "1", 10);
    expect(result.score).toBe(10);
    expect(result.feedback).toBe("Correct explanation");
  });

  // Test 17: explain/free_text auto full
  it("explain/free_text: auto full", () => {
    const config = JSON.stringify({ explanationType: "free_text" });
    const result = scoreStep(
      "explain",
      config,
      "free_text",
      "Because energy is conserved",
      10
    );
    expect(result.score).toBe(10);
    expect(result.feedback).toBe("Explanation recorded");
  });

  // Test 18: unknown step type score 0
  it("unknown step type: score 0", () => {
    const result = scoreStep("nonexistent", null, "", null, 10);
    expect(result.score).toBe(0);
    expect(result.maxScore).toBe(10);
  });
});
