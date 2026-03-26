import { describe, expect, it } from "vitest";
import { getAllExperiments } from "@/shared/lib/experiments/registry";
import { getExperimentHtmlPath } from "@/shared/lib/experiments/html-map";

describe("registry integrity", () => {
  const experiments = getAllExperiments();

  it("no duplicate slugs", () => {
    const slugs = experiments.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("no duplicate ids", () => {
    const ids = experiments.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all non-Wave-1 experiments have html-map entry", () => {
    experiments
      .filter((e) => e.wave !== 1)
      .forEach((e) => {
        expect(
          getExperimentHtmlPath(e.id),
          `Missing html-map entry for: ${e.id} (slug: ${e.slug})`
        ).not.toBeNull();
      });
  });

  it("Wave 9+ experiments enforce id === slug", () => {
    experiments
      .filter((e) => e.wave >= 9)
      .forEach((e) => {
        expect(e.id, `id !== slug for ${e.slug}`).toBe(e.slug);
      });
  });

  it("all slugs are kebab-case", () => {
    const kebabRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    experiments.forEach((e) => {
      expect(
        kebabRe.test(e.slug),
        `slug not kebab-case: ${e.slug}`
      ).toBe(true);
    });
  });

  it("all experiments have required fields", () => {
    experiments.forEach((e) => {
      expect(e.id, `missing id`).toBeTruthy();
      expect(e.slug, `missing slug for ${e.id}`).toBeTruthy();
      expect(e.title, `missing title for ${e.slug}`).toBeTruthy();
      expect(e.wave, `missing wave for ${e.slug}`).toBeGreaterThanOrEqual(1);
      expect(e.wave, `invalid wave for ${e.slug}`).toBeLessThanOrEqual(12);
    });
  });

  it("total experiment count >= 114", () => {
    expect(experiments.length).toBeGreaterThanOrEqual(114);
  });
});
