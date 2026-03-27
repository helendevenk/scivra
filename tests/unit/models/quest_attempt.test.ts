import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({ db: vi.fn() }));
vi.mock('@/shared/lib/hash', () => ({ getUuid: vi.fn(() => 'mock-uuid') }));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { createQuestAttempt, updateQuestAttempt, findQuestAttemptById, getActiveAttempt, getUserAttempts, getBestAttempt, completeAttempt } from '@/shared/models/quest_attempt';

let mockDb: ReturnType<typeof createMockDb>;
beforeEach(() => { vi.clearAllMocks(); mockDb = createMockDb(); vi.mocked(db).mockReturnValue(mockDb as any); });

const M = { id: 'a-1', userId: 'u-1', questId: 'q-1', status: 'in_progress', totalScore: 0, maxPossibleScore: 100, startedAt: new Date(), completedAt: null, createdAt: new Date() };

describe('createQuestAttempt', () => {
  it('inserts and returns', async () => { mockDb._resolveInsert([M]); expect(await createQuestAttempt(M as any)).toEqual(M); });
});
describe('updateQuestAttempt', () => {
  it('updates and returns', async () => { mockDb._resolveInsert([{ ...M, status: 'completed' }]); expect((await updateQuestAttempt('a-1', { status: 'completed' })).status).toBe('completed'); });
});
describe('findQuestAttemptById', () => {
  it('returns attempt', async () => { mockDb._resolveSelect([M]); expect(await findQuestAttemptById('a-1')).toEqual(M); });
  it('returns undefined when missing', async () => { mockDb._resolveSelect([]); expect(await findQuestAttemptById('x')).toBeUndefined(); });
});
describe('getActiveAttempt', () => {
  it('returns active attempt', async () => { mockDb._resolveSelect([M]); expect(await getActiveAttempt('u-1', 'q-1')).toEqual(M); });
  it('returns undefined when none active', async () => { mockDb._resolveSelect([]); expect(await getActiveAttempt('u-1', 'q-1')).toBeUndefined(); });
});
describe('getUserAttempts', () => {
  it('returns all attempts', async () => { mockDb._resolveSelect([M]); expect(await getUserAttempts('u-1')).toHaveLength(1); });
});
describe('getBestAttempt', () => {
  it('returns best completed attempt', async () => { mockDb._resolveSelect([{ ...M, status: 'completed', totalScore: 90 }]); expect((await getBestAttempt('u-1', 'q-1'))!.totalScore).toBe(90); });
});
describe('completeAttempt', () => {
  it('updates status and score', async () => {
    mockDb._resolveInsert([{ ...M, status: 'completed', totalScore: 85, maxPossibleScore: 100 }]);
    const result = await completeAttempt('a-1', 85, 100);
    expect(result.status).toBe('completed');
    expect(result.totalScore).toBe(85);
  });
});
