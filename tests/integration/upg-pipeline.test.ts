/**
 * UPG Pipeline Integration Tests
 *
 * Covers the current UPG orchestration path:
 * request parsing -> auth/quota/rate-limit -> lock -> generateCore ->
 * credit consumption / refund -> API response.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/models/user', () => ({
  getUserInfo: vi.fn(),
}));

vi.mock('@/shared/models/credit', () => ({
  getRemainingCredits: vi.fn(),
  consumeCredits: vi.fn(),
  refundCredits: vi.fn(),
}));

vi.mock('@/shared/models/upg_daily_quota', () => ({
  getDailyQuotaCount: vi.fn(),
  incrementDailyQuota: vi.fn(),
}));

vi.mock('@/shared/models/subscription', () => ({
  getCurrentSubscription: vi.fn(),
}));

vi.mock('@/shared/lib/experiments/access', () => ({
  subscriptionToTier: vi.fn(),
}));

vi.mock('@/shared/lib/upg/generate-core', () => ({
  generateCore: vi.fn(),
}));

vi.mock('@/shared/lib/upg/disciplines', () => ({
  isValidDiscipline: vi.fn(),
  getDisciplineConfig: vi.fn(),
}));

vi.mock('@/shared/lib/redis', () => ({
  checkRateLimit: vi.fn(),
  acquireLock: vi.fn(),
  releaseLock: vi.fn(),
}));

import { POST } from '@/app/api/upg/generate/route';
import {
  consumeCredits,
  getRemainingCredits,
  refundCredits,
} from '@/shared/models/credit';
import { getCurrentSubscription } from '@/shared/models/subscription';
import {
  getDailyQuotaCount,
  incrementDailyQuota,
} from '@/shared/models/upg_daily_quota';
import { getUserInfo } from '@/shared/models/user';
import { subscriptionToTier } from '@/shared/lib/experiments/access';
import { generateCore } from '@/shared/lib/upg/generate-core';
import {
  getDisciplineConfig,
  isValidDiscipline,
} from '@/shared/lib/upg/disciplines';
import {
  acquireLock,
  checkRateLimit,
  releaseLock,
} from '@/shared/lib/redis';

function makeRequest(
  body: Record<string, unknown> = {
    prompt: 'simulate a pendulum',
    discipline: 'physics',
    language: 'en',
  },
  headers: Record<string, string> = {}
) {
  return new Request('http://localhost/api/upg/generate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '1.2.3.4',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function setupAuthenticatedUser() {
  vi.mocked(getUserInfo).mockResolvedValue({
    id: 'user-1',
    email: 'student@example.com',
  } as never);
  vi.mocked(getCurrentSubscription).mockResolvedValue(undefined as never);
  vi.mocked(subscriptionToTier).mockReturnValue('free' as never);
  vi.mocked(getDailyQuotaCount).mockResolvedValue(0);
  vi.mocked(getRemainingCredits).mockResolvedValue(20);
}

function setupAnonymousUser() {
  vi.mocked(getUserInfo).mockResolvedValue(undefined);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(isValidDiscipline).mockReturnValue(true);
  vi.mocked(getDisciplineConfig).mockReturnValue({
    id: 'physics',
    name: { en: 'Physics', zh: '物理' },
    enabled: true,
  } as never);
  vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true } as never);
  vi.mocked(acquireLock).mockResolvedValue(true);
  vi.mocked(releaseLock).mockResolvedValue(undefined);
  vi.mocked(generateCore).mockResolvedValue({
    id: 'gen-1',
    status: 'completed',
    htmlContent: '<html>ok</html>',
    inputTokens: 100,
    outputTokens: 400,
  } as never);
  vi.mocked(consumeCredits).mockResolvedValue({ id: 'credit-1' } as never);
  vi.mocked(incrementDailyQuota).mockResolvedValue(undefined as never);
  vi.mocked(refundCredits).mockResolvedValue({ id: 'refund-1' } as never);
});

describe('UPG pipeline orchestration', () => {
  it('runs the authenticated generation flow end-to-end', async () => {
    setupAuthenticatedUser();

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json).toEqual({
      code: 0,
      message: 'ok',
      data: {
        id: 'gen-1',
        status: 'completed',
        htmlContent: '<html>ok</html>',
      },
    });
    expect(generateCore).toHaveBeenCalledWith({
      prompt: 'simulate a pendulum',
      language: 'en',
      userId: 'user-1',
      discipline: 'physics',
    });
    expect(consumeCredits).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        credits: 10,
        scene: 'upg-generate',
      })
    );
    expect(incrementDailyQuota).toHaveBeenCalledWith(
      'user-1',
      expect.any(String)
    );
    expect(releaseLock).toHaveBeenCalledTimes(1);
  });

  it('uses the anonymous path without credit consumption', async () => {
    setupAnonymousUser();

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(checkRateLimit).toHaveBeenCalledWith(
      expect.stringContaining('upg:anon:'),
      1,
      86400
    );
    expect(generateCore).toHaveBeenCalledWith(
      expect.objectContaining({ userId: null })
    );
    expect(consumeCredits).not.toHaveBeenCalled();
    expect(incrementDailyQuota).not.toHaveBeenCalled();
  });

  it('short-circuits without charging when generation fails', async () => {
    setupAuthenticatedUser();
    vi.mocked(generateCore).mockResolvedValue({
      id: 'gen-failed',
      status: 'failed',
      htmlContent: null,
      errorMessage: 'Quality check failed',
      inputTokens: 120,
      outputTokens: 0,
    } as never);

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toContain('Quality check failed');
    expect(consumeCredits).not.toHaveBeenCalled();
    expect(refundCredits).not.toHaveBeenCalled();
    expect(releaseLock).toHaveBeenCalledTimes(1);
  });

  it('refunds credits if post-generation persistence fails', async () => {
    setupAuthenticatedUser();
    vi.mocked(incrementDailyQuota).mockRejectedValueOnce(
      new Error('quota write failed')
    );

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toContain('quota write failed');
    expect(consumeCredits).toHaveBeenCalledTimes(1);
    expect(refundCredits).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        credits: 10,
        scene: 'upg-refund',
        relatedCreditId: 'credit-1',
      })
    );
  });

  it('rejects invalid disciplines before orchestration continues', async () => {
    setupAuthenticatedUser();
    vi.mocked(isValidDiscipline).mockReturnValue(false);

    const res = await POST(
      makeRequest({ prompt: 'simulate a pendulum', discipline: 'alchemy' })
    );
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toContain('Invalid discipline');
    expect(generateCore).not.toHaveBeenCalled();
    expect(acquireLock).not.toHaveBeenCalled();
  });

  it('releases the lock even when a request is rejected after lock allocation', async () => {
    setupAuthenticatedUser();
    vi.mocked(acquireLock).mockResolvedValue(false);

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toContain('already in progress');
    expect(releaseLock).toHaveBeenCalledTimes(1);
  });
});
