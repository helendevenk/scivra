import type { BatchPromptConfig } from './types';

interface PhysicsQualityResult {
  passed: boolean;
  issues: string[];
  warnings: string[];
  score: number; // 0-100
}

/**
 * Physics-specific quality check for batch-generated experiments.
 * More stringent than the general checkQuality — verifies experiment-specific requirements.
 */
export function checkPhysicsQuality(
  html: string,
  config: BatchPromptConfig
): PhysicsQualityResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // 1. Check required equations are present (by key terms)
  for (const eq of config.equations) {
    // Extract key variable names from equation (e.g., "F = ma" → ["F", "ma"])
    const terms = eq
      .replace(/\\[a-zA-Z]+/g, '') // strip LaTeX commands
      .replace(/[{}()\\]/g, '')
      .split(/[=+\-*/^_\s]+/)
      .filter((t) => t.length >= 1 && !/^\d+$/.test(t));

    const found = terms.some(
      (term) => html.includes(term) || html.toLowerCase().includes(term.toLowerCase())
    );
    if (!found) {
      warnings.push(`Equation term not found: ${eq.slice(0, 40)}`);
      score -= 5;
    }
  }

  // 2. Check required slider parameters exist
  const sliderCount = (html.match(/type\s*=\s*["']range["']/gi) || []).length;
  if (sliderCount < 3) {
    issues.push(`Only ${sliderCount} sliders (minimum 3 required)`);
    score -= 20;
  } else if (sliderCount < config.variables.length) {
    warnings.push(`${sliderCount} sliders found, expected ${config.variables.length}`);
    score -= 5;
  }

  // 3. Check required visual elements (heuristic keyword matching)
  for (const element of config.visualElements) {
    const keywords = element.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const found = keywords.some((kw) => html.toLowerCase().includes(kw));
    if (!found) {
      warnings.push(`Visual element may be missing: ${element}`);
      score -= 3;
    }
  }

  // 4. Check for Quiz component
  const hasQuiz = /quiz|question|选择|answer|correct/i.test(html);
  if (!hasQuiz) {
    warnings.push('No quiz component detected');
    score -= 5;
  }

  // 5. Check for Play/Pause/Reset controls
  const hasPlayPause = /play|pause|暂停|播放/i.test(html);
  const hasReset = /reset|重置/i.test(html);
  if (!hasPlayPause) {
    warnings.push('No Play/Pause button detected');
    score -= 3;
  }
  if (!hasReset) {
    warnings.push('No Reset button detected');
    score -= 3;
  }

  // 6. Check for KaTeX formula rendering
  const hasKatexRender = /katex\.render|katex\.renderToString/i.test(html);
  if (!hasKatexRender) {
    issues.push('No KaTeX render call found — formulas will not display');
    score -= 15;
  }

  // 7. Check HTML size is reasonable (15KB - 200KB for a good experiment)
  const sizeBytes = new TextEncoder().encode(html).length;
  if (sizeBytes < 15 * 1024) {
    warnings.push(`HTML seems too small (${(sizeBytes / 1024).toFixed(1)}KB) — may be incomplete`);
    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  return {
    passed: issues.length === 0 && score >= 50,
    issues,
    warnings,
    score,
  };
}
