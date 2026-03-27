import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

vi.mock('@/shared/lib/hash', () => ({
  getUuid: vi.fn(() => 'mock-uuid'),
}));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import {
  createLabNotebook,
  updateLabNotebook,
  findLabNotebookById,
  getNotebooksByUser,
  getNotebooksByUserCount,
  softDeleteLabNotebook,
  getNotebookForExperiment,
  getNotebookForGeneration,
  getMonthlyNotebookCount,
} from '@/shared/models/lab_notebook';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_NOTEBOOK = {
  id: 'nb-1',
  userId: 'user-1',
  experimentId: 'exp-1',
  generationId: null,
  title: 'Projectile Motion Lab',
  hypothesis: 'Objects follow parabolic paths',
  method: 'Launch at various angles',
  data: 'angle=45, range=100m',
  analysis: 'Confirms prediction',
  conclusion: 'Hypothesis supported',
  status: 'draft',
  version: 1,
  createdAt: new Date('2026-03-27'),
  updatedAt: new Date('2026-03-27'),
  deletedAt: null,
};

describe('createLabNotebook', () => {
  it('inserts a new notebook and returns it', async () => {
    mockDb._resolveInsert([MOCK_NOTEBOOK]);

    const result = await createLabNotebook({
      userId: 'user-1',
      experimentId: 'exp-1',
      title: 'Projectile Motion Lab',
    });

    expect(result).toEqual(MOCK_NOTEBOOK);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
  });

  it('uses provided id if given', async () => {
    const customId = { ...MOCK_NOTEBOOK, id: 'custom-id' };
    mockDb._resolveInsert([customId]);

    const result = await createLabNotebook({
      id: 'custom-id',
      userId: 'user-1',
      experimentId: 'exp-1',
      title: 'Test',
    });

    expect(result.id).toBe('custom-id');
  });

  it('falls back to getUuid when no id provided', async () => {
    mockDb._resolveInsert([MOCK_NOTEBOOK]);

    await createLabNotebook({
      userId: 'user-1',
      title: 'Test',
    });

    expect(mockDb.values).toHaveBeenCalled();
  });
});

describe('updateLabNotebook', () => {
  it('updates notebook fields and returns updated record', async () => {
    const updated = { ...MOCK_NOTEBOOK, hypothesis: 'Updated hypothesis' };
    mockDb._resolveInsert([updated]);

    const result = await updateLabNotebook('nb-1', { hypothesis: 'Updated hypothesis' });

    expect(result.hypothesis).toBe('Updated hypothesis');
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns undefined when notebook not found or deleted', async () => {
    mockDb._resolveInsert([]);

    const result = await updateLabNotebook('nonexistent', { hypothesis: 'test' });

    expect(result).toBeUndefined();
  });
});

describe('findLabNotebookById', () => {
  it('returns notebook when found and not deleted', async () => {
    mockDb._resolveSelect([MOCK_NOTEBOOK]);

    const result = await findLabNotebookById('nb-1');

    expect(result).toEqual(MOCK_NOTEBOOK);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns undefined when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await findLabNotebookById('nonexistent');

    expect(result).toBeUndefined();
  });
});

describe('getNotebooksByUser', () => {
  it('returns notebooks for user with default pagination', async () => {
    mockDb._resolveSelect([MOCK_NOTEBOOK]);

    const result = await getNotebooksByUser('user-1');

    expect(result).toEqual([MOCK_NOTEBOOK]);
    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.offset).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();
  });

  it('returns empty array when no notebooks', async () => {
    mockDb._resolveSelect([]);

    const result = await getNotebooksByUser('user-1');

    expect(result).toEqual([]);
  });

  it('applies status filter', async () => {
    mockDb._resolveSelect([MOCK_NOTEBOOK]);

    await getNotebooksByUser('user-1', { status: 'draft' });

    expect(mockDb.where).toHaveBeenCalled();
  });

  it('applies experimentId filter', async () => {
    mockDb._resolveSelect([MOCK_NOTEBOOK]);

    await getNotebooksByUser('user-1', { experimentId: 'exp-1' });

    expect(mockDb.where).toHaveBeenCalled();
  });

  it('applies custom pagination', async () => {
    mockDb._resolveSelect([]);

    await getNotebooksByUser('user-1', { page: 2, pageSize: 10 });

    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.offset).toHaveBeenCalled();
  });
});

describe('getNotebooksByUserCount', () => {
  it('returns count for user', async () => {
    mockDb._resolveSelect([{ count: 5 }]);

    const result = await getNotebooksByUserCount('user-1');

    expect(result).toBe(5);
  });

  it('returns 0 when no results', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getNotebooksByUserCount('user-1');

    expect(result).toBe(0);
  });

  it('applies status filter', async () => {
    mockDb._resolveSelect([{ count: 2 }]);

    const result = await getNotebooksByUserCount('user-1', { status: 'draft' });

    expect(result).toBe(2);
  });

  it('applies experimentId filter', async () => {
    mockDb._resolveSelect([{ count: 1 }]);

    const result = await getNotebooksByUserCount('user-1', { experimentId: 'exp-1' });

    expect(result).toBe(1);
  });
});

describe('softDeleteLabNotebook', () => {
  it('sets deletedAt and returns updated record', async () => {
    const deleted = { ...MOCK_NOTEBOOK, deletedAt: new Date() };
    mockDb._resolveInsert([deleted]);

    const result = await softDeleteLabNotebook('nb-1');

    expect(result.deletedAt).toBeTruthy();
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns undefined when notebook not found or already deleted', async () => {
    mockDb._resolveInsert([]);

    const result = await softDeleteLabNotebook('nonexistent');

    expect(result).toBeUndefined();
  });
});

describe('getNotebookForExperiment', () => {
  it('returns draft notebook for user+experiment', async () => {
    mockDb._resolveSelect([MOCK_NOTEBOOK]);

    const result = await getNotebookForExperiment('user-1', 'exp-1');

    expect(result).toEqual(MOCK_NOTEBOOK);
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();
    expect(mockDb.limit).toHaveBeenCalled();
  });

  it('returns undefined when no draft notebook exists', async () => {
    mockDb._resolveSelect([]);

    const result = await getNotebookForExperiment('user-1', 'exp-1');

    expect(result).toBeUndefined();
  });
});

describe('getNotebookForGeneration', () => {
  it('returns draft notebook for user+generation', async () => {
    const nbWithGen = { ...MOCK_NOTEBOOK, generationId: 'gen-1' };
    mockDb._resolveSelect([nbWithGen]);

    const result = await getNotebookForGeneration('user-1', 'gen-1');

    expect(result).toEqual(nbWithGen);
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();
    expect(mockDb.limit).toHaveBeenCalled();
  });

  it('returns undefined when no draft notebook exists', async () => {
    mockDb._resolveSelect([]);

    const result = await getNotebookForGeneration('user-1', 'gen-1');

    expect(result).toBeUndefined();
  });
});

describe('getMonthlyNotebookCount', () => {
  it('returns count for current month', async () => {
    mockDb._resolveSelect([{ count: 3 }]);

    const result = await getMonthlyNotebookCount('user-1');

    expect(result).toBe(3);
  });

  it('returns 0 when no notebooks this month', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getMonthlyNotebookCount('user-1');

    expect(result).toBe(0);
  });
});
