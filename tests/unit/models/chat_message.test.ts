import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock external deps BEFORE importing the model
vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

vi.mock('@/shared/models/chat', () => ({}));

vi.mock('@/shared/models/user', () => ({
  appendUserToResult: vi.fn((result: unknown[]) => result),
}));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { appendUserToResult } from '@/shared/models/user';
import {
  createChatMessage,
  getChatMessages,
  getChatMessagesCount,
  findChatMessageById,
  updateChatMessage,
  ChatMessageStatus,
} from '@/shared/models/chat_message';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

describe('createChatMessage', () => {
  it('inserts and returns chat message', async () => {
    const newMsg = {
      id: 'msg-1',
      chatId: 'chat-1',
      userId: 'u1',
      content: 'Hello',
      role: 'user',
    };
    const expected = { ...newMsg, status: 'created', createdAt: new Date() };
    mockDb._resolveInsert([expected]);

    const result = await createChatMessage(newMsg as any);

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalledWith(newMsg);
    expect(mockDb.returning).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });
});

describe('getChatMessages', () => {
  it('returns messages with default pagination', async () => {
    const messages = [
      { id: 'msg-1', content: 'Hello' },
      { id: 'msg-2', content: 'World' },
    ];
    mockDb._resolveSelect(messages);

    const result = await getChatMessages({ chatId: 'chat-1' });

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();
    expect(mockDb.limit).toHaveBeenCalledWith(30);
    expect(mockDb.offset).toHaveBeenCalledWith(0); // (1-1)*30
    expect(result).toEqual(messages);
  });

  it('paginates with custom page and limit', async () => {
    const messages = [{ id: 'msg-3' }];
    mockDb._resolveSelect(messages);

    const result = await getChatMessages({ chatId: 'chat-1', page: 3, limit: 10 });

    expect(mockDb.limit).toHaveBeenCalledWith(10);
    expect(mockDb.offset).toHaveBeenCalledWith(20); // (3-1)*10
    expect(result).toEqual(messages);
  });

  it('calls appendUserToResult when getUser is true', async () => {
    const messages = [{ id: 'msg-1', userId: 'u1' }];
    mockDb._resolveSelect(messages);

    const result = await getChatMessages({ chatId: 'chat-1', getUser: true });

    expect(appendUserToResult).toHaveBeenCalledWith(messages);
    expect(result).toEqual(messages);
  });

  it('does not call appendUserToResult when getUser is false', async () => {
    mockDb._resolveSelect([]);

    await getChatMessages({ chatId: 'chat-1', getUser: false });

    expect(appendUserToResult).not.toHaveBeenCalled();
  });

  it('returns empty array when no messages found', async () => {
    mockDb._resolveSelect([]);

    const result = await getChatMessages({ chatId: 'chat-1' });

    expect(result).toEqual([]);
  });

  it('filters by userId and status', async () => {
    mockDb._resolveSelect([]);

    await getChatMessages({
      chatId: 'chat-1',
      userId: 'u1',
      status: ChatMessageStatus.CREATED,
    });

    expect(mockDb.where).toHaveBeenCalled();
  });
});

describe('getChatMessagesCount', () => {
  it('returns count value', async () => {
    mockDb._resolveSelect([{ count: 15 }]);

    const result = await getChatMessagesCount({ chatId: 'chat-1' });

    expect(result).toBe(15);
  });

  it('returns 0 when no result', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getChatMessagesCount({ chatId: 'chat-1' });

    expect(result).toBe(0);
  });

  it('returns 0 when count is 0', async () => {
    mockDb._resolveSelect([{ count: 0 }]);

    const result = await getChatMessagesCount({ chatId: 'chat-1' });

    expect(result).toBe(0);
  });

  it('filters by userId and status', async () => {
    mockDb._resolveSelect([{ count: 5 }]);

    const result = await getChatMessagesCount({
      chatId: 'chat-1',
      userId: 'u1',
      status: ChatMessageStatus.DELETED,
    });

    expect(mockDb.where).toHaveBeenCalled();
    expect(result).toBe(5);
  });
});

describe('findChatMessageById', () => {
  it('returns chat message when found', async () => {
    const message = { id: 'msg-1', content: 'Hello', chatId: 'chat-1' };
    mockDb._resolveSelect([message]);

    const result = await findChatMessageById('msg-1');

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(result).toEqual(message);
  });

  it('returns undefined when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await findChatMessageById('nonexistent');

    expect(result).toBeUndefined();
  });
});

describe('updateChatMessage', () => {
  it('updates and returns chat message', async () => {
    const updated = { id: 'msg-1', content: 'Updated', status: 'deleted' };
    mockDb._resolveInsert([updated]);

    const result = await updateChatMessage('msg-1', { content: 'Updated' } as any);

    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalledWith({ content: 'Updated' });
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
    expect(result).toEqual(updated);
  });

  it('returns undefined when message does not exist', async () => {
    mockDb._resolveInsert([]);

    const result = await updateChatMessage('nonexistent', { content: 'X' } as any);

    expect(result).toBeUndefined();
  });
});
