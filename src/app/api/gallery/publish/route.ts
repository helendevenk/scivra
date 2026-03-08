import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { togglePublish } from '@/shared/models/upg_generation';

export async function POST(request: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('Please sign in to publish');
    }

    const body = await request.json();
    const id = body?.id;
    if (!id || typeof id !== 'string') {
      return respErr('Invalid generation id');
    }

    const result = await togglePublish(id, user.id);
    if (!result) {
      return respErr('Generation not found or not owned by you');
    }

    return respData(result);
  } catch (e: any) {
    console.error('Gallery publish failed:', e);
    return respErr(e.message || 'Failed to toggle publish');
  }
}
