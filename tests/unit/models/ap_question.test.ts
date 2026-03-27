import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({ db: vi.fn() }));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { createApQuestion, updateApQuestion, findApQuestionById, getQuestionsByUnit, deleteApQuestion, batchCreateQuestions } from '@/shared/models/ap_question';

let mockDb: ReturnType<typeof createMockDb>;
beforeEach(() => { vi.clearAllMocks(); mockDb = createMockDb(); vi.mocked(db).mockReturnValue(mockDb as any); });

const M = { id: 'q-1', examId: 'e-1', unitId: 'u-1', difficulty: 'medium', type: 'mcq', isPublished: true, sort: 1, questionNumber: 1, createdAt: new Date() };

describe('createApQuestion', () => {
  it('inserts and returns', async () => { mockDb._resolveInsert([M]); expect(await createApQuestion(M as any)).toEqual(M); });
});
describe('updateApQuestion', () => {
  it('updates and returns', async () => { mockDb._resolveInsert([{ ...M, difficulty: 'hard' }]); expect((await updateApQuestion('q-1', { difficulty: 'hard' })).difficulty).toBe('hard'); });
});
describe('findApQuestionById', () => {
  it('returns question', async () => { mockDb._resolveSelect([M]); expect(await findApQuestionById('q-1')).toEqual(M); });
  it('returns null when missing', async () => { mockDb._resolveSelect([]); expect(await findApQuestionById('x')).toBeNull(); });
});
describe('getQuestionsByUnit', () => {
  it('returns paginated questions with count', async () => {
    // First call: count, second call: questions
    mockDb._resolveSelect([{ count: 1 }]);
    const result = await getQuestionsByUnit('e-1', 'u-1');
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
  });
});
describe('deleteApQuestion', () => {
  it('deletes and returns', async () => { mockDb._resolveInsert([M]); expect(await deleteApQuestion('q-1')).toEqual(M); });
  it('returns null when missing', async () => { mockDb._resolveInsert([]); expect(await deleteApQuestion('x')).toBeNull(); });
});
describe('batchCreateQuestions', () => {
  it('returns empty for empty input', async () => { expect(await batchCreateQuestions([])).toEqual([]); });
  it('inserts batch', async () => { mockDb._resolveInsert([M]); const result = await batchCreateQuestions([M as any]); expect(result).toBeTruthy(); });
});
