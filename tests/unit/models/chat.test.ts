import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

vi.mock('@/shared/models/user', () => ({
  appendUserToResult: vi.fn((result) => result),
}));

import { db } from '@/core/db';
import { appendUserToResult } from '@/shared/models/user';
import { createMockDb } from '../../helpers/mock-db';
import {
  createChat,
  getChats,
  getChatsCount,
  findChatById,
  updateChat,
  ChatStatus,
} from '@/shared/models/chat';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_CHAT = {
  id: 'chat-1',
  userId: 'user-1',
  title: 'Physics Question',
  status: ChatStatus.CREATED,
  createdAt: new Date('2026-03-27'),
  updatedAt: new Date('2026-03-27'),
};

describe('createChat', () => {
  it('inserts a new chat and returns it', async () => {
    mockDb._resolveInsert([MOCK_CHAT]);

    const result = await createChat({
      id: 'chat-1',
      userId: 'user-1',
      title: 'Physics Question',
    });

    expect(result).toEqual(MOCK_CHAT);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
  });
});

describe('getChats', () => {
  it('returns paginated chats with defaults', async () => {
    mockDb._resolveSelect([MOCK_CHAT]);

    const result = await getChats({ userId: 'user-1' });

    expect(result).toHaveLength(1);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();
    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.offset).toHaveBeenCalled();
  });

  it('filters by status', async () => {
    mockDb._resolveSelect([]);

    const result = await getChats({ userId: 'user-1', status: ChatStatus.DELETED });

    expect(result).toHaveLength(0);
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('applies custom page and limit', async () => {
    mockDb._resolveSelect([MOCK_CHAT]);

    await getChats({ userId: 'user-1', page: 2, limit: 10 });

    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.offset).toHaveBeenCalled();
  });

  it('calls appendUserToResult when getUser is true', async () => {
    mockDb._resolveSelect([MOCK_CHAT]);

    const result = await getChats({ userId: 'user-1', getUser: true });

    expect(appendUserToResult).toHaveBeenCalledWith([MOCK_CHAT]);
    expect(result).toHaveLength(1);
  });

  it('does not call appendUserToResult when getUser is false', async () => {
    mockDb._resolveSelect([MOCK_CHAT]);

    await getChats({ userId: 'user-1', getUser: false });

    expect(appendUserToResult).not.toHaveBeenCalled();
  });

  it('returns empty array when no chats', async () => {
    mockDb._resolveSelect([]);

    const result = await getChats({ userId: 'user-1' });

    expect(result).toEqual([]);
  });
});

describe('getChatsCount', () => {
  it('returns count for user', async () => {
    mockDb._resolveSelect([{ count: 5 }]);

    const result = await getChatsCount({ userId: 'user-1' });

    expect(result).toBe(5);
  });

  it('returns count filtered by status', async () => {
    mockDb._resolveSelect([{ count: 2 }]);

    const result = await getChatsCount({ userId: 'user-1', status: ChatStatus.CREATED });

    expect(result).toBe(2);
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns 0 when no results', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getChatsCount({ userId: 'user-1' });

    expect(result).toBe(0);
  });

  it('returns 0 when count is 0', async () => {
    mockDb._resolveSelect([{ count: 0 }]);

    const result = await getChatsCount({ userId: 'user-1' });

    expect(result).toBe(0);
  });
});

describe('findChatById', () => {
  it('returns chat when found', async () => {
    mockDb._resolveSelect([MOCK_CHAT]);

    const result = await findChatById('chat-1');

    expect(result).toEqual(MOCK_CHAT);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns undefined when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await findChatById('nonexistent');

    expect(result).toBeUndefined();
  });
});

describe('updateChat', () => {
  it('updates chat and returns updated record', async () => {
    const updated = { ...MOCK_CHAT, title: 'Updated Title' };
    mockDb._resolveInsert([updated]);

    const result = await updateChat('chat-1', { title: 'Updated Title' });

    expect(result.title).toBe('Updated Title');
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
  });

  it('updates chat status', async () => {
    const deleted = { ...MOCK_CHAT, status: ChatStatus.DELETED };
    mockDb._resolveInsert([deleted]);

    const result = await updateChat('chat-1', { status: ChatStatus.DELETED });

    expect(result.status).toBe(ChatStatus.DELETED);
  });

  it('returns undefined when chat does not exist', async () => {
    mockDb._resolveInsert([]);

    const result = await updateChat('nonexistent', { title: 'X' });

    expect(result).toBeUndefined();
  });
});
