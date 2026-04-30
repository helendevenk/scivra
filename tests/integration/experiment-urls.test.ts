import { beforeAll, describe, expect, it } from "vitest";

import { getAllExperimentsAsync } from "@/shared/lib/experiments/registry";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

// Preflight: if the dev server isn't reachable (e.g. running `pnpm test` in
// CI without a parallel `pnpm dev`), skip the suite instead of failing on
// `fetch failed`. Local dev keeps the test active automatically.
let serverReachable = false;
beforeAll(async () => {
  try {
    const res = await fetch(BASE_URL, { redirect: "manual" });
    serverReachable = res.status >= 200 && res.status < 500;
  } catch {
    serverReachable = false;
  }
});

describe("Every experiment URL resolves", () => {
  it(
    "returns 200 for /labs/{subject}/{primaryStandard}/{slug} for all experiments",
    async (ctx) => {
      if (!serverReachable) {
        ctx.skip();
        return;
      }
      const experiments = await getAllExperimentsAsync();

      expect(experiments.length).toBeGreaterThan(150);

      const fetchOnce = async (url: string) => {
        const response = await fetch(url, { redirect: "manual" });
        return response.status;
      };

      // First pass: fire all 179 routes in parallel. Cold turbopack
      // dev servers under load can intermittently 500 the first time a
      // route is compiled — so retry any non-200 once after a small
      // backoff to give the dev server a second compile chance.
      const initial = await Promise.all(
        experiments.map(async (experiment) => {
          const url = `${BASE_URL}/labs/${experiment.subject}/${experiment.primaryStandard}/${experiment.slug}`;
          const status = await fetchOnce(url);
          return { url, status };
        })
      );

      const results = await Promise.all(
        initial.map(async (entry) => {
          if (entry.status === 200) return entry;
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const status = await fetchOnce(entry.url);
          return { url: entry.url, status };
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
