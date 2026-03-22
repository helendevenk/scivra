import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { getProgressByUser } from '@/shared/models/ap_user_progress';

export async function GET() {
  try {
    const user = await getUserInfo();
    if (!user) return respErr('Unauthorized');

    const progress = await getProgressByUser(user.id);
    return respData(progress);
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'Failed to get progress';
    console.error('AP Prep get progress failed:', e);
    return respErr(message);
  }
}
