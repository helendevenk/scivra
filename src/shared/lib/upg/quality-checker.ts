import { UPG_MAX_HTML_SIZE } from './constants';
import { getDisciplineConfig } from './disciplines';

interface QualityResult {
  passed: boolean;
  issues: string[];
  warnings: string[];
}

const BLACKLIST_PATTERNS = [
  /\beval\s*\(/,
  /\bnew\s+Function\s*\(/,
  /\bdocument\s*\.\s*cookie\b/,
  /\blocalStorage\b/,
  /\bsessionStorage\b/,
];

export function checkQuality(html: string, discipline?: string): QualityResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // === CRITICAL CHECKS (block generation) ===

  // 1. Check for Three.js CDN script tag
  const hasThreeJsCdn = /cdn\.jsdelivr\.net\/npm\/three@[\d.]+\/build\/three(?:\.min)?\.js/.test(html);
  const hasThreeJs = hasThreeJsCdn || /\bTHREE\b/.test(html);
  if (!hasThreeJs) {
    issues.push('Missing Three.js library — 3D will not render');
  }
  if (!hasThreeJsCdn && hasThreeJs) {
    warnings.push('Three.js not loaded from CDN — may use wrong version');
  }

  // 2. Check OrbitControls is loaded (local or CDN)
  const hasOrbitControlsScript =
    /\/lib\/orbit-controls\.js/.test(html) ||
    /cdn\.jsdelivr\.net\/npm\/three@[\d.]+\/examples\/js\/controls\/OrbitControls\.js/.test(html);
  const hasOrbitControlsUsage = /THREE\.OrbitControls/.test(html);
  if (!hasOrbitControlsScript) {
    issues.push('Missing OrbitControls script tag — camera controls will not work');
  }
  if (!hasOrbitControlsUsage && hasOrbitControlsScript) {
    warnings.push('OrbitControls loaded but never instantiated');
  }

  // 3. Detect self-implemented camera controls (AI reinventing the wheel)
  const hasSelfImplementedControls =
    /class\s+OrbitControls/.test(html) ||
    /function\s+OrbitControls/.test(html) ||
    /const\s+OrbitControls\s*=\s*function/.test(html) ||
    /class\s+(?:Trackball|ArcBall|CameraControl)/.test(html);
  if (hasSelfImplementedControls) {
    issues.push('Self-implemented camera controls detected — MUST use THREE.OrbitControls from CDN');
  }

  // 4. Check for KaTeX / math formulas
  const hasKatex =
    /katex/i.test(html) ||
    /\\frac|\\sum|\\int|\\sqrt|\\alpha|\\beta|\\gamma|\\Delta/i.test(html);
  if (!hasKatex) {
    issues.push('Missing KaTeX or mathematical formulas');
  }

  // 5. Check for at least 1 range slider
  const hasSlider = /input[^>]*type\s*=\s*["']range["']/i.test(html);
  if (!hasSlider) {
    issues.push('Missing interactive slider (input[type=range])');
  }

  // 6. Check HTML size bounds
  const sizeBytes = new TextEncoder().encode(html).length;
  if (sizeBytes < 5 * 1024) {
    issues.push(`HTML too small (${sizeBytes} bytes, minimum 5KB)`);
  }
  if (sizeBytes > UPG_MAX_HTML_SIZE) {
    issues.push(`HTML too large (${sizeBytes} bytes, maximum ${UPG_MAX_HTML_SIZE / 1024}KB)`);
  }

  // 7. Check blacklist patterns
  for (const pattern of BLACKLIST_PATTERNS) {
    if (pattern.test(html)) {
      issues.push(`Contains blacklisted pattern: ${pattern.source}`);
    }
  }

  // === THREE.JS INITIALIZATION CHECKS (prevent black screen) ===

  const hasSceneInit = /new\s+THREE\.Scene\s*\(/.test(html);
  if (!hasSceneInit) {
    issues.push('Missing THREE.Scene initialization — 3D will not render');
  }

  const hasRendererInit = /new\s+THREE\.WebGLRenderer/.test(html);
  if (!hasRendererInit) {
    issues.push('Missing THREE.WebGLRenderer — 3D will not render');
  }

  const hasAnimationLoop =
    /requestAnimationFrame/.test(html) ||
    /setAnimationLoop/.test(html);
  if (!hasAnimationLoop) {
    issues.push('Missing animation loop (requestAnimationFrame or setAnimationLoop)');
  }

  const hasResizeHandler = /addEventListener\s*\(\s*['"]resize['"]/.test(html);
  if (!hasResizeHandler) {
    issues.push('Missing window resize handler — layout will break on resize');
  }

  const hasPixelRatio = /setPixelRatio/.test(html);
  if (!hasPixelRatio) {
    issues.push('Missing setPixelRatio — rendering will be blurry on high-DPI screens');
  }

  // 8. Check for try-catch wrapper (anti-black-screen defense #1)
  const hasTryCatch = /try\s*\{/.test(html) && /catch\s*\(/.test(html);
  if (!hasTryCatch) {
    warnings.push('Missing try-catch wrapper — errors will cause silent black screen');
  }

  // === CODE QUALITY WARNINGS (non-blocking) ===

  // 9. Check for var usage (should use const/let)
  const varMatches = html.match(/\bvar\s+\w/g);
  if (varMatches && varMatches.length > 3) {
    warnings.push(`Uses 'var' keyword ${varMatches.length} times — should use const/let`);
  }

  // 10. Check for lighting (objects invisible without lights)
  const hasLighting =
    /DirectionalLight|PointLight|SpotLight|AmbientLight|HemisphereLight/.test(html);
  if (!hasLighting && hasSceneInit) {
    warnings.push('No lighting detected — 3D objects may appear completely black');
  }

  // 11. Check for DOMContentLoaded wrapper
  const hasDomReady = /DOMContentLoaded/.test(html);
  if (!hasDomReady) {
    warnings.push('Missing DOMContentLoaded handler — scripts may run before DOM is ready');
  }

  // === Pedagogy checks (CTO D7: warning-level, non-blocking) ===
  const quizMatches = html.match(/type=["']radio["']/g);
  const quizGroupCount = quizMatches ? Math.floor(quizMatches.length / 3) : 0; // ~3-4 options per question
  if (quizGroupCount < 3) {
    warnings.push(`[pedagogy] Quiz count: found ~${quizGroupCount} questions, expected >= 3`);
  }

  const presetMatches = html.match(/btn-preset|preset-item|preset-name|applyPreset|data-preset/g);
  const presetCount = presetMatches ? new Set(presetMatches).size > 1 ? (html.match(/applyPreset|onclick.*preset/g) || []).length : 0 : 0;
  if (presetCount < 3 && (html.match(/preset/gi) || []).length < 3) {
    warnings.push('[pedagogy] Preset count: fewer than 3 preset experiment buttons detected');
  }

  const speedMatches = html.match(/0\.25x|0\.5x|1x|2x|3x/g);
  if (!speedMatches || speedMatches.length < 3) {
    warnings.push('[pedagogy] Speed control: fewer than 3 speed options (0.25x/0.5x/1x/2x/3x) detected');
  }

  const hasDashboard = /overlay-stats|stat-row|data-row|data-label|tabular-nums|SIMULATION DATA/i.test(html);
  if (!hasDashboard) {
    warnings.push('[pedagogy] Data dashboard: no real-time statistics overlay detected');
  }

  // Rough teaching text length check: extract text between left panel tags
  const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const educationalKeywords = textContent.match(/\b(because|therefore|this means|for example|in real life|counterintuitive|important|conservation|principle)\b/gi);
  if (!educationalKeywords || educationalKeywords.length < 5) {
    warnings.push('[pedagogy] Teaching text: educational content appears thin (fewer than 5 explanatory phrases detected)');
  }

  // === onclick + try-catch scope bug detection ===
  // If HTML uses onclick="fn()" AND all JS is inside try{}, functions declared
  // with const/let are block-scoped and invisible to onclick handlers.
  // Safe patterns: addEventListener (no onclick needed) or window.fn = fn
  const hasOnclick = /\bonclick\s*=\s*["']/.test(html);
  if (hasOnclick && hasTryCatch) {
    const hasWindowExpose = /window\.\w+\s*=/.test(html);
    if (!hasWindowExpose) {
      warnings.push(
        '[scope] HTML uses onclick="" with try-catch wrapper but no window.fn exposure — ' +
        'block-scoped functions are invisible to onclick. Use addEventListener or add window.fn = fn'
      );
    }
  }

  // === Discipline-specific checks ===
  if (discipline) {
    const config = getDisciplineConfig(discipline);
    for (const rule of config.qualityRules) {
      const result = rule.check(html);
      if (!result.passed) {
        if (rule.severity === 'error') {
          issues.push(`[${discipline}] ${rule.description}: ${result.message}`);
        } else {
          warnings.push(`[${discipline}] ${rule.description}: ${result.message}`);
        }
      }
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    warnings,
  };
}
