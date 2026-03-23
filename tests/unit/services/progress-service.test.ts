import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock all external dependencies ──

vi.mock('@/shared/models/daily_usage', () => ({
  upsertDailyUsage: vi.fn(),
  getTotalUsedSeconds: vi.fn(async () => 0),
}));

vi.mock('@/shared/models/experiment_progress', () => ({
  getExperimentProgress: vi.fn(async () => null),
  upsertExperimentProgress: vi.fn(),
}));

// quota is a pure-function module — we let it run real code
// access module has subscriptionToTier which is also pure — let it run

// ── Import mocked modules ──

import {
  upsertDailyUsage,
  getTotalUsedSeconds,
} from '@/shared/models/daily_usage';
import {
  getExperimentProgress,
  upsertExperimentProgress,
} from '@/shared/models/experiment_progress';
import {
  trackUsage,
  getQuota,
  getProgress,
  updateProgress,
} from '@/shared/lib/usage/progress-service';

const mockedUpsertDaily = vi.mocked(upsertDailyUsage);
const mockedGetTotalUsed = vi.mocked(getTotalUsedSeconds);
const mockedGetProgress = vi.mocked(getExperimentProgress);
const mockedUpsertProgress = vi.mocked(upsertExperimentProgress);

// ── Tests ──

describe('trackUsage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetTotalUsed.mockResolvedValue(0);
  });

  // 1. increments daily usage
  it('should call upsertDailyUsage to increment usage', async () => {
    await trackUsage({
      keyType: 'user',
      keyValue: 'user-1',
      experimentId: 'exp-1',
      seconds: 30,
      planName: null,
    });

    expect(mockedUpsertDaily).toHaveBeenCalledTimes(1);
    expect(mockedUpsertDaily).toHaveBeenCalledWith(
      expect.objectContaining({
        keyType: 'user',
        keyValue: 'user-1',
        experimentId: 'exp-1',
        additionalSeconds: 30,
      })
    );
  });

  // 2. respects daily limit for free tier → returns exhausted when over limit
  it('should return exhausted=true for free tier when daily limit exceeded', async () => {
    mockedGetTotalUsed.mockResolvedValue(350); // over 300s free limit

    const snapshot = await trackUsage({
      keyType: 'session',
      keyValue: 'sess-1',
      experimentId: 'exp-1',
      seconds: 10,
      planName: null,
    });

    expect(snapshot.exhausted).toBe(true);
    expect(snapshot.remainingSeconds).toBe(0);
    expect(snapshot.limitSeconds).toBe(300);
  });

  // 3. no limit for pro tier
  it('should return exhausted=false and null limit for pro tier', async () => {
    mockedGetTotalUsed.mockResolvedValue(9999);

    const snapshot = await trackUsage({
      keyType: 'user',
      keyValue: 'user-1',
      experimentId: 'exp-1',
      seconds: 60,
      planName: 'pro-monthly',
    });

    expect(snapshot.exhausted).toBe(false);
    expect(snapshot.limitSeconds).toBeNull();
    expect(snapshot.remainingSeconds).toBeNull();
  });
});

describe('getQuota', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 4. returns correct snapshot for free tier
  it('should return correct quota snapshot for free tier', async () => {
    mockedGetTotalUsed.mockResolvedValue(120);

    const snapshot = await getQuota({
      keyType: 'user',
      keyValue: 'user-1',
      planName: null,
    });

    expect(snapshot.limitSeconds).toBe(300);
    expect(snapshot.usedSeconds).toBe(120);
    expect(snapshot.remainingSeconds).toBe(180);
    expect(snapshot.exhausted).toBe(false);
  });

  // 5. returns unlimited for pro tier
  it('should return unlimited quota for pro tier', async () => {
    mockedGetTotalUsed.mockResolvedValue(500);

    const snapshot = await getQuota({
      keyType: 'user',
      keyValue: 'user-1',
      planName: 'pro-annual',
    });

    expect(snapshot.limitSeconds).toBeNull();
    expect(snapshot.exhausted).toBe(false);
    expect(snapshot.remainingSeconds).toBeNull();
  });
});

describe('getProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 6. returns progress for known user+experiment
  it('should return populated snapshot for existing progress', async () => {
    mockedGetProgress.mockResolvedValue({
      id: 'prog-1',
      userId: 'user-1',
      experimentId: 'exp-1',
      completedChallenges: JSON.stringify(['challenge-a', 'challenge-b']),
      totalTimeSpent: 600,
      sessionsCount: 5,
      lastAccessedAt: new Date('2026-03-20T10:00:00Z'),
      firstUsedAt: new Date('2026-03-15T08:00:00Z'),
      lastParameters: '{"gravity":9.8}',
      createdAt: new Date(),
    });

    const snapshot = await getProgress('user-1', 'exp-1');

    expect(snapshot.completedChallenges).toEqual(['challenge-a', 'challenge-b']);
    expect(snapshot.totalTimeSpent).toBe(600);
    expect(snapshot.sessionsCount).toBe(5);
    expect(snapshot.lastAccessedAt).toBe('2026-03-20T10:00:00.000Z');
    expect(snapshot.firstUsedAt).toBe('2026-03-15T08:00:00.000Z');
  });

  // 7. returns empty snapshot for unknown
  it('should return empty snapshot when no progress exists', async () => {
    mockedGetProgress.mockResolvedValue(null);

    const snapshot = await getProgress('user-1', 'unknown-exp');

    expect(snapshot.completedChallenges).toEqual([]);
    expect(snapshot.totalTimeSpent).toBe(0);
    expect(snapshot.sessionsCount).toBe(0);
    expect(snapshot.lastAccessedAt).toBeNull();
    expect(snapshot.firstUsedAt).toBeNull();
  });
});

describe('updateProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 8. creates new progress record
  it('should call upsertExperimentProgress and return snapshot', async () => {
    mockedUpsertProgress.mockResolvedValue({
      id: 'prog-new',
      userId: 'user-1',
      experimentId: 'exp-1',
      completedChallenges: JSON.stringify(['c1']),
      totalTimeSpent: 0,
      sessionsCount: 0,
      lastAccessedAt: new Date('2026-03-23T00:00:00Z'),
      firstUsedAt: new Date('2026-03-23T00:00:00Z'),
      lastParameters: null,
      createdAt: new Date(),
    });

    const snapshot = await updateProgress({
      userId: 'user-1',
      experimentId: 'exp-1',
      completedChallenges: ['c1'],
    });

    expect(mockedUpsertProgress).toHaveBeenCalledWith('user-1', 'exp-1', {
      completedChallenges: ['c1'],
      lastParameters: undefined,
    });
    expect(snapshot.completedChallenges).toEqual(['c1']);
  });

  // 9. updates existing with new challenges
  it('should pass new challenges to upsert for merging', async () => {
    mockedUpsertProgress.mockResolvedValue({
      id: 'prog-1',
      userId: 'user-1',
      experimentId: 'exp-1',
      completedChallenges: JSON.stringify(['c1', 'c2', 'c3']),
      totalTimeSpent: 120,
      sessionsCount: 3,
      lastAccessedAt: new Date('2026-03-23T12:00:00Z'),
      firstUsedAt: new Date('2026-03-20T08:00:00Z'),
      lastParameters: null,
      createdAt: new Date(),
    });

    const snapshot = await updateProgress({
      userId: 'user-1',
      experimentId: 'exp-1',
      completedChallenges: ['c2', 'c3'],
    });

    expect(snapshot.completedChallenges).toEqual(['c1', 'c2', 'c3']);
  });

  // 10. merges lastParameters
  it('should pass lastParameters to upsert', async () => {
    mockedUpsertProgress.mockResolvedValue({
      id: 'prog-1',
      userId: 'user-1',
      experimentId: 'exp-1',
      completedChallenges: null,
      totalTimeSpent: 60,
      sessionsCount: 1,
      lastAccessedAt: new Date('2026-03-23T12:00:00Z'),
      firstUsedAt: new Date('2026-03-23T12:00:00Z'),
      lastParameters: '{"velocity":10,"angle":45}',
      createdAt: new Date(),
    });

    const snapshot = await updateProgress({
      userId: 'user-1',
      experimentId: 'exp-1',
      lastParameters: '{"velocity":10,"angle":45}',
    });

    expect(mockedUpsertProgress).toHaveBeenCalledWith('user-1', 'exp-1', {
      completedChallenges: undefined,
      lastParameters: '{"velocity":10,"angle":45}',
    });
    expect(snapshot.completedChallenges).toEqual([]);
  });
});
