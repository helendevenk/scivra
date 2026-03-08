import { NextRequest } from 'next/server';

import { createComplianceService } from '@/core/compliance';
import { createDrizzleComplianceRepository } from '@/core/compliance/repository';
import { getSignUser } from '@/shared/models/user';
import { respData, respErr } from '@/shared/lib/resp';
import { captureServerError } from '@/extensions/monitoring/sentry';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSignUser();
    if (!user) {
      return respErr('unauthorized');
    }

    const { id } = await params;
    if (!id) {
      return respErr('request_id_required');
    }

    const service = createComplianceService(createDrizzleComplianceRepository());

    const result = await service.getPrivacyRequestStatus({
      userId: user.id,
      requestId: id,
    });

    if (!result.ok) {
      return respErr('not_found');
    }

    return respData(result);
  } catch (error) {
    captureServerError(error, { route: '/api/privacy/status/[id]' });
    return respErr('status_query_failed');
  }
}
