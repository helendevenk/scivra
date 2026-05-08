import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock external deps BEFORE importing the model
vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

vi.mock('@/shared/models/user', () => ({
  appendUserToResult: vi.fn((result: unknown[]) => result),
}));

vi.mock('drizzle-orm', async (importOriginal) => {
  const actual = await importOriginal<typeof import('drizzle-orm')>();

  return {
    ...actual,
    and: vi.fn((...conditions: unknown[]) => ({ conditions, op: 'and' })),
    count: vi.fn(() => ({ op: 'count' })),
    desc: vi.fn((column: unknown) => ({ column, op: 'desc' })),
    eq: vi.fn((column: unknown, value: unknown) => ({
      column,
      op: 'eq',
      value,
    })),
    inArray: vi.fn((column: unknown, values: unknown[]) => ({
      column,
      op: 'inArray',
      values,
    })),
  };
});

import { db } from '@/core/db';
import { inArray } from 'drizzle-orm';
import { createMockDb } from '../../helpers/mock-db';
import {
  createSubscription,
  updateSubscriptionBySubscriptionNo,
  updateSubscriptionById,
  findSubscriptionById,
  findSubscriptionBySubscriptionNo,
  findSubscriptionByProviderSubscriptionId,
  getCurrentSubscription,
  getSubscriptions,
  getSubscriptionsCount,
  SubscriptionStatus,
} from '@/shared/models/subscription';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

describe('createSubscription', () => {
  it('inserts new subscription and returns result', async () => {
    const newSub = { id: 's1', subscriptionNo: 'SN-001', userId: 'u1' };
    const expected = { ...newSub, status: SubscriptionStatus.ACTIVE };
    mockDb._resolveInsert([expected]);

    const result = await createSubscription(newSub as any);

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalledWith(newSub);
    expect(result).toEqual(expected);
  });
});

describe('updateSubscriptionBySubscriptionNo', () => {
  it('updates fields by subscriptionNo', async () => {
    const updated = { id: 's1', status: SubscriptionStatus.CANCELED };
    mockDb._resolveInsert([updated]);

    const result = await updateSubscriptionBySubscriptionNo('SN-001', {
      status: SubscriptionStatus.CANCELED,
    } as any);

    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(result).toEqual(updated);
  });
});

describe('updateSubscriptionById', () => {
  it('updates by ID', async () => {
    const updated = { id: 's1', status: SubscriptionStatus.PAUSED };
    mockDb._resolveInsert([updated]);

    const result = await updateSubscriptionById('s1', {
      status: SubscriptionStatus.PAUSED,
    } as any);

    expect(mockDb.update).toHaveBeenCalled();
    expect(result).toEqual(updated);
  });
});

describe('findSubscriptionById', () => {
  it('returns subscription by ID', async () => {
    const sub = { id: 's1', subscriptionNo: 'SN-001' };
    mockDb._resolveSelect([sub]);

    const result = await findSubscriptionById('s1');

    expect(result).toEqual(sub);
  });
});

describe('findSubscriptionBySubscriptionNo', () => {
  it('returns subscription by subscriptionNo', async () => {
    const sub = { id: 's1', subscriptionNo: 'SN-001' };
    mockDb._resolveSelect([sub]);

    const result = await findSubscriptionBySubscriptionNo('SN-001');

    expect(result).toEqual(sub);
  });
});

describe('findSubscriptionByProviderSubscriptionId', () => {
  it('returns by provider and subscriptionId', async () => {
    const sub = {
      id: 's1',
      paymentProvider: 'stripe',
      subscriptionId: 'sub_123',
    };
    mockDb._resolveSelect([sub]);

    const result = await findSubscriptionByProviderSubscriptionId({
      provider: 'stripe',
      subscriptionId: 'sub_123',
    });

    expect(mockDb.where).toHaveBeenCalled();
    expect(result).toEqual(sub);
  });
});

describe('getCurrentSubscription', () => {
  it('returns active subscription for user', async () => {
    const sub = {
      id: 's1',
      userId: 'u1',
      status: SubscriptionStatus.ACTIVE,
    };
    mockDb._resolveSelect([sub]);

    const result = await getCurrentSubscription('u1');

    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();
    expect(mockDb.limit).toHaveBeenCalledWith(1);
    expect(result).toEqual(sub);
  });

  it('treats past due as a current subscription during dunning', async () => {
    mockDb._resolveSelect([]);

    await getCurrentSubscription('u1');

    expect(inArray).toHaveBeenCalledWith(expect.anything(), [
      SubscriptionStatus.ACTIVE,
      SubscriptionStatus.PENDING_CANCEL,
      SubscriptionStatus.TRIALING,
      SubscriptionStatus.PAST_DUE,
    ]);
  });

  it('returns undefined when no active subscription', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getCurrentSubscription('u1');

    expect(result).toBeUndefined();
  });
});

describe('getSubscriptions', () => {
  it('paginates and returns results', async () => {
    const subs = [{ id: 's1' }, { id: 's2' }];
    mockDb._resolveSelect(subs);

    const result = await getSubscriptions({
      userId: 'u1',
      page: 2,
      limit: 15,
    });

    expect(mockDb.limit).toHaveBeenCalledWith(15);
    expect(mockDb.offset).toHaveBeenCalledWith(15); // (2-1)*15
    expect(result).toEqual(subs);
  });
});

describe('getSubscriptionsCount', () => {
  it('returns count', async () => {
    mockDb._resolveSelect([{ count: 7 }]);

    const result = await getSubscriptionsCount({ userId: 'u1' });

    expect(result).toBe(7);
  });

  it('returns 0 when no result', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getSubscriptionsCount({});

    expect(result).toBe(0);
  });
});
