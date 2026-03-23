import { describe, it, expect } from 'vitest';
import { getSystemPrompt, buildUserPrompt } from '@/shared/lib/upg/system-prompt';

describe('getSystemPrompt', () => {
  it('returns base prompt without discipline-specific content when no discipline', () => {
    const prompt = getSystemPrompt();
    expect(prompt).toContain('AetherViz');
    expect(prompt).toContain('Three.js');
    expect(prompt).toContain('OrbitControls');
    expect(prompt).not.toContain('Physics-Specific');
  });

  it('includes discipline-specific content when discipline is provided', () => {
    const prompt = getSystemPrompt('physics');
    expect(prompt).toContain('AetherViz');
    expect(prompt).toContain('Physics-Specific');
    expect(prompt).toContain('Analytical Solution');
  });

  it('falls back to physics for unknown discipline (via getDisciplineConfig)', () => {
    const prompt = getSystemPrompt('alchemy');
    expect(prompt).toContain('Physics-Specific');
  });
});

describe('buildUserPrompt', () => {
  it('generates Chinese language instruction for zh', () => {
    const prompt = buildUserPrompt('Simple Pendulum', 'zh');
    expect(prompt).toContain('Simple Pendulum');
    expect(prompt).toContain('必须使用中文');
  });

  it('generates English language instruction for en', () => {
    const prompt = buildUserPrompt('Projectile Motion', 'en');
    expect(prompt).toContain('Projectile Motion');
    expect(prompt).toContain('must be in English');
  });

  it('includes discipline context when discipline is provided', () => {
    const prompt = buildUserPrompt('Wave', 'en', 'physics');
    expect(prompt).toContain('Physics visualization');
  });
});
