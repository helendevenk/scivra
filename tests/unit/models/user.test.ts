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
