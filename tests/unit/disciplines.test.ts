import { describe, it, expect } from 'vitest';
import {
  getDisciplineConfig,
  getEnabledDisciplines,
  getAllDisciplines,
  isValidDiscipline,
} from '@/shared/lib/upg/disciplines';

describe('getDisciplineConfig', () => {
  it('returns physics config when no id is provided', () => {
    const config = getDisciplineConfig();
    expect(config.id).toBe('physics');
  });

  it('returns physics config for undefined', () => {
    const config = getDisciplineConfig(undefined);
    expect(config.id).toBe('physics');
  });

  it('returns correct config for a valid discipline id', () => {
    const config = getDisciplineConfig('chemistry');
    expect(config.id).toBe('chemistry');
    expect(config.name.en).toBe('Chemistry');
  });

  it('falls back to physics for unknown discipline id', () => {
    const config = getDisciplineConfig('alchemy');
    expect(config.id).toBe('physics');
  });
});

describe('getEnabledDisciplines', () => {
  it('returns only enabled disciplines', () => {
    const enabled = getEnabledDisciplines();
    expect(enabled.length).toBeGreaterThanOrEqual(1);
    expect(enabled.every(d => d.enabled)).toBe(true);
  });

  it('includes physics (the only S1 enabled discipline)', () => {
    const enabled = getEnabledDisciplines();
    expect(enabled.some(d => d.id === 'physics')).toBe(true);
  });
});

describe('getAllDisciplines', () => {
  it('returns all 5 registered disciplines', () => {
    const all = getAllDisciplines();
    expect(all).toHaveLength(5);
    const ids = all.map(d => d.id);
    expect(ids).toEqual(expect.arrayContaining(['physics', 'chemistry', 'biology', 'math', 'earth-science']));
  });
});

describe('isValidDiscipline', () => {
  it('returns true for valid discipline ids', () => {
    expect(isValidDiscipline('physics')).toBe(true);
    expect(isValidDiscipline('earth-science')).toBe(true);
  });

  it('returns false for invalid discipline ids', () => {
    expect(isValidDiscipline('alchemy')).toBe(false);
    expect(isValidDiscipline('')).toBe(false);
  });
});
