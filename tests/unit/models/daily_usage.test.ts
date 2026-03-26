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
  getDailyUsage,
  upsertDailyUsage,
  getTotalUsedSeconds,
} from '@/shared/models/daily_usage';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_USAGE = {
  id: 'usage-1',
  keyType: 'user',
  keyValue: 'user-1',
  experimentId: 'projectile-motion',
  usageDate: '2026-03-27',
  usedSeconds: 300,
};

describe('getDailyUsage', () => {
  it('returns usage record when found', async () => {
    mockDb._resolveSelect([MOCK_USAGE]);

    const result = await getDailyUsage({
      keyType: 'user',
      keyValue: 'user-1',
      experimentId: 'projectile-motion',
      usageDate: '2026-03-27',
    });

    expect(result).toEqual(MOCK_USAGE);
  });

  it('returns null when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await getDailyUsage({
      keyType: 'user',
      keyValue: 'user-1',
      experimentId: 'nonexistent',
      usageDate: '2026-03-27',
    });

    expect(result).toBeNull();
  });
});

describe('upsertDailyUsage', () => {
  it('creates new record when none exists', async () => {
    mockDb._resolveSelect([]);
    mockDb._resolveInsert([{ ...MOCK_USAGE, usedSeconds: 60 }]);

    const result = await upsertDailyUsage({
      keyType: 'user',
      keyValue: 'user-1',
      experimentId: 'projectile-motion',
      usageDate: '2026-03-27',
      additionalSeconds: 60,
    });

    expect(result.usedSeconds).toBe(60);
    expect(mockDb.insert).toHaveBeenCalled();
  });

  it('increments seconds when record exists', async () => {
    mockDb._resolveSelect([MOCK_USAGE]);
    mockDb._resolveInsert([{ ...MOCK_USAGE, usedSeconds: 360 }]);

    const result = await upsertDailyUsage({
      keyType: 'user',
      keyValue: 'user-1',
      experimentId: 'projectile-motion',
      usageDate: '2026-03-27',
      additionalSeconds: 60,
    });

    expect(result.usedSeconds).toBe(360);
    expect(mockDb.update).toHaveBeenCalled();
  });
});

describe('getTotalUsedSeconds', () => {
  it('sums seconds across all experiments for a date', async () => {
    mockDb._resolveSelect([
      { ...MOCK_USAGE, usedSeconds: 300 },
      { ...MOCK_USAGE, experimentId: 'wave-on-string', usedSeconds: 150 },
    ]);

    const result = await getTotalUsedSeconds({
      keyType: 'user',
      keyValue: 'user-1',
      usageDate: '2026-03-27',
    });

    expect(result).toBe(450);
  });

  it('returns 0 when no usage exists', async () => {
    mockDb._resolveSelect([]);

    const result = await getTotalUsedSeconds({
      keyType: 'user',
      keyValue: 'user-1',
      usageDate: '2026-03-27',
    });

    expect(result).toBe(0);
  });
});
