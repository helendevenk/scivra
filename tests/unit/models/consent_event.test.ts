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
  createConsentEvent,
  deleteConsentEventsOlderThan,
} from '@/shared/models/consent_event';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_CONSENT_EVENT = {
  id: 'mock-uuid',
  userId: 'user-1',
  consentType: 'terms',
  consentVersion: '1.0',
  granted: true,
  ipAddress: '127.0.0.1',
  userAgent: 'test-agent',
  createdAt: new Date('2026-03-27'),
};

describe('createConsentEvent', () => {
  it('creates a consent event with generated uuid', async () => {
    mockDb._resolveInsert([MOCK_CONSENT_EVENT]);

    const result = await createConsentEvent({
      userId: 'user-1',
      consentType: 'terms',
      consentVersion: '1.0',
      granted: true,
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
    });

    expect(result).toEqual(MOCK_CONSENT_EVENT);
    expect(result.id).toBe('mock-uuid');
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
  });
});

describe('deleteConsentEventsOlderThan', () => {
  it('deletes events older than cutoff and returns count', async () => {
    mockDb._resolveSelect({ count: 5 });

    const cutoff = new Date('2026-01-01');
    const result = await deleteConsentEventsOlderThan(cutoff);

    expect(result).toBe(5);
    expect(mockDb.delete).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns 0 when no events to delete', async () => {
    mockDb._resolveSelect({ count: 0 });

    const cutoff = new Date('2020-01-01');
    const result = await deleteConsentEventsOlderThan(cutoff);

    expect(result).toBe(0);
  });
});
