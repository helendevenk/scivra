import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

vi.mock('@/core/auth', () => ({
  getAuth: vi.fn(),
}));

vi.mock('@/shared/models/credit', () => ({
  getRemainingCredits: vi.fn(() => 100),
}));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import {
  findUserById,
  updateUser,
  getUsers,
  getUsersCount,
  getUserByUserIds,
  getUserCredits,
  appendUserToResult,
} from '@/shared/models/user';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_USER = {
  id: 'user-1',
  name: 'Alice',
  email: 'alice@example.com',
  image: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-03-27'),
};

describe('findUserById', () => {
  it('returns user when found', async () => {
    mockDb._resolveSelect([MOCK_USER]);
    const result = await findUserById('user-1');
    expect(result).toEqual(MOCK_USER);
  });

  it('returns undefined when not found', async () => {
    mockDb._resolveSelect([]);
    const result = await findUserById('nonexistent');
    expect(result).toBeUndefined();
  });
});

describe('updateUser', () => {
  it('updates and returns user', async () => {
    const updated = { ...MOCK_USER, name: 'Bob' };
    mockDb._resolveInsert([updated]);
    const result = await updateUser('user-1', { name: 'Bob' });
    expect(result.name).toBe('Bob');
    expect(mockDb.update).toHaveBeenCalled();
  });
});

describe('getUsers', () => {
  it('returns paginated users', async () => {
    mockDb._resolveSelect([MOCK_USER]);
    const result = await getUsers({ page: 1, limit: 10 });
    expect(result).toHaveLength(1);
    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.offset).toHaveBeenCalled();
  });

  it('filters by email when provided', async () => {
    mockDb._resolveSelect([MOCK_USER]);
    await getUsers({ email: 'alice@example.com' });
    expect(mockDb.where).toHaveBeenCalled();
  });
});

describe('getUsersCount', () => {
  it('returns count', async () => {
    mockDb._resolveSelect([{ count: 42 }]);
    const result = await getUsersCount({});
    expect(result).toBe(42);
  });

  it('returns 0 when empty', async () => {
    mockDb._resolveSelect([undefined]);
    const result = await getUsersCount({});
    expect(result).toBe(0);
  });
});

describe('getUserByUserIds', () => {
  it('returns users matching ids', async () => {
    mockDb._resolveSelect([MOCK_USER]);
    const result = await getUserByUserIds(['user-1']);
    expect(result).toHaveLength(1);
  });
});

describe('getUserCredits', () => {
  it('returns remaining credits', async () => {
    const result = await getUserCredits('user-1');
    expect(result.remainingCredits).toBe(100);
  });
});

// ─── getUsers additional branches ───

describe('getUsers (additional)', () => {
  it('uses default values when called with no args', async () => {
    mockDb._resolveSelect([MOCK_USER]);

    const result = await getUsers();

    expect(result).toHaveLength(1);
    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.offset).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();
  });

  it('does not apply where clause when email is undefined', async () => {
    mockDb._resolveSelect([]);

    await getUsers({ page: 2, limit: 5 });

    // where is still called (with undefined condition), but no eq filter
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns empty array when no users match', async () => {
    mockDb._resolveSelect([]);

    const result = await getUsers({ email: 'nobody@example.com' });

    expect(result).toEqual([]);
  });
});

// ─── appendUserToResult ───

describe('appendUserToResult', () => {
  it('returns input as-is when result is null', async () => {
    const result = await appendUserToResult(null);
    expect(result).toBeNull();
  });

  it('returns input as-is when result is empty array', async () => {
    const result = await appendUserToResult([]);
    expect(result).toEqual([]);
  });

  it('appends user objects to each result item', async () => {
    const items = [
      { id: 'item-1', userId: 'user-1' },
      { id: 'item-2', userId: 'user-2' },
    ];
    const users = [
      { ...MOCK_USER, id: 'user-1', name: 'Alice' },
      { ...MOCK_USER, id: 'user-2', name: 'Bob', email: 'bob@example.com' },
    ];
    // getUserByUserIds calls select().from().where() which is thenable
    mockDb._resolveSelect(users);

    const result = await appendUserToResult(items);

    expect(result).toHaveLength(2);
    expect(result[0].user.name).toBe('Alice');
    expect(result[1].user.name).toBe('Bob');
  });

  it('sets user as undefined when userId has no matching user', async () => {
    const items = [{ id: 'item-1', userId: 'unknown-user' }];
    mockDb._resolveSelect([]); // no users found

    const result = await appendUserToResult(items);

    expect(result).toHaveLength(1);
    expect(result[0].user).toBeUndefined();
  });
});
