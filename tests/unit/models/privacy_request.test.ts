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
  createPrivacyRequest,
  getPrivacyRequestById,
  updatePrivacyRequestStatus,
} from '@/shared/models/privacy_request';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_PRIVACY_REQUEST = {
  id: 'mock-uuid',
  userId: 'user-1',
  requestType: 'data_export',
  status: 'pending',
  metadata: null,
  completedAt: null,
  createdAt: new Date('2026-03-27'),
  updatedAt: new Date('2026-03-27'),
};

describe('createPrivacyRequest', () => {
  it('creates a privacy request with generated uuid', async () => {
    mockDb._resolveInsert([MOCK_PRIVACY_REQUEST]);

    const result = await createPrivacyRequest({
      userId: 'user-1',
      requestType: 'data_export',
    });

    expect(result).toEqual(MOCK_PRIVACY_REQUEST);
    expect(result.id).toBe('mock-uuid');
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
  });

  it('creates a privacy request with metadata', async () => {
    const withMetadata = { ...MOCK_PRIVACY_REQUEST, metadata: '{"format":"json"}' };
    mockDb._resolveInsert([withMetadata]);

    const result = await createPrivacyRequest({
      userId: 'user-1',
      requestType: 'data_export',
      metadata: '{"format":"json"}',
    });

    expect(result.metadata).toBe('{"format":"json"}');
  });
});

describe('getPrivacyRequestById', () => {
  it('returns privacy request when found', async () => {
    mockDb._resolveSelect([MOCK_PRIVACY_REQUEST]);

    const result = await getPrivacyRequestById('mock-uuid');

    expect(result).toEqual(MOCK_PRIVACY_REQUEST);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns null when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await getPrivacyRequestById('nonexistent');

    expect(result).toBeNull();
  });
});

describe('updatePrivacyRequestStatus', () => {
  it('updates status and returns updated record', async () => {
    const updated = { ...MOCK_PRIVACY_REQUEST, status: 'completed' };
    mockDb._resolveInsert([updated]);

    const result = await updatePrivacyRequestStatus('mock-uuid', 'completed');

    expect(result.status).toBe('completed');
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
  });

  it('updates status with completedAt date', async () => {
    const completedAt = new Date('2026-03-27T12:00:00Z');
    const updated = { ...MOCK_PRIVACY_REQUEST, status: 'completed', completedAt };
    mockDb._resolveInsert([updated]);

    const result = await updatePrivacyRequestStatus('mock-uuid', 'completed', completedAt);

    expect(result.status).toBe('completed');
    expect(result.completedAt).toEqual(completedAt);
  });

  it('returns undefined when request does not exist', async () => {
    mockDb._resolveInsert([]);

    const result = await updatePrivacyRequestStatus('nonexistent', 'completed');

    expect(result).toBeUndefined();
  });
});
