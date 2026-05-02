/**
 * D4 regression test: parameters[] in TS Experiment definitions must
 * cover the actual user-facing controls in HTML simulation files.
 *
 * - For each slug in `phase3-manifest.ts`:
 *   - R3F-exempt slugs are skipped (no HTML to audit).
 *   - Slugs with no `EXPERIMENT_HTML_MAP` entry are skipped (separate
 *     "D5" tech debt — tracked elsewhere).
 *   - Otherwise, the diff between `parameters[]` (with
 *     `htmlControlAliases` applied) + `presets[]` and the HTML controls
 *     must be empty, OR exactly match a `KNOWN_DRIFT` entry.
 *
 * - New drift not in `KNOWN_DRIFT` fails the build.
 * - Drift entries past their `expires` date fail the build.
 *
 * To regenerate the snapshot after Phase C fixes:
 *   pnpm tsx scripts/d4-generate-known-drift.ts
 *
 * See: docs/plans/2026-05-02-d4-ts-html-sync-plan.md §4 Phase B.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";

import { getAllExperiments } from "@/shared/lib/experiments/registry";
import { getExperimentHtmlPath } from "@/shared/lib/experiments/html-map";
import {
  diffControls,
  extractHtmlControls,
  isCleanDiff,
  type ControlDiff,
} from "@/shared/lib/d4/control-audit";

import { PHASE3_FILLED_SLUGS } from "./phase3-manifest";
import knownDriftJson from "./d4-known-drift.json" with { type: "json" };

interface KnownDriftEntry {
  diff: ControlDiff;
  owner: string;
  tier: string;
  expires: string;
  reason: string;
}

const KNOWN_DRIFT = knownDriftJson as Record<string, KnownDriftEntry>;

const R3F_IDS = new Set([
  "newtons-laws",
  "projectile-motion",
  "em-spectrum",
  "roller-coaster",
]);

// Resolve the public directory relative to the repo root, regardless of
// where vitest is invoked from.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = resolve(__dirname, "../../../public");

const allExperiments = getAllExperiments();
const bySlug = new Map(allExperiments.map((e) => [e.slug, e]));

interface AuditedSlug {
  slug: string;
  category: "html-backed" | "react-r3f" | "html-missing";
  diff: ControlDiff | null;
}

const audited: AuditedSlug[] = [...PHASE3_FILLED_SLUGS]
  .sort()
  .map((slug) => {
    const exp = bySlug.get(slug);
    if (!exp) {
      return { slug, category: "html-missing" as const, diff: null };
    }
    if (R3F_IDS.has(exp.id)) {
      return { slug, category: "react-r3f" as const, diff: null };
    }
    const htmlPath = getExperimentHtmlPath(slug);
    if (!htmlPath) {
      return { slug, category: "html-missing" as const, diff: null };
    }
    const fullPath = join(PUBLIC_DIR, htmlPath.replace(/^\//, ""));
    if (!existsSync(fullPath)) {
      return { slug, category: "html-missing" as const, diff: null };
    }
    const htmlControls = extractHtmlControls(htmlPath, PUBLIC_DIR);
    return {
      slug,
      category: "html-backed" as const,
      diff: diffControls(exp, htmlControls),
    };
  });

const today = new Date().toISOString().slice(0, 10);

describe("D4 params-vs-html regression", () => {
  it("KNOWN_DRIFT keys are all in the Phase 3 manifest", () => {
    const orphans = Object.keys(KNOWN_DRIFT).filter(
      (slug) => !PHASE3_FILLED_SLUGS.has(slug),
    );
    expect(
      orphans,
      `Stale KNOWN_DRIFT entries: ${orphans.join(", ")}`,
    ).toEqual([]);
  });

  it("no KNOWN_DRIFT entry has expired", () => {
    const overdue: string[] = [];
    for (const [slug, entry] of Object.entries(KNOWN_DRIFT)) {
      if (entry.expires < today) {
        overdue.push(`${slug} (expired ${entry.expires}, owner=${entry.owner})`);
      }
    }
    expect(overdue, `Overdue drift entries:\n  ${overdue.join("\n  ")}`).toEqual(
      [],
    );
  });

  it("every KNOWN_DRIFT entry has owner/tier/expires/reason", () => {
    const malformed: string[] = [];
    for (const [slug, entry] of Object.entries(KNOWN_DRIFT)) {
      if (!entry.owner || !entry.tier || !entry.expires || !entry.reason) {
        malformed.push(slug);
      }
    }
    expect(
      malformed,
      `Malformed drift entries: ${malformed.join(", ")}`,
    ).toEqual([]);
  });

  describe("per-slug coverage", () => {
    for (const a of audited) {
      if (a.category === "react-r3f") {
        it.skip(`${a.slug} (R3F-exempt)`, () => {});
        continue;
      }
      if (a.category === "html-missing") {
        it.skip(`${a.slug} (html-missing — D5 separate tech debt)`, () => {});
        continue;
      }
      const diff = a.diff!;
      it(`${a.slug} matches HTML controls or KNOWN_DRIFT`, () => {
        if (isCleanDiff(diff)) {
          // Clean — passes regardless of KNOWN_DRIFT presence (entry will be
          // pruned in the next snapshot regeneration).
          return;
        }
        const known = KNOWN_DRIFT[a.slug];
        expect(
          known,
          `New drift detected for ${a.slug}. Diff:\n${JSON.stringify(diff, null, 2)}\n\nIf intentional, run \`pnpm tsx scripts/d4-generate-known-drift.ts\` and commit the snapshot update with owner/tier/expires/reason.`,
        ).toBeDefined();
        expect(diff, `Drift for ${a.slug} differs from snapshot`).toEqual(
          known.diff,
        );
      });
    }
  });
});
