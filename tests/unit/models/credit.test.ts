import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock external deps BEFORE importing the model
vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

vi.mock('@/shared/lib/hash', () => ({
  getUuid: vi.fn(() => 'mock-uuid'),
  getSnowId: vi.fn(() => 'mock-snow-id'),
}));

vi.mock('@/shared/models/config', () => ({
  getAllConfigs: vi.fn(),
}));

vi.mock('@/shared/models/user', () => ({
  appendUserToResult: vi.fn((result: unknown[]) => result),
}));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { getAllConfigs } from '@/shared/models/config';
import {
  calculateCreditExpirationTime,
  createCredit,
  getCredits,
  getCreditsCount,
  consumeCredits,
  getRemainingCredits,
  grantCreditsForNewUser,
  refundCredits,
  CreditStatus,
  CreditTransactionType,
  CreditTransactionScene,
} from '@/shared/models/credit';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
  // Add 'for' method to chain (used by consumeCredits FOR UPDATE)
  (mockDb as any).for = vi.fn().mockReturnValue(mockDb);
});

// ── T2-01 Tests ──

describe('calculateCreditExpirationTime', () => {
  it('returns null when creditsValidDays is 0 (never expires)', () => {
    const result = calculateCreditExpirationTime({ creditsValidDays: 0 });
    expect(result).toBeNull();
  });

  it('returns null when creditsValidDays is negative', () => {
    const result = calculateCreditExpirationTime({ creditsValidDays: -1 });
    expect(result).toBeNull();
  });

  it('returns date based on creditsValidDays for one-time payment', () => {
    const now = new Date();
    const result = calculateCreditExpirationTime({ creditsValidDays: 30 });
    expect(result).toBeInstanceOf(Date);
    // Should be roughly 30 days from now
    const diff = result!.getTime() - now.getTime();
    const daysDiff = diff / (1000 * 60 * 60 * 24);
    expect(daysDiff).toBeGreaterThanOrEqual(29.9);
    expect(daysDiff).toBeLessThanOrEqual(30.1);
  });

  it('returns currentPeriodEnd date for subscription', () => {
    const periodEnd = new Date('2026-12-31T00:00:00Z');
    const result = calculateCreditExpirationTime({
      creditsValidDays: 30,
      currentPeriodEnd: periodEnd,
    });
    expect(result).toBeInstanceOf(Date);
    expect(result!.getTime()).toBe(periodEnd.getTime());
  });
});

describe('createCredit', () => {
  it('inserts and returns credit record', async () => {
    const newCredit = {
      id: 'c1',
      transactionNo: 'tn1',
      userId: 'u1',
      credits: 100,
    };
    const expected = { ...newCredit, status: 'active' };
    mockDb._resolveInsert([expected]);

    const result = await createCredit(newCredit as any);

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalledWith(newCredit);
    expect(result).toEqual(expected);
  });
});

describe('getCredits', () => {
  it('paginates with limit/offset', async () => {
    const credits = [{ id: 'c1' }, { id: 'c2' }];
    mockDb._resolveSelect(credits);

    const result = await getCredits({ userId: 'u1', page: 2, limit: 10 });

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();
    expect(mockDb.limit).toHaveBeenCalledWith(10);
    expect(mockDb.offset).toHaveBeenCalledWith(10); // (2-1)*10
    expect(result).toEqual(credits);
  });
});

describe('getCreditsCount', () => {
  it('returns count value', async () => {
    mockDb._resolveSelect([{ count: 42 }]);

    const result = await getCreditsCount({ userId: 'u1' });

    expect(result).toBe(42);
  });

  it('returns 0 when no result', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getCreditsCount({ userId: 'u1' });

    expect(result).toBe(0);
  });
});

describe('consumeCredits', () => {
  it('deducts from available credits (FIFO)', async () => {
    // First call: balance check → returns total
    // Second call: batch select → returns grant records
    // Third+ calls: updates + insert
    let selectCallCount = 0;
    mockDb.then.mockImplementation((resolve: (v: unknown) => void) => {
      selectCallCount++;
      if (selectCallCount === 1) {
        // balance check
        return Promise.resolve([{ total: '100' }]).then(resolve);
      }
      if (selectCallCount === 2) {
        // batch credits
        return Promise.resolve([
          { id: 'g1', remainingCredits: 50, expiresAt: null, transactionNo: 'tn1' },
        ]).then(resolve);
      }
      // no more credits
      return Promise.resolve([]).then(resolve);
    });

    // returning for the final insert
    mockDb.returning.mockResolvedValue([{ id: 'consumed' }]);

    const result = await consumeCredits({
      userId: 'u1',
      credits: 30,
      scene: 'payment',
    });

    expect(result).toBeDefined();
    expect(result.transactionType).toBe(CreditTransactionType.CONSUME);
    expect(result.credits).toBe(-30);
  });

  it('throws error when insufficient credits', async () => {
    // Balance check returns insufficient
    mockDb.then.mockImplementation((resolve: (v: unknown) => void) => {
      return Promise.resolve([{ total: '5' }]).then(resolve);
    });

    await expect(
      consumeCredits({ userId: 'u1', credits: 100 })
    ).rejects.toThrow('Insufficient credits');
  });

  it('skips expired credits (only uses valid ones)', async () => {
    let selectCallCount = 0;
    mockDb.then.mockImplementation((resolve: (v: unknown) => void) => {
      selectCallCount++;
      if (selectCallCount === 1) {
        // balance check - sufficient
        return Promise.resolve([{ total: '50' }]).then(resolve);
      }
      if (selectCallCount === 2) {
        // batch credits - only non-expired returned (DB filters)
        return Promise.resolve([
          { id: 'g2', remainingCredits: 50, expiresAt: null, transactionNo: 'tn2' },
        ]).then(resolve);
      }
      return Promise.resolve([]).then(resolve);
    });
    mockDb.returning.mockResolvedValue([{ id: 'consumed' }]);

    const result = await consumeCredits({ userId: 'u1', credits: 10 });

    // The query includes expiration conditions (isNull or gt), so expired credits are filtered
    expect(result.credits).toBe(-10);
  });
});

describe('getRemainingCredits', () => {
  it('sums available credits', async () => {
    mockDb._resolveSelect([{ total: '250' }]);

    const result = await getRemainingCredits('u1');

    expect(result).toBe(250);
  });

  it('returns 0 for new user with no credits', async () => {
    mockDb._resolveSelect([{ total: null }]);

    const result = await getRemainingCredits('u1');

    expect(result).toBe(0);
  });
});

describe('grantCreditsForNewUser', () => {
  it('creates initial credit record when enabled', async () => {
    vi.mocked(getAllConfigs).mockResolvedValue({
      initial_credits_enabled: 'true',
      initial_credits_amount: '100',
      initial_credits_valid_days: '30',
      initial_credits_description: 'Welcome credits',
    } as any);

    const insertedRecord = { id: 'mock-uuid' };
    mockDb._resolveInsert([insertedRecord]);

    const user = { id: 'u1', email: 'test@example.com' };
    const result = await grantCreditsForNewUser(user as any);

    expect(result).toBeDefined();
    expect(result!.userId).toBe('u1');
    expect(result!.credits).toBe(100);
    expect(result!.transactionType).toBe(CreditTransactionType.GRANT);
    expect(result!.transactionScene).toBe(CreditTransactionScene.GIFT);
  });

  it('returns undefined when initial credits disabled', async () => {
    vi.mocked(getAllConfigs).mockResolvedValue({
      initial_credits_enabled: 'false',
    } as any);

    const result = await grantCreditsForNewUser({ id: 'u1', email: 'x@x.com' } as any);

    expect(result).toBeUndefined();
  });
});

describe('refundCredits', () => {
  it('creates refund credit record', async () => {
    const refunded = { id: 'mock-uuid' };
    mockDb._resolveInsert([refunded]);

    const result = await refundCredits({
      userId: 'u1',
      credits: 50,
      scene: 'gift',
      description: 'Refund for failed generation',
    });

    expect(result.userId).toBe('u1');
    expect(result.credits).toBe(50);
    expect(result.transactionType).toBe(CreditTransactionType.GRANT);
    expect(result.expiresAt).toBeNull();
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalled();
  });

  it('includes relatedCreditId in metadata when provided', async () => {
    mockDb._resolveInsert([{ id: 'mock-uuid' }]);

    const result = await refundCredits({
      userId: 'u1',
      credits: 25,
      relatedCreditId: 'original-credit-id',
    });

    expect(result.metadata).toBe(
      JSON.stringify({ relatedCreditId: 'original-credit-id' })
    );
  });
});
