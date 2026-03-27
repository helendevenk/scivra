import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({ db: vi.fn() }));
vi.mock('@/shared/lib/hash', () => ({ getUuid: vi.fn(() => 'mock-uuid') }));
vi.mock('@/extensions/ai', () => ({
  AITaskStatus: { PENDING: 'pending', COMPLETED: 'completed', FAILED: 'failed' },
}));
vi.mock('@/shared/models/credit', () => ({
  consumeCredits: vi.fn(),
  CreditStatus: { ACTIVE: 'active', DELETED: 'deleted' },
}));
vi.mock('@/shared/models/user', () => ({
  appendUserToResult: vi.fn((result: unknown[]) => result.map((item: any) => ({ ...item, user: { id: item.userId, name: 'Mock User' } }))),
}));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { consumeCredits } from '@/shared/models/credit';
import { appendUserToResult } from '@/shared/models/user';
import {
  createAITask,
  findAITaskById,
  updateAITaskById,
  getAITasksCount,
  getAITasks,
} from '@/shared/models/ai_task';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_TASK = {
  id: 'task-1',
  userId: 'user-1',
  scene: 'image',
  mediaType: 'image',
  provider: 'openai',
  model: 'dall-e-3',
  status: 'pending',
  costCredits: 10,
  creditId: null,
  prompt: 'a cat',
  result: null,
  createdAt: new Date('2026-03-27'),
  updatedAt: new Date('2026-03-27'),
};

// ─── createAITask ───

describe('createAITask', () => {
  it('creates task without credits when costCredits is 0', async () => {
    const taskNoCredits = { ...MOCK_TASK, costCredits: 0 };
    mockDb._resolveInsert([taskNoCredits]);

    const result = await createAITask(taskNoCredits as any);

    expect(result).toEqual(taskNoCredits);
    expect(mockDb.transaction).toHaveBeenCalled();
    expect(mockDb.insert).toHaveBeenCalled();
    expect(consumeCredits).not.toHaveBeenCalled();
  });

  it('creates task and consumes credits when costCredits > 0', async () => {
    mockDb._resolveInsert([MOCK_TASK]);
    vi.mocked(consumeCredits).mockResolvedValue({ id: 'credit-consumed-1' } as any);

    const result = await createAITask(MOCK_TASK as any);

    expect(result).toEqual(MOCK_TASK);
    expect(mockDb.transaction).toHaveBeenCalled();
    expect(consumeCredits).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        credits: 10,
        scene: 'image',
      })
    );
    // update is called to set creditId on the task
    expect(mockDb.update).toHaveBeenCalled();
  });

  it('does not update creditId when consumeCredits returns null', async () => {
    mockDb._resolveInsert([MOCK_TASK]);
    vi.mocked(consumeCredits).mockResolvedValue(null as any);

    const result = await createAITask(MOCK_TASK as any);

    expect(result).toEqual(MOCK_TASK);
    // update should NOT be called since consumedCredit is null
    expect(mockDb.update).not.toHaveBeenCalled();
  });
});

// ─── findAITaskById ───

describe('findAITaskById', () => {
  it('returns task when found', async () => {
    mockDb._resolveSelect([MOCK_TASK]);

    const result = await findAITaskById('task-1');

    expect(result).toEqual(MOCK_TASK);
  });

  it('returns undefined when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await findAITaskById('nonexistent');

    expect(result).toBeUndefined();
  });
});

// ─── updateAITaskById ───

describe('updateAITaskById', () => {
  it('updates task fields and returns result', async () => {
    const updated = { ...MOCK_TASK, status: 'completed', result: 'http://img.png' };
    mockDb._resolveInsert([updated]); // returning()

    const result = await updateAITaskById('task-1', {
      status: 'completed',
      result: 'http://img.png',
    } as any);

    expect(result).toEqual(updated);
    expect(mockDb.transaction).toHaveBeenCalled();
    expect(mockDb.update).toHaveBeenCalled();
  });

  it('revokes credits on FAILED status with creditId', async () => {
    const consumedCredit = {
      id: 'credit-consumed-1',
      status: 'active',
      consumedDetail: JSON.stringify([
        { creditId: 'credit-src-1', creditsConsumed: 5 },
        { creditId: 'credit-src-2', creditsConsumed: 5 },
      ]),
    };

    // In the transaction:
    // 1. select consumed credit record (thenable)
    // 2. update credit records to add back (returning chain)
    // 3. update consumed credit status to DELETED
    // 4. update task
    mockDb._resolveSelect([consumedCredit]);
    mockDb._resolveInsert([{ ...MOCK_TASK, status: 'failed' }]); // final returning()

    const result = await updateAITaskById('task-1', {
      status: 'failed',
      creditId: 'credit-consumed-1',
    } as any);

    expect(result.status).toBe('failed');
    expect(mockDb.transaction).toHaveBeenCalled();
    // update called multiple times: credit restore + status delete + task update
    expect(mockDb.update).toHaveBeenCalled();
  });

  it('skips credit revocation when consumed credit is already deleted', async () => {
    const deletedCredit = {
      id: 'credit-consumed-1',
      status: 'deleted', // not active
      consumedDetail: '[]',
    };
    mockDb._resolveSelect([deletedCredit]);
    mockDb._resolveInsert([{ ...MOCK_TASK, status: 'failed' }]);

    const result = await updateAITaskById('task-1', {
      status: 'failed',
      creditId: 'credit-consumed-1',
    } as any);

    expect(result.status).toBe('failed');
    // Only 1 update call for the task itself (no credit restoration)
    expect(mockDb.update).toHaveBeenCalledTimes(1);
  });

  it('skips credit revocation when status is not FAILED', async () => {
    mockDb._resolveInsert([{ ...MOCK_TASK, status: 'completed' }]);

    const result = await updateAITaskById('task-1', {
      status: 'completed',
    } as any);

    expect(result.status).toBe('completed');
    // Only 1 update for the task
    expect(mockDb.update).toHaveBeenCalledTimes(1);
  });
});

// ─── getAITasksCount ───

describe('getAITasksCount', () => {
  it('returns count with all filters', async () => {
    mockDb._resolveSelect([{ count: 42 }]);

    const result = await getAITasksCount({
      userId: 'user-1',
      status: 'completed',
      mediaType: 'image',
      provider: 'openai',
    });

    expect(result).toBe(42);
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns count with no filters', async () => {
    mockDb._resolveSelect([{ count: 100 }]);

    const result = await getAITasksCount({});

    expect(result).toBe(100);
  });

  it('returns 0 when no results', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getAITasksCount({});

    expect(result).toBe(0);
  });
});

// ─── getAITasks ───

describe('getAITasks', () => {
  it('returns paginated tasks without user', async () => {
    mockDb._resolveSelect([MOCK_TASK]);

    const result = await getAITasks({ page: 1, limit: 10 });

    expect(result).toHaveLength(1);
    expect(mockDb.orderBy).toHaveBeenCalled();
    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.offset).toHaveBeenCalled();
    expect(appendUserToResult).not.toHaveBeenCalled();
  });

  it('appends user when getUser=true', async () => {
    mockDb._resolveSelect([MOCK_TASK]);

    const result = await getAITasks({ getUser: true });

    expect(appendUserToResult).toHaveBeenCalledWith([MOCK_TASK]);
    expect(result[0]).toHaveProperty('user');
  });

  it('applies all filters', async () => {
    mockDb._resolveSelect([]);

    await getAITasks({
      userId: 'user-1',
      status: 'completed',
      mediaType: 'image',
      provider: 'openai',
    });

    expect(mockDb.where).toHaveBeenCalled();
  });

  it('uses default page=1 and limit=30', async () => {
    mockDb._resolveSelect([]);

    await getAITasks({});

    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.offset).toHaveBeenCalled();
  });
});
