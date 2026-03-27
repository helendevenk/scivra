import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({ db: vi.fn() }));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { createRetentionRepository } from '@/shared/models/retention-repository';

let mockDb: ReturnType<typeof createMockDb>;
beforeEach(() => { vi.clearAllMocks(); mockDb = createMockDb(); vi.mocked(db).mockReturnValue(mockDb as any); });

describe('RetentionRepository', () => {
  it('deleteAnonymousUsageOlderThan returns count', async () => {
    mockDb._resolveInsert([{ id: '1' }, { id: '2' }]);
    const repo = createRetentionRepository();
    const result = await repo.deleteAnonymousUsageOlderThan({ cutoff: new Date() });
    expect(result).toBe(2);
    expect(mockDb.delete).toHaveBeenCalled();
  });

  it('deleteConsentEventsOlderThan returns count', async () => {
    mockDb._resolveInsert([{ id: '1' }]);
    const repo = createRetentionRepository();
    const result = await repo.deleteConsentEventsOlderThan({ cutoff: new Date() });
    expect(result).toBe(1);
  });

  it('returns 0 when nothing to delete', async () => {
    mockDb._resolveInsert([]);
    const repo = createRetentionRepository();
    expect(await repo.deleteAnonymousUsageOlderThan({ cutoff: new Date() })).toBe(0);
  });
});
