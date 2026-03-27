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
  toggleLike,
  isLikedByUser,
  batchCheckLiked,
  getRecentLikesByUserId,
} from '@/shared/models/upg_like';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

describe('toggleLike', () => {
  it('unlikes when like already exists', async () => {
    // First select finds existing like
    mockDb._resolveSelect([{ id: 'like-1' }]);
    // update().returning() after delete
    mockDb._resolveInsert([{ likeCount: 4 }]);

    const result = await toggleLike('user-1', 'gen-1');

    expect(result).toEqual({ liked: false, likeCount: 4 });
    expect(mockDb.transaction).toHaveBeenCalled();
    expect(mockDb.delete).toHaveBeenCalled();
  });

  it('likes when no existing like', async () => {
    // First select finds nothing
    mockDb._resolveSelect([]);
    // update().returning() after insert
    mockDb._resolveInsert([{ likeCount: 6 }]);

    const result = await toggleLike('user-1', 'gen-1');

    expect(result).toEqual({ liked: true, likeCount: 6 });
    expect(mockDb.transaction).toHaveBeenCalled();
    expect(mockDb.insert).toHaveBeenCalled();
  });

  it('defaults likeCount to 0 when undefined', async () => {
    mockDb._resolveSelect([{ id: 'like-1' }]);
    mockDb._resolveInsert([{ likeCount: undefined }]);

    const result = await toggleLike('user-1', 'gen-1');

    expect(result).toEqual({ liked: false, likeCount: 0 });
  });
});

describe('isLikedByUser', () => {
  it('returns true when like exists', async () => {
    mockDb._resolveSelect([{ id: 'like-1' }]);

    const result = await isLikedByUser('user-1', 'gen-1');

    expect(result).toBe(true);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns false when no like exists', async () => {
    mockDb._resolveSelect([]);

    const result = await isLikedByUser('user-1', 'gen-1');

    expect(result).toBe(false);
  });
});

describe('batchCheckLiked', () => {
  it('returns empty map for empty generationIds', async () => {
    const result = await batchCheckLiked('user-1', []);

    expect(result).toEqual(new Map());
    expect(mockDb.select).not.toHaveBeenCalled();
  });

  it('returns map with liked state for each id', async () => {
    mockDb._resolveSelect([
      { generationId: 'gen-1' },
      { generationId: 'gen-3' },
    ]);

    const result = await batchCheckLiked('user-1', ['gen-1', 'gen-2', 'gen-3']);

    expect(result.get('gen-1')).toBe(true);
    expect(result.get('gen-2')).toBe(false);
    expect(result.get('gen-3')).toBe(true);
    expect(result.size).toBe(3);
  });

  it('returns all false when user has no likes', async () => {
    mockDb._resolveSelect([]);

    const result = await batchCheckLiked('user-1', ['gen-1', 'gen-2']);

    expect(result.get('gen-1')).toBe(false);
    expect(result.get('gen-2')).toBe(false);
  });
});

describe('getRecentLikesByUserId', () => {
  it('returns recent likes with default limit', async () => {
    const likes = [
      { generationId: 'gen-1', createdAt: new Date('2026-03-27') },
      { generationId: 'gen-2', createdAt: new Date('2026-03-26') },
    ];
    mockDb._resolveSelect(likes);

    const result = await getRecentLikesByUserId('user-1');

    expect(result).toEqual(likes);
    expect(mockDb.orderBy).toHaveBeenCalled();
    expect(mockDb.limit).toHaveBeenCalled();
  });

  it('returns empty array when no likes', async () => {
    mockDb._resolveSelect([]);

    const result = await getRecentLikesByUserId('user-1');

    expect(result).toEqual([]);
  });

  it('accepts custom limit', async () => {
    mockDb._resolveSelect([]);

    await getRecentLikesByUserId('user-1', 10);

    expect(mockDb.limit).toHaveBeenCalled();
  });
});
