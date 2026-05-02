#!/usr/bin/env tsx
/**
 * D4 audit: compare parameters[] in TypeScript experiment definitions
 * against the actual user-facing controls in the corresponding HTML
 * simulation files.
 *
 * See: docs/plans/2026-05-02-d4-ts-html-sync-plan.md §4 Phase A.
 *
 * Run:
 *   pnpm tsx scripts/audit-params-vs-html.ts
 *
 * Output:
 *   _phase3-research/d4-audit/audit.jsonl
 *   _phase3-research/d4-audit/audit-summary.md
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

import { getAllExperiments } from "../src/shared/lib/experiments/registry";
import { getExperimentHtmlPath } from "../src/shared/lib/experiments/html-map";
import { PHASE3_FILLED_SLUGS } from "../tests/unit/content/phase3-manifest";
import type { Experiment, Parameter } from "../src/shared/types/experiment";

// Wave-1 R3F experiments — sourced from the runtime's WAVE1_IDS set in
// src/app/[locale]/(landing)/experiments/[slug]/ExperimentClient.tsx
const R3F_IDS = new Set([
  "newtons-laws",
  "projectile-motion",
  "em-spectrum",
  "roller-coaster",
]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "..");
const PUBLIC_DIR = join(REPO_ROOT, "public");
const OUT_DIR = join(REPO_ROOT, "_phase3-research/d4-audit");

// =============================================================================
// HTML control extraction
// =============================================================================

interface HtmlControl {
  id: string;
  kind: "range" | "number" | "checkbox" | "select" | "preset-button";
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string;
  options?: string[];
  presetTarget?: string; // e.g. param name decoded from onclick="applyPreset('mass', 5)"
  presetValue?: string;
  source: string; // tag + attrs snippet for debugging
}

const EXCLUDED_ID_PATTERNS: RegExp[] = [
  // playback / animation
  /^(play|pause|playBtn|playPause|step|reset|resetBtn)$/i,
  /^(speed|playSpeed|playback)/i,
  /-(speed|playback)$/i,

  // fullscreen / about / help / quiz
  /^(fullscreen|fs-|about|help|info|infoBtn|helpBtn|aboutBtn)/i,
  /^(quiz|q-|question)/i,

  // data overlay / readout displays (read-only)
  /^(d-|data-|display-|readout|readout-|out-|o-|val-|value-)/i,

  // toast/modal/notification
  /^(toast|modal|notif|alert)/i,

  // canvas / scene / generic display
  /^(canvas|scene|wrap|main|root|app|container)$/i,

  // legend / labels (display-only)
  /^(legend|label|caption|title|subtitle|footer|header)/i,

  // chart axes
  /^(chart|axis|x-axis|y-axis|xy)/i,
];

function isExcludedId(id: string): boolean {
  if (!id) return true;
  return EXCLUDED_ID_PATTERNS.some((re) => re.test(id));
}

function extractHtmlControls(htmlPath: string): HtmlControl[] {
  // htmlPath is like "/experiments/middle/ms-newtons-laws.html"
  const fullPath = join(PUBLIC_DIR, htmlPath.replace(/^\//, ""));
  if (!existsSync(fullPath)) {
    throw new Error(`HTML file not found: ${fullPath}`);
  }
  const html = readFileSync(fullPath, "utf-8");
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const controls: HtmlControl[] = [];

  // 1) <input type="range|number|checkbox"> with id
  const inputs = doc.querySelectorAll<HTMLInputElement>(
    'input[type="range"], input[type="number"], input[type="checkbox"]',
  );
  for (const input of Array.from(inputs)) {
    const id = input.getAttribute("id") ?? "";
    if (!id || isExcludedId(id)) continue;
    const type = (input.getAttribute("type") ?? "range").toLowerCase();
    const min = input.getAttribute("min");
    const max = input.getAttribute("max");
    const step = input.getAttribute("step");
    const value = input.getAttribute("value");
    const label = findAssociatedLabel(doc, id);
    controls.push({
      id,
      kind:
        type === "range" ? "range" : type === "checkbox" ? "checkbox" : "number",
      label,
      min: min !== null ? Number(min) : undefined,
      max: max !== null ? Number(max) : undefined,
      step: step !== null ? Number(step) : undefined,
      defaultValue: value ?? undefined,
      source: input.outerHTML.slice(0, 200),
    });
  }

  // 2) <select> with id
  const selects = doc.querySelectorAll<HTMLSelectElement>("select[id]");
  for (const select of Array.from(selects)) {
    const id = select.getAttribute("id") ?? "";
    if (!id || isExcludedId(id)) continue;
    const opts = Array.from(select.querySelectorAll("option")).map(
      (o) => o.getAttribute("value") ?? o.textContent?.trim() ?? "",
    );
    const label = findAssociatedLabel(doc, id);
    controls.push({
      id,
      kind: "select",
      label,
      options: opts,
      source: select.outerHTML.slice(0, 200),
    });
  }

  // 3) <button> with data-preset / onclick="applyPreset(...)" / setMode(...) / setX(...)
  const buttons = doc.querySelectorAll("button, [data-preset]");
  for (const btn of Array.from(buttons)) {
    const id = btn.getAttribute("id") ?? "";
    const dataPreset = btn.getAttribute("data-preset");
    const dataParam = btn.getAttribute("data-param");
    const onclick = btn.getAttribute("onclick");

    // Skip excluded button ids (Reset, Play, etc.)
    if (id && isExcludedId(id)) continue;

    if (dataPreset) {
      controls.push({
        id: `preset:${dataPreset}`,
        kind: "preset-button",
        label: btn.textContent?.trim() ?? undefined,
        presetTarget: dataPreset,
        source: btn.outerHTML.slice(0, 200),
      });
      continue;
    }
    if (dataParam) {
      controls.push({
        id: `preset:${dataParam}`,
        kind: "preset-button",
        label: btn.textContent?.trim() ?? undefined,
        presetTarget: dataParam,
        source: btn.outerHTML.slice(0, 200),
      });
      continue;
    }
    if (onclick) {
      // Match applyPreset('name', value), setMode('name'), setX('name'), etc.
      const presetMatch = onclick.match(
        /(applyPreset|setMode|setPreset|set[A-Z]\w*|select[A-Z]\w*)\(\s*['"`]([^'"`]+)['"`]/,
      );
      if (presetMatch) {
        const fn = presetMatch[1];
        const target = presetMatch[2];
        controls.push({
          id: `preset:${fn}:${target}`,
          kind: "preset-button",
          label: btn.textContent?.trim() ?? undefined,
          presetTarget: `${fn}:${target}`,
          source: btn.outerHTML.slice(0, 200),
        });
      }
    }
  }

  return controls;
}

function findAssociatedLabel(doc: Document, id: string): string | undefined {
  const label = doc.querySelector(`label[for="${id}"]`);
  if (label) return label.textContent?.trim();
  // fall back to aria-label or sibling text
  const el = doc.getElementById(id);
  const aria = el?.getAttribute("aria-label");
  if (aria) return aria;
  return undefined;
}

// =============================================================================
// Diff
// =============================================================================

interface ParamSnapshot {
  id: string;
  alias?: string; // resolved DOM id via htmlControlAliases
  min: number;
  max: number;
  step: number;
  default: number;
}

interface SlugAuditResult {
  slug: string;
  filePath?: string;
  htmlPath?: string;
  classification: "html-backed" | "react-r3f" | "html-missing";
  tsParams: ParamSnapshot[];
  htmlControls: HtmlControl[];
  diff: {
    missingInHtml: string[]; // semantic param ids in .ts not represented in HTML
    missingInTs: string[]; // HTML control ids not represented in .ts
    rangeMismatch: Array<{
      paramId: string;
      domId: string;
      ts: { min: number; max: number; step: number };
      html: { min?: number; max?: number; step?: number };
    }>;
    typeMismatch: Array<{
      paramId: string;
      domId: string;
      tsKind: "range";
      htmlKind: HtmlControl["kind"];
    }>;
  };
  topicMismatch?: {
    tsSubtitle?: string;
    htmlTitle?: string;
    suspect: boolean;
  };
}

function snapshotParam(p: Parameter, aliases: Record<string, string> = {}): ParamSnapshot {
  return {
    id: p.id,
    alias: aliases[p.id],
    min: p.min,
    max: p.max,
    step: p.step,
    default: p.default,
  };
}

function findHtmlMatch(
  param: ParamSnapshot,
  htmlControls: HtmlControl[],
): HtmlControl | undefined {
  // Try alias first, then fall back to direct id match
  const target = param.alias ?? param.id;
  return htmlControls.find((c) => c.id === target);
}

function diffSlug(
  exp: Experiment,
  htmlControls: HtmlControl[],
): SlugAuditResult["diff"] {
  const aliases = exp.htmlControlAliases ?? {};
  const presets = exp.presets ?? [];
  const tsSnapshots = exp.parameters.map((p) => snapshotParam(p, aliases));

  const missingInHtml: string[] = [];
  const rangeMismatch: SlugAuditResult["diff"]["rangeMismatch"] = [];
  const typeMismatch: SlugAuditResult["diff"]["typeMismatch"] = [];
  const matchedDomIds = new Set<string>();

  for (const ts of tsSnapshots) {
    const match = findHtmlMatch(ts, htmlControls);
    if (!match) {
      missingInHtml.push(ts.id);
      continue;
    }
    matchedDomIds.add(match.id);
    if (match.kind !== "range" && match.kind !== "number") {
      typeMismatch.push({
        paramId: ts.id,
        domId: match.id,
        tsKind: "range",
        htmlKind: match.kind,
      });
      continue;
    }
    const tsMin = ts.min;
    const tsMax = ts.max;
    const tsStep = ts.step;
    const htmlMin = match.min;
    const htmlMax = match.max;
    const htmlStep = match.step;
    if (
      htmlMin !== undefined &&
      htmlMax !== undefined &&
      (Math.abs(tsMin - htmlMin) > 1e-9 ||
        Math.abs(tsMax - htmlMax) > 1e-9 ||
        (htmlStep !== undefined && Math.abs(tsStep - htmlStep) > 1e-9))
    ) {
      rangeMismatch.push({
        paramId: ts.id,
        domId: match.id,
        ts: { min: tsMin, max: tsMax, step: tsStep },
        html: { min: htmlMin, max: htmlMax, step: htmlStep },
      });
    }
  }

  // Match presets[].id against HTML preset buttons.
  // HTML preset button id formats produced by extractHtmlControls:
  //   - "preset:<value>"           (data-preset / data-param)
  //   - "preset:<fn>:<value>"      (onclick="applyPreset('<value>')" etc.)
  // Match if either format ends with ":<presetId>".
  const matchedPresetTargets = new Set<string>();
  for (const preset of presets) {
    const target = preset.id;
    const hit = htmlControls.find((c) => {
      if (c.kind !== "preset-button") return false;
      // c.id is "preset:<...>"; presetTarget is the last segment
      if (c.presetTarget?.endsWith(`:${target}`)) return true;
      if (c.presetTarget === target) return true;
      return false;
    });
    if (hit) {
      matchedDomIds.add(hit.id);
      matchedPresetTargets.add(target);
    } else {
      missingInHtml.push(`preset:${target}`);
    }
  }

  // HTML controls not matched by any .ts param or preset (after considering aliases)
  const aliasedDomIds = new Set(Object.values(aliases));
  const tsDirectIds = new Set(exp.parameters.map((p) => p.id));
  const missingInTs: string[] = [];
  for (const c of htmlControls) {
    if (matchedDomIds.has(c.id)) continue;
    // not matched directly or via alias
    if (aliasedDomIds.has(c.id)) continue;
    if (tsDirectIds.has(c.id)) continue;
    missingInTs.push(c.id);
  }

  return { missingInHtml, missingInTs, rangeMismatch, typeMismatch };
}

function detectTopicMismatch(exp: Experiment, htmlPath: string): SlugAuditResult["topicMismatch"] {
  const fullPath = join(PUBLIC_DIR, htmlPath.replace(/^\//, ""));
  if (!existsSync(fullPath)) return undefined;
  const html = readFileSync(fullPath, "utf-8");
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const htmlTitle = (titleMatch?.[1] ?? h1Match?.[1] ?? "")
    .replace(/<[^>]+>/g, "")
    .trim();
  const tsSubtitle = exp.subtitle ?? "";
  if (!htmlTitle || !tsSubtitle) {
    return { tsSubtitle, htmlTitle, suspect: false };
  }
  // Cheap heuristic: at least one shared content word (>=4 chars, not stopword)
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
  const tsWords = words(tsSubtitle);
  const htmlWords = words(htmlTitle);
  const overlap = [...tsWords].filter((w) => htmlWords.has(w));
  return {
    tsSubtitle,
    htmlTitle,
    suspect: overlap.length === 0,
  };
}

// =============================================================================
// Main
// =============================================================================

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
    if (R3F_IDS.has(exp.id)) {
      results.push({
        slug,
        classification: "react-r3f",
        tsParams: exp.parameters.map((p) =>
          snapshotParam(p, exp.htmlControlAliases ?? {}),
        ),
        htmlControls: [],
        diff: {
          missingInHtml: [],
          missingInTs: [],
          rangeMismatch: [],
          typeMismatch: [],
        },
      });
      continue;
    }
    const htmlPath = getExperimentHtmlPath(slug);
    if (!htmlPath) {
      results.push({
        slug,
        classification: "html-missing",
        tsParams: exp.parameters.map((p) =>
          snapshotParam(p, exp.htmlControlAliases ?? {}),
        ),
        htmlControls: [],
        diff: {
          missingInHtml: [],
          missingInTs: [],
          rangeMismatch: [],
          typeMismatch: [],
        },
      });
      continue;
    }
    try {
      const htmlControls = extractHtmlControls(htmlPath);
      const diff = diffSlug(exp, htmlControls);
      const topic = detectTopicMismatch(exp, htmlPath);
      results.push({
        slug,
        filePath: htmlPath,
        htmlPath: htmlPath,
        classification: "html-backed",
        tsParams: exp.parameters.map((p) =>
          snapshotParam(p, exp.htmlControlAliases ?? {}),
        ),
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
          htmlPath: htmlPath,
          classification: "html-missing",
          tsParams: exp.parameters.map((p) =>
            snapshotParam(p, exp.htmlControlAliases ?? {}),
          ),
          htmlControls: [],
          diff: {
            missingInHtml: [],
            missingInTs: [],
            rangeMismatch: [],
            typeMismatch: [],
          },
        });
      } else {
        errors.push({ slug, error: msg });
      }
    }
  }

  // Write JSONL
  const jsonlPath = join(OUT_DIR, "audit.jsonl");
  writeFileSync(
    jsonlPath,
    results.map((r) => JSON.stringify(r)).join("\n") + "\n",
  );

  // Summary
  const stats = {
    total: results.length,
    htmlBacked: results.filter((r) => r.classification === "html-backed").length,
    reactR3f: results.filter((r) => r.classification === "react-r3f").length,
    htmlMissing: results.filter((r) => r.classification === "html-missing")
      .length,
    clean: results.filter(
      (r) =>
        r.classification === "html-backed" &&
        r.diff.missingInHtml.length === 0 &&
        r.diff.missingInTs.length === 0 &&
        r.diff.rangeMismatch.length === 0 &&
        r.diff.typeMismatch.length === 0,
    ).length,
    withMissingInHtml: results.filter(
      (r) => r.diff.missingInHtml.length > 0,
    ).length,
    withMissingInTs: results.filter((r) => r.diff.missingInTs.length > 0)
      .length,
    withRangeMismatch: results.filter(
      (r) => r.diff.rangeMismatch.length > 0,
    ).length,
    withTopicMismatch: results.filter(
      (r) => r.topicMismatch?.suspect === true,
    ).length,
    errors: errors.length,
  };

  // Markdown summary
  const lines: string[] = [];
  lines.push("# D4 audit — params vs HTML controls\n");
  lines.push(`Generated: ${new Date().toISOString()}\n`);
  lines.push("## Counts\n");
  for (const [k, v] of Object.entries(stats)) {
    lines.push(`- **${k}**: ${v}`);
  }
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
    for (const e of errors) {
      lines.push(`- ${e.slug}: ${e.error}`);
    }
  }

  const summaryPath = join(OUT_DIR, "audit-summary.md");
  writeFileSync(summaryPath, lines.join("\n"));

  console.log(JSON.stringify(stats, null, 2));
  console.log(`\nJSONL: ${jsonlPath}`);
  console.log(`Summary: ${summaryPath}`);
}

main();
