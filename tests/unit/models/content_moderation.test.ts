import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

vi.mock('@/shared/lib/hash', () => ({
  getUuid: vi.fn(() => 'mock-uuid'),
}));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import {
  createModerationRecord,
  getModerationRecordsByGenerationId,
  getPendingModerationRecords,
  updateModerationRecord,
  getModerationStats,
  getModerationRecordById,
} from '@/shared/models/content_moderation';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_RECORD = {
  id: 'mod-1',
  generationId: 'gen-1',
  userId: 'user-1',
  contentType: 'input',
  content: 'harmless physics prompt',
  status: 'pass',
  checkedAt: new Date('2026-03-27T00:00:00Z'),
  reviewedBy: null,
  reviewNotes: null,
  reviewedAt: null,
};

describe('createModerationRecord', () => {
  it('creates and returns a moderation record', async () => {
    mockDb._resolveInsert([MOCK_RECORD]);

    const result = await createModerationRecord({
      generationId: 'gen-1',
      userId: 'user-1',
      contentType: 'input',
      content: 'harmless physics prompt',
      status: 'pass',
    });

    expect(result).toEqual(MOCK_RECORD);
    expect(mockDb.insert).toHaveBeenCalled();
  });
});

describe('getModerationRecordsByGenerationId', () => {
  it('returns records ordered by checkedAt desc', async () => {
    mockDb._resolveSelect([MOCK_RECORD]);

    const result = await getModerationRecordsByGenerationId('gen-1');

    expect(result).toHaveLength(1);
    expect(mockDb.orderBy).toHaveBeenCalled();
  });
});

describe('getPendingModerationRecords', () => {
  it('returns pending records with pagination', async () => {
    const pending = { ...MOCK_RECORD, status: 'pending' };
    mockDb._resolveSelect([pending]);

    const result = await getPendingModerationRecords(50, 0);

    expect(result).toHaveLength(1);
    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.offset).toHaveBeenCalled();
  });
});

describe('updateModerationRecord', () => {
  it('updates status and returns record', async () => {
    const updated = { ...MOCK_RECORD, status: 'reject', reviewedBy: 'admin-1' };
    mockDb._resolveInsert([updated]);

    const result = await updateModerationRecord('mod-1', {
      status: 'reject',
      reviewedBy: 'admin-1',
    });

    expect(result!.status).toBe('reject');
    expect(mockDb.update).toHaveBeenCalled();
  });

  it('returns null when record not found', async () => {
    mockDb._resolveInsert([undefined]);

    const result = await updateModerationRecord('nonexistent', { status: 'pass' });

    expect(result).toBeNull();
  });
});

describe('getModerationStats', () => {
  it('aggregates stats correctly', async () => {
    mockDb._resolveSelect([
      { ...MOCK_RECORD, status: 'pass' },
      { ...MOCK_RECORD, id: 'mod-2', status: 'pass' },
      { ...MOCK_RECORD, id: 'mod-3', status: 'reject' },
      { ...MOCK_RECORD, id: 'mod-4', status: 'pending' },
    ]);

    const result = await getModerationStats();

    expect(result).toEqual({ total: 4, passed: 2, rejected: 1, pending: 1 });
  });

  it('returns zeros when no records', async () => {
    mockDb._resolveSelect([]);

    const result = await getModerationStats();

    expect(result).toEqual({ total: 0, passed: 0, rejected: 0, pending: 0 });
  });
});

describe('getModerationRecordById', () => {
  it('returns record when found', async () => {
    mockDb._resolveSelect([MOCK_RECORD]);

    const result = await getModerationRecordById('mod-1');

    expect(result).toEqual(MOCK_RECORD);
  });

  it('returns null when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await getModerationRecordById('nonexistent');

    expect(result).toBeNull();
  });
});
