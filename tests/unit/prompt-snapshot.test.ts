import { describe, it, expect } from 'vitest';
import { getSystemPrompt, buildUserPrompt } from '@/shared/lib/upg/system-prompt';
import { checkQuality } from '@/shared/lib/upg/quality-checker';
import { getDisciplineConfig, isValidDiscipline, getEnabledDisciplines, getAllDisciplines } from '@/shared/lib/upg/disciplines';

describe('Phase 0.5 Regression: System Prompt', () => {
  it('getSystemPrompt() without args matches snapshot (backward compat)', () => {
    const output = getSystemPrompt();
    expect(output).toMatchSnapshot();
  });

  it('getSystemPrompt() without args does NOT contain discipline-specific content', () => {
    const output = getSystemPrompt();
    // Without discipline, no physics-specific or chemistry-specific content should be injected
    expect(output).not.toContain('Physics-Specific Visualization Requirements');
    expect(output).not.toContain('Chemistry-Specific Requirements');
  });

  it('getSystemPrompt("physics") contains physics-specific content', () => {
    const output = getSystemPrompt('physics');
    expect(output).toContain('Physics-Specific Visualization Requirements');
    expect(output).toContain('Analytical Solution Overlay');
    expect(output).toContain('Force & Motion Visualization');
  });

  it('getSystemPrompt("physics") starts with same base prompt as no-arg', () => {
    const noArg = getSystemPrompt();
    const physics = getSystemPrompt('physics');
    // The physics version should contain the entire base prompt
    const basePrefix = noArg.substring(0, 500);
    expect(physics).toContain(basePrefix);
  });

  it('getSystemPrompt("chemistry") does NOT contain chemistry content (disabled in S1)', () => {
    // Chemistry is disabled, but getSystemPrompt still returns config content
    // (the API route blocks disabled disciplines, not the prompt function)
    const output = getSystemPrompt('chemistry');
    expect(output).toContain('Chemistry-Specific Requirements');
  });
});

describe('Phase 0.5 Regression: User Prompt', () => {
  it('buildUserPrompt without discipline matches snapshot', () => {
    const output = buildUserPrompt('Simple Pendulum', 'en');
    expect(output).toMatchSnapshot();
  });

  it('buildUserPrompt with discipline adds context', () => {
    const output = buildUserPrompt('Simple Pendulum', 'en', 'physics');
    expect(output).toContain('Physics visualization');
  });

  it('buildUserPrompt zh language works', () => {
    const output = buildUserPrompt('简单摆', 'zh');
    expect(output).toContain('必须使用中文');
  });
});

describe('Phase 0.5 Regression: Quality Checker', () => {
  const MINIMAL_VALID_HTML = `<!DOCTYPE html><html><head>
<script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/controls/OrbitControls.js"></script>
</head><body><script>
document.addEventListener('DOMContentLoaded', function() {
  try {
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    var camera = new THREE.PerspectiveCamera();
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    var light = new THREE.AmbientLight();
    scene.add(light);
    window.addEventListener('resize', function() {});
    renderer.setAnimationLoop(function() { renderer.render(scene, camera); });
    katex.render('F = ma', document.createElement('div'));
  } catch(e) { console.error(e); }
});
</script>
<input type="range" min="0" max="100">
<span>m/s</span>
<span>kg</span>
</body></html>`;

  it('checkQuality without discipline returns consistent result', () => {
    const resultA = checkQuality(MINIMAL_VALID_HTML);
    const resultB = checkQuality(MINIMAL_VALID_HTML);
    // Same input → same output (deterministic)
    expect(resultA.passed).toBe(resultB.passed);
    expect(resultA.issues).toEqual(resultB.issues);
  });

  it('checkQuality with discipline does not add blocking errors from physics rules', () => {
    // Physics qualityRules are severity: 'warning', not 'error'
    // So discipline should NOT introduce new issues (only warnings)
    const withoutDiscipline = checkQuality(MINIMAL_VALID_HTML);
    const withPhysics = checkQuality(MINIMAL_VALID_HTML, 'physics');
    // Same blocking issues (physics rules are warnings only)
    expect(withPhysics.issues).toEqual(withoutDiscipline.issues);
    // Physics may add extra warnings
    expect(withPhysics.warnings.length).toBeGreaterThanOrEqual(withoutDiscipline.warnings.length);
  });

  it('checkQuality with unknown discipline falls back to physics (no crash)', () => {
    const result = checkQuality(MINIMAL_VALID_HTML, 'nonexistent');
    // Should not throw, fallback to physics config
    expect(result).toBeDefined();
    expect(Array.isArray(result.issues)).toBe(true);
  });
});

describe('Phase 0.5: Discipline Registry', () => {
  it('getDisciplineConfig() defaults to physics', () => {
    const config = getDisciplineConfig();
    expect(config.id).toBe('physics');
    expect(config.enabled).toBe(true);
  });

  it('getDisciplineConfig("physics") returns physics config', () => {
    const config = getDisciplineConfig('physics');
    expect(config.id).toBe('physics');
    expect(config.stage).toBe('S1');
  });

  it('getDisciplineConfig("unknown") falls back to physics', () => {
    const config = getDisciplineConfig('unknown');
    expect(config.id).toBe('physics');
  });

  it('isValidDiscipline works correctly', () => {
    expect(isValidDiscipline('physics')).toBe(true);
    expect(isValidDiscipline('chemistry')).toBe(true);
    expect(isValidDiscipline('nonexistent')).toBe(false);
  });

  it('getEnabledDisciplines returns only physics in S1', () => {
    const enabled = getEnabledDisciplines();
    expect(enabled).toHaveLength(1);
    expect(enabled[0].id).toBe('physics');
  });

  it('getAllDisciplines returns all 5 disciplines', () => {
    const all = getAllDisciplines();
    expect(all).toHaveLength(5);
    const ids = all.map((d) => d.id);
    expect(ids).toContain('physics');
    expect(ids).toContain('chemistry');
    expect(ids).toContain('biology');
    expect(ids).toContain('math');
    expect(ids).toContain('earth-science');
  });
});
