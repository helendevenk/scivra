import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  getUpgGenerationsByUserId,
  getUpgGenerationsCount,
} from '@/shared/models/upg_generation';

export async function GET(request: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('Please sign in to view your generations');
    }

    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get('pageSize') || '20', 10)));

    const [generations, total] = await Promise.all([
      getUpgGenerationsByUserId(user.id, page, pageSize),
      getUpgGenerationsCount(user.id),
    ]);

    return respData({
      list: generations,
      total,
      page,
      pageSize,
    });
  } catch (e: any) {
    console.error('UPG get my generations failed:', e);
    return respErr(e.message || 'Failed to get generations');
  }
}
