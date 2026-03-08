import { NextRequest } from 'next/server';

import { createComplianceService, type ConsentEventType } from '@/core/compliance';
import { createDrizzleComplianceRepository } from '@/core/compliance/repository';
import { getSignUser } from '@/shared/models/user';
import { respData, respErr } from '@/shared/lib/resp';
import { captureServerError } from '@/extensions/monitoring/sentry';

const VALID_EVENT_TYPES: ConsentEventType[] = [
  'privacy_accept',
  'terms_accept',
  'cookie_accept',
  'cookie_reject',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, policyVersion, regionCode, sessionId } = body;

    if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
      return respErr('invalid_event_type');
    }

    const user = await getSignUser();
    const userId = user?.id ?? null;

    if (!userId && !sessionId) {
      return respErr('session_id_required');
    }

    const service = createComplianceService(createDrizzleComplianceRepository());

    const result = await service.recordConsent({
      eventType,
      policyVersion: policyVersion ?? null,
      regionCode: regionCode ?? null,
      sessionId: sessionId ?? null,
      userId,
    });

    return respData(result);
  } catch (error) {
    captureServerError(error, { route: '/api/compliance/consent' });
    return respErr('consent_failed');
  }
}
