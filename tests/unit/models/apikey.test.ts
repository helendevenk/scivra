import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock external deps BEFORE importing the model
vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

vi.mock('@/shared/models/user', () => ({
  appendUserToResult: vi.fn((result: unknown[]) => result),
}));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { appendUserToResult } from '@/shared/models/user';
import {
  createApikey,
  getApikeys,
  getApikeysCount,
  findApikeyById,
  findApikeyByKey,
  updateApikey,
  ApikeyStatus,
} from '@/shared/models/apikey';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

describe('createApikey', () => {
  it('inserts and returns apikey record', async () => {
    const newKey = {
      id: 'ak-1',
      userId: 'u1',
      key: 'sk-abc123',
      name: 'Test Key',
    };
    const expected = { ...newKey, status: 'active', createdAt: new Date() };
    mockDb._resolveInsert([expected]);

    const result = await createApikey(newKey as any);

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalledWith(newKey);
    expect(mockDb.returning).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });
});

describe('getApikeys', () => {
  it('returns apikeys with default pagination', async () => {
    const keys = [{ id: 'ak-1' }, { id: 'ak-2' }];
    mockDb._resolveSelect(keys);

    const result = await getApikeys({ userId: 'u1' });

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();
    expect(mockDb.limit).toHaveBeenCalledWith(30);
    expect(mockDb.offset).toHaveBeenCalledWith(0); // (1-1)*30
    expect(result).toEqual(keys);
  });

  it('paginates with custom page and limit', async () => {
    mockDb._resolveSelect([{ id: 'ak-3' }]);

    const result = await getApikeys({ userId: 'u1', page: 2, limit: 5 });

    expect(mockDb.offset).toHaveBeenCalledWith(5); // (2-1)*5
    expect(mockDb.limit).toHaveBeenCalledWith(5);
    expect(result).toEqual([{ id: 'ak-3' }]);
  });

  it('calls appendUserToResult when getUser is true', async () => {
    const keys = [{ id: 'ak-1', userId: 'u1' }];
    mockDb._resolveSelect(keys);

    const result = await getApikeys({ userId: 'u1', getUser: true });

    expect(appendUserToResult).toHaveBeenCalledWith(keys);
    expect(result).toEqual(keys);
  });

  it('does not call appendUserToResult when getUser is false', async () => {
    mockDb._resolveSelect([]);

    await getApikeys({ userId: 'u1', getUser: false });

    expect(appendUserToResult).not.toHaveBeenCalled();
  });

  it('returns empty array when no apikeys found', async () => {
    mockDb._resolveSelect([]);

    const result = await getApikeys({ userId: 'u1' });

    expect(result).toEqual([]);
  });

  it('filters by status', async () => {
    mockDb._resolveSelect([]);

    await getApikeys({ userId: 'u1', status: ApikeyStatus.ACTIVE });

    expect(mockDb.where).toHaveBeenCalled();
  });
});

describe('getApikeysCount', () => {
  it('returns count value', async () => {
    mockDb._resolveSelect([{ count: 7 }]);

    const result = await getApikeysCount({ userId: 'u1' });

    expect(result).toBe(7);
  });

  it('returns 0 when no result', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getApikeysCount({ userId: 'u1' });

    expect(result).toBe(0);
  });

  it('returns 0 when count is 0', async () => {
    mockDb._resolveSelect([{ count: 0 }]);

    const result = await getApikeysCount({ userId: 'u1' });

    expect(result).toBe(0);
  });

  it('filters by userId and status', async () => {
    mockDb._resolveSelect([{ count: 3 }]);

    const result = await getApikeysCount({
      userId: 'u1',
      status: ApikeyStatus.DELETED,
    });

    expect(mockDb.where).toHaveBeenCalled();
    expect(result).toBe(3);
  });
});

describe('findApikeyById', () => {
  it('returns apikey when found', async () => {
    const apikey = { id: 'ak-1', key: 'sk-abc', userId: 'u1' };
    mockDb._resolveSelect([apikey]);

    const result = await findApikeyById('ak-1');

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(result).toEqual(apikey);
  });

  it('returns undefined when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await findApikeyById('nonexistent');

    expect(result).toBeUndefined();
  });
});

describe('findApikeyByKey', () => {
  it('returns active apikey when found', async () => {
    const apikey = { id: 'ak-1', key: 'sk-abc', status: 'active' };
    mockDb._resolveSelect([apikey]);

    const result = await findApikeyByKey('sk-abc');

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(result).toEqual(apikey);
  });

  it('returns undefined when key not found', async () => {
    mockDb._resolveSelect([]);

    const result = await findApikeyByKey('sk-nonexistent');

    expect(result).toBeUndefined();
  });
});

describe('updateApikey', () => {
  it('updates and returns apikey', async () => {
    const updated = { id: 'ak-1', name: 'Renamed Key', status: 'active' };
    mockDb._resolveInsert([updated]);

    const result = await updateApikey('ak-1', { name: 'Renamed Key' } as any);

    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalledWith({ name: 'Renamed Key' });
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
    expect(result).toEqual(updated);
  });

  it('returns undefined when apikey does not exist', async () => {
    mockDb._resolveInsert([]);

    const result = await updateApikey('nonexistent', { name: 'X' } as any);

    expect(result).toBeUndefined();
  });
});
