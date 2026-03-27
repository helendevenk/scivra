import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({ db: vi.fn() }));
vi.mock('@/shared/lib/hash', () => ({ getUuid: vi.fn(() => 'mock-uuid') }));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { getOrCreateProgress, updateProgress, getProgressByUser } from '@/shared/models/ap_user_progress';

let mockDb: ReturnType<typeof createMockDb>;
beforeEach(() => { vi.clearAllMocks(); mockDb = createMockDb(); vi.mocked(db).mockReturnValue(mockDb as any); });

const M = {
  id: 'p-1', userId: 'u-1', examId: 'e-1',
  totalAttempted: 10, totalCorrect: 7,
  unitBreakdown: JSON.stringify([{ unitId: 'u-1', attempted: 10, correct: 7 }]),
  weakUnits: JSON.stringify([]),
  streakDays: 3,
  lastAttemptAt: new Date('2026-03-26'),
  createdAt: new Date(),
};

describe('getOrCreateProgress', () => {
  it('returns existing progress', async () => {
    mockDb._resolveSelect([M]);
    expect(await getOrCreateProgress('u-1', 'e-1')).toEqual(M);
  });
  it('creates new when not found', async () => {
    mockDb._resolveSelect([]);
    mockDb._resolveInsert([{ ...M, totalAttempted: 0, totalCorrect: 0 }]);
    const result = await getOrCreateProgress('u-1', 'e-1');
    expect(result.totalAttempted).toBe(0);
    expect(mockDb.insert).toHaveBeenCalled();
  });
});

describe('updateProgress', () => {
  it('updates progress with correct answer', async () => {
    // getOrCreateProgress: find existing
    mockDb._resolveSelect([M]);
    // updateProgress: returns updated
    mockDb._resolveInsert([{ ...M, totalAttempted: 11, totalCorrect: 8 }]);
    const result = await updateProgress('u-1', 'e-1', true, 'u-1');
    expect(result.totalAttempted).toBe(11);
    expect(result.totalCorrect).toBe(8);
  });

  it('resets streak when gap > 1 day', async () => {
    const old = { ...M, lastAttemptAt: new Date('2026-03-20'), streakDays: 5 };
    mockDb._resolveSelect([old]);
    mockDb._resolveInsert([{ ...old, streakDays: 1 }]);
    const result = await updateProgress('u-1', 'e-1', false, 'u-1');
    expect(result.streakDays).toBe(1);
  });
});

describe('getProgressByUser', () => {
  it('returns all progress for user', async () => {
    mockDb._resolveSelect([M]);
    expect(await getProgressByUser('u-1')).toHaveLength(1);
  });
});
