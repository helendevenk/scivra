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
  createUpgReport,
  getReportCountByGenerationId,
} from '@/shared/models/upg_report';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_UPG_REPORT = {
  id: 'report-1',
  generationId: 'gen-1',
  userId: 'user-1',
  reportType: 'inappropriate',
  content: 'Contains harmful content',
  status: 'pending',
  createdAt: new Date('2026-03-27'),
};

describe('createUpgReport', () => {
  it('creates a report and returns it', async () => {
    mockDb._resolveInsert([MOCK_UPG_REPORT]);

    const result = await createUpgReport({
      id: 'report-1',
      generationId: 'gen-1',
      userId: 'user-1',
      reportType: 'inappropriate',
      content: 'Contains harmful content',
    });

    expect(result).toEqual(MOCK_UPG_REPORT);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
  });

  it('uses generated uuid when id is not provided', async () => {
    const reportWithMockId = { ...MOCK_UPG_REPORT, id: 'mock-uuid' };
    mockDb._resolveInsert([reportWithMockId]);

    const result = await createUpgReport({
      id: 'mock-uuid',
      generationId: 'gen-1',
      userId: 'user-1',
      reportType: 'inappropriate',
    });

    expect(result.id).toBe('mock-uuid');
  });
});

describe('getReportCountByGenerationId', () => {
  it('returns count for a generation', async () => {
    mockDb._resolveSelect([{ count: 3 }]);

    const result = await getReportCountByGenerationId('gen-1');

    expect(result).toBe(3);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns 0 when no reports exist', async () => {
    mockDb._resolveSelect([{ count: 0 }]);

    const result = await getReportCountByGenerationId('gen-1');

    expect(result).toBe(0);
  });

  it('returns 0 when result is undefined', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getReportCountByGenerationId('gen-1');

    expect(result).toBe(0);
  });
});
