import { describe, it, expect } from 'vitest';
import { checkQuality } from '@/shared/lib/upg/quality-checker';

/**
 * Minimal valid HTML that passes all quality checks.
 * Contains: Three.js CDN, OrbitControls CDN, KaTeX, slider, Scene, Renderer,
 * animation loop, resize handler, pixel ratio, try-catch, DOMContentLoaded,
 * lighting, const/let, and enough size (>5KB via padding).
 */
function makeValidHtml(overrides: Partial<Record<string, string>> = {}): string {
  const parts = {
    threeCdn: '<script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"></script>',
    orbitCdn: '<script src="https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/controls/OrbitControls.js"></script>',
    katex: '\\frac{1}{2}mv^2',
    slider: '<input type="range" min="0" max="100">',
    scene: 'const scene = new THREE.Scene();',
    renderer: 'const renderer = new THREE.WebGLRenderer();',
    animLoop: 'renderer.setAnimationLoop(animate);',
    resize: "window.addEventListener('resize', onResize);",
    pixelRatio: 'renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));',
    tryCatch: 'try { init(); } catch (e) { console.error(e); }',
    domReady: "document.addEventListener('DOMContentLoaded', init);",
    lighting: 'const light = new THREE.DirectionalLight(0xffffff);',
    orbitUsage: 'const controls = new THREE.OrbitControls(camera, renderer.domElement);',
    ...overrides,
  };

  const html = `<!DOCTYPE html><html><head>
${parts.threeCdn}
${parts.orbitCdn}
</head><body>
${parts.slider}
<div>${parts.katex}</div>
<script>
${parts.domReady}
${parts.tryCatch}
${parts.scene}
${parts.renderer}
${parts.animLoop}
${parts.resize}
${parts.pixelRatio}
${parts.lighting}
${parts.orbitUsage}
</script>
</body></html>`;

  // Pad to > 5KB with an HTML comment
  const currentSize = new TextEncoder().encode(html).length;
  if (currentSize < 5 * 1024) {
    const padding = '<!-- ' + 'x'.repeat(5 * 1024 - currentSize + 100) + ' -->';
    return html.replace('</body>', padding + '</body>');
  }
  return html;
}

describe('checkQuality', () => {
  // --- PASS CASE ---
  it('passes for valid HTML with all required elements', () => {
    const result = checkQuality(makeValidHtml());
    expect(result.passed).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  // --- THREE.JS CDN ---
  it('fails when Three.js library is completely absent (no CDN, no THREE reference)', () => {
    // Remove CDN AND all THREE references to trigger "Missing Three.js library"
    const result = checkQuality(makeValidHtml({
      threeCdn: '',
      scene: '',
      renderer: '',
      lighting: '',
      orbitUsage: '',
      orbitCdn: '',
      pixelRatio: '',
    }));
    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining('Missing Three.js library')])
    );
  });

  it('warns when THREE is referenced but not loaded from CDN', () => {
    const result = checkQuality(makeValidHtml({ threeCdn: '' }));
    expect(result.warnings).toEqual(
      expect.arrayContaining([expect.stringContaining('not loaded from CDN')])
    );
  });

  // --- ORBIT CONTROLS ---
  it('fails when OrbitControls script is missing', () => {
    const result = checkQuality(makeValidHtml({ orbitCdn: '', orbitUsage: '' }));
    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining('OrbitControls script tag')])
    );
  });

  it('warns when OrbitControls is loaded but never instantiated', () => {
    const result = checkQuality(makeValidHtml({ orbitUsage: '' }));
    expect(result.warnings).toEqual(
      expect.arrayContaining([expect.stringContaining('OrbitControls loaded but never instantiated')])
    );
  });

  // --- SELF-IMPLEMENTED CONTROLS ---
  it('fails when self-implemented camera controls detected (class)', () => {
    const result = checkQuality(makeValidHtml({ orbitUsage: 'class OrbitControls { constructor() {} }' }));
    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining('Self-implemented camera controls')])
    );
  });

  // --- KATEX ---
  it('fails when KaTeX / math formulas missing', () => {
    const result = checkQuality(makeValidHtml({ katex: '' }));
    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining('KaTeX')])
    );
  });

  // --- SLIDER ---
  it('fails when interactive slider is missing', () => {
    const result = checkQuality(makeValidHtml({ slider: '' }));
    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining('slider')])
    );
  });

  // --- SIZE BOUNDS ---
  it('fails when HTML is too small (< 5KB)', () => {
    const tiny = '<html><body>hi</body></html>';
    const result = checkQuality(tiny);
    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining('too small')])
    );
  });

  it('fails when HTML exceeds max size', () => {
    const huge = makeValidHtml() + 'x'.repeat(200 * 1024 + 1);
    const result = checkQuality(huge);
    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining('too large')])
    );
  });

  // --- BLACKLIST ---
  it('fails when eval() is present', () => {
    const result = checkQuality(makeValidHtml({ scene: 'eval("code"); const scene = new THREE.Scene();' }));
    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining('blacklisted')])
    );
  });

  it('fails when localStorage is present', () => {
    const result = checkQuality(makeValidHtml({ scene: 'localStorage.getItem("x"); const scene = new THREE.Scene();' }));
    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining('blacklisted')])
    );
  });

  // --- THREE.JS INIT ---
  it('fails when THREE.Scene init is missing', () => {
    const result = checkQuality(makeValidHtml({ scene: '' }));
    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining('THREE.Scene')])
    );
  });

  it('fails when WebGLRenderer is missing', () => {
    const result = checkQuality(makeValidHtml({ renderer: '', animLoop: 'requestAnimationFrame(animate);', pixelRatio: 'renderer.setPixelRatio(1);' }));
    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining('WebGLRenderer')])
    );
  });

  it('fails when animation loop is missing', () => {
    const result = checkQuality(makeValidHtml({ animLoop: '' }));
    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining('animation loop')])
    );
  });

  it('fails when resize handler is missing', () => {
    const result = checkQuality(makeValidHtml({ resize: '' }));
    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining('resize')])
    );
  });

  // --- WARNINGS ---
  it('warns when try-catch wrapper is missing', () => {
    const result = checkQuality(makeValidHtml({ tryCatch: '' }));
    expect(result.warnings).toEqual(
      expect.arrayContaining([expect.stringContaining('try-catch')])
    );
  });

  // --- DISCIPLINE-SPECIFIC ---
  it('applies discipline-specific quality rules when discipline is provided', () => {
    // Physics has a warning rule checking for SI units
    const htmlNoUnits = makeValidHtml();
    const result = checkQuality(htmlNoUnits, 'physics');
    // The valid HTML doesn't contain SI unit patterns like "m/s", so should get a warning
    const hasPhysicsWarning = result.warnings.some(w => w.includes('[physics]'));
    expect(hasPhysicsWarning).toBe(true);
  });
});
