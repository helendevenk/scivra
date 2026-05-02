#!/usr/bin/env tsx
/**
 * Generate the KNOWN_DRIFT snapshot file used by
 * tests/unit/content/params-vs-html.test.ts.
 *
 * Run: pnpm tsx scripts/d4-generate-known-drift.ts
 *
 * Output: tests/unit/content/d4-known-drift.json
 *
 * After fixing slugs in Phase C, re-run this script to shrink the
 * snapshot. Each remaining entry must have an owner + tier + expires
 * to prevent allowlist rot.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { getAllExperiments } from "../src/shared/lib/experiments/registry";
import { getExperimentHtmlPath } from "../src/shared/lib/experiments/html-map";
import { PHASE3_FILLED_SLUGS } from "../tests/unit/content/phase3-manifest";
import {
  diffControls,
  extractHtmlControls,
  isCleanDiff,
  type ControlDiff,
} from "../src/shared/lib/d4/control-audit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "..");
const PUBLIC_DIR = join(REPO_ROOT, "public");
const OUT_PATH = join(REPO_ROOT, "tests/unit/content/d4-known-drift.json");

const R3F_IDS = new Set([
  "newtons-laws",
  "projectile-motion",
  "em-spectrum",
  "roller-coaster",
]);

interface KnownDriftEntry {
  diff: ControlDiff;
  owner: string;
  tier: "C1" | "C2" | "C3" | "C4" | "C5" | "D" | "D5";
  expires: string;
  reason: string;
}

function inferTier(diff: ControlDiff): KnownDriftEntry["tier"] {
  const dInHtml = diff.missingInHtml.length;
  const dInTs = diff.missingInTs.length;
  const rng = diff.rangeMismatch.length;
  if (dInHtml === 0 && dInTs === 0 && rng === 0) return "C1";
  if (dInHtml >= 2 && dInTs >= 2) return "C5";
  if (dInHtml > 0 && dInHtml <= 2 && dInTs <= 1 && rng === 0) return "C2";
  if (dInHtml > 0 && dInTs === 0) return "C3";
  if (dInHtml === 0 && dInTs > 0) return "C4";
  if (rng > 0 && dInHtml + dInTs <= 1) return "C1";
  return "C5";
}

function inferReason(diff: ControlDiff): string {
  const parts: string[] = [];
  if (diff.missingInHtml.length)
    parts.push(`${diff.missingInHtml.length} ts param(s) not in HTML`);
  if (diff.missingInTs.length)
    parts.push(`${diff.missingInTs.length} HTML control(s) not in ts`);
  if (diff.rangeMismatch.length)
    parts.push(`${diff.rangeMismatch.length} range mismatch(es)`);
  if (diff.typeMismatch.length)
    parts.push(`${diff.typeMismatch.length} type mismatch(es)`);
  return parts.join("; ") || "no diff";
}

function main() {
  const expiresDate = "2026-08-31"; // ~3 months out — re-evaluate after Phase C
  const owner = "claude";

  const allExperiments = getAllExperiments();
  const bySlug = new Map(allExperiments.map((e) => [e.slug, e]));

  const drift: Record<string, KnownDriftEntry> = {};

  for (const slug of PHASE3_FILLED_SLUGS) {
    const exp = bySlug.get(slug);
    if (!exp) continue;
    if (R3F_IDS.has(exp.id)) continue;
    const htmlPath = getExperimentHtmlPath(slug);
    if (!htmlPath) continue;
    let htmlControls;
    try {
      htmlControls = extractHtmlControls(htmlPath, PUBLIC_DIR);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("not found")) continue;
      throw err;
    }
    const diff = diffControls(exp, htmlControls);
    if (isCleanDiff(diff)) continue;
    drift[slug] = {
      diff,
      owner,
      tier: inferTier(diff),
      expires: expiresDate,
      reason: inferReason(diff),
    };
  }

  const sorted: Record<string, KnownDriftEntry> = {};
  for (const k of Object.keys(drift).sort()) sorted[k] = drift[k];

  writeFileSync(OUT_PATH, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(sorted).length} drift entries to ${OUT_PATH}`);

  const tierCounts = new Map<string, number>();
  for (const e of Object.values(sorted))
    tierCounts.set(e.tier, (tierCounts.get(e.tier) ?? 0) + 1);
  console.log("Tier distribution:");
  for (const [t, c] of [...tierCounts.entries()].sort()) {
    console.log(`  ${t}: ${c}`);
  }
}

main();
