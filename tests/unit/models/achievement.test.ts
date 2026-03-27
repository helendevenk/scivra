import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({ db: vi.fn() }));
vi.mock('@/shared/lib/hash', () => ({ getUuid: vi.fn(() => 'mock-uuid') }));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { createAchievement, getActiveAchievements, findAchievementBySlug, getUserAchievements, unlockAchievement, checkAndUnlockAchievements } from '@/shared/models/achievement';

let mockDb: ReturnType<typeof createMockDb>;
beforeEach(() => { vi.clearAllMocks(); mockDb = createMockDb(); vi.mocked(db).mockReturnValue(mockDb as any); });

const M = { id: 'ach-1', slug: 'first-quest', isActive: true, criteria: '{"type":"quest_count","count":1}', sortOrder: 1, createdAt: new Date() };
const UA = { id: 'ua-1', userId: 'u-1', achievementId: 'ach-1', questAttemptId: null, createdAt: new Date() };

describe('createAchievement', () => {
  it('inserts and returns', async () => { mockDb._resolveInsert([M]); expect(await createAchievement(M as any)).toEqual(M); });
});
describe('getActiveAchievements', () => {
  it('returns active achievements', async () => { mockDb._resolveSelect([M]); expect(await getActiveAchievements()).toHaveLength(1); });
});
describe('findAchievementBySlug', () => {
  it('returns by slug', async () => { mockDb._resolveSelect([M]); expect(await findAchievementBySlug('first-quest')).toEqual(M); });
  it('returns undefined when missing', async () => { mockDb._resolveSelect([]); expect(await findAchievementBySlug('x')).toBeUndefined(); });
});
describe('getUserAchievements', () => {
  it('returns user achievements', async () => { mockDb._resolveSelect([UA]); expect(await getUserAchievements('u-1')).toHaveLength(1); });
});
describe('unlockAchievement', () => {
  it('returns existing if already unlocked', async () => {
    mockDb._resolveSelect([UA]);
    const result = await unlockAchievement('u-1', 'ach-1');
    expect(result).toEqual(UA);
    expect(mockDb.insert).not.toHaveBeenCalled();
  });
  it('inserts new unlock when not yet unlocked', async () => {
    mockDb._resolveSelect([]);
    mockDb._resolveInsert([UA]);
    const result = await unlockAchievement('u-1', 'ach-1');
    expect(result).toEqual(UA);
    expect(mockDb.insert).toHaveBeenCalled();
  });
  it('updates learningStats after new unlock', async () => {
    mockDb._resolveSelect([]); // no existing
    mockDb._resolveInsert([UA]); // insert returns UA
    // The function does a second insert (learningStats) after the first returns
    // Both inserts resolve via the same mockDb._resolveInsert chain

    await unlockAchievement('u-1', 'ach-1');

    // insert is called twice: once for userAchievement, once for learningStats
    expect(mockDb.insert).toHaveBeenCalledTimes(2);
    expect(mockDb.onConflictDoUpdate).toHaveBeenCalled();
  });
});

// ─── checkAndUnlockAchievements ───

describe('checkAndUnlockAchievements', () => {
  const makeAch = (id: string, criteria: object) => ({
    id,
    slug: `ach-${id}`,
    name: `Achievement ${id}`,
    description: 'test',
    iconUrl: null,
    isActive: true,
    criteria: JSON.stringify(criteria),
    sortOrder: 1,
    createdAt: new Date(),
  });

  it('unlocks quest_count achievement when count threshold met', async () => {
    const ach = makeAch('ach-qc', { type: 'quest_count', count: 3 });

    // Call sequence:
    // 1. getActiveAchievements → select (thenable)
    // 2. getUserAchievements → select (thenable)
    // 3. For quest_count: select count from questAttempt (thenable)
    // 4. unlockAchievement: select existing (thenable) → insert (returning)
    // 5. learningStats insert (returning, via onConflictDoUpdate)
    let selectCall = 0;
    mockDb.then.mockImplementation((resolve: (v: unknown) => void) => {
      selectCall++;
      switch (selectCall) {
        case 1: return Promise.resolve([ach]).then(resolve);       // active achievements
        case 2: return Promise.resolve([]).then(resolve);          // user has none unlocked
        case 3: return Promise.resolve([{ count: 5 }]).then(resolve); // quest count = 5 >= 3
        case 4: return Promise.resolve([]).then(resolve);          // unlockAchievement: not yet unlocked
        default: return Promise.resolve([]).then(resolve);
      }
    });
    const ua = { ...UA, achievementId: 'ach-qc' };
    mockDb._resolveInsert([ua]);

    const result = await checkAndUnlockAchievements('u-1', {});

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ach-qc');
  });

  it('unlocks perfect_score achievement when score matches max', async () => {
    const ach = makeAch('ach-ps', { type: 'perfect_score' });

    let selectCall = 0;
    mockDb.then.mockImplementation((resolve: (v: unknown) => void) => {
      selectCall++;
      switch (selectCall) {
        case 1: return Promise.resolve([ach]).then(resolve);
        case 2: return Promise.resolve([]).then(resolve);
        // No DB query for perfect_score — it uses context
        case 3: return Promise.resolve([]).then(resolve); // unlockAchievement check
        default: return Promise.resolve([]).then(resolve);
      }
    });
    mockDb._resolveInsert([{ ...UA, achievementId: 'ach-ps' }]);

    const result = await checkAndUnlockAchievements('u-1', {
      totalScore: 100,
      maxScore: 100,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ach-ps');
  });

  it('does not unlock perfect_score when score below max', async () => {
    const ach = makeAch('ach-ps', { type: 'perfect_score' });

    let selectCall = 0;
    mockDb.then.mockImplementation((resolve: (v: unknown) => void) => {
      selectCall++;
      switch (selectCall) {
        case 1: return Promise.resolve([ach]).then(resolve);
        case 2: return Promise.resolve([]).then(resolve);
        default: return Promise.resolve([]).then(resolve);
      }
    });

    const result = await checkAndUnlockAchievements('u-1', {
      totalScore: 80,
      maxScore: 100,
    });

    expect(result).toHaveLength(0);
  });

  it('unlocks streak achievement when count meets days threshold', async () => {
    const ach = makeAch('ach-streak', { type: 'streak', days: 5 });

    let selectCall = 0;
    mockDb.then.mockImplementation((resolve: (v: unknown) => void) => {
      selectCall++;
      switch (selectCall) {
        case 1: return Promise.resolve([ach]).then(resolve);
        case 2: return Promise.resolve([]).then(resolve);
        case 3: return Promise.resolve([{ count: 7 }]).then(resolve); // 7 >= 5
        case 4: return Promise.resolve([]).then(resolve); // unlock check
        default: return Promise.resolve([]).then(resolve);
      }
    });
    mockDb._resolveInsert([{ ...UA, achievementId: 'ach-streak' }]);

    const result = await checkAndUnlockAchievements('u-1', {});

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ach-streak');
  });

  it('unlocks quest_complete achievement for specific quest', async () => {
    const ach = makeAch('ach-qcomp', { type: 'quest_complete', questId: 'quest-42' });

    let selectCall = 0;
    mockDb.then.mockImplementation((resolve: (v: unknown) => void) => {
      selectCall++;
      switch (selectCall) {
        case 1: return Promise.resolve([ach]).then(resolve);
        case 2: return Promise.resolve([]).then(resolve);
        case 3: return Promise.resolve([{ count: 1 }]).then(resolve); // quest completed
        case 4: return Promise.resolve([]).then(resolve); // unlock check
        default: return Promise.resolve([]).then(resolve);
      }
    });
    mockDb._resolveInsert([{ ...UA, achievementId: 'ach-qcomp' }]);

    const result = await checkAndUnlockAchievements('u-1', {
      questAttemptId: 'attempt-1',
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ach-qcomp');
  });

  it('skips already unlocked achievements', async () => {
    const ach = makeAch('ach-1', { type: 'quest_count', count: 1 });

    let selectCall = 0;
    mockDb.then.mockImplementation((resolve: (v: unknown) => void) => {
      selectCall++;
      switch (selectCall) {
        case 1: return Promise.resolve([ach]).then(resolve);
        case 2: return Promise.resolve([{ ...UA, achievementId: 'ach-1' }]).then(resolve); // already unlocked
        default: return Promise.resolve([]).then(resolve);
      }
    });

    const result = await checkAndUnlockAchievements('u-1', {});

    expect(result).toHaveLength(0);
    // Should not attempt to query quest count since it's already unlocked
  });

  it('does not unlock quest_complete when no questAttemptId in context', async () => {
    const ach = makeAch('ach-qcomp', { type: 'quest_complete', questId: 'quest-42' });

    let selectCall = 0;
    mockDb.then.mockImplementation((resolve: (v: unknown) => void) => {
      selectCall++;
      switch (selectCall) {
        case 1: return Promise.resolve([ach]).then(resolve);
        case 2: return Promise.resolve([]).then(resolve);
        default: return Promise.resolve([]).then(resolve);
      }
    });

    const result = await checkAndUnlockAchievements('u-1', {});

    expect(result).toHaveLength(0);
  });

  it('does not unlock perfect_score when maxScore is 0', async () => {
    const ach = makeAch('ach-ps', { type: 'perfect_score' });

    let selectCall = 0;
    mockDb.then.mockImplementation((resolve: (v: unknown) => void) => {
      selectCall++;
      switch (selectCall) {
        case 1: return Promise.resolve([ach]).then(resolve);
        case 2: return Promise.resolve([]).then(resolve);
        default: return Promise.resolve([]).then(resolve);
      }
    });

    const result = await checkAndUnlockAchievements('u-1', {
      totalScore: 0,
      maxScore: 0,
    });

    expect(result).toHaveLength(0);
  });
});
