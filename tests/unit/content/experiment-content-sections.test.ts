import { describe, it, expect } from "vitest";
import { getAllExperiments } from "@/shared/lib/experiments/registry";
import { PHASE3_FILLED_SLUGS } from "./phase3-manifest";

const experiments = getAllExperiments();

const wordCount = (s: string) =>
  s.trim().split(/\s+/).filter(Boolean).length;

const FORBIDDEN_FAQ_PATTERNS: { name: string; re: RegExp }[] = [
  { name: "</script>", re: /<\/script/i },
  { name: "<!--", re: /<!--/ },
  { name: "]]>", re: /\]\]>/ },
  { name: "U+2028", re: /\u2028/ },
  { name: "U+2029", re: /\u2029/ },
];

describe("Phase 3 contentSections quality gate", () => {
  const filledExperiments = experiments.filter((e) =>
    PHASE3_FILLED_SLUGS.has(e.slug),
  );

  it("manifest matches actual filled experiments (forward)", () => {
    expect(filledExperiments.length).toBe(PHASE3_FILLED_SLUGS.size);
  });

  it("every experiment with contentSections is in manifest (inverse)", () => {
    const orphans = experiments
      .filter((e) => e.contentSections)
      .map((e) => e.slug)
      .filter((slug) => !PHASE3_FILLED_SLUGS.has(slug));
    expect(
      orphans,
      `Filled-but-unregistered slugs: ${orphans.join(", ") || "(none)"}`,
    ).toEqual([]);
  });

  describe.each(filledExperiments)("$slug", (exp) => {
    const cs = exp.contentSections;

    it("has contentSections defined", () => {
      expect(cs).toBeDefined();
    });

    it("whatIsIt has at least 100 words", () => {
      expect(cs?.whatIsIt).toBeTruthy();
      const wc = wordCount(cs!.whatIsIt!);
      expect(
        wc,
        `${exp.slug}.whatIsIt has ${wc} words (need >=100)`,
      ).toBeGreaterThanOrEqual(100);
    });

    it("parameterExplanations covers every parameter id", () => {
      const paramIds = exp.parameters.map((p) => p.id);
      const keys = Object.keys(cs?.parameterExplanations ?? {});
      const missing = paramIds.filter((id) => !keys.includes(id));
      const orphaned = keys.filter((k) => !paramIds.includes(k));
      expect(
        missing,
        `${exp.slug} missing parameterExplanations for: ${missing.join(", ") || "(none)"}`,
      ).toEqual([]);
      expect(
        orphaned,
        `${exp.slug} parameterExplanations has unmatched keys: ${orphaned.join(", ") || "(none)"}`,
      ).toEqual([]);
    });

    it("misconceptions has 3-5 non-empty entries", () => {
      expect(cs?.misconceptions).toBeDefined();
      const len = cs!.misconceptions!.length;
      expect(
        len,
        `${exp.slug} misconceptions count is ${len}`,
      ).toBeGreaterThanOrEqual(3);
      expect(
        len,
        `${exp.slug} misconceptions count is ${len}`,
      ).toBeLessThanOrEqual(5);
      for (const [i, m] of cs!.misconceptions!.entries()) {
        expect(
          m.wrong.trim().length,
          `${exp.slug} misconceptions[${i}].wrong empty`,
        ).toBeGreaterThan(0);
        expect(
          m.correct.trim().length,
          `${exp.slug} misconceptions[${i}].correct empty`,
        ).toBeGreaterThan(0);
      }
    });

    it("teacherUseCases has 3-5 entries each >=30 chars", () => {
      expect(cs?.teacherUseCases).toBeDefined();
      const len = cs!.teacherUseCases!.length;
      expect(len).toBeGreaterThanOrEqual(3);
      expect(len).toBeLessThanOrEqual(5);
      for (const [i, u] of cs!.teacherUseCases!.entries()) {
        expect(
          u.trim().length,
          `${exp.slug} teacherUseCases[${i}] has ${u.length} chars (need >=30)`,
        ).toBeGreaterThanOrEqual(30);
      }
    });

    it("faq has 4-6 Q/A pairs; questions end in ?, answers >=100 chars", () => {
      expect(cs?.faq).toBeDefined();
      const len = cs!.faq!.length;
      expect(len).toBeGreaterThanOrEqual(4);
      expect(len).toBeLessThanOrEqual(6);
      for (const [i, f] of cs!.faq!.entries()) {
        expect(
          f.question.trim().endsWith("?"),
          `${exp.slug} faq[${i}] question must end in ?`,
        ).toBe(true);
        expect(
          f.answer.trim().length,
          `${exp.slug} faq[${i}] answer has ${f.answer.length} chars (need >=100)`,
        ).toBeGreaterThanOrEqual(100);
      }
    });

    it("FAQ strings free of script-injection / JSON-LD breakers", () => {
      for (const [i, f] of (cs?.faq ?? []).entries()) {
        for (const { name, re } of FORBIDDEN_FAQ_PATTERNS) {
          expect(
            re.test(f.question),
            `${exp.slug} faq[${i}].question contains ${name}`,
          ).toBe(false);
          expect(
            re.test(f.answer),
            `${exp.slug} faq[${i}].answer contains ${name}`,
          ).toBe(false);
        }
      }
    });

    it("total word count >= 800 across all five sections", () => {
      const total =
        wordCount(cs?.whatIsIt ?? "") +
        Object.values(cs?.parameterExplanations ?? {}).reduce(
          (sum, t) => sum + wordCount(t),
          0,
        ) +
        (cs?.misconceptions ?? []).reduce(
          (sum, m) => sum + wordCount(m.wrong) + wordCount(m.correct),
          0,
        ) +
        (cs?.teacherUseCases ?? []).reduce(
          (sum, u) => sum + wordCount(u),
          0,
        ) +
        (cs?.faq ?? []).reduce(
          (sum, f) => sum + wordCount(f.question) + wordCount(f.answer),
          0,
        );
      expect(
        total,
        `${exp.slug} total contentSections word count is ${total} (need >=800)`,
      ).toBeGreaterThanOrEqual(800);
    });
  });
});
