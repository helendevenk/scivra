import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createMockDb, type MockChain } from '../../helpers/mock-db';

// user_credits.ts does `const db = getDb()` at module level, capturing the return
// value once. Use a Proxy so the module-level `db` delegates to a fresh mock each test.
const _holder: { current: MockChain } = { current: null as unknown as MockChain };

vi.mock('@/core/db', () => {
  const proxy = new Proxy({} as MockChain, {
    get(_target, prop) {
      return (_holder.current as Record<string | symbol, unknown>)?.[prop];
    },
  });
  return { db: vi.fn(() => proxy) };
});

import {
  getOrCreateUserCredits,
  getUserCreditsBalance,
  addUserCredits,
  spendUserCredits,
  refundUserCredits,
  resetUserCredits,
} from '@/shared/models/user_credits';

beforeEach(() => {
  vi.clearAllMocks();
  _holder.current = createMockDb();
});

function mockDb(): MockChain {
  return _holder.current;
}

const MOCK_CREDITS = {
  userId: 'user-1',
  totalCredits: 100,
  usedCredits: 30,
  version: 1,
  createdAt: new Date('2026-03-27'),
  updatedAt: new Date('2026-03-27'),
};

describe('getOrCreateUserCredits', () => {
  it('returns existing record when found', async () => {
    mockDb()._resolveSelect([MOCK_CREDITS]);

    const result = await getOrCreateUserCredits('user-1');

    expect(result).toEqual(MOCK_CREDITS);
    expect(mockDb().select).toHaveBeenCalled();
    expect(mockDb().insert).not.toHaveBeenCalled();
  });

  it('creates new record when not found', async () => {
    const newRecord = { ...MOCK_CREDITS, totalCredits: 0, usedCredits: 0, version: 0 };
    mockDb()._resolveSelect([]);
    mockDb()._resolveInsert([newRecord]);

    const result = await getOrCreateUserCredits('user-1');

    expect(result).toEqual(newRecord);
    expect(mockDb().insert).toHaveBeenCalled();
    expect(mockDb().values).toHaveBeenCalled();
    expect(mockDb().returning).toHaveBeenCalled();
  });
});

describe('getUserCreditsBalance', () => {
  it('returns total, used, and available credits', async () => {
    mockDb()._resolveSelect([MOCK_CREDITS]);

    const result = await getUserCreditsBalance('user-1');

    expect(result).toEqual({
      total: 100,
      used: 30,
      available: 70,
    });
  });

  it('returns zeros for new user', async () => {
    const newRecord = { ...MOCK_CREDITS, totalCredits: 0, usedCredits: 0, version: 0 };
    mockDb()._resolveSelect([]);
    mockDb()._resolveInsert([newRecord]);

    const result = await getUserCreditsBalance('user-1');

    expect(result).toEqual({
      total: 0,
      used: 0,
      available: 0,
    });
  });
});

describe('addUserCredits', () => {
  it('returns error for non-positive amount', async () => {
    const result = await addUserCredits('user-1', 0);

    expect(result).toEqual({ success: false, error: 'Amount must be positive' });
  });

  it('returns error for negative amount', async () => {
    const result = await addUserCredits('user-1', -5);

    expect(result).toEqual({ success: false, error: 'Amount must be positive' });
  });

  it('adds credits successfully on first attempt', async () => {
    mockDb()._resolveSelect([MOCK_CREDITS]);
    const updated = { ...MOCK_CREDITS, totalCredits: 150, version: 2 };
    mockDb()._resolveInsert([updated]);

    const result = await addUserCredits('user-1', 50);

    expect(result.success).toBe(true);
    expect(result.currentBalance).toBe(120); // 150 - 30
  });

  it('returns concurrent modification error after max retries', async () => {
    mockDb()._resolveSelect([MOCK_CREDITS]);
    mockDb()._resolveInsert([]);

    const result = await addUserCredits('user-1', 50, 1);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Concurrent modification');
  });
});

describe('spendUserCredits', () => {
  it('returns error for non-positive amount', async () => {
    const result = await spendUserCredits('user-1', 0);

    expect(result).toEqual({ success: false, error: 'Amount must be positive' });
  });

  it('returns insufficient credits error when balance too low', async () => {
    const lowBalance = { ...MOCK_CREDITS, totalCredits: 10, usedCredits: 5 };
    mockDb()._resolveSelect([lowBalance]);

    const result = await spendUserCredits('user-1', 10);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Insufficient credits');
    expect(result.currentBalance).toBe(5);
  });

  it('spends credits successfully', async () => {
    mockDb()._resolveSelect([MOCK_CREDITS]);
    const updated = { ...MOCK_CREDITS, usedCredits: 40, version: 2 };
    mockDb()._resolveInsert([updated]);

    const result = await spendUserCredits('user-1', 10);

    expect(result.success).toBe(true);
    expect(result.currentBalance).toBe(60); // 100 - 40
  });

  it('returns concurrent modification error after max retries', async () => {
    mockDb()._resolveSelect([MOCK_CREDITS]);
    mockDb()._resolveInsert([]);

    const result = await spendUserCredits('user-1', 10, 1);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Concurrent modification');
  });
});

describe('refundUserCredits', () => {
  it('returns error for non-positive amount', async () => {
    const result = await refundUserCredits('user-1', 0);

    expect(result).toEqual({ success: false, error: 'Amount must be positive' });
  });

  it('refunds credits successfully', async () => {
    mockDb()._resolveSelect([MOCK_CREDITS]);
    const updated = { ...MOCK_CREDITS, usedCredits: 20, version: 2 };
    mockDb()._resolveInsert([updated]);

    const result = await refundUserCredits('user-1', 10);

    expect(result.success).toBe(true);
    expect(result.currentBalance).toBe(80); // 100 - 20
  });

  it('caps refund at usedCredits amount', async () => {
    const lowUsed = { ...MOCK_CREDITS, usedCredits: 5, version: 1 };
    mockDb()._resolveSelect([lowUsed]);
    const updated = { ...lowUsed, usedCredits: 0, version: 2 };
    mockDb()._resolveInsert([updated]);

    const result = await refundUserCredits('user-1', 100);

    expect(result.success).toBe(true);
    expect(result.currentBalance).toBe(100); // 100 - 0
  });

  it('returns concurrent modification error after max retries', async () => {
    mockDb()._resolveSelect([MOCK_CREDITS]);
    mockDb()._resolveInsert([]);

    const result = await refundUserCredits('user-1', 10, 1);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Concurrent modification');
  });
});

describe('resetUserCredits', () => {
  it('resets credits to specified total', async () => {
    mockDb()._resolveInsert([{ ...MOCK_CREDITS, totalCredits: 50, usedCredits: 0, version: 0 }]);

    const result = await resetUserCredits('user-1', 50);

    expect(result.success).toBe(true);
    expect(result.currentBalance).toBe(50);
    expect(mockDb().update).toHaveBeenCalled();
    expect(mockDb().set).toHaveBeenCalled();
  });

  it('resets to zero by default', async () => {
    mockDb()._resolveInsert([{ ...MOCK_CREDITS, totalCredits: 0, usedCredits: 0, version: 0 }]);

    const result = await resetUserCredits('user-1');

    expect(result.success).toBe(true);
    expect(result.currentBalance).toBe(0);
  });

  it('returns error when record not found', async () => {
    mockDb()._resolveInsert([]);

    const result = await resetUserCredits('nonexistent');

    expect(result.success).toBe(false);
    expect(result.error).toContain('not found');
  });
});
