import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mocks ---

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
  subscriptionToTier: vi.fn().mockReturnValue('free'),
}));

vi.mock('@/shared/lib/upg/generate-core', () => ({
  generateCore: vi.fn(),
}));

vi.mock('@/shared/lib/upg/disciplines', () => ({
  isValidDiscipline: vi.fn().mockReturnValue(true),
  getDisciplineConfig: vi.fn().mockReturnValue({
    id: 'physics',
    name: { en: 'Physics', zh: '物理' },
    enabled: true,
  }),
}));

vi.mock('@/shared/lib/redis', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
  acquireLock: vi.fn().mockResolvedValue(true),
  releaseLock: vi.fn().mockResolvedValue(undefined),
}));

// Re-import after mocks
import { POST } from '@/app/api/upg/generate/route';
import { getUserInfo } from '@/shared/models/user';
import { getRemainingCredits, consumeCredits } from '@/shared/models/credit';
import { getDailyQuotaCount, incrementDailyQuota } from '@/shared/models/upg_daily_quota';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { subscriptionToTier } from '@/shared/lib/experiments/access';
import { generateCore } from '@/shared/lib/upg/generate-core';
import { isValidDiscipline, getDisciplineConfig } from '@/shared/lib/upg/disciplines';
import { checkRateLimit, acquireLock, releaseLock } from '@/shared/lib/redis';

// --- Helpers ---

function makeRequest(
  body: Record<string, unknown> = { prompt: 'test gravity', discipline: 'physics' },
  headers: Record<string, string> = {}
) {
  return new Request('http://localhost/api/upg/generate', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '1.2.3.4',
      ...headers,
    },
  });
}

function setupAuthenticatedUser() {
  vi.mocked(getUserInfo).mockResolvedValue({ id: 'user-1', email: 'test@example.com' } as never);
  vi.mocked(getRemainingCredits).mockResolvedValue(100);
  vi.mocked(getDailyQuotaCount).mockResolvedValue(0);
  vi.mocked(getCurrentSubscription).mockResolvedValue(null);
  vi.mocked(subscriptionToTier).mockReturnValue('free' as never);
}

function setupAnonymousUser() {
  vi.mocked(getUserInfo).mockResolvedValue(null);
}

function setupSuccessfulGeneration() {
  vi.mocked(generateCore).mockResolvedValue({
    id: 'gen-1',
    status: 'completed',
    htmlContent: '<div>physics sim</div>',
  } as never);
  vi.mocked(consumeCredits).mockResolvedValue({ id: 'credit-1' } as never);
  vi.mocked(incrementDailyQuota).mockResolvedValue(undefined as never);
}

// --- Tests ---

describe('POST /api/upg/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset default mock return values
    vi.mocked(isValidDiscipline).mockReturnValue(true);
    vi.mocked(getDisciplineConfig).mockReturnValue({
      id: 'physics',
      name: { en: 'Physics', zh: '物理' },
      enabled: true,
    } as never);
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true } as never);
    vi.mocked(acquireLock).mockResolvedValue(true);
    vi.mocked(releaseLock).mockResolvedValue(undefined);
  });

  it('should generate successfully for authenticated user', async () => {
    setupAuthenticatedUser();
    setupSuccessfulGeneration();

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.id).toBe('gen-1');
    expect(json.data.htmlContent).toBe('<div>physics sim</div>');
    expect(consumeCredits).toHaveBeenCalled();
    expect(releaseLock).toHaveBeenCalled();
  });

  it('should reject empty prompt (too short)', async () => {
    setupAuthenticatedUser();

    const res = await POST(makeRequest({ prompt: '', discipline: 'physics' }));
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toContain('Prompt length');
  });

  it('should reject when rate limited (anonymous)', async () => {
    setupAnonymousUser();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: false } as never);

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toContain('once per day');
  });

  it('should reject when generateCore returns moderation failure', async () => {
    setupAuthenticatedUser();
    vi.mocked(generateCore).mockResolvedValue({
      status: 'failed',
      errorMessage: 'Content flagged by moderation',
    } as never);

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toContain('Content flagged');
  });

  it('should allow anonymous user when rate limit allows', async () => {
    setupAnonymousUser();
    setupSuccessfulGeneration();

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.id).toBe('gen-1');
    // Anonymous users should not consume credits
    expect(consumeCredits).not.toHaveBeenCalled();
  });

  it('should check credits for authenticated user', async () => {
    setupAuthenticatedUser();
    vi.mocked(getRemainingCredits).mockResolvedValue(0);

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toContain('Insufficient credits');
  });

  it('should reject daily limit exceeded for authenticated user', async () => {
    setupAuthenticatedUser();
    vi.mocked(getDailyQuotaCount).mockResolvedValue(3); // Free limit is 3

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toContain('Daily generation limit');
  });

  it('should validate discipline parameter', async () => {
    setupAuthenticatedUser();
    vi.mocked(isValidDiscipline).mockReturnValue(false);

    const res = await POST(
      makeRequest({ prompt: 'test gravity', discipline: 'astrology' })
    );
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toContain('Invalid discipline');
  });

  it('should return error when lock acquisition fails', async () => {
    setupAuthenticatedUser();
    vi.mocked(acquireLock).mockResolvedValue(false);

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toContain('already in progress');
  });

  it('should return error when LLM generation fails', async () => {
    setupAuthenticatedUser();
    vi.mocked(generateCore).mockRejectedValue(new Error('LLM timeout'));

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toContain('LLM timeout');
    expect(releaseLock).toHaveBeenCalled();
  });

  it('should store result and consume credits on success', async () => {
    setupAuthenticatedUser();
    setupSuccessfulGeneration();

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(consumeCredits).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        credits: 10,
        scene: 'upg-generate',
      })
    );
    expect(incrementDailyQuota).toHaveBeenCalled();
  });

  it('should return correct response format', async () => {
    setupAuthenticatedUser();
    setupSuccessfulGeneration();

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(json).toEqual({
      code: 0,
      message: 'ok',
      data: {
        id: 'gen-1',
        status: 'completed',
        htmlContent: '<div>physics sim</div>',
      },
    });
  });
});
