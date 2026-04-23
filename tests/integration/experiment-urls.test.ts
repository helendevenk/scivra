import { describe, expect, it } from "vitest";

import { getAllExperimentsAsync } from "@/shared/lib/experiments/registry";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

describe("Every experiment URL resolves", () => {
  it(
    "returns 200 for /labs/{subject}/{primaryStandard}/{slug} for all experiments",
    async () => {
      const experiments = await getAllExperimentsAsync();

      expect(experiments.length).toBeGreaterThan(150);

      const results = await Promise.all(
        experiments.map(async (experiment) => {
          const url = `${BASE_URL}/labs/${experiment.subject}/${experiment.primaryStandard}/${experiment.slug}`;
          const response = await fetch(url, { redirect: "manual" });

          return { url, status: response.status };
        })
      );

      const broken = results.filter((result) => result.status !== 200);

      if (broken.length > 0) {
        console.error(
          "Broken experiment URLs:\n" +
            broken.map((entry) => `  ${entry.status}  ${entry.url}`).join("\n")
        );
      }

      expect(broken).toHaveLength(0);
    },
    120_000
  );
});
