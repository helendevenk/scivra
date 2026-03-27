import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({ db: vi.fn() }));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { createApAttempt, getAttemptsByUser, getAttemptsByQuestion } from '@/shared/models/ap_attempt';

let mockDb: ReturnType<typeof createMockDb>;
beforeEach(() => { vi.clearAllMocks(); mockDb = createMockDb(); vi.mocked(db).mockReturnValue(mockDb as any); });

const M = { id: 'att-1', userId: 'u-1', examId: 'e-1', questionId: 'q-1', isCorrect: true, createdAt: new Date() };

describe('createApAttempt', () => {
  it('inserts and returns', async () => { mockDb._resolveInsert([M]); expect(await createApAttempt(M as any)).toEqual(M); });
});
describe('getAttemptsByUser', () => {
  it('returns attempts ordered by date', async () => { mockDb._resolveSelect([M]); expect(await getAttemptsByUser('u-1', 'e-1')).toHaveLength(1); });
});
describe('getAttemptsByQuestion', () => {
  it('returns attempts for question', async () => { mockDb._resolveSelect([M]); expect(await getAttemptsByQuestion('u-1', 'q-1')).toHaveLength(1); });
});
