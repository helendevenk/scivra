export type AgeGroup = 'u13' | '13_17' | '18_plus' | 'unknown';

export type ConsentEventType =
  | 'privacy_accept'
  | 'terms_accept'
  | 'cookie_accept'
  | 'cookie_reject'
  | 'age_gate';

export type PrivacyRequestType = 'export' | 'delete';

export type PrivacyRequestStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'rejected';

type AgeGateInput = {
  ageGroup: AgeGroup;
  countryCode: string | null;
  sessionId: string | null;
  userId: string | null;
};

type ConsentInput = {
  eventType: Exclude<ConsentEventType, 'age_gate'>;
  policyVersion: string | null;
  regionCode: string | null;
  sessionId: string | null;
  userId: string | null;
};

type CreatePrivacyRequestInput = {
  userId: string;
  requestType: PrivacyRequestType;
};

type GetPrivacyRequestStatusInput = {
  userId: string;
  requestId: string;
};

function normalizeCountryCode(countryCode: string | null): string | null {
  if (!countryCode) return null;
  return countryCode.slice(0, 2).toUpperCase();
}

export type ComplianceRepository = {
  recordConsentEvent: (input: {
    userId: string | null;
    sessionId: string | null;
    eventType: ConsentEventType;
    policyVersion?: string | null;
    regionCode?: string | null;
    metadata?: Record<string, unknown>;
  }) => Promise<string>;
  updateUserCompliance: (input: {
    userId: string;
    ageGroup?: AgeGroup;
    countryCode?: string | null;
    privacyPolicyVersion?: string | null;
    termsVersion?: string | null;
    termsAcceptedAt?: Date | null;
    marketingConsentAt?: Date | null;
  }) => Promise<void>;
  createPrivacyRequest: (input: {
    userId: string;
    requestType: PrivacyRequestType;
    metadata?: Record<string, unknown>;
  }) => Promise<{ id: string; status: PrivacyRequestStatus }>;
  getPrivacyRequestById: (input: {
    requestId: string;
  }) => Promise<{
    id: string;
    userId: string;
    requestType: PrivacyRequestType;
    status: PrivacyRequestStatus;
    updatedAt?: Date | null;
  } | null>;
};

export function createComplianceService(repository: ComplianceRepository) {
  return {
    async handleAgeGate(input: AgeGateInput) {
      const countryCode = normalizeCountryCode(input.countryCode);

      await repository.recordConsentEvent({
        userId: input.userId,
        sessionId: input.sessionId,
        eventType: 'age_gate',
        regionCode: countryCode,
        metadata: { ageGroup: input.ageGroup },
      });

      if (input.userId) {
        await repository.updateUserCompliance({
          userId: input.userId,
          ageGroup: input.ageGroup,
          countryCode,
        });
      }

      return {
        ok: true as const,
        allowSignup: input.ageGroup !== 'u13',
        allowAnonymous: true as const,
      };
    },

    async recordConsent(input: ConsentInput) {
      const countryCode = normalizeCountryCode(input.regionCode);
      const eventId = await repository.recordConsentEvent({
        userId: input.userId,
        sessionId: input.sessionId,
        eventType: input.eventType,
        policyVersion: input.policyVersion,
        regionCode: countryCode,
      });

      if (input.userId && input.eventType === 'privacy_accept') {
        await repository.updateUserCompliance({
          userId: input.userId,
          privacyPolicyVersion: input.policyVersion,
          countryCode,
        });
      }

      if (input.userId && input.eventType === 'terms_accept') {
        await repository.updateUserCompliance({
          userId: input.userId,
          termsVersion: input.policyVersion,
          termsAcceptedAt: new Date(),
          countryCode,
        });
      }

      return { ok: true as const, eventId };
    },

    async createPrivacyRequest(input: CreatePrivacyRequestInput) {
      const request = await repository.createPrivacyRequest({
        userId: input.userId,
        requestType: input.requestType,
      });

      return {
        ok: true as const,
        requestId: request.id,
        status: request.status,
      };
    },

    async getPrivacyRequestStatus(input: GetPrivacyRequestStatusInput) {
      const request = await repository.getPrivacyRequestById({
        requestId: input.requestId,
      });

      if (!request || request.userId !== input.userId) {
        return { ok: false as const, error: 'not_found' as const };
      }

      return {
        ok: true as const,
        status: request.status,
        requestType: request.requestType,
        updatedAt: request.updatedAt?.toISOString() ?? null,
      };
    },
  };
}
