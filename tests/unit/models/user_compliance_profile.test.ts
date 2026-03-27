import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock external deps BEFORE importing the model
vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import {
  getComplianceProfile,
  upsertComplianceProfile,
} from '@/shared/models/user_compliance_profile';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

describe('getComplianceProfile', () => {
  it('returns profile when found', async () => {
    const profile = {
      userId: 'u1',
      ageGroup: 'teen',
      region: 'US',
      consentVersion: '1.0',
    };
    mockDb._resolveSelect([profile]);

    const result = await getComplianceProfile('u1');

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(result).toEqual(profile);
  });

  it('returns null when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await getComplianceProfile('nonexistent');

    expect(result).toBeNull();
  });

  it('returns null when result is undefined', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getComplianceProfile('u1');

    expect(result).toBeNull();
  });
});

describe('upsertComplianceProfile', () => {
  it('updates existing profile', async () => {
    // First call: getComplianceProfile (select) returns existing
    const existing = { userId: 'u1', ageGroup: 'teen', region: 'US' };
    const updated = { userId: 'u1', ageGroup: 'adult', region: 'US' };

    // getComplianceProfile is called first (select chain)
    mockDb._resolveSelect([existing]);
    // Then update().set().where().returning() resolves
    mockDb._resolveInsert([updated]);

    const result = await upsertComplianceProfile('u1', { ageGroup: 'adult' } as any);

    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalledWith({ ageGroup: 'adult' });
    expect(mockDb.returning).toHaveBeenCalled();
    expect(result).toEqual(updated);
  });

  it('inserts new profile when not existing', async () => {
    // getComplianceProfile returns nothing (no existing record)
    mockDb._resolveSelect([]);
    const created = { userId: 'u1', ageGroup: 'teen', region: 'CA' };
    mockDb._resolveInsert([created]);

    const result = await upsertComplianceProfile('u1', {
      ageGroup: 'teen',
      region: 'CA',
    } as any);

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalledWith({
      userId: 'u1',
      ageGroup: 'teen',
      region: 'CA',
    });
    expect(mockDb.returning).toHaveBeenCalled();
    expect(result).toEqual(created);
  });

  it('handles undefined result from select as no existing profile', async () => {
    mockDb._resolveSelect([undefined]);
    const created = { userId: 'u2', ageGroup: 'child' };
    mockDb._resolveInsert([created]);

    const result = await upsertComplianceProfile('u2', { ageGroup: 'child' } as any);

    // undefined ?? null = null → insert path
    expect(mockDb.insert).toHaveBeenCalled();
    expect(result).toEqual(created);
  });
});
