import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// --- Mocks ---

const mockHandleAgeGate = vi.fn();
const mockRecordConsent = vi.fn();

vi.mock('@/core/compliance', () => ({
  createComplianceService: vi.fn(() => ({
    handleAgeGate: mockHandleAgeGate,
    recordConsent: mockRecordConsent,
  })),
}));

vi.mock('@/core/compliance/repository', () => ({
  createDrizzleComplianceRepository: vi.fn(() => ({})),
}));

vi.mock('@/shared/models/user', () => ({
  getSignUser: vi.fn(),
}));

vi.mock('@/extensions/monitoring/sentry', () => ({
  captureServerError: vi.fn(),
}));

// Re-import after mocks
import { POST as ageGatePOST } from '@/app/api/compliance/age-gate/route';
import { POST as consentPOST } from '@/app/api/compliance/consent/route';
import { getSignUser } from '@/shared/models/user';

// --- Helpers ---

function makeAgeGateRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/compliance/age-gate', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

function makeConsentRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/compliance/consent', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

// --- Tests ---

describe('POST /api/compliance/age-gate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSignUser).mockResolvedValue(null);
  });

  it('should accept valid birthdate and return age gate result', async () => {
    mockHandleAgeGate.mockResolvedValue({
      ageGroup: '18_plus',
      requiresParentalConsent: false,
      allowSignup: true,
      allowAnonymous: true,
    });

    const res = await ageGatePOST(
      makeAgeGateRequest({ ageGroup: '18_plus', countryCode: 'US' })
    );
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.ageGroup).toBe('18_plus');
    expect(json.data.allowSignup).toBe(true);
  });

  it('should block u13 users from signup', async () => {
    mockHandleAgeGate.mockResolvedValue({
      ageGroup: 'u13',
      requiresParentalConsent: true,
      allowSignup: false,
      allowAnonymous: true,
    });

    const res = await ageGatePOST(
      makeAgeGateRequest({ ageGroup: 'u13', countryCode: 'US' })
    );
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.allowSignup).toBe(false);
    expect(json.data.requiresParentalConsent).toBe(true);
  });

  it('should require parental consent for 13-17 age group', async () => {
    mockHandleAgeGate.mockResolvedValue({
      ageGroup: '13_17',
      requiresParentalConsent: true,
      allowSignup: true,
      allowAnonymous: true,
    });

    const res = await ageGatePOST(
      makeAgeGateRequest({ ageGroup: '13_17', countryCode: 'US' })
    );
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.requiresParentalConsent).toBe(true);
    expect(json.data.allowSignup).toBe(true);
  });

  it('should allow full access for 18+ users', async () => {
    mockHandleAgeGate.mockResolvedValue({
      ageGroup: '18_plus',
      requiresParentalConsent: false,
      allowSignup: true,
      allowAnonymous: true,
    });

    const res = await ageGatePOST(
      makeAgeGateRequest({ ageGroup: '18_plus', countryCode: 'CA' })
    );
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.requiresParentalConsent).toBe(false);
    expect(json.data.allowSignup).toBe(true);
    expect(mockHandleAgeGate).toHaveBeenCalledWith(
      expect.objectContaining({ ageGroup: '18_plus', countryCode: 'CA' })
    );
  });

  it('should reject invalid age group', async () => {
    const res = await ageGatePOST(
      makeAgeGateRequest({ ageGroup: 'invalid_group' })
    );
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe('invalid_age_group');
    expect(mockHandleAgeGate).not.toHaveBeenCalled();
  });
});

describe('POST /api/compliance/consent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSignUser).mockResolvedValue(null);
  });

  it('should record consent successfully with session ID', async () => {
    mockRecordConsent.mockResolvedValue({ eventId: 'evt-1' });

    const res = await consentPOST(
      makeConsentRequest({
        eventType: 'privacy_accept',
        policyVersion: '2.0',
        sessionId: 'sess-abc',
      })
    );
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.eventId).toBe('evt-1');
    expect(mockRecordConsent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'privacy_accept',
        policyVersion: '2.0',
        sessionId: 'sess-abc',
        userId: null,
      })
    );
  });

  it('should reject missing eventType', async () => {
    const res = await consentPOST(
      makeConsentRequest({ policyVersion: '1.0', sessionId: 'sess-1' })
    );
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe('invalid_event_type');
  });

  it('should require sessionId when user is anonymous', async () => {
    vi.mocked(getSignUser).mockResolvedValue(null);

    const res = await consentPOST(
      makeConsentRequest({
        eventType: 'terms_accept',
        policyVersion: '1.0',
      })
    );
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe('session_id_required');
  });
});
