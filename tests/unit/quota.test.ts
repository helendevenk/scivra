import { describe, it, expect } from 'vitest';
import {
  normalizeTrackedSeconds,
  buildQuotaSnapshot,
  FREE_DAILY_LIMIT_SECONDS,
} from '@/shared/lib/usage/quota';

describe('normalizeTrackedSeconds', () => {
  it('returns 0 for NaN', () => {
    expect(normalizeTrackedSeconds(NaN)).toBe(0);
  });

  it('returns 0 for Infinity', () => {
    expect(normalizeTrackedSeconds(Infinity)).toBe(0);
  });

  it('returns 0 for negative values', () => {
    expect(normalizeTrackedSeconds(-10)).toBe(0);
  });

  it('returns 0 for zero', () => {
    expect(normalizeTrackedSeconds(0)).toBe(0);
  });

  it('floors fractional values', () => {
    expect(normalizeTrackedSeconds(5.9)).toBe(5);
  });

  it('caps at 120 seconds', () => {
    expect(normalizeTrackedSeconds(200)).toBe(120);
  });

  it('passes through valid values', () => {
    expect(normalizeTrackedSeconds(60)).toBe(60);
  });
});

describe('buildQuotaSnapshot', () => {
  it('returns unlimited for pro tier', () => {
    const snap = buildQuotaSnapshot({ tier: 'pro', usedSeconds: 100 });
    expect(snap.limitSeconds).toBeNull();
    expect(snap.remainingSeconds).toBeNull();
    expect(snap.exhausted).toBe(false);
  });

  it('returns unlimited for max tier', () => {
    const snap = buildQuotaSnapshot({ tier: 'max', usedSeconds: 9999 });
    expect(snap.limitSeconds).toBeNull();
    expect(snap.exhausted).toBe(false);
  });

  it('returns correct remaining for free tier', () => {
    const snap = buildQuotaSnapshot({ tier: 'free', usedSeconds: 100 });
    expect(snap.limitSeconds).toBe(FREE_DAILY_LIMIT_SECONDS);
    expect(snap.usedSeconds).toBe(100);
    expect(snap.remainingSeconds).toBe(FREE_DAILY_LIMIT_SECONDS - 100);
    expect(snap.exhausted).toBe(false);
  });

  it('marks exhausted when limit reached', () => {
    const snap = buildQuotaSnapshot({ tier: 'free', usedSeconds: FREE_DAILY_LIMIT_SECONDS });
    expect(snap.remainingSeconds).toBe(0);
    expect(snap.exhausted).toBe(true);
  });

  it('marks exhausted when over limit', () => {
    const snap = buildQuotaSnapshot({ tier: 'free', usedSeconds: FREE_DAILY_LIMIT_SECONDS + 50 });
    expect(snap.remainingSeconds).toBe(0);
    expect(snap.exhausted).toBe(true);
  });

  it('handles zero usage for free tier', () => {
    const snap = buildQuotaSnapshot({ tier: 'free', usedSeconds: 0 });
    expect(snap.remainingSeconds).toBe(FREE_DAILY_LIMIT_SECONDS);
    expect(snap.exhausted).toBe(false);
  });
});
