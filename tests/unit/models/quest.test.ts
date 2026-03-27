import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({ db: vi.fn() }));
vi.mock('@/shared/lib/hash', () => ({ getUuid: vi.fn(() => 'mock-uuid') }));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { createQuest, updateQuest, findQuestById, findQuestBySlug, getPublishedQuests, getWeeklyChallenge, deleteQuest } from '@/shared/models/quest';

let mockDb: ReturnType<typeof createMockDb>;
beforeEach(() => { vi.clearAllMocks(); mockDb = createMockDb(); vi.mocked(db).mockReturnValue(mockDb as any); });

const M = { id: 'q-1', slug: 'gravity-quest', isPublished: true, category: 'physics', difficulty: 'medium', tier: 'free', isWeeklyChallenge: false, weeklyStartDate: null, weeklyEndDate: null, sortOrder: 1, createdAt: new Date() };

describe('createQuest', () => {
  it('inserts and returns', async () => { mockDb._resolveInsert([M]); expect(await createQuest(M as any)).toEqual(M); });
});
describe('updateQuest', () => {
  it('updates and returns', async () => { mockDb._resolveInsert([{ ...M, slug: 'x' }]); expect((await updateQuest('q-1', { slug: 'x' })).slug).toBe('x'); });
});
describe('findQuestById', () => {
  it('returns quest', async () => { mockDb._resolveSelect([M]); expect(await findQuestById('q-1')).toEqual(M); });
  it('returns undefined when missing', async () => { mockDb._resolveSelect([]); expect(await findQuestById('x')).toBeUndefined(); });
});
describe('findQuestBySlug', () => {
  it('returns quest by slug', async () => { mockDb._resolveSelect([M]); expect(await findQuestBySlug('gravity-quest')).toEqual(M); });
});
describe('getPublishedQuests', () => {
  it('returns published', async () => { mockDb._resolveSelect([M]); expect(await getPublishedQuests()).toHaveLength(1); });
  it('filters by category', async () => { mockDb._resolveSelect([]); await getPublishedQuests({ category: 'physics' }); expect(mockDb.where).toHaveBeenCalled(); });
});
describe('getWeeklyChallenge', () => {
  it('returns undefined when no challenge', async () => { mockDb._resolveSelect([]); expect(await getWeeklyChallenge()).toBeUndefined(); });
});
describe('deleteQuest', () => {
  it('calls delete', async () => { await deleteQuest('q-1'); expect(mockDb.delete).toHaveBeenCalled(); });
});
