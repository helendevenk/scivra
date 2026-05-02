#!/usr/bin/env tsx
/**
 * D4 triage classifier: reads _phase3-research/d4-audit/audit.jsonl
 * and emits a per-slug severity classification + recommended fix
 * direction, per the heuristic in
 * docs/plans/2026-05-02-d4-ts-html-sync-plan.md §4 Phase A step 2.
 *
 * Run after `pnpm tsx scripts/audit-params-vs-html.ts`:
 *   pnpm tsx scripts/d4-classify-triage.ts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "..");
const IN_PATH = join(REPO_ROOT, "_phase3-research/d4-audit/audit.jsonl");
const OUT_DIR = join(REPO_ROOT, "docs/reports");
const OUT_PATH = join(OUT_DIR, "2026-05-02-d4-triage.md");

interface AuditRecord {
  slug: string;
  htmlPath?: string;
  classification: "html-backed" | "react-r3f" | "html-missing";
  tsParams: Array<{ id: string; min: number; max: number; step: number; default: number }>;
  htmlControls: Array<{
    id: string;
    kind: string;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
  }>;
  diff: {
    missingInHtml: string[];
    missingInTs: string[];
    rangeMismatch: Array<{
      paramId: string;
      domId: string;
      ts: { min: number; max: number; step: number };
      html: { min?: number; max?: number; step?: number };
    }>;
    typeMismatch: Array<{
      paramId: string;
      domId: string;
      tsKind: string;
      htmlKind: string;
    }>;
  };
  topicMismatch?: { tsSubtitle?: string; htmlTitle?: string; suspect: boolean };
}

type Severity = "OK" | "trivial" | "easy" | "drop" | "add" | "mixed" | "hard" | "exempt" | "html-missing";

function classifySeverity(r: AuditRecord): Severity {
  if (r.classification === "react-r3f") return "exempt";
  if (r.classification === "html-missing") return "html-missing";
  const dInHtml = r.diff.missingInHtml.length;
  const dInTs = r.diff.missingInTs.length;
  const rng = r.diff.rangeMismatch.length;
  const tp = r.diff.typeMismatch.length;
  // Empty diff = OK regardless of topicMismatch heuristic. The topic
  // heuristic is an inflated signal; once params + presets are aligned
  // and ranges match HTML, the slug is in good shape.
  if (dInHtml === 0 && dInTs === 0 && rng === 0 && tp === 0) return "OK";
  // Topic mismatch with non-empty diff = likely a true hard case.
  if (r.topicMismatch?.suspect) return "hard";
  // most TS params not in HTML AND many HTML controls not in TS → mixed (likely heavy redesign)
  if (dInHtml >= 2 && dInTs >= 2) return "mixed";
  // alias only: TS params ≤ 2 not matched, HTML controls ≤ 1 unmatched, no range diff
  if (dInHtml > 0 && dInHtml <= 2 && dInTs <= 1 && rng === 0 && tp === 0) return "easy";
  // pure adds: HTML has controls .ts doesn't list
  if (dInHtml === 0 && dInTs > 0) return "add";
  // pure drops: .ts has params HTML doesn't have, several
  if (dInHtml > 0 && dInTs === 0) return "drop";
  // range mismatch dominant
  if (rng > 0 && dInHtml + dInTs <= 1) return "trivial";
  // fallback
  return "mixed";
}

function fixDirection(sev: Severity): string {
  switch (sev) {
    case "OK":
      return "no action";
    case "trivial":
      return "Edit .ts ranges to match HTML";
    case "easy":
      return "Add htmlControlAliases (no rename)";
    case "drop":
      return "Remove unused .ts params + scrub references";
    case "add":
      return "Add HTML-only controls to .ts";
    case "mixed":
      return "Combination of drop + add (case-by-case)";
    case "hard":
      return "Topic-level mismatch — Phase D (PM decision)";
    case "exempt":
      return "R3F-exempt (no HTML to audit)";
    case "html-missing":
      return "No HTML map entry (separate tech debt; not D4 scope)";
  }
}

function severityToTier(sev: Severity): string {
  switch (sev) {
    case "OK":
      return "—";
    case "trivial":
      return "C1";
    case "easy":
      return "C2";
    case "drop":
      return "C3";
    case "add":
      return "C4";
    case "mixed":
      return "C5";
    case "hard":
      return "D";
    case "exempt":
      return "R3F";
    case "html-missing":
      return "HTML-MAP";
  }
}

function severityIcon(sev: Severity): string {
  switch (sev) {
    case "OK":
      return "✅";
    case "trivial":
    case "easy":
      return "🟢";
    case "drop":
    case "add":
    case "mixed":
      return "🟡";
    case "hard":
      return "🔴";
    case "exempt":
      return "⚪";
    case "html-missing":
      return "⚫";
  }
}

function main() {
  if (!existsSync(IN_PATH)) {
    throw new Error(`Audit JSONL not found: ${IN_PATH}. Run scripts/audit-params-vs-html.ts first.`);
  }
  const lines = readFileSync(IN_PATH, "utf-8").split("\n").filter((l) => l.trim());
  const records: AuditRecord[] = lines.map((l) => JSON.parse(l));

  const classified = records.map((r) => ({
    record: r,
    severity: classifySeverity(r),
  }));

  // Counts
  const counts = new Map<Severity, number>();
  for (const c of classified) {
    counts.set(c.severity, (counts.get(c.severity) ?? 0) + 1);
  }

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const out: string[] = [];
  out.push("---");
  out.push("name: d4-triage-report");
  out.push("status: complete");
  out.push("created: 2026-05-02T06:50:00Z");
  out.push("updated: 2026-05-02T06:50:00Z");
  out.push("---");
  out.push("");
  out.push("# D4 Triage Report");
  out.push("");
  out.push(
    "Generated by `scripts/audit-params-vs-html.ts` + `scripts/d4-classify-triage.ts` against the 179 slugs in `tests/unit/content/phase3-manifest.ts`.",
  );
  out.push("");
  out.push("## Counts by severity");
  out.push("");
  out.push("| Severity | Tier | Count | Fix direction |");
  out.push("|---|---|---:|---|");
  const order: Severity[] = ["OK", "trivial", "easy", "drop", "add", "mixed", "hard", "exempt", "html-missing"];
  for (const s of order) {
    const c = counts.get(s) ?? 0;
    out.push(`| ${severityIcon(s)} ${s} | ${severityToTier(s)} | ${c} | ${fixDirection(s)} |`);
  }
  out.push("");
  out.push(`Total: ${classified.length}`);
  out.push("");

  // Per-tier sections
  for (const sev of order) {
    const items = classified.filter((c) => c.severity === sev);
    if (items.length === 0) continue;
    out.push(`## ${severityIcon(sev)} ${sev} (${severityToTier(sev)}) — ${items.length} slugs`);
    out.push("");
    if (sev === "OK" || sev === "exempt" || sev === "html-missing") {
      // bullet list of slugs
      for (const it of items) {
        out.push(`- ${it.record.slug}`);
      }
      out.push("");
      continue;
    }
    out.push("| slug | TS params | HTML controls | missingInHtml | missingInTs | rangeMismatch | typeMismatch | topicSubtitle vs htmlTitle |");
    out.push("|---|---:|---:|---|---|---|---|---|");
    for (const it of items) {
      const r = it.record;
      const tsCount = r.tsParams.length;
      const htmlCount = r.htmlControls.length;
      const dInHtml = r.diff.missingInHtml.join(",") || "-";
      const dInTs = r.diff.missingInTs.join(",") || "-";
      const rng = r.diff.rangeMismatch.map((m) => m.paramId).join(",") || "-";
      const tp = r.diff.typeMismatch.map((m) => m.paramId).join(",") || "-";
      const topic = r.topicMismatch
        ? `${r.topicMismatch.tsSubtitle?.slice(0, 40) ?? ""} vs ${r.topicMismatch.htmlTitle?.slice(0, 40) ?? ""}${r.topicMismatch.suspect ? " ⚠️" : ""}`
        : "-";
      out.push(`| ${r.slug} | ${tsCount} | ${htmlCount} | ${dInHtml} | ${dInTs} | ${rng} | ${tp} | ${topic} |`);
    }
    out.push("");
  }

  writeFileSync(OUT_PATH, out.join("\n"));
  console.log(`Triage report: ${OUT_PATH}`);
  console.log(`\nCounts:`);
  for (const s of order) {
    console.log(`  ${severityIcon(s)} ${s.padEnd(15)} ${counts.get(s) ?? 0}`);
  }
}

main();
