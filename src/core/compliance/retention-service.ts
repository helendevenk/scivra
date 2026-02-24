export const DEFAULT_ANONYMOUS_RETENTION_DAYS = 365;
export const DEFAULT_CONSENT_RETENTION_DAYS = 730;

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type RetentionRepository = {
  deleteAnonymousUsageOlderThan: (input: { cutoff: Date }) => Promise<number>;
  deleteConsentEventsOlderThan: (input: { cutoff: Date }) => Promise<number>;
};

function formatUtcDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildCutoffDate(now: Date, retentionDays: number): Date {
  return new Date(now.getTime() - retentionDays * ONE_DAY_MS);
}

export async function processDataRetention(
  input: {
    now?: Date;
    anonymousRetentionDays?: number;
    consentRetentionDays?: number;
  },
  repository: RetentionRepository
) {
  const now = input.now ?? new Date();
  const anonymousRetentionDays =
    input.anonymousRetentionDays ?? DEFAULT_ANONYMOUS_RETENTION_DAYS;
  const consentRetentionDays =
    input.consentRetentionDays ?? DEFAULT_CONSENT_RETENTION_DAYS;

  const anonymousCutoff = buildCutoffDate(now, anonymousRetentionDays);
  const consentCutoff = buildCutoffDate(now, consentRetentionDays);

  const [deletedAnonymousUsage, deletedConsentEvents] = await Promise.all([
    repository.deleteAnonymousUsageOlderThan({ cutoff: anonymousCutoff }),
    repository.deleteConsentEventsOlderThan({ cutoff: consentCutoff }),
  ]);

  return {
    ok: true as const,
    deletedAnonymousUsage,
    deletedConsentEvents,
    anonymousCutoffDate: formatUtcDateString(anonymousCutoff),
    consentCutoffDate: formatUtcDateString(consentCutoff),
  };
}
