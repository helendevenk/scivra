import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({ db: vi.fn() }));
vi.mock('@/shared/lib/hash', () => ({ getUuid: vi.fn(() => 'mock-uuid') }));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { createAchievement, getActiveAchievements, findAchievementBySlug, getUserAchievements, unlockAchievement } from '@/shared/models/achievement';

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
});
