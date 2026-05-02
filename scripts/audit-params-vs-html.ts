#!/usr/bin/env tsx
/**
 * D4 audit CLI: produce JSONL + markdown summary of parameters[]
 * vs HTML simulation control mismatches.
 *
 * Logic lives in src/shared/lib/d4/control-audit.ts (shared with
 * tests/unit/content/params-vs-html.test.ts).
 *
 * Run: pnpm tsx scripts/audit-params-vs-html.ts
 *
 * Output:
 *   _phase3-research/d4-audit/audit.jsonl
 *   _phase3-research/d4-audit/audit-summary.md
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { getAllExperiments } from "../src/shared/lib/experiments/registry";
import { getExperimentHtmlPath } from "../src/shared/lib/experiments/html-map";
import { PHASE3_FILLED_SLUGS } from "../tests/unit/content/phase3-manifest";
import {
  diffControls,
  extractHtmlControls,
  snapshotParam,
  type ControlDiff,
  type HtmlControl,
  type ParamSnapshot,
} from "../src/shared/lib/d4/control-audit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "..");
const PUBLIC_DIR = join(REPO_ROOT, "public");
const OUT_DIR = join(REPO_ROOT, "_phase3-research/d4-audit");

const R3F_IDS = new Set([
  "newtons-laws",
  "projectile-motion",
  "em-spectrum",
  "roller-coaster",
]);

interface SlugAuditResult {
  slug: string;
  filePath?: string;
  htmlPath?: string;
  classification: "html-backed" | "react-r3f" | "html-missing";
  tsParams: ParamSnapshot[];
  htmlControls: HtmlControl[];
  diff: ControlDiff;
  topicMismatch?: { tsSubtitle?: string; htmlTitle?: string; suspect: boolean };
}

function detectTopicMismatch(
  exp: { subtitle?: string },
  htmlPath: string,
): SlugAuditResult["topicMismatch"] {
  const fullPath = join(PUBLIC_DIR, htmlPath.replace(/^\//, ""));
  if (!existsSync(fullPath)) return undefined;
  const html = readFileSync(fullPath, "utf-8");
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const htmlTitle = (titleMatch?.[1] ?? h1Match?.[1] ?? "")
    .replace(/<[^>]+>/g, "")
    .trim();
  const tsSubtitle = exp.subtitle ?? "";
  if (!htmlTitle || !tsSubtitle) return { tsSubtitle, htmlTitle, suspect: false };
  const stopwords = new Set([
    "with",
    "from",
    "into",
    "that",
    "this",
    "what",
    "when",
    "where",
    "which",
    "their",
    "have",
    "been",
    "your",
    "more",
    "than",
  ]);
  const words = (s: string): Set<string> =>
    new Set(
      s
        .toLowerCase()
        .replace(/[^a-z\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 4 && !stopwords.has(w)),
    );
  const overlap = [...words(tsSubtitle)].filter((w) => words(htmlTitle).has(w));
  return { tsSubtitle, htmlTitle, suspect: overlap.length === 0 };
}

function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const allExperiments = getAllExperiments();
  const bySlug = new Map(allExperiments.map((e) => [e.slug, e]));

  const results: SlugAuditResult[] = [];
  const errors: Array<{ slug: string; error: string }> = [];

  for (const slug of PHASE3_FILLED_SLUGS) {
    const exp = bySlug.get(slug);
    if (!exp) {
      errors.push({ slug, error: "slug not found in registry" });
      continue;
    }
    const tsParams = exp.parameters.map((p) =>
      snapshotParam(p, exp.htmlControlAliases ?? {}),
    );
    if (R3F_IDS.has(exp.id)) {
      results.push({
        slug,
        classification: "react-r3f",
        tsParams,
        htmlControls: [],
        diff: { missingInHtml: [], missingInTs: [], rangeMismatch: [], typeMismatch: [] },
      });
      continue;
    }
    const htmlPath = getExperimentHtmlPath(slug);
    if (!htmlPath) {
      results.push({
        slug,
        classification: "html-missing",
        tsParams,
        htmlControls: [],
        diff: { missingInHtml: [], missingInTs: [], rangeMismatch: [], typeMismatch: [] },
      });
      continue;
    }
    try {
      const htmlControls = extractHtmlControls(htmlPath, PUBLIC_DIR);
      const diff = diffControls(exp, htmlControls);
      const topic = detectTopicMismatch(exp, htmlPath);
      results.push({
        slug,
        filePath: htmlPath,
        htmlPath,
        classification: "html-backed",
        tsParams,
        htmlControls,
        diff,
        topicMismatch: topic,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("not found")) {
        results.push({
          slug,
          filePath: htmlPath,
          htmlPath,
          classification: "html-missing",
          tsParams,
          htmlControls: [],
          diff: { missingInHtml: [], missingInTs: [], rangeMismatch: [], typeMismatch: [] },
        });
      } else {
        errors.push({ slug, error: msg });
      }
    }
  }

  writeFileSync(
    join(OUT_DIR, "audit.jsonl"),
    results.map((r) => JSON.stringify(r)).join("\n") + "\n",
  );

  const stats = {
    total: results.length,
    htmlBacked: results.filter((r) => r.classification === "html-backed").length,
    reactR3f: results.filter((r) => r.classification === "react-r3f").length,
    htmlMissing: results.filter((r) => r.classification === "html-missing").length,
    clean: results.filter(
      (r) =>
        r.classification === "html-backed" &&
        r.diff.missingInHtml.length === 0 &&
        r.diff.missingInTs.length === 0 &&
        r.diff.rangeMismatch.length === 0 &&
        r.diff.typeMismatch.length === 0,
    ).length,
    withMissingInHtml: results.filter((r) => r.diff.missingInHtml.length > 0).length,
    withMissingInTs: results.filter((r) => r.diff.missingInTs.length > 0).length,
    withRangeMismatch: results.filter((r) => r.diff.rangeMismatch.length > 0).length,
    withTopicMismatch: results.filter((r) => r.topicMismatch?.suspect === true).length,
    errors: errors.length,
  };

  const lines: string[] = [];
  lines.push("# D4 audit — params vs HTML controls\n");
  lines.push(`Generated: ${new Date().toISOString()}\n`);
  lines.push("## Counts\n");
  for (const [k, v] of Object.entries(stats)) lines.push(`- **${k}**: ${v}`);
  lines.push("");
  lines.push("## Slugs with non-empty diff\n");
  lines.push(
    "| slug | classification | missingInHtml | missingInTs | rangeMismatch | typeMismatch | topicSuspect |",
  );
  lines.push("|---|---|---|---|---|---|---|");
  for (const r of results) {
    const tot =
      r.diff.missingInHtml.length +
      r.diff.missingInTs.length +
      r.diff.rangeMismatch.length +
      r.diff.typeMismatch.length;
    if (tot === 0 && !r.topicMismatch?.suspect) continue;
    lines.push(
      `| ${r.slug} | ${r.classification} | ${r.diff.missingInHtml.join(",") || "-"} | ${r.diff.missingInTs.join(",") || "-"} | ${r.diff.rangeMismatch.map((m) => m.paramId).join(",") || "-"} | ${r.diff.typeMismatch.map((m) => m.paramId).join(",") || "-"} | ${r.topicMismatch?.suspect ? "YES" : "-"} |`,
    );
  }
  if (errors.length) {
    lines.push("\n## Errors\n");
    for (const e of errors) lines.push(`- ${e.slug}: ${e.error}`);
  }
  writeFileSync(join(OUT_DIR, "audit-summary.md"), lines.join("\n"));

  console.log(JSON.stringify(stats, null, 2));
  console.log(`\nJSONL: ${join(OUT_DIR, "audit.jsonl")}`);
  console.log(`Summary: ${join(OUT_DIR, "audit-summary.md")}`);
}

main();
