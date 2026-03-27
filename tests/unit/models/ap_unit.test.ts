import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({ db: vi.fn() }));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { createApUnit, updateApUnit, findApUnitById, findApUnitBySlug, getUnitsByExamId, deleteApUnit } from '@/shared/models/ap_unit';

let mockDb: ReturnType<typeof createMockDb>;
beforeEach(() => { vi.clearAllMocks(); mockDb = createMockDb(); vi.mocked(db).mockReturnValue(mockDb as any); });

const M = { id: 'u-1', examId: 'e-1', slug: 'kinematics', unitNumber: 1, sort: 1, createdAt: new Date() };

describe('createApUnit', () => {
  it('inserts and returns', async () => { mockDb._resolveInsert([M]); expect(await createApUnit(M as any)).toEqual(M); });
});
describe('updateApUnit', () => {
  it('updates and returns', async () => { mockDb._resolveInsert([{ ...M, slug: 'x' }]); expect((await updateApUnit('u-1', { slug: 'x' })).slug).toBe('x'); });
});
describe('findApUnitById', () => {
  it('returns unit', async () => { mockDb._resolveSelect([M]); expect(await findApUnitById('u-1')).toEqual(M); });
  it('returns null when missing', async () => { mockDb._resolveSelect([]); expect(await findApUnitById('x')).toBeNull(); });
});
describe('findApUnitBySlug', () => {
  it('returns unit by slug', async () => { mockDb._resolveSelect([M]); expect(await findApUnitBySlug('e-1', 'kinematics')).toEqual(M); });
});
describe('getUnitsByExamId', () => {
  it('returns units ordered', async () => { mockDb._resolveSelect([M]); expect(await getUnitsByExamId('e-1')).toHaveLength(1); });
});
describe('deleteApUnit', () => {
  it('deletes and returns', async () => { mockDb._resolveInsert([M]); expect(await deleteApUnit('u-1')).toEqual(M); });
  it('returns null when missing', async () => { mockDb._resolveInsert([]); expect(await deleteApUnit('x')).toBeNull(); });
});
