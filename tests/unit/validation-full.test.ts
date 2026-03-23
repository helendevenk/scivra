import { describe, it, expect } from 'vitest';
import { runFullValidation } from '@/shared/lib/upg/validation';
import type { FullValidationResult } from '@/shared/lib/upg/validation';

/** Minimal HTML that passes most technical checks */
function buildGoodHtml(): string {
  return `
<html><body>
<input type="range" min="0" max="10" />
<div class="quiz"><p class="question">Q</p><p class="answer">A</p></div>
<script>
try {
  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  const light = new THREE.AmbientLight(0xffffff);
  const controls = new OrbitControls(camera, renderer.domElement);
  renderer.setAnimationLoop(() => renderer.render(scene, camera));
  window.addEventListener('resize', () => {});

  const g = 9.8;
  let total = kinetic + potential;
  if (isNaN(x)) x = 0;
  dt = Math.min(dt, 0.016);
  // numerical vs analytical comparison
  // velocity: 5 m/s, mass: 2 kg, force: 10 N, energy: 25 J, frequency: 60 Hz
} catch(e) {}
katex.render("\\frac{1}{2}", el);
</script>
</body></html>`;
}

describe('runFullValidation', () => {
  it('returns FullValidationResult structure', () => {
    const result = runFullValidation(buildGoodHtml(), 'physics');
    expect(result).toHaveProperty('technicalScore');
    expect(result).toHaveProperty('disciplineScore');
    expect(result).toHaveProperty('overallScore');
    expect(result).toHaveProperty('verified');
    expect(result).toHaveProperty('details');
    expect(typeof result.technicalScore).toBe('number');
    expect(typeof result.disciplineScore).toBe('number');
    expect(typeof result.overallScore).toBe('number');
    expect(typeof result.verified).toBe('boolean');
    expect(Array.isArray(result.details)).toBe(true);
  });

  it('computes overall score as tech * 0.6 + disc * 0.4', () => {
    const result = runFullValidation(buildGoodHtml(), 'physics');
    const expected = Math.round(result.technicalScore * 0.6 + result.disciplineScore * 0.4);
    expect(result.overallScore).toBe(expected);
  });

  it('verified=true when overallScore >= threshold (60)', () => {
    const result = runFullValidation(buildGoodHtml(), 'physics');
    // Good HTML should score well above 60
    expect(result.overallScore).toBeGreaterThanOrEqual(60);
    expect(result.verified).toBe(true);
  });

  it('verified=false when overallScore < threshold', () => {
    // Minimal HTML that fails most checks
    const html = '<html><body><p>empty</p></body></html>';
    const result = runFullValidation(html, 'physics');
    // Only tv-no-blacklist (10 weight) passes → tech ~10, disc low → overall < 60
    expect(result.overallScore).toBeLessThan(60);
    expect(result.verified).toBe(false);
  });

  it('falls back to physics for unknown discipline', () => {
    const resultUnknown = runFullValidation(buildGoodHtml(), 'alchemy');
    const resultPhysics = runFullValidation(buildGoodHtml(), 'physics');
    // Same discipline rules → same scores
    expect(resultUnknown.disciplineScore).toBe(resultPhysics.disciplineScore);
    expect(resultUnknown.overallScore).toBe(resultPhysics.overallScore);
  });

  it('details array contains both tech and discipline results', () => {
    const result = runFullValidation(buildGoodHtml(), 'physics');
    // 10 technical rules + 5 physics validation rules = 15 total
    expect(result.details.length).toBe(15);
    // Check technical rules are present
    const techIds = result.details.filter((d) => d.ruleId.startsWith('tv-'));
    expect(techIds.length).toBe(10);
    // Check physics rules are present
    const physIds = result.details.filter((d) => d.ruleId.startsWith('pv-'));
    expect(physIds.length).toBe(5);
  });
});
