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
  createVersion,
  getVersionsByNotebook,
  findVersionById,
} from '@/shared/models/lab_notebook_version';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_VERSION = {
  id: 'ver-1',
  notebookId: 'nb-1',
  version: 1,
  hypothesis: 'Objects follow parabolic paths',
  method: 'Launch at various angles',
  data: 'angle=45, range=100m',
  analysis: 'Confirms prediction',
  conclusion: 'Hypothesis supported',
  changeDescription: 'Initial version',
  createdAt: new Date('2026-03-27'),
};

describe('createVersion', () => {
  it('inserts a new version and returns it', async () => {
    mockDb._resolveInsert([MOCK_VERSION]);

    const result = await createVersion('nb-1', 1, {
      hypothesis: 'Objects follow parabolic paths',
      method: 'Launch at various angles',
      data: 'angle=45, range=100m',
      analysis: 'Confirms prediction',
      conclusion: 'Hypothesis supported',
    }, 'Initial version');

    expect(result).toEqual(MOCK_VERSION);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
  });

  it('handles null snapshot fields', async () => {
    const nullVersion = {
      ...MOCK_VERSION,
      hypothesis: null,
      method: null,
      data: null,
      analysis: null,
      conclusion: null,
      changeDescription: null,
    };
    mockDb._resolveInsert([nullVersion]);

    const result = await createVersion('nb-1', 1, {});

    expect(result.hypothesis).toBeNull();
    expect(result.method).toBeNull();
    expect(result.data).toBeNull();
    expect(result.analysis).toBeNull();
    expect(result.conclusion).toBeNull();
    expect(result.changeDescription).toBeNull();
  });

  it('handles undefined snapshot fields as null', async () => {
    const nullVersion = {
      ...MOCK_VERSION,
      hypothesis: null,
      method: null,
      data: null,
      analysis: null,
      conclusion: null,
    };
    mockDb._resolveInsert([nullVersion]);

    const result = await createVersion('nb-1', 2, {
      hypothesis: undefined,
      method: undefined,
      data: undefined,
      analysis: undefined,
      conclusion: undefined,
    });

    expect(result.hypothesis).toBeNull();
  });

  it('defaults changeDescription to null when not provided', async () => {
    mockDb._resolveInsert([{ ...MOCK_VERSION, changeDescription: null }]);

    const result = await createVersion('nb-1', 1, {
      hypothesis: 'test',
    });

    expect(result.changeDescription).toBeNull();
  });
});

describe('getVersionsByNotebook', () => {
  it('returns versions ordered by version desc', async () => {
    const versions = [
      { ...MOCK_VERSION, version: 3 },
      { ...MOCK_VERSION, id: 'ver-2', version: 2 },
      { ...MOCK_VERSION, id: 'ver-3', version: 1 },
    ];
    mockDb._resolveSelect(versions);

    const result = await getVersionsByNotebook('nb-1');

    expect(result).toHaveLength(3);
    expect(result[0].version).toBe(3);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();
  });

  it('returns empty array when no versions exist', async () => {
    mockDb._resolveSelect([]);

    const result = await getVersionsByNotebook('nb-1');

    expect(result).toEqual([]);
  });
});

describe('findVersionById', () => {
  it('returns version when found', async () => {
    mockDb._resolveSelect([MOCK_VERSION]);

    const result = await findVersionById('ver-1');

    expect(result).toEqual(MOCK_VERSION);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns undefined when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await findVersionById('nonexistent');

    expect(result).toBeUndefined();
  });
});
