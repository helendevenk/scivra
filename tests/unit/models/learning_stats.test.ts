import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock external deps BEFORE importing the model
vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

vi.mock('@/shared/lib/hash', () => ({
  getUuid: vi.fn(() => 'mock-uuid'),
}));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import {
  getLearningStats,
  getOrCreateLearningStats,
  incrementUpgGenerated,
  incrementUpgPublished,
  incrementExperimentCompleted,
  addStudyTime,
  updateStreak,
} from '@/shared/models/learning_stats';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const baseLearningStats = {
  id: 'ls-1',
  userId: 'u1',
  upgsGenerated: 5,
  upgsPublished: 2,
  upgsLiked: 10,
  experimentsStarted: 8,
  experimentsCompleted: 6,
  studyMinutes: 120,
  streakDays: 3,
  longestStreak: 7,
  lastActiveAt: new Date('2026-03-26T10:00:00Z'),
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-03-26'),
};

describe('getLearningStats', () => {
  it('returns stats when found', async () => {
    mockDb._resolveSelect([baseLearningStats]);

    const result = await getLearningStats('u1');

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(result).toEqual(baseLearningStats);
  });

  it('returns undefined when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await getLearningStats('nonexistent');

    expect(result).toBeUndefined();
  });
});

describe('getOrCreateLearningStats', () => {
  it('returns existing stats without creating', async () => {
    mockDb._resolveSelect([baseLearningStats]);

    const result = await getOrCreateLearningStats('u1');

    expect(result).toEqual(baseLearningStats);
    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it('creates new stats when none exist', async () => {
    let selectCallCount = 0;
    mockDb.then.mockImplementation((resolve: (v: unknown) => void) => {
      selectCallCount++;
      if (selectCallCount === 1) {
        // First getLearningStats: not found
        return Promise.resolve([]).then(resolve);
      }
      // Second getLearningStats after insert: found
      return Promise.resolve([baseLearningStats]).then(resolve);
    });

    const result = await getOrCreateLearningStats('u1');

    expect(mockDb.insert).toHaveBeenCalled();
    expect(result).toEqual(baseLearningStats);
  });

  it('throws error when creation fails', async () => {
    // Both selects return empty (insert succeeds but subsequent select still empty)
    mockDb._resolveSelect([]);

    await expect(getOrCreateLearningStats('u1')).rejects.toThrow(
      'Failed to create learning stats'
    );
  });
});

describe('incrementUpgGenerated', () => {
  it('increments upgsGenerated counter', async () => {
    // getOrCreateLearningStats select returns existing
    mockDb._resolveSelect([baseLearningStats]);

    await incrementUpgGenerated('u1');

    // First call is select (getOrCreateLearningStats), second is update
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });
});

describe('incrementUpgPublished', () => {
  it('increments upgsPublished counter', async () => {
    mockDb._resolveSelect([baseLearningStats]);

    await incrementUpgPublished('u1');

    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
  });
});

describe('incrementExperimentCompleted', () => {
  it('increments experimentsCompleted counter', async () => {
    mockDb._resolveSelect([baseLearningStats]);

    await incrementExperimentCompleted('u1');

    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
  });
});

describe('addStudyTime', () => {
  it('adds study minutes', async () => {
    mockDb._resolveSelect([baseLearningStats]);

    await addStudyTime('u1', 30);

    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
  });
});

describe('updateStreak', () => {
  it('does nothing when same day (daysDiff === 0)', async () => {
    const now = new Date();
    const statsToday = { ...baseLearningStats, lastActiveAt: now };
    mockDb._resolveSelect([statsToday]);

    await updateStreak('u1');

    // update should NOT be called for same-day activity
    expect(mockDb.update).not.toHaveBeenCalled();
  });

  it('increments streak for consecutive day (daysDiff === 1)', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const statsYesterday = {
      ...baseLearningStats,
      lastActiveAt: yesterday,
      streakDays: 3,
      longestStreak: 7,
    };
    mockDb._resolveSelect([statsYesterday]);

    await updateStreak('u1');

    expect(mockDb.update).toHaveBeenCalled();
    const setCall = mockDb.set.mock.calls[0][0];
    expect(setCall.streakDays).toBe(4); // 3 + 1
    expect(setCall.longestStreak).toBe(7); // max(7, 4) = 7
  });

  it('updates longestStreak when new streak exceeds it', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const statsYesterday = {
      ...baseLearningStats,
      lastActiveAt: yesterday,
      streakDays: 7,
      longestStreak: 7,
    };
    mockDb._resolveSelect([statsYesterday]);

    await updateStreak('u1');

    const setCall = mockDb.set.mock.calls[0][0];
    expect(setCall.streakDays).toBe(8);
    expect(setCall.longestStreak).toBe(8); // max(7, 8) = 8
  });

  it('resets streak to 1 when streak broken (daysDiff > 1)', async () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const statsOld = {
      ...baseLearningStats,
      lastActiveAt: threeDaysAgo,
      streakDays: 5,
      longestStreak: 10,
    };
    mockDb._resolveSelect([statsOld]);

    await updateStreak('u1');

    expect(mockDb.update).toHaveBeenCalled();
    const setCall = mockDb.set.mock.calls[0][0];
    expect(setCall.streakDays).toBe(1); // reset
    expect(setCall.longestStreak).toBe(10); // max(10, 1) = 10
  });
});
