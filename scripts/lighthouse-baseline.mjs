#!/usr/bin/env node
/**
 * Lighthouse baseline — runs 3 times on a URL, writes median of key metrics.
 *
 * Usage:
 *   node scripts/lighthouse-baseline.mjs [url] [--device=mobile|desktop]
 *
 * Default url:    http://localhost:3000
 * Default device: mobile
 *
 * Output: docs/baselines/homepage-YYYY-MM-DD-<device>.json
 *
 * Exit 0 on success, 1 on crash.
 */

import * as chromeLauncher from 'chrome-launcher';
import fs from 'node:fs/promises';
import path from 'node:path';

// Dynamic import because lighthouse is ESM-only and default export needs unwrap
const { default: lighthouse } = await import('lighthouse');

const url = process.argv[2] ?? 'http://localhost:3000';
const device =
  process.argv.find((a) => a.startsWith('--device='))?.split('=')[1] ?? 'mobile';

async function runOnce(chrome) {
  const screen =
    device === 'mobile'
      ? { mobile: true, width: 360, height: 640, deviceScaleFactor: 2, disabled: false }
      : {
          mobile: false,
          width: 1440,
          height: 900,
          deviceScaleFactor: 1,
          disabled: false,
        };

  const result = await lighthouse(url, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
    formFactor: device,
    screenEmulation: screen,
  });

  const { lhr } = result;
  return {
    performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
    seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
    bestPractices: Math.round((lhr.categories['best-practices']?.score ?? 0) * 100),
    lcp: lhr.audits['largest-contentful-paint']?.numericValue ?? 0,
    cls: lhr.audits['cumulative-layout-shift']?.numericValue ?? 0,
    tbt: lhr.audits['total-blocking-time']?.numericValue ?? 0,
    fcp: lhr.audits['first-contentful-paint']?.numericValue ?? 0,
  };
}

function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

async function main() {
  console.log(`Lighthouse baseline · ${url} · ${device} · 3 runs`);
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--no-sandbox'],
  });
  try {
    const runs = [];
    for (let i = 1; i <= 3; i++) {
      process.stdout.write(`  run ${i}/3... `);
      runs.push(await runOnce(chrome));
      console.log('done');
    }
    const keys = [
      'performance',
      'accessibility',
      'seo',
      'bestPractices',
      'lcp',
      'cls',
      'tbt',
      'fcp',
    ];
    const medians = Object.fromEntries(
      keys.map((k) => [k, median(runs.map((r) => r[k]))])
    );
    const date = new Date().toISOString().split('T')[0];
    const output = { url, device, date, runs, median: medians };
    const fname = `homepage-${date}-${device}.json`;
    const outDir = path.join('docs', 'baselines');
    await fs.mkdir(outDir, { recursive: true });
    const outPath = path.join(outDir, fname);
    await fs.writeFile(outPath, JSON.stringify(output, null, 2));
    console.log(`\n✓ Saved: ${outPath}`);
    console.log(
      `  perf=${medians.performance}  a11y=${medians.accessibility}  seo=${medians.seo}  bp=${medians.bestPractices}`
    );
    console.log(
      `  lcp=${Math.round(medians.lcp)}ms  cls=${medians.cls.toFixed(3)}  tbt=${Math.round(medians.tbt)}ms  fcp=${Math.round(medians.fcp)}ms`
    );
  } finally {
    await chrome.kill();
  }
}

main().catch((err) => {
  console.error('lighthouse-baseline crashed:', err);
  process.exit(1);
});
