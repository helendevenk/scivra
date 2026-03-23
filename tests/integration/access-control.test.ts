/**
 * Access Control Integration Tests
 *
 * Tests the access control pipeline end-to-end:
 * subscription tier → canAccessTier → experiment filtering → paywall enforcement.
 *
 * The access module (shared/lib/experiments/access.ts) is tested as-is (pure functions).
 * The learning path paywall (checkNodeAccess) is tested with DB mock.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── DB Mock (for learning path paywall) ───────────────────────────

const _store: Record<string, Record<string, unknown>[]> = {
  subscription: [],
  learningPathProgress: [],
};

vi.mock('@/core/db', () => {
  function _chain(op: string, tableName: string) {
    const self: any = {};
    self.values = () => self;
    self.set = () => self;
    self.where = () => self;
    self.orderBy = () => self;
    self.limit = () => self;
    self.offset = () => self;
    self.from = (t: any) => {
      const c = _chain('select', t?._ || 'unknown');
      return c;
    };
    self.onConflictDoNothing = () => self;
    self.onConflictDoUpdate = () => self;
    self.returning = () => Promise.resolve([]);

    self.then = (resolve: any) => {
      const store = (globalThis as any).__accessStore;
      if (!store) return Promise.resolve([]).then(resolve);
      return Promise.resolve(store[tableName] || []).then(resolve);
    };

    return self;
  }

  return {
    db: () => ({
      insert: (t: any) => _chain('insert', t?._ || 'unknown'),
      select: () => ({
        from: (t: any) => _chain('select', t?._ || 'unknown'),
      }),
      update: (t: any) => _chain('update', t?._ || 'unknown'),
      transaction: async (fn: any) => fn({
        insert: (t: any) => _chain('insert', t?._ || 'unknown'),
        select: () => ({
          from: (t: any) => _chain('select', t?._ || 'unknown'),
        }),
        update: (t: any) => _chain('update', t?._ || 'unknown'),
      }),
    }),
  };
});

vi.mock('@/config/db/schema', () => ({
  subscription: { _: 'subscription' },
  learningPath: { _: 'learningPath' },
  learningPathNode: { _: 'learningPathNode' },
  learningPathProgress: { _: 'learningPathProgress' },
}));

vi.mock('@/shared/lib/hash', () => ({
  getUuid: () => `uuid-${Math.random().toString(36).slice(2, 8)}`,
}));

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
  unstable_cache: (fn: any) => fn,
}));

vi.mock('@/config', () => ({
  envConfigs: { database_url: 'postgres://test' },
}));

vi.mock('@/shared/lib/env', () => ({
  isCloudflareWorker: false,
}));

vi.mock('@/shared/models/user', () => ({
  appendUserToResult: (rows: any[]) => rows,
}));

// ─── Imports ───────────────────────────────────────────────────────

import { canAccessTier, subscriptionToTier } from '@/shared/lib/experiments/access';
import { checkNodeAccess } from '@/shared/models/learning_path';
import type { Tier } from '@/shared/types/experiment';

// ─── Tests ─────────────────────────────────────────────────────────

beforeEach(() => {
  _store.subscription = [];
  (globalThis as any).__accessStore = _store;
});

describe('Access Control Integration', () => {
  it('should allow free user to access only free-tier experiments', () => {
    const userTier: Tier = 'free';

    expect(canAccessTier(userTier, 'free')).toBe(true);
    expect(canAccessTier(userTier, 'pro')).toBe(false);
    expect(canAccessTier(userTier, 'max')).toBe(false);
  });

  it('should allow pro user to access free and pro-tier experiments', () => {
    const userTier: Tier = 'pro';

    expect(canAccessTier(userTier, 'free')).toBe(true);
    expect(canAccessTier(userTier, 'pro')).toBe(true);
    expect(canAccessTier(userTier, 'max')).toBe(false);
  });

  it('should map subscriptionToTier correctly for Pro Monthly', () => {
    expect(subscriptionToTier('Pro Monthly')).toBe('pro');
    expect(subscriptionToTier('pro annual')).toBe('pro');
    expect(subscriptionToTier('Premium Plan')).toBe('pro');
  });

  it('should map subscriptionToTier correctly for Max/Enterprise', () => {
    expect(subscriptionToTier('Max Monthly')).toBe('max');
    expect(subscriptionToTier('Enterprise Annual')).toBe('max');
  });

  it('should map null/empty planName to free tier', () => {
    expect(subscriptionToTier(null)).toBe('free');
    expect(subscriptionToTier('')).toBe('free');
  });

  it('should combine subscriptionToTier + canAccessTier for full access check', () => {
    // Pro user accessing a pro experiment
    const tier = subscriptionToTier('Pro Monthly');
    expect(canAccessTier(tier, 'pro')).toBe(true);
    expect(canAccessTier(tier, 'max')).toBe(false);

    // Max user accessing any experiment
    const maxTier = subscriptionToTier('Max Yearly');
    expect(canAccessTier(maxTier, 'free')).toBe(true);
    expect(canAccessTier(maxTier, 'pro')).toBe(true);
    expect(canAccessTier(maxTier, 'max')).toBe(true);
  });

  it('should allow access to first 3 learning path nodes for any user (free wall)', async () => {
    // checkNodeAccess allows orderIndex < 3 for everyone
    const result0 = await checkNodeAccess(0, null);
    expect(result0.allowed).toBe(true);

    const result1 = await checkNodeAccess(1, null);
    expect(result1.allowed).toBe(true);

    const result2 = await checkNodeAccess(2, null);
    expect(result2.allowed).toBe(true);
  });

  it('should deny access to node index >= 3 for unauthenticated users', async () => {
    const result = await checkNodeAccess(3, null);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('login_required');
  });
});
