import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createMockDb, type MockChain } from '../../helpers/mock-db';

// audit_log.ts does `const db = getDb()` at module level, capturing the return
// value once. We need a stable proxy object that delegates to a fresh mock each test.
//
// vi.mock is hoisted, so we can't reference `let mockDb` inside the factory.
// Instead, we create a Proxy that delegates all property access to a mutable target.

const _holder: { current: MockChain } = { current: null as any };

vi.mock('@/core/db', () => {
  // This factory runs once (hoisted). Return a Proxy so the module-level
  // `const db = getDb()` captures a live reference we can swap internals on.
  const proxy = new Proxy({} as MockChain, {
    get(_target, prop) {
      return (_holder.current as any)?.[prop];
    },
  });
  return {
    db: vi.fn(() => proxy),
  };
});

vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => 'mock-nanoid'),
}));

import {
  createAuditLog,
  queryAuditLogs,
  getUserAuditLogs,
  getResourceAuditLogs,
  countAuditLogsByAction,
} from '@/shared/models/audit_log';

beforeEach(() => {
  vi.clearAllMocks();
  _holder.current = createMockDb();
});

// Convenience accessor
function mockDb(): MockChain {
  return _holder.current;
}

describe('createAuditLog', () => {
  it('creates audit log entry with all fields', async () => {
    const logEntry = {
      id: 'mock-nanoid',
      userId: 'u1',
      action: 'user.login',
      resourceType: 'session',
      resourceId: 'sess-1',
      metadata: '{"ip":"1.2.3.4"}',
      ipAddress: '1.2.3.4',
      userAgent: 'Mozilla/5.0',
      createdAt: new Date(),
    };
    mockDb()._resolveInsert([logEntry]);

    const result = await createAuditLog({
      userId: 'u1',
      action: 'user.login',
      resourceType: 'session',
      resourceId: 'sess-1',
      metadata: { ip: '1.2.3.4' },
      ipAddress: '1.2.3.4',
      userAgent: 'Mozilla/5.0',
    });

    expect(mockDb().insert).toHaveBeenCalled();
    expect(mockDb().values).toHaveBeenCalled();
    expect(mockDb().returning).toHaveBeenCalled();
    expect(result).toEqual(logEntry);

    // Verify metadata was JSON.stringify'd
    const valuesArg = (mockDb().values as any).mock.calls[0][0];
    expect(valuesArg.id).toBe('mock-nanoid');
    expect(valuesArg.metadata).toBe('{"ip":"1.2.3.4"}');
  });

  it('creates audit log with minimal fields', async () => {
    const logEntry = {
      id: 'mock-nanoid',
      action: 'system.healthcheck',
      createdAt: new Date(),
    };
    mockDb()._resolveInsert([logEntry]);

    const result = await createAuditLog({ action: 'system.healthcheck' });

    expect(result).toEqual(logEntry);
    const valuesArg = (mockDb().values as any).mock.calls[0][0];
    expect(valuesArg.userId).toBeUndefined();
    expect(valuesArg.metadata).toBeUndefined();
  });

  it('handles undefined metadata correctly', async () => {
    mockDb()._resolveInsert([{ id: 'mock-nanoid', action: 'test' }]);

    await createAuditLog({ action: 'test' });

    const valuesArg = (mockDb().values as any).mock.calls[0][0];
    expect(valuesArg.metadata).toBeUndefined();
  });
});

describe('queryAuditLogs', () => {
  it('returns logs with no filters', async () => {
    const logs = [
      { id: 'log-1', action: 'user.login' },
      { id: 'log-2', action: 'user.logout' },
    ];
    mockDb()._resolveSelect(logs);

    const result = await queryAuditLogs({});

    expect(mockDb().select).toHaveBeenCalled();
    expect(mockDb().from).toHaveBeenCalled();
    expect(mockDb().orderBy).toHaveBeenCalled();
    expect(result).toEqual(logs);
  });

  it('filters by userId', async () => {
    mockDb()._resolveSelect([{ id: 'log-1' }]);

    const result = await queryAuditLogs({ userId: 'u1' });

    expect(mockDb().where).toHaveBeenCalled();
    expect(result).toEqual([{ id: 'log-1' }]);
  });

  it('filters by action and resourceType', async () => {
    mockDb()._resolveSelect([]);

    await queryAuditLogs({ action: 'user.login', resourceType: 'session' });

    expect(mockDb().where).toHaveBeenCalled();
  });

  it('filters by date range', async () => {
    mockDb()._resolveSelect([]);

    await queryAuditLogs({
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-03-31'),
    });

    expect(mockDb().where).toHaveBeenCalled();
  });

  it('applies limit and offset', async () => {
    mockDb()._resolveSelect([]);

    await queryAuditLogs({ limit: 10, offset: 20 });

    expect(mockDb().limit).toHaveBeenCalledWith(10);
    expect(mockDb().offset).toHaveBeenCalledWith(20);
  });

  it('returns empty array when no logs match', async () => {
    mockDb()._resolveSelect([]);

    const result = await queryAuditLogs({ userId: 'nonexistent' });

    expect(result).toEqual([]);
  });
});

describe('getUserAuditLogs', () => {
  it('returns logs for a specific user with default limit', async () => {
    const logs = [{ id: 'log-1', userId: 'u1', action: 'user.login' }];
    mockDb()._resolveSelect(logs);

    const result = await getUserAuditLogs('u1');

    expect(mockDb().select).toHaveBeenCalled();
    expect(mockDb().where).toHaveBeenCalled();
    expect(mockDb().orderBy).toHaveBeenCalled();
    expect(mockDb().limit).toHaveBeenCalledWith(50);
    expect(result).toEqual(logs);
  });

  it('accepts custom limit', async () => {
    mockDb()._resolveSelect([]);

    await getUserAuditLogs('u1', 10);

    expect(mockDb().limit).toHaveBeenCalledWith(10);
  });

  it('returns empty array for user with no logs', async () => {
    mockDb()._resolveSelect([]);

    const result = await getUserAuditLogs('u-no-logs');

    expect(result).toEqual([]);
  });
});

describe('getResourceAuditLogs', () => {
  it('returns logs for a specific resource', async () => {
    const logs = [
      { id: 'log-1', resourceType: 'upg', resourceId: 'upg-1', action: 'upg.create' },
    ];
    mockDb()._resolveSelect(logs);

    const result = await getResourceAuditLogs('upg', 'upg-1');

    expect(mockDb().select).toHaveBeenCalled();
    expect(mockDb().where).toHaveBeenCalled();
    expect(mockDb().orderBy).toHaveBeenCalled();
    expect(mockDb().limit).toHaveBeenCalledWith(50);
    expect(result).toEqual(logs);
  });

  it('accepts custom limit', async () => {
    mockDb()._resolveSelect([]);

    await getResourceAuditLogs('upg', 'upg-1', 5);

    expect(mockDb().limit).toHaveBeenCalledWith(5);
  });

  it('returns empty array when resource has no logs', async () => {
    mockDb()._resolveSelect([]);

    const result = await getResourceAuditLogs('experiment', 'exp-nonexistent');

    expect(result).toEqual([]);
  });
});

describe('countAuditLogsByAction', () => {
  it('counts logs by action', async () => {
    mockDb()._resolveSelect([{ id: '1' }, { id: '2' }, { id: '3' }]);

    const result = await countAuditLogsByAction('user.login');

    expect(mockDb().where).toHaveBeenCalled();
    expect(result).toBe(3);
  });

  it('returns 0 when no logs match', async () => {
    mockDb()._resolveSelect([]);

    const result = await countAuditLogsByAction('nonexistent.action');

    expect(result).toBe(0);
  });

  it('filters by date range', async () => {
    mockDb()._resolveSelect([{ id: '1' }]);

    const result = await countAuditLogsByAction(
      'user.login',
      new Date('2026-01-01'),
      new Date('2026-03-31')
    );

    expect(mockDb().where).toHaveBeenCalled();
    expect(result).toBe(1);
  });

  it('filters with startDate only', async () => {
    mockDb()._resolveSelect([{ id: '1' }, { id: '2' }]);

    const result = await countAuditLogsByAction(
      'user.login',
      new Date('2026-01-01')
    );

    expect(result).toBe(2);
  });

  it('filters with endDate only', async () => {
    mockDb()._resolveSelect([]);

    const result = await countAuditLogsByAction(
      'user.login',
      undefined,
      new Date('2026-03-31')
    );

    expect(result).toBe(0);
  });
});
