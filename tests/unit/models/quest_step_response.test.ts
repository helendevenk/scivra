import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({ db: vi.fn() }));
vi.mock('@/shared/lib/hash', () => ({ getUuid: vi.fn(() => 'mock-uuid') }));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { createStepResponse, getResponsesByAttempt, findResponseByStep } from '@/shared/models/quest_step_response';

let mockDb: ReturnType<typeof createMockDb>;
beforeEach(() => { vi.clearAllMocks(); mockDb = createMockDb(); vi.mocked(db).mockReturnValue(mockDb as any); });

const M = { id: 'r-1', attemptId: 'a-1', stepId: 's-1', answer: '42', isCorrect: true, score: 10, createdAt: new Date() };

describe('createStepResponse', () => {
  it('inserts and returns', async () => { mockDb._resolveInsert([M]); expect(await createStepResponse(M as any)).toEqual(M); });
});
describe('getResponsesByAttempt', () => {
  it('returns responses', async () => { mockDb._resolveSelect([M]); expect(await getResponsesByAttempt('a-1')).toHaveLength(1); });
  it('returns empty for no responses', async () => { mockDb._resolveSelect([]); expect(await getResponsesByAttempt('a-1')).toHaveLength(0); });
});
describe('findResponseByStep', () => {
  it('returns response', async () => { mockDb._resolveSelect([M]); expect(await findResponseByStep('a-1', 's-1')).toEqual(M); });
  it('returns undefined when missing', async () => { mockDb._resolveSelect([]); expect(await findResponseByStep('a-1', 'x')).toBeUndefined(); });
});
