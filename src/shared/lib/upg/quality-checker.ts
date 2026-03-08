import { UPG_MAX_HTML_SIZE } from './constants';

interface QualityResult {
  passed: boolean;
  issues: string[];
}

const BLACKLIST_PATTERNS = [
  /\beval\s*\(/,
  /\bnew\s+Function\s*\(/,
  /\bdocument\s*\.\s*cookie\b/,
  /\blocalStorage\b/,
  /\bsessionStorage\b/,
];

export function checkQuality(html: string): QualityResult {
  const issues: string[] = [];

  // 1. Check for Three.js / 3D canvas presence
  const hasThreeJs =
    /three(?:\.min)?\.js/i.test(html) ||
    /\bTHREE\b/.test(html) ||
    /<canvas/i.test(html);
  if (!hasThreeJs) {
    issues.push('Missing Three.js or <canvas> element');
  }

  // 2. Check for KaTeX / math formulas
  const hasKatex =
    /katex/i.test(html) ||
    /\\frac|\\sum|\\int|\\sqrt|\\alpha|\\beta|\\gamma|\\Delta/i.test(html);
  if (!hasKatex) {
    issues.push('Missing KaTeX or mathematical formulas');
  }

  // 3. Check for at least 1 range slider
  const hasSlider = /input[^>]*type\s*=\s*["']range["']/i.test(html);
  if (!hasSlider) {
    issues.push('Missing interactive slider (input[type=range])');
  }

  // 4. Check HTML size bounds
  const sizeBytes = new TextEncoder().encode(html).length;
  if (sizeBytes < 5 * 1024) {
    issues.push(`HTML too small (${sizeBytes} bytes, minimum 5KB)`);
  }
  if (sizeBytes > UPG_MAX_HTML_SIZE) {
    issues.push(`HTML too large (${sizeBytes} bytes, maximum ${UPG_MAX_HTML_SIZE / 1024}KB)`);
  }

  // 5. Check blacklist patterns
  for (const pattern of BLACKLIST_PATTERNS) {
    if (pattern.test(html)) {
      issues.push(`Contains blacklisted pattern: ${pattern.source}`);
    }
  }

  return {
    passed: issues.length === 0,
    issues,
  };
}
