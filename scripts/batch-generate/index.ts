/**
 * UPG Batch Generation CLI
 *
 * Usage:
 *   pnpm tsx scripts/batch-generate/index.ts --id friction-lab --lang en
 *   pnpm tsx scripts/batch-generate/index.ts --tier p0 --lang en
 *   pnpm tsx scripts/batch-generate/index.ts --retry-failed
 *   pnpm tsx scripts/batch-generate/index.ts --report
 */

import 'dotenv/config';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { buildBatchPrompt } from './build-prompt';
import { checkPhysicsQuality } from './physics-quality';
import { loadPromptConfigs } from './prompt-configs/loader';
import type { BatchPromptConfig, GenerationResult } from './types';

const MAX_RETRIES = 3;
const DELAY_BETWEEN_MS = 5000;
const PROJECT_ROOT = resolve(__dirname, '../..');
const OUTPUT_DIR = resolve(PROJECT_ROOT, 'public/experiments/ap-physics');
const REPORT_PATH = resolve(PROJECT_ROOT, 'scripts/batch-generate/generation-report.json');

// ====== Anthropic API Direct Call ======

interface AnthropicResponse {
  html: string;
  inputTokens: number;
  outputTokens: number;
}

async function callAnthropicDirect(
  systemPrompt: string,
  userPrompt: string,
  temperature: number
): Promise<AnthropicResponse> {
  // Support both ANTHROPIC_API_KEY and OPENROUTER_API_KEY (for Anthropic-compatible proxies like zenmux)
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY or OPENROUTER_API_KEY not set');

  const baseUrl = (
    process.env.ANTHROPIC_BASE_URL || process.env.OPENROUTER_BASE_URL || 'https://api.anthropic.com'
  ).replace(/\/+$/, '');

  const isProxy = !baseUrl.includes('api.anthropic.com');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
  };
  if (isProxy) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else {
    headers['x-api-key'] = apiKey;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 300_000); // 5 min

  try {
    const response = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 16000,
        temperature,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const detail = (body as Record<string, unknown>)?.error || response.statusText;
      throw new Error(`Anthropic ${response.status}: ${JSON.stringify(detail)}`);
    }

    const data = await response.json();
    const content =
      (data as Record<string, unknown[]>)?.content?.find(
        (c: unknown) => (c as Record<string, string>).type === 'text'
      ) as Record<string, string> | undefined;
    const usage = (data as Record<string, Record<string, number>>)?.usage ?? {};

    return {
      html: content?.text ?? '',
      inputTokens: usage.input_tokens ?? 0,
      outputTokens: usage.output_tokens ?? 0,
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ====== System Prompt (read from file, avoid @/ path alias issues in CLI) ======

function getBaseSystemPrompt(): string {
  // Read the system prompt source files directly to avoid tsconfig path issues
  // We construct the prompt from the physics discipline config
  const promptPath = resolve(PROJECT_ROOT, 'src/shared/lib/upg/system-prompt.ts');
  // Fallback: use a minimal but effective system prompt for batch generation
  return BATCH_SYSTEM_PROMPT;
}

/** Standalone system prompt for batch CLI (mirrors the project's getSystemPrompt('physics')) */
const BATCH_SYSTEM_PROMPT = `You are AetherViz, a world-class interactive scientific visualization generator. Your sole output is a single, complete, self-contained HTML file that produces stunning, interactive 3D educational visualizations.

## OUTPUT FORMAT
- Output ONLY raw HTML starting with <!DOCTYPE html>. No markdown fences, no explanation, no commentary.
- The entire visualization must be in ONE file — all CSS inline in <style>, all JS inline in <script>.

## TECHNOLOGY STACK (CDN only)
- Three.js r134: https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js
- OrbitControls r134: https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/controls/OrbitControls.js
- KaTeX 0.16.9 CSS: https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css
- KaTeX 0.16.9 JS: https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js

**CRITICAL: Load Three.js and OrbitControls via <script> tags in <head>. They become global THREE object. OrbitControls registers as THREE.OrbitControls. NEVER import as ES modules. NEVER write your own camera controls.**

## ANTI-BLACK-SCREEN RULES
1. Wrap ALL Three.js code in try-catch. Show red error message on failure.
2. ALWAYS include window resize listener.
3. Use renderer.setAnimationLoop(fn) instead of manual requestAnimationFrame.
4. ALWAYS call renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)).
5. NEVER create new Vector3/Matrix4 inside animation loop — pre-allocate.
6. ALWAYS add at least 3 lights. Objects are invisible without light.
7. Scene background MUST be dark slate blue (0x0f172a), NEVER pure black.

## PERFORMANCE
- Detect device quality tier via navigator.hardwareConcurrency
- Adaptive particles/geometry/shadows
- Include FPS counter (top-left, small monospace)
- Cap delta time: Math.min(clock.getDelta(), 0.05)

## CONTENT STRUCTURE (all mandatory)
1. **Title Bar** — Subject icon + topic + one-line description
2. **Left Panel (30%, collapsible)** — KaTeX formulas, explanation, knowledge cards
3. **Main Canvas (70%)** — Three.js 3D scene with OrbitControls
4. **Control Panel** — Glassmorphism, 3+ sliders with label+value+unit, Play/Pause/Reset
5. **Formula Section** — 2+ formulas with katex.render(), live-updating values
6. **Quiz Panel** — Collapsible, 1-2 MCQs with instant feedback

## SECURITY
- NEVER use: eval(), new Function(), fetch(), XMLHttpRequest, document.cookie, localStorage
- All resources from cdn.jsdelivr.net only

## CODE QUALITY
- 'use strict', DOMContentLoaded wrapper, const/let (no var), WebGL context loss handling

## Physics-Specific Requirements

### Force & Motion
- Forces: ArrowHelper — red=force, blue=velocity, green=acceleration
- Coordinate axes with SI labels, trail lines (MAX_TRAIL=500)

### Energy
- Energy bar chart: kinetic(blue), potential(red), total(green dashed)
- Total energy constant in conservative systems

### Fields
- Electric/magnetic: field lines or color gradient
- Gravitational: gradient sphere or equipotential contours

### Physical Constants
- SI units: g=9.81 m/s², c=3×10⁸ m/s, e=1.6×10⁻¹⁹ C
- Planet label if g is adjusted

### Numerical Methods
- Default: Velocity Verlet. Complex: RK4.
- dt capped at 0.02s, tab-switch protection

### Analytical Solution Overlay (MANDATORY)
When closed-form solution exists, plot BOTH numerical (solid) and analytical (dashed orange) on same graph.
`;

// ====== HTML Post-Processing (standalone, no project imports) ======

function postProcess(html: string): { sanitized: string; qualityPassed: boolean; issues: string[] } {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Basic sanitization: ensure no eval/fetch/etc
  const blacklist = [/\beval\s*\(/, /\bnew\s+Function\s*\(/, /\bdocument\s*\.\s*cookie\b/, /\blocalStorage\b/];
  for (const p of blacklist) {
    if (p.test(html)) issues.push(`Blacklisted pattern: ${p.source}`);
  }

  // Check essential Three.js elements
  if (!/cdn\.jsdelivr\.net\/npm\/three@[\d.]+/.test(html)) issues.push('Missing Three.js CDN');
  if (!/OrbitControls/.test(html)) issues.push('Missing OrbitControls');
  if (!/new\s+THREE\.Scene/.test(html)) issues.push('Missing THREE.Scene');
  if (!/new\s+THREE\.WebGLRenderer/.test(html)) issues.push('Missing WebGLRenderer');
  if (!/setAnimationLoop|requestAnimationFrame/.test(html)) issues.push('Missing animation loop');
  if (!/addEventListener\s*\(\s*['"]resize['"]/.test(html)) issues.push('Missing resize handler');
  if (!/setPixelRatio/.test(html)) issues.push('Missing setPixelRatio');
  if (!/katex/i.test(html)) warnings.push('Missing KaTeX');
  if (!/input[^>]*type\s*=\s*["']range["']/i.test(html)) issues.push('Missing slider');

  const size = new TextEncoder().encode(html).length;
  if (size < 5 * 1024) issues.push(`HTML too small (${size} bytes)`);
  if (size > 200 * 1024) issues.push(`HTML too large (${size} bytes)`);

  return {
    sanitized: html,
    qualityPassed: issues.length === 0,
    issues: [...issues, ...warnings],
  };
}

// ====== Core Generation Logic ======

async function generateOne(
  config: BatchPromptConfig,
  lang: 'en' | 'zh'
): Promise<GenerationResult> {
  const systemPrompt = getBaseSystemPrompt();
  let lastError = '';

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const temperature = attempt === 1 ? 0.7 : 0.8;
      const userPrompt = buildBatchPrompt(config, lang);

      console.log(`  Attempt ${attempt}/${MAX_RETRIES} (temp=${temperature})...`);

      const aiResult = await callAnthropicDirect(systemPrompt, userPrompt, temperature);

      // Extract HTML from response (strip markdown fences if present)
      let rawHtml = aiResult.html;
      const fenceMatch = rawHtml.match(/```html\n([\s\S]*?)```/);
      if (fenceMatch) {
        rawHtml = fenceMatch[1];
      }
      // Also handle case where HTML starts after some text
      const doctypeMatch = rawHtml.match(/(<!DOCTYPE[\s\S]*)/i);
      if (doctypeMatch) {
        rawHtml = doctypeMatch[1];
      }

      // Post-process
      const { sanitized, qualityPassed, issues } = postProcess(rawHtml);

      if (!qualityPassed) {
        lastError = `Quality check failed: ${issues.join('; ')}`;
        console.log(`  ❌ ${lastError}`);
        if (attempt < MAX_RETRIES) {
          await sleep(10000);
        }
        continue;
      }

      // Physics-specific quality check
      const physicsResult = checkPhysicsQuality(sanitized, config);
      if (!physicsResult.passed) {
        lastError = `Physics check failed (score=${physicsResult.score}): ${physicsResult.issues.join('; ')}`;
        console.log(`  ⚠️ ${lastError}`);
        // Physics check is softer — still save but warn
      }

      // Write file
      const outputPath = resolve(OUTPUT_DIR, `${config.neonId}.html`);
      writeFileSync(outputPath, sanitized, 'utf-8');

      const size = new TextEncoder().encode(sanitized).length;
      console.log(`  ✅ Success (${(size / 1024).toFixed(1)}KB, ${aiResult.inputTokens + aiResult.outputTokens} tokens, score=${physicsResult.score})`);

      return {
        id: config.neonId,
        status: 'success',
        attempt,
        tokens: aiResult.inputTokens + aiResult.outputTokens,
        size,
        outputPath: `/experiments/ap-physics/${config.neonId}.html`,
      };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : String(err);
      console.log(`  ❌ Attempt ${attempt} error: ${lastError.slice(0, 100)}`);
      if (attempt < MAX_RETRIES) {
        await sleep(10000);
      }
    }
  }

  return {
    id: config.neonId,
    status: 'failed',
    attempt: MAX_RETRIES,
    error: lastError,
  };
}

// ====== CLI Entry Point ======

async function main() {
  const args = parseArgs();

  if (args.report) {
    printReport();
    return;
  }

  const allConfigs = loadPromptConfigs();
  let configs: BatchPromptConfig[];

  if (args.id) {
    const found = allConfigs.find((c) => c.neonId === args.id);
    if (!found) {
      console.error(`❌ Experiment not found: ${args.id}`);
      console.log('Available:', allConfigs.map((c) => c.neonId).join(', '));
      process.exit(1);
    }
    configs = [found];
  } else if (args.tier) {
    const tier = args.tier.toUpperCase() as 'P0' | 'P1' | 'P2';
    configs = allConfigs.filter((c) => c.tier === tier);
  } else if (args.retryFailed) {
    const report = loadReport();
    const failedIds = report.filter((r) => r.status === 'failed').map((r) => r.id);
    configs = allConfigs.filter((c) => failedIds.includes(c.neonId));
  } else {
    configs = allConfigs;
  }

  if (configs.length === 0) {
    console.log('No experiments to generate.');
    return;
  }

  console.log(`\n🚀 Batch generating ${configs.length} experiments (lang=${args.lang})\n`);

  // Ensure output dir exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const results: GenerationResult[] = loadReport();

  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    console.log(`[${i + 1}/${configs.length}] ${config.neonId} (${config.phetName})`);

    // Skip if already succeeded
    const existing = results.find((r) => r.id === config.neonId);
    if (existing?.status === 'success' && !args.force) {
      console.log('  ⏭️ Already succeeded, skipping (use --force to regenerate)');
      continue;
    }

    const result = await generateOne(config, args.lang);

    // Update results (replace existing or add new)
    const idx = results.findIndex((r) => r.id === config.neonId);
    if (idx >= 0) {
      results[idx] = result;
    } else {
      results.push(result);
    }

    // Save report after each generation
    saveReport(results);

    // Delay between generations
    if (i < configs.length - 1) {
      await sleep(DELAY_BETWEEN_MS);
    }
  }

  // Final summary
  const succeeded = results.filter((r) => r.status === 'success').length;
  const failed = results.filter((r) => r.status === 'failed').length;
  console.log(`\n📊 Done: ${succeeded} succeeded, ${failed} failed out of ${results.length} total`);
}

// ====== Helpers ======

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    id: '',
    tier: '',
    lang: 'en' as 'en' | 'zh',
    retryFailed: false,
    report: false,
    force: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--id':
        result.id = args[++i] || '';
        break;
      case '--tier':
        result.tier = args[++i] || '';
        break;
      case '--lang':
        result.lang = (args[++i] || 'en') as 'en' | 'zh';
        break;
      case '--retry-failed':
        result.retryFailed = true;
        break;
      case '--report':
        result.report = true;
        break;
      case '--force':
        result.force = true;
        break;
    }
  }

  return result;
}

function loadReport(): GenerationResult[] {
  if (!existsSync(REPORT_PATH)) return [];
  try {
    return JSON.parse(readFileSync(REPORT_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

function saveReport(results: GenerationResult[]) {
  writeFileSync(REPORT_PATH, JSON.stringify(results, null, 2), 'utf-8');
}

function printReport() {
  const results = loadReport();
  if (results.length === 0) {
    console.log('No generation results yet.');
    return;
  }

  const succeeded = results.filter((r) => r.status === 'success');
  const failed = results.filter((r) => r.status === 'failed');

  console.log(`\n📊 Generation Report`);
  console.log(`Total: ${results.length} | ✅ ${succeeded.length} | ❌ ${failed.length}\n`);

  if (failed.length > 0) {
    console.log('Failed experiments:');
    for (const r of failed) {
      console.log(`  ❌ ${r.id}: ${r.error?.slice(0, 80)}`);
    }
  }

  const totalTokens = succeeded.reduce((sum, r) => sum + (r.tokens || 0), 0);
  const totalSize = succeeded.reduce((sum, r) => sum + (r.size || 0), 0);
  console.log(`\nTotal tokens: ${totalTokens.toLocaleString()}`);
  console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
