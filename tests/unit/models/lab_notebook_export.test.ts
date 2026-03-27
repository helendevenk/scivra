import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({ db: vi.fn() }));
vi.mock('@/shared/lib/hash', () => ({ getUuid: vi.fn(() => 'mock-uuid') }));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { createExport, getExportsByNotebook } from '@/shared/models/lab_notebook_export';

let mockDb: ReturnType<typeof createMockDb>;
beforeEach(() => { vi.clearAllMocks(); mockDb = createMockDb(); vi.mocked(db).mockReturnValue(mockDb as any); });

const M = { id: 'exp-1', notebookId: 'nb-1', format: 'pdf', url: '/exports/exp-1.pdf', createdAt: new Date() };

describe('createExport', () => {
  it('inserts and returns', async () => { mockDb._resolveInsert([M]); expect(await createExport(M as any)).toEqual(M); });
  it('uses provided id', async () => { mockDb._resolveInsert([M]); await createExport({ ...M, id: 'custom' } as any); expect(mockDb.values).toHaveBeenCalled(); });
});
describe('getExportsByNotebook', () => {
  it('returns exports ordered', async () => { mockDb._resolveSelect([M]); expect(await getExportsByNotebook('nb-1')).toHaveLength(1); });
  it('returns empty when none', async () => { mockDb._resolveSelect([]); expect(await getExportsByNotebook('nb-1')).toHaveLength(0); });
});
