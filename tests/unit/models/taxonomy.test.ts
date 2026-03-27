import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import {
  addTaxonomy,
  updateTaxonomy,
  deleteTaxonomy,
  findTaxonomy,
  getTaxonomies,
  getTaxonomiesCount,
  TaxonomyType,
  TaxonomyStatus,
} from '@/shared/models/taxonomy';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_TAXONOMY = {
  id: 'tax-1',
  name: 'Physics',
  slug: 'physics',
  type: TaxonomyType.CATEGORY,
  status: TaxonomyStatus.PUBLISHED,
  description: 'Physics category',
  parentId: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-03-27'),
};

describe('addTaxonomy', () => {
  it('inserts a new taxonomy and returns it', async () => {
    mockDb._resolveInsert([MOCK_TAXONOMY]);

    const result = await addTaxonomy({
      id: 'tax-1',
      name: 'Physics',
      slug: 'physics',
      type: TaxonomyType.CATEGORY,
    });

    expect(result).toEqual(MOCK_TAXONOMY);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
  });
});

describe('updateTaxonomy', () => {
  it('updates taxonomy fields and returns updated record', async () => {
    const updated = { ...MOCK_TAXONOMY, name: 'Advanced Physics' };
    mockDb._resolveInsert([updated]);

    const result = await updateTaxonomy('tax-1', { name: 'Advanced Physics' });

    expect(result.name).toBe('Advanced Physics');
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
  });

  it('returns undefined when taxonomy does not exist', async () => {
    mockDb._resolveInsert([]);

    const result = await updateTaxonomy('nonexistent', { name: 'X' });

    expect(result).toBeUndefined();
  });
});

describe('deleteTaxonomy', () => {
  it('soft-deletes by setting status to ARCHIVED', async () => {
    const archived = { ...MOCK_TAXONOMY, status: TaxonomyStatus.ARCHIVED };
    mockDb._resolveInsert([archived]);

    const result = await deleteTaxonomy('tax-1');

    expect(result.status).toBe(TaxonomyStatus.ARCHIVED);
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
  });
});

describe('findTaxonomy', () => {
  it('returns taxonomy when found by id', async () => {
    mockDb._resolveSelect([MOCK_TAXONOMY]);

    const result = await findTaxonomy({ id: 'tax-1' });

    expect(result).toEqual(MOCK_TAXONOMY);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.limit).toHaveBeenCalled();
  });

  it('returns taxonomy when found by slug', async () => {
    mockDb._resolveSelect([MOCK_TAXONOMY]);

    const result = await findTaxonomy({ slug: 'physics' });

    expect(result).toEqual(MOCK_TAXONOMY);
  });

  it('returns taxonomy when found by status', async () => {
    mockDb._resolveSelect([MOCK_TAXONOMY]);

    const result = await findTaxonomy({ status: TaxonomyStatus.PUBLISHED });

    expect(result).toEqual(MOCK_TAXONOMY);
  });

  it('returns undefined when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await findTaxonomy({ id: 'nonexistent' });

    expect(result).toBeUndefined();
  });
});

describe('getTaxonomies', () => {
  it('returns paginated list with defaults', async () => {
    mockDb._resolveSelect([MOCK_TAXONOMY]);

    const result = await getTaxonomies();

    expect(result).toHaveLength(1);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();
    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.offset).toHaveBeenCalled();
  });

  it('filters by type', async () => {
    mockDb._resolveSelect([MOCK_TAXONOMY]);

    const result = await getTaxonomies({ type: TaxonomyType.CATEGORY });

    expect(result).toHaveLength(1);
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('filters by status', async () => {
    mockDb._resolveSelect([]);

    const result = await getTaxonomies({ status: TaxonomyStatus.DRAFT });

    expect(result).toHaveLength(0);
  });

  it('filters by ids', async () => {
    mockDb._resolveSelect([MOCK_TAXONOMY]);

    const result = await getTaxonomies({ ids: ['tax-1', 'tax-2'] });

    expect(result).toHaveLength(1);
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns empty array when no results', async () => {
    mockDb._resolveSelect([]);

    const result = await getTaxonomies();

    expect(result).toEqual([]);
  });

  it('applies custom page and limit', async () => {
    mockDb._resolveSelect([]);

    await getTaxonomies({ page: 3, limit: 10 });

    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.offset).toHaveBeenCalled();
  });
});

describe('getTaxonomiesCount', () => {
  it('returns count', async () => {
    mockDb._resolveSelect([{ count: 42 }]);

    const result = await getTaxonomiesCount();

    expect(result).toBe(42);
  });

  it('returns count filtered by type', async () => {
    mockDb._resolveSelect([{ count: 10 }]);

    const result = await getTaxonomiesCount({ type: TaxonomyType.TAG });

    expect(result).toBe(10);
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns 0 when no results', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getTaxonomiesCount();

    expect(result).toBe(0);
  });

  it('returns 0 when count is 0', async () => {
    mockDb._resolveSelect([{ count: 0 }]);

    const result = await getTaxonomiesCount();

    expect(result).toBe(0);
  });
});
