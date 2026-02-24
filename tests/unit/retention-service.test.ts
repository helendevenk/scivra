import { describe, it, expect, vi } from 'vitest';
import { processDataRetention } from '@/core/compliance/retention-service';

function createMockRetentionRepo() {
  return {
    deleteAnonymousUsageOlderThan: vi.fn().mockResolvedValue(10),
    deleteConsentEventsOlderThan: vi.fn().mockResolvedValue(5),
  };
}

describe('processDataRetention', () => {
  it('deletes old data with default retention days', async () => {
    const repo = createMockRetentionRepo();
    const now = new Date('2026-06-01T00:00:00Z');
    const result = await processDataRetention({ now }, repo);

    expect(result.ok).toBe(true);
    expect(result.deletedAnonymousUsage).toBe(10);
    expect(result.deletedConsentEvents).toBe(5);

    const anonCutoff = (repo.deleteAnonymousUsageOlderThan.mock.calls[0][0] as { cutoff: Date }).cutoff;
    expect(anonCutoff.toISOString().slice(0, 10)).toBe('2025-06-01');

    const consentCutoff = (repo.deleteConsentEventsOlderThan.mock.calls[0][0] as { cutoff: Date }).cutoff;
    expect(consentCutoff.toISOString().slice(0, 10)).toBe('2024-06-01');
  });

  it('uses custom retention days', async () => {
    const repo = createMockRetentionRepo();
    const now = new Date('2026-06-01T00:00:00Z');
    const result = await processDataRetention(
      { now, anonymousRetentionDays: 30, consentRetentionDays: 60 },
      repo
    );

    expect(result.ok).toBe(true);
    expect(result.anonymousCutoffDate).toBe('2026-05-02');
    expect(result.consentCutoffDate).toBe('2026-04-02');
  });

  it('uses current date when now is not provided', async () => {
    const repo = createMockRetentionRepo();
    const result = await processDataRetention({}, repo);
    expect(result.ok).toBe(true);
    expect(result.anonymousCutoffDate).toBeDefined();
  });
});
