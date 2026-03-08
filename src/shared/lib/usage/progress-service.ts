import {
  upsertDailyUsage,
  getTotalUsedSeconds,
} from '@/shared/models/daily_usage';
import {
  getExperimentProgress,
  upsertExperimentProgress,
  type ExperimentProgress,
} from '@/shared/models/experiment_progress';
import {
  normalizeTrackedSeconds,
  buildQuotaSnapshot,
  type QuotaSnapshot,
} from '@/shared/lib/usage/quota';
import { subscriptionToTier } from '@/shared/lib/experiments/access';

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── Types ───

type TrackInput = {
  keyType: 'user' | 'session';
  keyValue: string;
  experimentId: string;
  seconds: number;
  planName: string | null;
};

type GetQuotaInput = {
  keyType: 'user' | 'session';
  keyValue: string;
  planName: string | null;
};

type UpdateProgressInput = {
  userId: string;
  experimentId: string;
  completedChallenges?: string[];
  lastParameters?: string;
};

export type ProgressSnapshot = {
  completedChallenges: string[];
  totalTimeSpent: number;
  sessionsCount: number;
  lastAccessedAt: string | null;
  firstUsedAt: string | null;
};

// ─── Quota ───

export async function trackUsage(input: TrackInput): Promise<QuotaSnapshot> {
  const tier = subscriptionToTier(input.planName);
  const usageDate = todayDateString();
  const normalized = normalizeTrackedSeconds(input.seconds);

  if (normalized > 0) {
    await upsertDailyUsage({
      keyType: input.keyType,
      keyValue: input.keyValue,
      experimentId: input.experimentId,
      usageDate,
      additionalSeconds: normalized,
    });

    // Sync to experimentProgress for logged-in users
    if (input.keyType === 'user') {
      await upsertExperimentProgress(input.keyValue, input.experimentId, {
        additionalSeconds: normalized,
        incrementSession: true,
      });
    }
  }

  const usedSeconds = await getTotalUsedSeconds({
    keyType: input.keyType,
    keyValue: input.keyValue,
    usageDate,
  });

  return buildQuotaSnapshot({ tier, usedSeconds });
}

export async function getQuota(input: GetQuotaInput): Promise<QuotaSnapshot> {
  const tier = subscriptionToTier(input.planName);
  const usageDate = todayDateString();

  const usedSeconds = await getTotalUsedSeconds({
    keyType: input.keyType,
    keyValue: input.keyValue,
    usageDate,
  });

  return buildQuotaSnapshot({ tier, usedSeconds });
}

// ─── Progress ───

export async function getProgress(
  userId: string,
  experimentId: string
): Promise<ProgressSnapshot> {
  const row = await getExperimentProgress(userId, experimentId);
  return rowToSnapshot(row);
}

export async function updateProgress(
  input: UpdateProgressInput
): Promise<ProgressSnapshot> {
  const row = await upsertExperimentProgress(
    input.userId,
    input.experimentId,
    {
      completedChallenges: input.completedChallenges,
      lastParameters: input.lastParameters,
    }
  );
  return rowToSnapshot(row);
}

// ─── Helpers ───

function rowToSnapshot(row: ExperimentProgress | null): ProgressSnapshot {
  if (!row) {
    return {
      completedChallenges: [],
      totalTimeSpent: 0,
      sessionsCount: 0,
      lastAccessedAt: null,
      firstUsedAt: null,
    };
  }
  return {
    completedChallenges: row.completedChallenges
      ? JSON.parse(row.completedChallenges)
      : [],
    totalTimeSpent: row.totalTimeSpent,
    sessionsCount: row.sessionsCount,
    lastAccessedAt: row.lastAccessedAt?.toISOString() ?? null,
    firstUsedAt: row.firstUsedAt?.toISOString() ?? null,
  };
}
