import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({ db: vi.fn() }));
vi.mock('@/shared/lib/hash', () => ({ getUuid: vi.fn(() => 'mock-uuid') }));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { createQuestStep, updateQuestStep, getStepsByQuestId, findQuestStepById, deleteQuestStep } from '@/shared/models/quest_step';

let mockDb: ReturnType<typeof createMockDb>;
beforeEach(() => { vi.clearAllMocks(); mockDb = createMockDb(); vi.mocked(db).mockReturnValue(mockDb as any); });

const M = { id: 's-1', questId: 'q-1', orderIndex: 0, titleEn: 'Step 1', titleZh: '步骤 1', stepType: 'knowledge', contentEn: 'Content', contentZh: '内容', createdAt: new Date() };

describe('createQuestStep', () => {
  it('inserts and returns', async () => { mockDb._resolveInsert([M]); expect(await createQuestStep(M as any)).toEqual(M); });
});
describe('updateQuestStep', () => {
  it('updates and returns', async () => { mockDb._resolveInsert([{ ...M, titleEn: 'X' }]); expect((await updateQuestStep('s-1', { titleEn: 'X' })).titleEn).toBe('X'); });
});
describe('getStepsByQuestId', () => {
  it('returns ordered steps', async () => { mockDb._resolveSelect([M]); expect(await getStepsByQuestId('q-1')).toHaveLength(1); });
});
describe('findQuestStepById', () => {
  it('returns step', async () => { mockDb._resolveSelect([M]); expect(await findQuestStepById('s-1')).toEqual(M); });
  it('returns undefined when missing', async () => { mockDb._resolveSelect([]); expect(await findQuestStepById('x')).toBeUndefined(); });
});
describe('deleteQuestStep', () => {
  it('calls delete', async () => { await deleteQuestStep('s-1'); expect(mockDb.delete).toHaveBeenCalled(); });
});
