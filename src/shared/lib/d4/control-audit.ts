/**
 * D4 control audit primitives. Used by:
 *   - `scripts/audit-params-vs-html.ts` (CLI: writes JSONL + summary)
 *   - `tests/unit/content/params-vs-html.test.ts` (CI: regression test)
 *
 * Pure functions — extract HTML controls from a simulation file via
 * jsdom and diff them against an Experiment's `parameters[]` /
 * `presets[]` / `htmlControlAliases`.
 *
 * jsdom is a devDependency. This file is never bundled into the Next.js
 * app because nothing in app code (anywhere under `src/app/` or
 * `src/shared/blocks/` etc.) imports it.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { JSDOM } from "jsdom";

import type { Experiment, Parameter } from "@/shared/types/experiment";

export const PUBLIC_DIR_DEFAULT = "public";

export interface HtmlControl {
  id: string;
  kind: "range" | "number" | "checkbox" | "select" | "preset-button";
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string;
  options?: string[];
  presetTarget?: string;
  source: string;
}

const EXCLUDED_ID_PATTERNS: RegExp[] = [
  /^(play|pause|playBtn|playPause|step|reset|resetBtn)$/i,
  /^(speed|playSpeed|playback)/i,
  /-(speed|playback)$/i,
  /^(fullscreen|fs-|about|help|info|infoBtn|helpBtn|aboutBtn)/i,
  /^(quiz|q-|question)/i,
  /^(d-|data-|display-|readout|readout-|out-|o-|val-|value-)/i,
  /^(toast|modal|notif|alert)/i,
  /^(canvas|scene|wrap|main|root|app|container)$/i,
  /^(legend|label|caption|title|subtitle|footer|header)/i,
  /^(chart|axis|x-axis|y-axis|xy)/i,
];

export function isExcludedId(id: string): boolean {
  if (!id) return true;
  return EXCLUDED_ID_PATTERNS.some((re) => re.test(id));
}

const EXCLUDED_PRESET_FN_PATTERNS: RegExp[] = [
  /^(setSpeed|setSimSpeed|setPlaySpeed|setPlayback|setTimeSpeed|setRate|setFps)/,
  /^(toggle|show|hide|open|close|reset|play|pause|step|fullscreen|focus)/i,
];

function isExcludedPresetFn(fn: string, _target: string): boolean {
  return EXCLUDED_PRESET_FN_PATTERNS.some((re) => re.test(fn));
}

export function extractHtmlControls(
  htmlPath: string,
  publicDir: string = PUBLIC_DIR_DEFAULT,
): HtmlControl[] {
  const fullPath = join(publicDir, htmlPath.replace(/^\//, ""));
  if (!existsSync(fullPath)) {
    throw new Error(`HTML file not found: ${fullPath}`);
  }
  const html = readFileSync(fullPath, "utf-8");
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const controls: HtmlControl[] = [];

  const inputs = doc.querySelectorAll<HTMLInputElement>(
    'input[type="range"], input[type="number"], input[type="checkbox"]',
  );
  for (const input of Array.from(inputs)) {
    const rawId = input.getAttribute("id") ?? "";
    const type = (input.getAttribute("type") ?? "range").toLowerCase();
    let id = rawId;

    if (!id) {
      const oninput = input.getAttribute("oninput") ?? input.getAttribute("onchange") ?? "";
      const m = oninput.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
      if (m) {
        id = `oninput:${m[1]}`;
      } else {
        continue;
      }
    }

    if (isExcludedId(id)) continue;
    const min = input.getAttribute("min");
    const max = input.getAttribute("max");
    const step = input.getAttribute("step");
    const value = input.getAttribute("value");
    controls.push({
      id,
      kind:
        type === "range"
          ? "range"
          : type === "checkbox"
            ? "checkbox"
            : "number",
      label: findAssociatedLabel(doc, id),
      min: min !== null ? Number(min) : undefined,
      max: max !== null ? Number(max) : undefined,
      step: step !== null ? Number(step) : undefined,
      defaultValue: value ?? undefined,
      source: input.outerHTML.slice(0, 200),
    });
  }

  const selects = doc.querySelectorAll<HTMLSelectElement>("select[id]");
  for (const select of Array.from(selects)) {
    const id = select.getAttribute("id") ?? "";
    if (!id || isExcludedId(id)) continue;
    const opts = Array.from(select.querySelectorAll("option")).map(
      (o) => o.getAttribute("value") ?? o.textContent?.trim() ?? "",
    );
    controls.push({
      id,
      kind: "select",
      label: findAssociatedLabel(doc, id),
      options: opts,
      source: select.outerHTML.slice(0, 200),
    });
  }

  const buttons = doc.querySelectorAll("button, [data-preset]");
  for (const btn of Array.from(buttons)) {
    const id = btn.getAttribute("id") ?? "";
    const dataPreset = btn.getAttribute("data-preset");
    const dataParam = btn.getAttribute("data-param");
    const onclick = btn.getAttribute("onclick");

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
      const presetMatch = onclick.match(
        /(applyPreset|setMode|setPreset|set[A-Z]\w*|select[A-Z]\w*|load[A-Z]\w*|choose[A-Z]\w*|pick[A-Z]\w*|jumpTo[A-Z]\w*|goTo[A-Z]\w*)\(\s*(?:['"`]([^'"`]+)['"`]|(-?\d+(?:\.\d+)?))/,
      );
      if (presetMatch) {
        const fn = presetMatch[1];
        const target = presetMatch[2] ?? presetMatch[3];
        if (isExcludedPresetFn(fn, target)) continue;
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
  const el = doc.getElementById(id);
  const aria = el?.getAttribute("aria-label");
  if (aria) return aria;
  return undefined;
}

export interface ParamSnapshot {
  id: string;
  alias?: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

export function snapshotParam(
  p: Parameter,
  aliases: Record<string, string> = {},
): ParamSnapshot {
  return {
    id: p.id,
    alias: aliases[p.id],
    min: p.min,
    max: p.max,
    step: p.step,
    default: p.default,
  };
}

export interface ControlDiff {
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
    tsKind: "range";
    htmlKind: HtmlControl["kind"];
  }>;
}

export function diffControls(
  exp: Experiment,
  htmlControls: HtmlControl[],
): ControlDiff {
  const aliases = exp.htmlControlAliases ?? {};
  const presets = exp.presets ?? [];
  const tsSnapshots = exp.parameters.map((p) => snapshotParam(p, aliases));

  const missingInHtml: string[] = [];
  const rangeMismatch: ControlDiff["rangeMismatch"] = [];
  const typeMismatch: ControlDiff["typeMismatch"] = [];
  const matchedDomIds = new Set<string>();

  for (const ts of tsSnapshots) {
    const target = ts.alias ?? ts.id;
    const match = htmlControls.find((c) => c.id === target);
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
    const { min: tsMin, max: tsMax, step: tsStep } = ts;
    const { min: htmlMin, max: htmlMax, step: htmlStep } = match;
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

  for (const preset of presets) {
    const target = preset.id;
    const hit = htmlControls.find((c) => {
      if (c.kind !== "preset-button") return false;
      if (c.presetTarget?.endsWith(`:${target}`)) return true;
      if (c.presetTarget === target) return true;
      return false;
    });
    if (hit) {
      matchedDomIds.add(hit.id);
    } else {
      missingInHtml.push(`preset:${target}`);
    }
  }

  const aliasedDomIds = new Set(Object.values(aliases));
  const tsDirectIds = new Set(exp.parameters.map((p) => p.id));
  const missingInTs: string[] = [];
  for (const c of htmlControls) {
    if (matchedDomIds.has(c.id)) continue;
    if (aliasedDomIds.has(c.id)) continue;
    if (tsDirectIds.has(c.id)) continue;
    missingInTs.push(c.id);
  }

  return { missingInHtml, missingInTs, rangeMismatch, typeMismatch };
}

export function isCleanDiff(d: ControlDiff): boolean {
  return (
    d.missingInHtml.length === 0 &&
    d.missingInTs.length === 0 &&
    d.rangeMismatch.length === 0 &&
    d.typeMismatch.length === 0
  );
}
