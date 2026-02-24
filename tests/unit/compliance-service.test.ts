import { describe, it, expect, vi } from 'vitest';
import { createComplianceService, type ComplianceRepository } from '@/core/compliance/service';

function createMockRepository(): ComplianceRepository {
  return {
    recordConsentEvent: vi.fn().mockResolvedValue('evt-123'),
    updateUserCompliance: vi.fn().mockResolvedValue(undefined),
    createPrivacyRequest: vi.fn().mockResolvedValue({ id: 'req-1', status: 'pending' }),
    getPrivacyRequestById: vi.fn().mockResolvedValue(null),
  };
}

describe('createComplianceService', () => {
  describe('handleAgeGate', () => {
    it('allows signup for 18_plus', async () => {
      const repo = createMockRepository();
      const service = createComplianceService(repo);
      const result = await service.handleAgeGate({
        ageGroup: '18_plus',
        countryCode: 'US',
        sessionId: 'sess-1',
        userId: 'user-1',
      });
      expect(result.ok).toBe(true);
      expect(result.allowSignup).toBe(true);
      expect(result.allowAnonymous).toBe(true);
    });

    it('blocks signup for u13', async () => {
      const repo = createMockRepository();
      const service = createComplianceService(repo);
      const result = await service.handleAgeGate({
        ageGroup: 'u13',
        countryCode: 'US',
        sessionId: 'sess-1',
        userId: null,
      });
      expect(result.allowSignup).toBe(false);
      expect(result.allowAnonymous).toBe(true);
    });

    it('records consent event', async () => {
      const repo = createMockRepository();
      const service = createComplianceService(repo);
      await service.handleAgeGate({
        ageGroup: '13_17',
        countryCode: 'gb',
        sessionId: 'sess-1',
        userId: null,
      });
      expect(repo.recordConsentEvent).toHaveBeenCalledWith({
        userId: null,
        sessionId: 'sess-1',
        eventType: 'age_gate',
        regionCode: 'GB',
        metadata: { ageGroup: '13_17' },
      });
    });

    it('updates user compliance when userId provided', async () => {
      const repo = createMockRepository();
      const service = createComplianceService(repo);
      await service.handleAgeGate({
        ageGroup: '18_plus',
        countryCode: 'DE',
        sessionId: null,
        userId: 'user-1',
      });
      expect(repo.updateUserCompliance).toHaveBeenCalledWith({
        userId: 'user-1',
        ageGroup: '18_plus',
        countryCode: 'DE',
      });
    });

    it('skips user compliance update when no userId', async () => {
      const repo = createMockRepository();
      const service = createComplianceService(repo);
      await service.handleAgeGate({
        ageGroup: '18_plus',
        countryCode: 'US',
        sessionId: 'sess-1',
        userId: null,
      });
      expect(repo.updateUserCompliance).not.toHaveBeenCalled();
    });
  });

  describe('recordConsent', () => {
    it('records cookie_accept event', async () => {
      const repo = createMockRepository();
      const service = createComplianceService(repo);
      const result = await service.recordConsent({
        eventType: 'cookie_accept',
        policyVersion: '2026-01-01',
        regionCode: 'FR',
        sessionId: 'sess-1',
        userId: null,
      });
      expect(result.ok).toBe(true);
      expect(result.eventId).toBe('evt-123');
    });

    it('updates privacy policy version on privacy_accept', async () => {
      const repo = createMockRepository();
      const service = createComplianceService(repo);
      await service.recordConsent({
        eventType: 'privacy_accept',
        policyVersion: 'v2',
        regionCode: null,
        sessionId: null,
        userId: 'user-1',
      });
      expect(repo.updateUserCompliance).toHaveBeenCalledWith(
        expect.objectContaining({ privacyPolicyVersion: 'v2' })
      );
    });

    it('updates terms version on terms_accept', async () => {
      const repo = createMockRepository();
      const service = createComplianceService(repo);
      await service.recordConsent({
        eventType: 'terms_accept',
        policyVersion: 'v3',
        regionCode: null,
        sessionId: null,
        userId: 'user-1',
      });
      expect(repo.updateUserCompliance).toHaveBeenCalledWith(
        expect.objectContaining({
          termsVersion: 'v3',
          termsAcceptedAt: expect.any(Date),
        })
      );
    });
  });

  describe('createPrivacyRequest', () => {
    it('creates export request', async () => {
      const repo = createMockRepository();
      const service = createComplianceService(repo);
      const result = await service.createPrivacyRequest({
        userId: 'user-1',
        requestType: 'export',
      });
      expect(result.ok).toBe(true);
      expect(result.requestId).toBe('req-1');
      expect(result.status).toBe('pending');
    });
  });

  describe('getPrivacyRequestStatus', () => {
    it('returns not_found for missing request', async () => {
      const repo = createMockRepository();
      const service = createComplianceService(repo);
      const result = await service.getPrivacyRequestStatus({
        userId: 'user-1',
        requestId: 'nonexistent',
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('not_found');
      }
    });

    it('returns not_found when userId does not match', async () => {
      const repo = createMockRepository();
      (repo.getPrivacyRequestById as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'req-1',
        userId: 'other-user',
        requestType: 'export',
        status: 'pending',
        updatedAt: null,
      });
      const service = createComplianceService(repo);
      const result = await service.getPrivacyRequestStatus({
        userId: 'user-1',
        requestId: 'req-1',
      });
      expect(result.ok).toBe(false);
    });

    it('returns status for valid request', async () => {
      const repo = createMockRepository();
      (repo.getPrivacyRequestById as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'req-1',
        userId: 'user-1',
        requestType: 'delete',
        status: 'processing',
        updatedAt: new Date('2026-01-15'),
      });
      const service = createComplianceService(repo);
      const result = await service.getPrivacyRequestStatus({
        userId: 'user-1',
        requestId: 'req-1',
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.status).toBe('processing');
        expect(result.requestType).toBe('delete');
        expect(result.updatedAt).toBe('2026-01-15T00:00:00.000Z');
      }
    });
  });
});
