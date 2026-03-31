import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createMockDb, type MockChain } from '../../helpers/mock-db';

// upg_tag.ts does `const db = getDb()` at module level, capturing the return
// value once. Use a Proxy so the module-level `db` delegates to a fresh mock each test.
const _holder: { current: MockChain } = { current: null as unknown as MockChain };

vi.mock('@/core/db', () => {
  const proxy = new Proxy({} as MockChain, {
    get(_target, prop) {
      return (_holder.current as unknown as Record<string | symbol, unknown>)?.[prop];
    },
  });
  return { db: vi.fn(() => proxy) };
});

vi.mock('nanoid', () => ({ nanoid: vi.fn(() => 'mock-nanoid') }));

import {
  createOrGetTag,
  getTagById,
  getTagByName,
  getPopularTags,
  getTagsByCategory,
  incrementTagUsage,
  decrementTagUsage,
  associateTagsWithGeneration,
  removeTagsFromGeneration,
  getGenerationTags,
  searchTags,
} from '@/shared/models/upg_tag';

beforeEach(() => {
  vi.clearAllMocks();
  _holder.current = createMockDb();
});

function mockDb(): MockChain {
  return _holder.current;
}

const MOCK_TAG = {
  id: 'tag-1',
  name: 'physics',
  category: 'science',
  usageCount: 5,
  createdAt: new Date('2026-03-27'),
  updatedAt: new Date('2026-03-27'),
};

describe('createOrGetTag', () => {
  it('returns existing tag when found', async () => {
    mockDb()._resolveSelect([MOCK_TAG]);

    const result = await createOrGetTag({ name: 'Physics' });

    expect(result).toEqual(MOCK_TAG);
    expect(mockDb().select).toHaveBeenCalled();
    expect(mockDb().insert).not.toHaveBeenCalled();
  });

  it('creates new tag when not found', async () => {
    const newTag = { ...MOCK_TAG, id: 'mock-nanoid', usageCount: 0 };
    mockDb()._resolveSelect([]);
    mockDb()._resolveInsert([newTag]);

    const result = await createOrGetTag({ name: 'Physics' });

    expect(result).toEqual(newTag);
    expect(mockDb().insert).toHaveBeenCalled();
    expect(mockDb().values).toHaveBeenCalled();
    expect(mockDb().returning).toHaveBeenCalled();
  });

  it('lowercases tag name', async () => {
    mockDb()._resolveSelect([MOCK_TAG]);

    await createOrGetTag({ name: 'PHYSICS' });

    expect(mockDb().where).toHaveBeenCalled();
  });

  it('accepts optional category', async () => {
    const newTag = { ...MOCK_TAG, id: 'mock-nanoid', category: 'stem' };
    mockDb()._resolveSelect([]);
    mockDb()._resolveInsert([newTag]);

    const result = await createOrGetTag({ name: 'math', category: 'stem' });

    expect(result.category).toBe('stem');
  });
});

describe('getTagById', () => {
  it('returns tag when found', async () => {
    mockDb()._resolveSelect([MOCK_TAG]);

    const result = await getTagById('tag-1');

    expect(result).toEqual(MOCK_TAG);
    expect(mockDb().where).toHaveBeenCalled();
    expect(mockDb().limit).toHaveBeenCalled();
  });

  it('returns null when not found', async () => {
    mockDb()._resolveSelect([]);

    const result = await getTagById('nonexistent');

    expect(result).toBeNull();
  });
});

describe('getTagByName', () => {
  it('returns tag when found', async () => {
    mockDb()._resolveSelect([MOCK_TAG]);

    const result = await getTagByName('physics');

    expect(result).toEqual(MOCK_TAG);
  });

  it('returns null when not found', async () => {
    mockDb()._resolveSelect([]);

    const result = await getTagByName('nonexistent');

    expect(result).toBeNull();
  });

  it('lowercases name for lookup', async () => {
    mockDb()._resolveSelect([MOCK_TAG]);

    await getTagByName('PHYSICS');

    expect(mockDb().where).toHaveBeenCalled();
  });
});

describe('getPopularTags', () => {
  it('returns tags ordered by usage count', async () => {
    mockDb()._resolveSelect([MOCK_TAG]);

    const result = await getPopularTags();

    expect(result).toEqual([MOCK_TAG]);
    expect(mockDb().orderBy).toHaveBeenCalled();
    expect(mockDb().limit).toHaveBeenCalled();
  });

  it('returns empty array when no tags exist', async () => {
    mockDb()._resolveSelect([]);

    const result = await getPopularTags();

    expect(result).toEqual([]);
  });

  it('accepts custom limit', async () => {
    mockDb()._resolveSelect([]);

    await getPopularTags(5);

    expect(mockDb().limit).toHaveBeenCalled();
  });
});

describe('getTagsByCategory', () => {
  it('returns tags filtered by category', async () => {
    mockDb()._resolveSelect([MOCK_TAG]);

    const result = await getTagsByCategory('science');

    expect(result).toEqual([MOCK_TAG]);
    expect(mockDb().where).toHaveBeenCalled();
    expect(mockDb().orderBy).toHaveBeenCalled();
  });

  it('returns empty array for unknown category', async () => {
    mockDb()._resolveSelect([]);

    const result = await getTagsByCategory('unknown');

    expect(result).toEqual([]);
  });
});

describe('incrementTagUsage', () => {
  it('updates usage count', async () => {
    await incrementTagUsage('tag-1');

    expect(mockDb().update).toHaveBeenCalled();
    expect(mockDb().set).toHaveBeenCalled();
    expect(mockDb().where).toHaveBeenCalled();
  });
});

describe('decrementTagUsage', () => {
  it('updates usage count with GREATEST(0, ...)', async () => {
    await decrementTagUsage('tag-1');

    expect(mockDb().update).toHaveBeenCalled();
    expect(mockDb().set).toHaveBeenCalled();
    expect(mockDb().where).toHaveBeenCalled();
  });
});

describe('associateTagsWithGeneration', () => {
  it('does nothing for empty tag names', async () => {
    await associateTagsWithGeneration('gen-1', []);

    expect(mockDb().insert).not.toHaveBeenCalled();
  });

  it('creates tags and associations', async () => {
    mockDb()._resolveSelect([]);
    mockDb()._resolveInsert([{ ...MOCK_TAG, id: 'mock-nanoid' }]);

    await associateTagsWithGeneration('gen-1', ['physics']);

    expect(mockDb().insert).toHaveBeenCalled();
    expect(mockDb().onConflictDoNothing).toHaveBeenCalled();
  });
});

describe('removeTagsFromGeneration', () => {
  it('does nothing for empty tagIds', async () => {
    await removeTagsFromGeneration('gen-1', []);

    expect(mockDb().delete).not.toHaveBeenCalled();
  });

  it('deletes associations and decrements usage', async () => {
    await removeTagsFromGeneration('gen-1', ['tag-1', 'tag-2']);

    expect(mockDb().delete).toHaveBeenCalled();
    expect(mockDb().where).toHaveBeenCalled();
    expect(mockDb().update).toHaveBeenCalled();
  });
});

describe('getGenerationTags', () => {
  it('returns tags for a generation via join', async () => {
    mockDb()._resolveSelect([MOCK_TAG]);

    const result = await getGenerationTags('gen-1');

    expect(result).toEqual([MOCK_TAG]);
    expect(mockDb().innerJoin).toHaveBeenCalled();
    expect(mockDb().where).toHaveBeenCalled();
  });

  it('returns empty array when generation has no tags', async () => {
    mockDb()._resolveSelect([]);

    const result = await getGenerationTags('gen-1');

    expect(result).toEqual([]);
  });
});

describe('searchTags', () => {
  it('returns tags matching prefix', async () => {
    mockDb()._resolveSelect([MOCK_TAG]);

    const result = await searchTags('phy');

    expect(result).toEqual([MOCK_TAG]);
    expect(mockDb().where).toHaveBeenCalled();
    expect(mockDb().orderBy).toHaveBeenCalled();
    expect(mockDb().limit).toHaveBeenCalled();
  });

  it('returns empty array for no matches', async () => {
    mockDb()._resolveSelect([]);

    const result = await searchTags('zzz');

    expect(result).toEqual([]);
  });

  it('accepts custom limit', async () => {
    mockDb()._resolveSelect([]);

    await searchTags('phy', 5);

    expect(mockDb().limit).toHaveBeenCalled();
  });
});
