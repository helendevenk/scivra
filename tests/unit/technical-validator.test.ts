import { describe, it, expect } from 'vitest';
import { runTechnicalValidation } from '@/shared/lib/upg/validation/technical-validator';

/**
 * Helper: builds a minimal HTML string that passes ALL technical checks.
 * Each test removes or corrupts one feature to verify its weight.
 */
function buildFullHtml(): string {
  return `
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css">
</head>
<body>
  <div id="quiz">
    <p class="question">What is Newton's first law?</p>
    <p class="answer">Inertia</p>
  </div>
  <input type="range" min="0" max="100" />
  <script>
    try {
      const renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);

      const light = new THREE.AmbientLight(0xffffff);
      scene.add(light);

      const controls = new OrbitControls(camera, renderer.domElement);

      renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
      });

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    } catch(e) { console.error(e); }

    katex.render("\\frac{1}{2}mv^2", document.getElementById("formula"));
  </script>
</body>
</html>`;
}

describe('runTechnicalValidation', () => {
  it('scores 100 for full valid HTML', () => {
    const result = runTechnicalValidation(buildFullHtml());
    expect(result.score).toBe(100);
    expect(result.details.every((d) => d.passed)).toBe(true);
  });

  it('loses 15 weight when animation loop is missing', () => {
    const html = buildFullHtml()
      .replace('setAnimationLoop', 'startLoop')
      .replace('requestAnimationFrame', 'startFrame');
    const result = runTechnicalValidation(html);
    // Total weight = 100, earned = 85 → 85%
    expect(result.score).toBe(85);
    const rule = result.details.find((d) => d.ruleId === 'tv-animation-loop');
    expect(rule?.passed).toBe(false);
  });

  it('loses 10 weight when resize handler is missing', () => {
    const html = buildFullHtml().replace(/window.*resize|addEventListener.*resize/g, 'noop');
    const result = runTechnicalValidation(html);
    expect(result.score).toBe(90);
    const rule = result.details.find((d) => d.ruleId === 'tv-resize-handler');
    expect(rule?.passed).toBe(false);
  });

  it('loses 10 weight when error handling is missing', () => {
    const html = buildFullHtml().replace('try {', 'doStuff(');
    const result = runTechnicalValidation(html);
    expect(result.score).toBe(90);
    const rule = result.details.find((d) => d.ruleId === 'tv-error-handling');
    expect(rule?.passed).toBe(false);
  });

  it('loses 10 weight when lighting is missing', () => {
    const html = buildFullHtml().replace('AmbientLight', 'GenericLight');
    const result = runTechnicalValidation(html);
    expect(result.score).toBe(90);
    const rule = result.details.find((d) => d.ruleId === 'tv-lighting');
    expect(rule?.passed).toBe(false);
  });

  it('fails tv-orbit-controls when OrbitControls is self-implemented', () => {
    const html = buildFullHtml().replace(
      'const controls = new OrbitControls',
      'class OrbitControls { constructor() {} } const controls = new OrbitControls'
    );
    const result = runTechnicalValidation(html);
    const rule = result.details.find((d) => d.ruleId === 'tv-orbit-controls');
    expect(rule?.passed).toBe(false);
    expect(result.score).toBe(85);
  });

  it('loses 10 weight when sliders are missing', () => {
    const html = buildFullHtml().replace(/<input[^>]+type="range"[^>]*\/?>/, '');
    const result = runTechnicalValidation(html);
    expect(result.score).toBe(90);
    const rule = result.details.find((d) => d.ruleId === 'tv-sliders');
    expect(rule?.passed).toBe(false);
  });

  it('loses 10 weight when KaTeX is missing', () => {
    const html = buildFullHtml()
      .replace(/katex/gi, 'mathlib')
      .replace(/\\frac/g, 'fraction')
      .replace(/\\vec/g, 'vector');
    const result = runTechnicalValidation(html);
    expect(result.score).toBe(90);
    const rule = result.details.find((d) => d.ruleId === 'tv-katex');
    expect(rule?.passed).toBe(false);
  });

  it('loses 5 weight when quiz is missing', () => {
    const html = buildFullHtml()
      .replace(/quiz/gi, 'widget')
      .replace(/question/gi, 'prompt-item')
      .replace(/answer/gi, 'response-item');
    const result = runTechnicalValidation(html);
    expect(result.score).toBe(95);
    const rule = result.details.find((d) => d.ruleId === 'tv-quiz');
    expect(rule?.passed).toBe(false);
  });

  it('loses 5 weight when pixel ratio is missing', () => {
    const html = buildFullHtml().replace('setPixelRatio', 'setDensity');
    const result = runTechnicalValidation(html);
    expect(result.score).toBe(95);
    const rule = result.details.find((d) => d.ruleId === 'tv-pixel-ratio');
    expect(rule?.passed).toBe(false);
  });

  it('loses 10 weight when blacklisted code (eval) is present', () => {
    const html = buildFullHtml() + '\neval("malicious()");';
    const result = runTechnicalValidation(html);
    expect(result.score).toBe(90);
    const rule = result.details.find((d) => d.ruleId === 'tv-no-blacklist');
    expect(rule?.passed).toBe(false);
  });

  it('returns details array with correct structure for each rule', () => {
    const result = runTechnicalValidation(buildFullHtml());
    expect(result.details).toHaveLength(10);
    for (const detail of result.details) {
      expect(detail).toHaveProperty('ruleId');
      expect(detail).toHaveProperty('ruleName');
      expect(detail).toHaveProperty('score');
      expect(detail).toHaveProperty('passed');
      expect(detail).toHaveProperty('message');
      expect(typeof detail.ruleId).toBe('string');
      expect(typeof detail.score).toBe('number');
      expect([0, 100]).toContain(detail.score);
    }
  });
});
