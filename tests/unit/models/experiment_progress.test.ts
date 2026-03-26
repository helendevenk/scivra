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
  getExperimentProgress,
  upsertExperimentProgress,
} from '@/shared/models/experiment_progress';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_PROGRESS = {
  id: 'prog-1',
  userId: 'user-1',
  experimentId: 'projectile-motion',
  totalTimeSpent: 120,
  sessionsCount: 3,
  completedChallenges: JSON.stringify(['q1', 'q2']),
  lastParameters: '{"angle":45}',
  lastAccessedAt: new Date('2026-03-27T00:00:00Z'),
  firstUsedAt: new Date('2026-03-25T00:00:00Z'),
};

describe('getExperimentProgress', () => {
  it('returns progress when found', async () => {
    mockDb._resolveSelect([MOCK_PROGRESS]);

    const result = await getExperimentProgress('user-1', 'projectile-motion');

    expect(result).toEqual(MOCK_PROGRESS);
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns null when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await getExperimentProgress('user-1', 'nonexistent');

    expect(result).toBeNull();
  });
});

describe('upsertExperimentProgress', () => {
  it('creates new progress record when none exists', async () => {
    // First call: getExperimentProgress returns nothing
    mockDb._resolveSelect([]);
    // Second call: insert returns new record
    mockDb._resolveInsert([{ ...MOCK_PROGRESS, totalTimeSpent: 60, sessionsCount: 1 }]);

    const result = await upsertExperimentProgress('user-1', 'projectile-motion', {
      additionalSeconds: 60,
      incrementSession: true,
    });

    expect(result.totalTimeSpent).toBe(60);
    expect(result.sessionsCount).toBe(1);
    expect(mockDb.insert).toHaveBeenCalled();
  });

  it('updates existing progress with additional time', async () => {
    mockDb._resolveSelect([MOCK_PROGRESS]);
    const updated = { ...MOCK_PROGRESS, totalTimeSpent: 180 };
    mockDb._resolveInsert([updated]); // returning() resolves from insert pool

    const result = await upsertExperimentProgress('user-1', 'projectile-motion', {
      additionalSeconds: 60,
    });

    expect(result.totalTimeSpent).toBe(180);
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
  });

  it('merges completed challenges without duplicates', async () => {
    mockDb._resolveSelect([MOCK_PROGRESS]);
    const merged = { ...MOCK_PROGRESS, completedChallenges: JSON.stringify(['q1', 'q2', 'q3']) };
    mockDb._resolveInsert([merged]);

    const result = await upsertExperimentProgress('user-1', 'projectile-motion', {
      completedChallenges: ['q2', 'q3'],
    });

    const challenges = JSON.parse(result.completedChallenges!);
    expect(challenges).toEqual(['q1', 'q2', 'q3']);
  });

  it('increments session count on update', async () => {
    mockDb._resolveSelect([MOCK_PROGRESS]);
    const updated = { ...MOCK_PROGRESS, sessionsCount: 4 };
    mockDb._resolveInsert([updated]);

    const result = await upsertExperimentProgress('user-1', 'projectile-motion', {
      incrementSession: true,
    });

    expect(result.sessionsCount).toBe(4);
  });

  it('stores lastParameters on create', async () => {
    mockDb._resolveSelect([]);
    const created = { ...MOCK_PROGRESS, lastParameters: '{"mass":10}' };
    mockDb._resolveInsert([created]);

    const result = await upsertExperimentProgress('user-1', 'projectile-motion', {
      lastParameters: '{"mass":10}',
    });

    expect(result.lastParameters).toBe('{"mass":10}');
  });
});
