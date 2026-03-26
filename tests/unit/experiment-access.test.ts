import { describe, it, expect } from 'vitest';
import {
  canAccessExperiment,
  canAccessTier,
  subscriptionToTier,
  FREE_EXPERIMENT_IDS,
} from '@/shared/lib/experiments/access';
import {
  getAllExperiments,
  getExperiment,
  getExperimentsByCategory,
  getExperimentsByTier,
  getExperimentsByWave,
} from '@/shared/lib/experiments/registry';

// ─── Existing: canAccessExperiment ───────────────────────────────

describe('canAccessExperiment', () => {
  it('should grant access to free experiments for free tier', () => {
    for (const id of FREE_EXPERIMENT_IDS) {
      expect(canAccessExperiment(id, 'free')).toBe(true);
    }
  });

  it('should grant access to free experiments for pro tier', () => {
    for (const id of FREE_EXPERIMENT_IDS) {
      expect(canAccessExperiment(id, 'pro')).toBe(true);
    }
  });

  it('should grant access to free experiments for max tier', () => {
    for (const id of FREE_EXPERIMENT_IDS) {
      expect(canAccessExperiment(id, 'max')).toBe(true);
    }
  });

  it('should deny non-free experiments for free tier', () => {
    expect(canAccessExperiment('em-spectrum', 'free')).toBe(false);
  });

  it('should grant non-free experiments for pro tier', () => {
    expect(canAccessExperiment('em-spectrum', 'pro')).toBe(true);
  });

  it('should grant non-free experiments for max tier', () => {
    expect(canAccessExperiment('em-spectrum', 'max')).toBe(true);
  });

  it('should deny unknown experiment for free tier', () => {
    expect(canAccessExperiment('nonexistent-experiment', 'free')).toBe(false);
  });
});

// ─── Existing: canAccessTier ─────────────────────────────────────

describe('canAccessTier', () => {
  it('should allow free to access free', () => {
    expect(canAccessTier('free', 'free')).toBe(true);
  });

  it('should deny free from accessing pro', () => {
    expect(canAccessTier('free', 'pro')).toBe(false);
  });

  it('should deny free from accessing max', () => {
    expect(canAccessTier('free', 'max')).toBe(false);
  });

  it('should allow pro to access free', () => {
    expect(canAccessTier('pro', 'free')).toBe(true);
  });

  it('should allow pro to access pro', () => {
    expect(canAccessTier('pro', 'pro')).toBe(true);
  });

  it('should deny pro from accessing max', () => {
    expect(canAccessTier('pro', 'max')).toBe(false);
  });

  it('should allow max to access all tiers', () => {
    expect(canAccessTier('max', 'free')).toBe(true);
    expect(canAccessTier('max', 'pro')).toBe(true);
    expect(canAccessTier('max', 'max')).toBe(true);
  });
});

// ─── Existing: subscriptionToTier ────────────────────────────────

describe('subscriptionToTier', () => {
  it('should return free for null', () => {
    expect(subscriptionToTier(null)).toBe('free');
  });

  it('should return free for empty string', () => {
    expect(subscriptionToTier('')).toBe('free');
  });

  it('should return pro for "pro" plan', () => {
    expect(subscriptionToTier('pro')).toBe('pro');
  });

  it('should return pro for "Pro Monthly" plan', () => {
    expect(subscriptionToTier('Pro Monthly')).toBe('pro');
  });

  it('should return pro for "premium" plan', () => {
    expect(subscriptionToTier('premium')).toBe('pro');
  });

  it('should return max for "max" plan', () => {
    expect(subscriptionToTier('max')).toBe('max');
  });

  it('should return max for "Max Annual" plan', () => {
    expect(subscriptionToTier('Max Annual')).toBe('max');
  });

  it('should return max for "enterprise" plan', () => {
    expect(subscriptionToTier('enterprise')).toBe('max');
  });

  it('should return free for unknown plan name', () => {
    expect(subscriptionToTier('basic')).toBe('free');
  });
});

// ─── NEW (TDD RED): getExperimentsBySubject ──────────────────────
// These tests import a function that doesn't exist yet → will FAIL

describe('getExperimentsBySubject', () => {
  // Dynamic import to avoid compile-time failure on the whole file
  let getExperimentsBySubject: typeof import('@/shared/lib/experiments/registry').getExperimentsBySubject;

  it('should be exported from registry', async () => {
    const mod = await import('@/shared/lib/experiments/registry');
    expect(mod).toHaveProperty('getExperimentsBySubject');
    getExperimentsBySubject = (mod as Record<string, unknown>).getExperimentsBySubject as typeof getExperimentsBySubject;
  });

  it('should return only physics experiments for "physics"', async () => {
    const mod = await import('@/shared/lib/experiments/registry') as Record<string, unknown>;
    const fn = mod.getExperimentsBySubject as (s: string) => Array<{ subject?: string }>;
    const results = fn('physics');
    expect(results.length).toBeGreaterThan(0);
    for (const exp of results) {
      expect(exp.subject).toBe('physics');
    }
  });

  it('should return only biology experiments for "biology"', async () => {
    const mod = await import('@/shared/lib/experiments/registry') as Record<string, unknown>;
    const fn = mod.getExperimentsBySubject as (s: string) => Array<{ subject?: string }>;
    const results = fn('biology');
    expect(results.length).toBeGreaterThan(0);
    for (const exp of results) {
      expect(exp.subject).toBe('biology');
    }
  });

  it('should return empty array for unknown subject', async () => {
    const mod = await import('@/shared/lib/experiments/registry') as Record<string, unknown>;
    const fn = mod.getExperimentsBySubject as (s: string) => unknown[];
    const results = fn('nonexistent-subject');
    expect(results).toEqual([]);
  });
});

// ─── NEW (TDD RED): getExperimentsByGradeLevel ──────────────────

describe('getExperimentsByGradeLevel', () => {
  it('should be exported from registry', async () => {
    const mod = await import('@/shared/lib/experiments/registry');
    expect(mod).toHaveProperty('getExperimentsByGradeLevel');
  });

  it('should return only K-2 experiments for "K-2"', async () => {
    const mod = await import('@/shared/lib/experiments/registry') as Record<string, unknown>;
    const fn = mod.getExperimentsByGradeLevel as (g: string) => Array<{ gradeLevel?: string }>;
    const results = fn('K-2');
    expect(results.length).toBeGreaterThan(0);
    for (const exp of results) {
      expect(exp.gradeLevel).toBe('K-2');
    }
  });

  it('should return only 9-12 experiments for "9-12"', async () => {
    const mod = await import('@/shared/lib/experiments/registry') as Record<string, unknown>;
    const fn = mod.getExperimentsByGradeLevel as (g: string) => Array<{ gradeLevel?: string }>;
    const results = fn('9-12');
    expect(results.length).toBeGreaterThan(0);
    for (const exp of results) {
      expect(exp.gradeLevel).toBe('9-12');
    }
  });

  it('should return AP experiments for "AP"', async () => {
    const mod = await import('@/shared/lib/experiments/registry') as Record<string, unknown>;
    const fn = mod.getExperimentsByGradeLevel as (g: string) => Array<{ gradeLevel?: string }>;
    const results = fn('AP');
    expect(results.length).toBeGreaterThan(0);
    for (const exp of results) {
      expect(exp.gradeLevel).toBe('AP');
    }
  });
});

// ─── NEW (TDD RED): getAccessibleExperiments ────────────────────

describe('getAccessibleExperiments', () => {
  it('should be exported from access module', async () => {
    const mod = await import('@/shared/lib/experiments/access');
    expect(mod).toHaveProperty('getAccessibleExperiments');
  });

  it('should return only free experiments for free tier with no filters', async () => {
    const mod = await import('@/shared/lib/experiments/access') as Record<string, unknown>;
    const fn = mod.getAccessibleExperiments as (tier: string) => Array<{ id: string }>;
    const results = fn('free');
    expect(results.length).toBe(FREE_EXPERIMENT_IDS.size);
    for (const exp of results) {
      expect(FREE_EXPERIMENT_IDS.has(exp.id)).toBe(true);
    }
  });

  it('should return all experiments for pro tier with no filters', async () => {
    const allExps = getAllExperiments();
    const mod = await import('@/shared/lib/experiments/access') as Record<string, unknown>;
    const fn = mod.getAccessibleExperiments as (tier: string) => unknown[];
    const results = fn('pro');
    expect(results.length).toBe(allExps.length);
  });

  it('should filter by subject for pro tier', async () => {
    const mod = await import('@/shared/lib/experiments/access') as Record<string, unknown>;
    const fn = mod.getAccessibleExperiments as (tier: string, filters?: { subject?: string }) => Array<{ subject?: string }>;
    const results = fn('pro', { subject: 'biology' });
    expect(results.length).toBeGreaterThan(0);
    for (const exp of results) {
      expect(exp.subject).toBe('biology');
    }
  });

  it('should filter by gradeLevel for pro tier', async () => {
    const mod = await import('@/shared/lib/experiments/access') as Record<string, unknown>;
    const fn = mod.getAccessibleExperiments as (tier: string, filters?: { gradeLevel?: string }) => Array<{ gradeLevel?: string }>;
    const results = fn('pro', { gradeLevel: '6-8' });
    expect(results.length).toBeGreaterThan(0);
    for (const exp of results) {
      expect(exp.gradeLevel).toBe('6-8');
    }
  });

  it('should combine access + subject + gradeLevel filters', async () => {
    const mod = await import('@/shared/lib/experiments/access') as Record<string, unknown>;
    const fn = mod.getAccessibleExperiments as (tier: string, filters?: { subject?: string; gradeLevel?: string }) => Array<{ subject?: string; gradeLevel?: string }>;
    const results = fn('free', { subject: 'physics', gradeLevel: '9-12' });
    for (const exp of results) {
      expect(exp.subject).toBe('physics');
      expect(exp.gradeLevel).toBe('9-12');
      // Free tier: must be in FREE_EXPERIMENT_IDS
    }
  });
});
