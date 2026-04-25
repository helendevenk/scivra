import { respData, respErr } from '@/shared/lib/resp';
import { getPopularTags } from '@/shared/models/upg_generation';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10))
    );

    const tags = await getPopularTags(limit);
    return respData({ tags });
  } catch (e: unknown) {
    console.error('Gallery tags failed:', e);
    return respErr((e instanceof Error ? e.message : String(e)) || 'Failed to get tags');
  }
}
