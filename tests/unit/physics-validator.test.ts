import { describe, it, expect } from 'vitest';
import { physicsValidationRules } from '@/shared/lib/upg/validation/physics-validator';

/** Helper to get a rule by ID and run its validate function */
function validate(ruleId: string, html: string) {
  const rule = physicsValidationRules.find((r) => r.id === ruleId);
  if (!rule) throw new Error(`Rule ${ruleId} not found`);
  return rule.validate(html);
}

describe('pv-energy-conservation', () => {
  it('scores 100 when energy conservation check is present', () => {
    const html = 'let total = kinetic + potential; totalEnergy = KE + PE;';
    const result = validate('pv-energy-conservation', html);
    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
  });

  it('scores 30 when energy variables exist but no conservation check', () => {
    const html = 'const kineticEnergy = 0.5 * m * v * v;';
    const result = validate('pv-energy-conservation', html);
    expect(result.score).toBe(30);
    expect(result.passed).toBe(false);
  });

  it('scores 50 (neutral) when no energy system detected', () => {
    const html = '<div>Simple pendulum visualization</div>';
    const result = validate('pv-energy-conservation', html);
    expect(result.score).toBe(50);
    expect(result.passed).toBe(true);
  });
});

describe('pv-physical-constants', () => {
  it('scores 100 when g=9.8', () => {
    const html = 'const g = 9.8;';
    const result = validate('pv-physical-constants', html);
    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.details).toContain('correct');
  });

  it('scores 80 when g=10 (approximate)', () => {
    const html = 'const g = 10;';
    const result = validate('pv-physical-constants', html);
    expect(result.score).toBe(80);
    expect(result.passed).toBe(true);
    expect(result.details).toContain('approximate');
  });

  it('scores 20 when g=5 (suspicious)', () => {
    const html = 'const g = 5;';
    const result = validate('pv-physical-constants', html);
    expect(result.score).toBe(20);
    expect(result.passed).toBe(false);
    expect(result.details).toContain('suspicious');
  });

  it('scores 70 when no gravity constant detected', () => {
    const html = '<div>No physics constants here</div>';
    const result = validate('pv-physical-constants', html);
    expect(result.score).toBe(70);
    expect(result.passed).toBe(true);
  });
});

describe('pv-analytical-overlay', () => {
  it('scores 100 when numerical-analytical comparison is present', () => {
    const html = 'Compare numerical vs analytical solution overlay';
    const result = validate('pv-analytical-overlay', html);
    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
  });

  it('scores 70 when analytical is mentioned without comparison', () => {
    const html = 'Show the analytical solution for this system';
    const result = validate('pv-analytical-overlay', html);
    expect(result.score).toBe(70);
    expect(result.passed).toBe(true);
  });

  it('scores 40 when no analytical overlay detected', () => {
    const html = '<div>Pure simulation with no reference</div>';
    const result = validate('pv-analytical-overlay', html);
    expect(result.score).toBe(40);
    expect(result.passed).toBe(false);
  });
});

describe('pv-nan-protection', () => {
  it('scores 100 when both isNaN check and dt cap are present', () => {
    const html = 'if (isNaN(x)) x = 0; dt = Math.min(dt, 0.016);';
    const result = validate('pv-nan-protection', html);
    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
  });

  it('scores 50 when only isNaN check is present', () => {
    const html = 'if (isNaN(velocity)) velocity = 0;';
    const result = validate('pv-nan-protection', html);
    expect(result.score).toBe(50);
    expect(result.passed).toBe(true);
  });

  it('scores 30 (minimum) when neither check is present', () => {
    const html = '<div>No numerical safeguards</div>';
    const result = validate('pv-nan-protection', html);
    expect(result.score).toBe(30);
    expect(result.passed).toBe(false);
  });
});

describe('pv-unit-labels', () => {
  it('scores 100 when 5+ SI units are present', () => {
    const html = 'velocity: 5 m/s, mass: 2 kg, force: 10 N, energy: 25 J, frequency: 60 Hz';
    const result = validate('pv-unit-labels', html);
    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
  });

  it('scores 30 (minimum) when 0 SI units are present', () => {
    const html = '<div>No units anywhere</div>';
    const result = validate('pv-unit-labels', html);
    expect(result.score).toBe(30);
    expect(result.passed).toBe(false);
  });
});
