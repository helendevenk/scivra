import { NextRequest } from 'next/server';

import { createComplianceService, type AgeGroup } from '@/core/compliance';
import { createDrizzleComplianceRepository } from '@/core/compliance/repository';
import { getSignUser } from '@/shared/models/user';
import { respData, respErr } from '@/shared/lib/resp';
import { captureServerError } from '@/extensions/monitoring/sentry';

const VALID_AGE_GROUPS: AgeGroup[] = ['u13', '13_17', '18_plus', 'unknown'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ageGroup, countryCode, sessionId } = body;

    if (!ageGroup || !VALID_AGE_GROUPS.includes(ageGroup)) {
      return respErr('invalid_age_group');
    }

    const user = await getSignUser();
    const service = createComplianceService(createDrizzleComplianceRepository());

    const result = await service.handleAgeGate({
      ageGroup,
      countryCode: countryCode ?? null,
      sessionId: sessionId ?? null,
      userId: user?.id ?? null,
    });

    return respData(result);
  } catch (error) {
    captureServerError(error, { route: '/api/compliance/age-gate' });
    return respErr('age_gate_failed');
  }
}
