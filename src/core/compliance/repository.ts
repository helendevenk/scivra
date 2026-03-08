import type { ComplianceRepository } from './service';
import { createConsentEvent } from '@/shared/models/consent_event';
import { upsertComplianceProfile } from '@/shared/models/user_compliance_profile';
import {
  createPrivacyRequest as createPrivacyRequestModel,
  getPrivacyRequestById as getPrivacyRequestByIdModel,
} from '@/shared/models/privacy_request';
import type { PrivacyRequestStatus, PrivacyRequestType } from './service';

export function createDrizzleComplianceRepository(): ComplianceRepository {
  return {
    async recordConsentEvent(input) {
      const result = await createConsentEvent({
        userId: input.userId ?? null,
        sessionId: input.sessionId ?? null,
        eventType: input.eventType,
        policyVersion: input.policyVersion ?? null,
        regionCode: input.regionCode ?? null,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      });
      return result.id;
    },

    async updateUserCompliance(input) {
      const { userId, ...data } = input;
      await upsertComplianceProfile(userId, data);
    },

    async createPrivacyRequest(input) {
      const result = await createPrivacyRequestModel({
        userId: input.userId,
        requestType: input.requestType,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      });
      return {
        id: result.id,
        status: result.status as PrivacyRequestStatus,
      };
    },

    async getPrivacyRequestById(input) {
      const result = await getPrivacyRequestByIdModel(input.requestId);
      if (!result) return null;
      return {
        id: result.id,
        userId: result.userId,
        requestType: result.requestType as PrivacyRequestType,
        status: result.status as PrivacyRequestStatus,
        updatedAt: result.updatedAt ?? null,
      };
    },
  };
}
