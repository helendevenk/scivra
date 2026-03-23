/**
 * Chainable mock DB for Drizzle ORM model tests.
 *
 * Usage in test files:
 * ```ts
 * import { vi } from 'vitest';
 * import { createMockDb, mockDbModule } from '../helpers/mock-db';
 *
 * vi.mock('@/core/db', () => mockDbModule());
 *
 * // In each test:
 * const mockDb = createMockDb();
 * vi.mocked(db).mockReturnValue(mockDb as any);
 * mockDb._resolveSelect([{ id: '1', name: 'test' }]);
 * ```
 */
import { vi } from 'vitest';

export interface MockChain {
  select: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  orderBy: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  offset: ReturnType<typeof vi.fn>;
  groupBy: ReturnType<typeof vi.fn>;
  leftJoin: ReturnType<typeof vi.fn>;
  innerJoin: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  values: ReturnType<typeof vi.fn>;
  returning: ReturnType<typeof vi.fn>;
  onConflictDoUpdate: ReturnType<typeof vi.fn>;
  onConflictDoNothing: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  execute: ReturnType<typeof vi.fn>;
  then: ReturnType<typeof vi.fn>;
  transaction: ReturnType<typeof vi.fn>;
  // Helpers for setting return values
  _resolveSelect: (data: unknown[]) => void;
  _resolveInsert: (data: unknown[]) => void;
  _resolveUpdate: (data: unknown[]) => void;
  _resolveExecute: (data: unknown) => void;
  _resolveTransaction: (fn: (tx: unknown) => unknown) => void;
}

export function createMockDb(): MockChain {
  let selectResult: unknown[] = [];
  let insertResult: unknown[] = [];
  let updateResult: unknown[] = [];
  let executeResult: unknown = [];

  const chain: MockChain = {
    select: vi.fn(),
    from: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    offset: vi.fn(),
    groupBy: vi.fn(),
    leftJoin: vi.fn(),
    innerJoin: vi.fn(),
    insert: vi.fn(),
    values: vi.fn(),
    returning: vi.fn(),
    onConflictDoUpdate: vi.fn(),
    onConflictDoNothing: vi.fn(),
    update: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    execute: vi.fn(),
    then: vi.fn(),
    transaction: vi.fn(),
    _resolveSelect: (data) => { selectResult = data; },
    _resolveInsert: (data) => { insertResult = data; },
    _resolveUpdate: (data) => { updateResult = data; },
    _resolveExecute: (data) => { executeResult = data; },
    _resolveTransaction: () => {},
  };

  // Make all query methods chainable
  const queryMethods = [
    'select', 'from', 'where', 'orderBy', 'limit', 'offset',
    'groupBy', 'leftJoin', 'innerJoin', 'insert', 'values',
    'update', 'set', 'delete', 'onConflictDoUpdate', 'onConflictDoNothing',
  ];
  for (const method of queryMethods) {
    (chain as unknown as Record<string, ReturnType<typeof vi.fn>>)[method].mockReturnValue(chain);
  }

  // Terminal methods resolve with data
  chain.returning.mockImplementation(() => Promise.resolve(insertResult));
  chain.execute.mockImplementation(() => Promise.resolve(executeResult));
  // Make chain itself thenable (for queries without explicit .execute())
  chain.then.mockImplementation((resolve: (v: unknown) => void) => {
    return Promise.resolve(selectResult).then(resolve);
  });

  // Transaction mock: execute the callback with a mock tx that behaves like chain
  chain.transaction.mockImplementation(async (fn: (tx: unknown) => unknown) => {
    return fn(chain);
  });

  return chain;
}

/**
 * Create the mock module for vi.mock('@/core/db')
 */
export function mockDbModule() {
  const mockDb = createMockDb();
  return {
    db: vi.fn(() => mockDb),
    closeDb: vi.fn(),
    __mockDb: mockDb,
  };
}
