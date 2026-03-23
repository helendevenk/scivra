/**
 * Experiment QA Checker — opens each HTML experiment in Playwright,
 * takes screenshot, checks DOM elements, collects console errors.
 *
 * Usage: npx tsx scripts/qa-experiments.ts [startIndex] [endIndex]
 * Example: npx tsx scripts/qa-experiments.ts 1 10  (check experiments 1-10)
 *          npx tsx scripts/qa-experiments.ts        (check all)
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const EXPERIMENTS_DIR = path.join(process.cwd(), 'public/experiments');
const SCREENSHOTS_DIR = path.join(process.cwd(), 'test-screenshots');
const REPORT_FILE = path.join(process.cwd(), 'docs/reports/2026-03-23-experiment-qa-results.json');

interface QAResult {
  index: number;
  category: string;
  name: string;
  file: string;
  fileSize: number;
  checks: {
    c1_loads: boolean;        // Page loads without black screen
    c2_no_errors: boolean;    // No critical JS errors
    c3_canvas: boolean;       // Canvas element exists
    c4_katex: number;         // Number of .katex elements
    c5_sliders: number;       // Number of range inputs
    c6_buttons: number;       // Number of buttons
    c7_screenshot: string;    // Screenshot path
  };
  consoleErrors: string[];
  consoleWarnings: number;
  status: 'PASS' | 'WARNING' | 'FAIL';
  failReasons: string[];
}

async function findAllExperiments(): Promise<{ category: string; name: string; file: string }[]> {
  const results: { category: string; name: string; file: string }[] = [];

  const categories = fs.readdirSync(EXPERIMENTS_DIR).filter(d => {
    const full = path.join(EXPERIMENTS_DIR, d);
    return fs.statSync(full).isDirectory();
  });

  for (const cat of categories) {
    const catDir = path.join(EXPERIMENTS_DIR, cat);
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.html'));
    for (const f of files) {
      results.push({
        category: cat,
        name: f.replace('.html', ''),
        file: path.join(catDir, f),
      });
    }
  }

  // Also check root level HTML files
  const rootFiles = fs.readdirSync(EXPERIMENTS_DIR).filter(f => f.endsWith('.html'));
  for (const f of rootFiles) {
    results.push({
      category: 'root',
      name: f.replace('.html', ''),
      file: path.join(EXPERIMENTS_DIR, f),
    });
  }

  return results.sort((a, b) => `${a.category}/${a.name}`.localeCompare(`${b.category}/${b.name}`));
}

async function checkExperiment(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof chromium.launch>>['newPage']>>,
  exp: { category: string; name: string; file: string },
  index: number
): Promise<QAResult> {
  const consoleErrors: string[] = [];
  let consoleWarnings = 0;

  // Collect console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text().slice(0, 200));
    } else if (msg.type() === 'warning') {
      consoleWarnings++;
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message.slice(0, 200));
  });

  const fileSize = fs.statSync(exp.file).size;
  const screenshotName = `qa-${exp.category}-${exp.name}.png`;
  const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);

  let c1_loads = false;
  let c3_canvas = false;
  let c4_katex = 0;
  let c5_sliders = 0;
  let c6_buttons = 0;

  try {
    // Navigate to file
    await page.goto(`file://${exp.file}`, { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Wait for Three.js to render (give it time)
    await page.waitForTimeout(3000);

    // Check C1: page loaded (not blank)
    const bodyHTML = await page.evaluate(() => document.body?.innerHTML?.length || 0);
    c1_loads = bodyHTML > 100;

    // Check C3: canvas exists
    const canvasCount = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      let visible = 0;
      canvases.forEach(c => {
        if (c.width > 0 && c.height > 0) visible++;
      });
      return visible;
    });
    c3_canvas = canvasCount > 0;

    // Check C4: KaTeX elements
    c4_katex = await page.evaluate(() => document.querySelectorAll('.katex, .katex-display, [class*="katex"]').length);

    // Check C5: sliders/range inputs
    c5_sliders = await page.evaluate(() => document.querySelectorAll('input[type="range"], [class*="slider"], [role="slider"]').length);

    // Check C6: buttons
    c6_buttons = await page.evaluate(() => document.querySelectorAll('button, [class*="btn"], [onclick]').length);

    // Take screenshot
    await page.screenshot({ path: screenshotPath, fullPage: false });

  } catch (err: any) {
    consoleErrors.push(`Navigation failed: ${err.message?.slice(0, 100)}`);
  }

  // Determine status
  const failReasons: string[] = [];
  const c2_no_errors = consoleErrors.filter(e =>
    !e.includes('favicon') &&
    !e.includes('net::ERR_FILE_NOT_FOUND') &&
    !e.includes('404')
  ).length === 0;

  if (!c1_loads) failReasons.push('Page did not load (blank/empty)');
  if (!c2_no_errors) failReasons.push(`${consoleErrors.length} JS errors`);
  if (!c3_canvas) failReasons.push('No visible canvas element');

  let status: 'PASS' | 'WARNING' | 'FAIL';
  if (!c1_loads) {
    status = 'FAIL';
  } else if (consoleErrors.length > 3) {
    status = 'FAIL';
  } else {
    const featureScore = (c4_katex > 0 ? 1 : 0) + (c5_sliders > 0 ? 1 : 0) + (c6_buttons > 0 ? 1 : 0);
    if (featureScore >= 2 && c3_canvas) {
      status = 'PASS';
    } else if (c1_loads) {
      status = 'WARNING';
      if (c4_katex === 0) failReasons.push('No KaTeX formulas');
      if (c5_sliders === 0) failReasons.push('No sliders/range inputs');
      if (c6_buttons === 0) failReasons.push('No buttons');
      if (!c3_canvas) failReasons.push('No canvas');
    } else {
      status = 'FAIL';
    }
  }

  return {
    index,
    category: exp.category,
    name: exp.name,
    file: exp.file,
    fileSize,
    checks: {
      c1_loads,
      c2_no_errors,
      c3_canvas,
      c4_katex,
      c5_sliders,
      c6_buttons,
      c7_screenshot: screenshotName,
    },
    consoleErrors: consoleErrors.slice(0, 5), // cap at 5
    consoleWarnings,
    status,
    failReasons,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const startIndex = args[0] ? parseInt(args[0]) : 1;
  const endIndex = args[1] ? parseInt(args[1]) : 999;

  // Ensure directories exist
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });

  const experiments = await findAllExperiments();
  const subset = experiments.slice(startIndex - 1, endIndex);

  console.log(`\n🔍 QA Check: ${subset.length} experiments (${startIndex}-${Math.min(endIndex, experiments.length)} of ${experiments.length})\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });

  const results: QAResult[] = [];

  // Load existing results if any
  let existingResults: QAResult[] = [];
  if (fs.existsSync(REPORT_FILE)) {
    try {
      existingResults = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf-8'));
    } catch {}
  }

  for (let i = 0; i < subset.length; i++) {
    const exp = subset[i];
    const globalIndex = startIndex + i;
    const page = await context.newPage();

    console.log(`[${globalIndex}/${experiments.length}] ${exp.category}/${exp.name} ...`);

    const result = await checkExperiment(page, exp, globalIndex);
    results.push(result);

    const icon = result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌';
    console.log(`  ${icon} ${result.status} — canvas:${result.checks.c3_canvas} katex:${result.checks.c4_katex} sliders:${result.checks.c5_sliders} buttons:${result.checks.c6_buttons}${result.failReasons.length > 0 ? ' — ' + result.failReasons.join(', ') : ''}`);

    await page.close();
  }

  await browser.close();

  // Merge with existing results
  const allResults = [...existingResults.filter(r => r.index < startIndex || r.index > endIndex), ...results];
  allResults.sort((a, b) => a.index - b.index);

  // Save results
  fs.writeFileSync(REPORT_FILE, JSON.stringify(allResults, null, 2));

  // Print summary
  const pass = results.filter(r => r.status === 'PASS').length;
  const warn = results.filter(r => r.status === 'WARNING').length;
  const fail = results.filter(r => r.status === 'FAIL').length;

  console.log(`\n📊 Batch Summary: ✅ ${pass} PASS | ⚠️ ${warn} WARNING | ❌ ${fail} FAIL`);

  if (fail > 0) {
    console.log('\n❌ Failed experiments:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  ${r.category}/${r.name}: ${r.failReasons.join(', ')}`);
    });
  }

  if (warn > 0) {
    console.log('\n⚠️ Warning experiments:');
    results.filter(r => r.status === 'WARNING').forEach(r => {
      console.log(`  ${r.category}/${r.name}: ${r.failReasons.join(', ')}`);
    });
  }
}

main().catch(console.error);
