import { describe, it, expect } from "vitest";
import { SUBJECTS, SUBJECT_LIST } from "@/shared/lib/experiments/subjects";

describe("SUBJECTS", () => {
  it("should contain all 5 disciplines", () => {
    const keys = Object.keys(SUBJECTS);
    expect(keys).toEqual(
      expect.arrayContaining([
        "physics",
        "chemistry",
        "biology",
        "earth-science",
        "math",
      ])
    );
    expect(keys).toHaveLength(5);
  });

  it("should have label, labelZh, dataAttr, and icon for each subject", () => {
    for (const [key, value] of Object.entries(SUBJECTS)) {
      expect(value).toHaveProperty("label");
      expect(value).toHaveProperty("labelZh");
      expect(value).toHaveProperty("dataAttr", key);
      expect(value).toHaveProperty("icon");
    }
  });
});

describe("SUBJECT_LIST", () => {
  it("should be an array of exactly 5 subject keys", () => {
    expect(SUBJECT_LIST).toHaveLength(5);
    expect(SUBJECT_LIST).toEqual(Object.keys(SUBJECTS));
  });
});
