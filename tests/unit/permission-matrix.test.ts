import { describe, it, expect } from 'vitest';
import {
  canAccessExperiment,
  canAccessTier,
  subscriptionToTier,
  getAccessibleExperiments,
  FREE_EXPERIMENT_IDS,
} from '@/shared/lib/experiments/access';
import {
  getAllExperiments,
  getExperimentsBySubject,
  getExperimentsByGradeLevel,
} from '@/shared/lib/experiments/registry';
import type { Tier, Subject, GradeLevel } from '@/shared/types/experiment';

// ─── Full Permission Matrix ─────────────────────────────────────

describe('Permission Matrix', () => {
  const allExperiments = getAllExperiments();
  const tiers: Tier[] = ['free', 'pro', 'max'];

  describe('tier access counts', () => {
    it('free tier should access exactly FREE_EXPERIMENT_IDS.size experiments', () => {
      const accessible = allExperiments.filter((e) =>
        canAccessExperiment(e.id, 'free')
      );
      expect(accessible.length).toBe(FREE_EXPERIMENT_IDS.size);
      for (const exp of accessible) {
        expect(FREE_EXPERIMENT_IDS.has(exp.id)).toBe(true);
      }
    });

    it('pro tier should access all experiments', () => {
      const accessible = allExperiments.filter((e) =>
        canAccessExperiment(e.id, 'pro')
      );
      expect(accessible.length).toBe(allExperiments.length);
    });

    it('max tier should access all experiments', () => {
      const accessible = allExperiments.filter((e) =>
        canAccessExperiment(e.id, 'max')
      );
      expect(accessible.length).toBe(allExperiments.length);
    });
  });

  describe('FREE_EXPERIMENT_IDS are valid', () => {
    it('all free experiment IDs should exist in registry', () => {
      for (const id of FREE_EXPERIMENT_IDS) {
        const found = allExperiments.find((e) => e.id === id);
        expect(found, `Free experiment "${id}" not found in registry`).toBeDefined();
      }
    });

    it('free experiments should be beginner or intermediate difficulty', () => {
      const allowed = new Set(['beginner', 'intermediate']);
      for (const id of FREE_EXPERIMENT_IDS) {
        const exp = allExperiments.find((e) => e.id === id);
        expect(
          allowed.has(exp?.difficulty ?? ''),
          `Free experiment "${id}" has difficulty "${exp?.difficulty}"`
        ).toBe(true);
      }
    });
  });

  describe('getAccessibleExperiments matches canAccessExperiment', () => {
    for (const tier of tiers) {
      it(`${tier} tier: getAccessibleExperiments matches manual filter`, () => {
        const viaFunction = getAccessibleExperiments(tier);
        const viaManual = allExperiments.filter((e) =>
          canAccessExperiment(e.id, tier)
        );
        expect(viaFunction.length).toBe(viaManual.length);
        const fnIds = new Set(viaFunction.map((e) => e.id));
        for (const exp of viaManual) {
          expect(fnIds.has(exp.id)).toBe(true);
        }
      });
    }
  });

  describe('subject filtering with access', () => {
    const subjects: Subject[] = ['physics', 'chemistry', 'biology', 'earth-science', 'math'];

    for (const subject of subjects) {
      it(`free tier + ${subject}: only free experiments of that subject`, () => {
        const results = getAccessibleExperiments('free', { subject });
        for (const exp of results) {
          expect(exp.subject).toBe(subject);
          expect(FREE_EXPERIMENT_IDS.has(exp.id)).toBe(true);
        }
      });

      it(`pro tier + ${subject}: all experiments of that subject`, () => {
        const results = getAccessibleExperiments('pro', { subject });
        const allOfSubject = getExperimentsBySubject(subject);
        expect(results.length).toBe(allOfSubject.length);
      });
    }
  });

  describe('gradeLevel filtering with access', () => {
    const grades: GradeLevel[] = ['K-2', '3-5', '6-8', '9-12', 'AP'];

    for (const grade of grades) {
      it(`pro tier + ${grade}: all experiments of that grade`, () => {
        const results = getAccessibleExperiments('pro', { gradeLevel: grade });
        const allOfGrade = getExperimentsByGradeLevel(grade);
        expect(results.length).toBe(allOfGrade.length);
      });
    }
  });

  describe('combined subject + gradeLevel filtering', () => {
    it('pro + physics + AP: should match manual filter', () => {
      const results = getAccessibleExperiments('pro', {
        subject: 'physics',
        gradeLevel: 'AP',
      });
      const manual = allExperiments.filter(
        (e) => e.subject === 'physics' && e.gradeLevel === 'AP'
      );
      expect(results.length).toBe(manual.length);
      expect(results.length).toBeGreaterThan(0);
    });

    it('pro + biology + AP: should return AP biology experiments', () => {
      const results = getAccessibleExperiments('pro', {
        subject: 'biology',
        gradeLevel: 'AP',
      });
      expect(results.length).toBeGreaterThan(0);
      for (const exp of results) {
        expect(exp.subject).toBe('biology');
        expect(exp.gradeLevel).toBe('AP');
      }
    });

    it('pro + earth-science + 6-8: should return MS earth experiments', () => {
      const results = getAccessibleExperiments('pro', {
        subject: 'earth-science',
        gradeLevel: '6-8',
      });
      expect(results.length).toBeGreaterThan(0);
      for (const exp of results) {
        expect(exp.subject).toBe('earth-science');
        expect(exp.gradeLevel).toBe('6-8');
      }
    });

    it('free + physics + AP: likely empty (free experiments are 9-12)', () => {
      const results = getAccessibleExperiments('free', {
        subject: 'physics',
        gradeLevel: 'AP',
      });
      // Free experiments (newtons-laws, projectile-motion, simple-harmonic-motion)
      // are gradeLevel 9-12, not AP — so this should be empty
      for (const exp of results) {
        expect(FREE_EXPERIMENT_IDS.has(exp.id)).toBe(true);
        expect(exp.gradeLevel).toBe('AP');
      }
    });
  });

  describe('subscriptionToTier edge cases', () => {
    it('should handle mixed case plan names', () => {
      expect(subscriptionToTier('PRO')).toBe('pro');
      expect(subscriptionToTier('MAX')).toBe('max');
      expect(subscriptionToTier('Premium')).toBe('pro');
      expect(subscriptionToTier('ENTERPRISE')).toBe('max');
    });

    it('should handle plan names with extra words', () => {
      expect(subscriptionToTier('NeonPhysics Pro Monthly')).toBe('pro');
      expect(subscriptionToTier('NeonPhysics Max Annual')).toBe('max');
      expect(subscriptionToTier('Enterprise Unlimited')).toBe('max');
    });
  });

  describe('data integrity', () => {
    it('every experiment should have a subject', () => {
      const missing = allExperiments.filter((e) => !e.subject);
      expect(
        missing.length,
        `${missing.length} experiments missing subject: ${missing.map((e) => e.id).join(', ')}`
      ).toBe(0);
    });

    it('every experiment should have a gradeLevel', () => {
      const missing = allExperiments.filter((e) => !e.gradeLevel);
      expect(
        missing.length,
        `${missing.length} experiments missing gradeLevel: ${missing.map((e) => e.id).join(', ')}`
      ).toBe(0);
    });

    it('subject values should be valid', () => {
      const validSubjects = new Set<string>([
        'physics', 'chemistry', 'biology', 'earth-science', 'math',
      ]);
      for (const exp of allExperiments) {
        if (exp.subject) {
          expect(
            validSubjects.has(exp.subject),
            `Invalid subject "${exp.subject}" in ${exp.id}`
          ).toBe(true);
        }
      }
    });

    it('gradeLevel values should be valid', () => {
      const validGrades = new Set<string>(['K-2', '3-5', '6-8', '9-12', 'AP']);
      for (const exp of allExperiments) {
        if (exp.gradeLevel) {
          expect(
            validGrades.has(exp.gradeLevel),
            `Invalid gradeLevel "${exp.gradeLevel}" in ${exp.id}`
          ).toBe(true);
        }
      }
    });

    it('experiment count should be >= 60', () => {
      expect(allExperiments.length).toBeGreaterThanOrEqual(60);
    });
  });
});
