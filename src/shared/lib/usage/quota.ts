import type { Tier } from '@/shared/types/experiment';

export const FREE_DAILY_LIMIT_SECONDS = 300;
const MAX_TRACKED_SECONDS_PER_REQUEST = 120;

export type QuotaSnapshot = {
  limitSeconds: number | null;
  usedSeconds: number;
  remainingSeconds: number | null;
  exhausted: boolean;
};

export function normalizeTrackedSeconds(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const normalized = Math.floor(value);
  if (normalized <= 0) return 0;
  return Math.min(normalized, MAX_TRACKED_SECONDS_PER_REQUEST);
}

export function buildQuotaSnapshot({
  tier,
  usedSeconds,
}: {
  tier: Tier;
  usedSeconds: number;
}): QuotaSnapshot {
  if (tier === 'pro' || tier === 'max') {
    return {
      limitSeconds: null,
      usedSeconds,
      remainingSeconds: null,
      exhausted: false,
    };
  }

  const limitSeconds = FREE_DAILY_LIMIT_SECONDS;
  const remainingSeconds = Math.max(0, limitSeconds - usedSeconds);

  return {
    limitSeconds,
    usedSeconds,
    remainingSeconds,
    exhausted: remainingSeconds <= 0,
  };
}
