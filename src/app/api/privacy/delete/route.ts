import { createComplianceService } from '@/core/compliance';
import { createDrizzleComplianceRepository } from '@/core/compliance/repository';
import { getSignUser } from '@/shared/models/user';
import { respData, respErr } from '@/shared/lib/resp';
import { captureServerError } from '@/extensions/monitoring/sentry';

export async function POST() {
  try {
    const user = await getSignUser();
    if (!user) {
      return respErr('unauthorized');
    }

    const service = createComplianceService(createDrizzleComplianceRepository());

    const result = await service.createPrivacyRequest({
      userId: user.id,
      requestType: 'delete',
    });

    return respData(result);
  } catch (error) {
    captureServerError(error, { route: '/api/privacy/delete' });
    return respErr('delete_request_failed');
  }
}
