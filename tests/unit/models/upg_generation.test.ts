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
  createUpgGeneration,
  updateUpgGeneration,
  findUpgGenerationById,
  getUpgGenerationsByUserId,
  getUpgGenerationsCount,
  softDeleteUpgGeneration,
  incrementViewCount,
  togglePublish,
  forkGeneration,
  getRecentGenerationsByUserId,
  getTotalLikesReceived,
  getMonthlyGenerationCount,
} from '@/shared/models/upg_generation';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_GENERATION = {
  id: 'gen-1',
  userId: 'user-1',
  prompt: 'Projectile motion',
  promptHash: 'hash-1',
  language: 'en',
  category: null,
  model: 'claude-sonnet-4-6',
  provider: 'anthropic',
  status: 'completed',
  htmlContent: '<html>test</html>',
  htmlUrl: null,
  htmlSize: 100,
  isPublic: false,
  viewCount: 0,
  likeCount: 0,
  forkCount: 0,
  shareCount: 0,
  downloadCount: 0,
  featured: false,
  tags: null,
  forkedFrom: null,
  validationScore: 85,
  validationDetails: null,
  validatedAt: null,
  version: 1,
  parentId: null,
  refinementPrompt: null,
  createdAt: new Date('2026-03-27T00:00:00Z'),
  updatedAt: new Date('2026-03-27T00:00:00Z'),
  deletedAt: null,
};

describe('createUpgGeneration', () => {
  it('inserts a new generation and returns it', async () => {
    mockDb._resolveInsert([MOCK_GENERATION]);

    const result = await createUpgGeneration({
      userId: 'user-1',
      prompt: 'Projectile motion',
      promptHash: 'hash-1',
      language: 'en',
      model: 'claude-sonnet-4-6',
      provider: 'anthropic',
      status: 'pending',
    });

    expect(result).toEqual(MOCK_GENERATION);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
  });

  it('uses provided id if given', async () => {
    mockDb._resolveInsert([{ ...MOCK_GENERATION, id: 'custom-id' }]);

    const result = await createUpgGeneration({
      id: 'custom-id',
      userId: 'user-1',
      prompt: 'test',
      promptHash: 'h',
      language: 'en',
      model: 'claude-sonnet-4-6',
      provider: 'anthropic',
      status: 'pending',
    });

    expect(result.id).toBe('custom-id');
  });
});

describe('updateUpgGeneration', () => {
  it('updates generation fields and returns updated record', async () => {
    const updated = { ...MOCK_GENERATION, status: 'completed', htmlContent: '<html>done</html>' };
    mockDb._resolveInsert([updated]); // returning() uses insert resolve

    const result = await updateUpgGeneration('gen-1', {
      status: 'completed',
      htmlContent: '<html>done</html>',
    });

    expect(result.status).toBe('completed');
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });
});

describe('findUpgGenerationById', () => {
  it('returns generation when found', async () => {
    mockDb._resolveSelect([MOCK_GENERATION]);

    const result = await findUpgGenerationById('gen-1');

    expect(result).toEqual(MOCK_GENERATION);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns undefined when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await findUpgGenerationById('nonexistent');

    expect(result).toBeUndefined();
  });
});

describe('getUpgGenerationsByUserId', () => {
  it('returns paginated list for user', async () => {
    mockDb._resolveSelect([MOCK_GENERATION]);

    const result = await getUpgGenerationsByUserId('user-1', 1, 20);

    expect(result).toHaveLength(1);
    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.offset).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();
  });

  it('applies search filter when q is provided', async () => {
    mockDb._resolveSelect([]);

    await getUpgGenerationsByUserId('user-1', 1, 20, 'motion');

    expect(mockDb.where).toHaveBeenCalled();
  });

  it('applies status filter when status is not all', async () => {
    mockDb._resolveSelect([]);

    await getUpgGenerationsByUserId('user-1', 1, 20, undefined, 'completed');

    expect(mockDb.where).toHaveBeenCalled();
  });

  it('ignores status filter when status is all', async () => {
    mockDb._resolveSelect([MOCK_GENERATION]);

    const result = await getUpgGenerationsByUserId('user-1', 1, 20, undefined, 'all');

    expect(result).toHaveLength(1);
  });
});

describe('getUpgGenerationsCount', () => {
  it('returns count for user', async () => {
    mockDb._resolveSelect([{ count: 5 }]);

    const result = await getUpgGenerationsCount('user-1');

    expect(result).toBe(5);
  });

  it('returns 0 when no results', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getUpgGenerationsCount('user-1');

    expect(result).toBe(0);
  });
});

describe('softDeleteUpgGeneration', () => {
  it('sets deletedAt and returns updated record', async () => {
    const deleted = { ...MOCK_GENERATION, deletedAt: new Date() };
    mockDb._resolveInsert([deleted]);

    const result = await softDeleteUpgGeneration('gen-1');

    expect(result.deletedAt).toBeTruthy();
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
  });
});

describe('incrementViewCount', () => {
  it('increments view count and returns record', async () => {
    const incremented = { ...MOCK_GENERATION, viewCount: 1 };
    mockDb._resolveInsert([incremented]);

    const result = await incrementViewCount('gen-1');

    expect(result.viewCount).toBe(1);
    expect(mockDb.update).toHaveBeenCalled();
  });
});

describe('togglePublish', () => {
  it('toggles isPublic from false to true', async () => {
    // findUpgGenerationById call
    mockDb._resolveSelect([{ ...MOCK_GENERATION, isPublic: false }]);
    // update returning call
    mockDb._resolveInsert([{ id: 'gen-1', isPublic: true }]);

    const result = await togglePublish('gen-1', 'user-1');

    expect(result).toEqual({ id: 'gen-1', isPublic: true });
  });

  it('returns null when generation not found', async () => {
    mockDb._resolveSelect([]);

    const result = await togglePublish('nonexistent', 'user-1');

    expect(result).toBeNull();
  });

  it('returns null when user is not owner', async () => {
    mockDb._resolveSelect([{ ...MOCK_GENERATION, userId: 'other-user' }]);

    const result = await togglePublish('gen-1', 'user-1');

    expect(result).toBeNull();
  });
});

describe('forkGeneration', () => {
  it('returns null when original not found', async () => {
    mockDb._resolveSelect([]);

    const result = await forkGeneration('nonexistent', 'user-2');

    expect(result).toBeNull();
  });

  it('returns null when original is not public', async () => {
    mockDb._resolveSelect([{ ...MOCK_GENERATION, isPublic: false }]);

    const result = await forkGeneration('gen-1', 'user-2');

    expect(result).toBeNull();
  });
});

describe('getRecentGenerationsByUserId', () => {
  it('returns recent generations with default limit', async () => {
    mockDb._resolveSelect([MOCK_GENERATION]);

    const result = await getRecentGenerationsByUserId('user-1');

    expect(result).toHaveLength(1);
    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();
  });
});

describe('getTotalLikesReceived', () => {
  it('returns total likes for user', async () => {
    mockDb._resolveSelect([{ total: '42' }]);

    const result = await getTotalLikesReceived('user-1');

    expect(result).toBe(42);
  });

  it('returns 0 when no likes', async () => {
    mockDb._resolveSelect([{ total: null }]);

    const result = await getTotalLikesReceived('user-1');

    expect(result).toBe(0);
  });
});

describe('getMonthlyGenerationCount', () => {
  it('returns count for current month', async () => {
    mockDb._resolveSelect([{ count: 3 }]);

    const result = await getMonthlyGenerationCount('user-1');

    expect(result).toBe(3);
  });

  it('returns 0 when no generations this month', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getMonthlyGenerationCount('user-1');

    expect(result).toBe(0);
  });
});
