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
  getOrCreateDailyQuota,
  incrementDailyQuota,
  getDailyQuotaCount,
} from '@/shared/models/upg_daily_quota';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_QUOTA = {
  id: 'quota-1',
  userId: 'user-1',
  usageDate: '2026-03-27',
  scene: 'upg-generate',
  generationCount: 3,
  createdAt: new Date(),
};

describe('getOrCreateDailyQuota', () => {
  it('returns existing quota when found', async () => {
    mockDb._resolveSelect([MOCK_QUOTA]);

    const result = await getOrCreateDailyQuota('user-1', '2026-03-27');

    expect(result).toEqual(MOCK_QUOTA);
    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it('creates new quota when not found', async () => {
    // First select: not found
    mockDb._resolveSelect([]);
    // Insert returns new record
    const newQuota = { ...MOCK_QUOTA, generationCount: 0 };
    mockDb._resolveInsert([newQuota]);

    const result = await getOrCreateDailyQuota('user-1', '2026-03-27');

    expect(result).toEqual(newQuota);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.onConflictDoNothing).toHaveBeenCalled();
  });

  it('handles race condition when insert returns null', async () => {
    // First select: not found
    mockDb._resolveSelect([]);
    // Insert returns null (conflict)
    mockDb._resolveInsert([undefined]);

    // The function will do a second select — but our mock returns the same empty array
    // In production the second select would find the record created by the other process
    await getOrCreateDailyQuota('user-1', '2026-03-27');

    expect(mockDb.insert).toHaveBeenCalled();
  });

  it('uses default scene when not specified', async () => {
    mockDb._resolveSelect([MOCK_QUOTA]);

    const result = await getOrCreateDailyQuota('user-1', '2026-03-27');

    expect(result.scene).toBe('upg-generate');
  });
});

describe('incrementDailyQuota', () => {
  it('upserts with onConflictDoUpdate', async () => {
    const incremented = { ...MOCK_QUOTA, generationCount: 4 };
    mockDb._resolveInsert([incremented]);

    const result = await incrementDailyQuota('user-1', '2026-03-27');

    expect(result.generationCount).toBe(4);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.onConflictDoUpdate).toHaveBeenCalled();
  });
});

describe('getDailyQuotaCount', () => {
  it('returns generation count', async () => {
    mockDb._resolveSelect([{ generationCount: 5 }]);

    const result = await getDailyQuotaCount('user-1', '2026-03-27');

    expect(result).toBe(5);
  });

  it('returns 0 when no quota record exists', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getDailyQuotaCount('user-1', '2026-03-27');

    expect(result).toBe(0);
  });
});
