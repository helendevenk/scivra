import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { getGalleryList } from '@/shared/models/upg_generation';
import { batchCheckLiked } from '@/shared/models/upg_like';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor') || undefined;
    const limit = Math.min(
      50,
      Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10))
    );
    const sort =
      (url.searchParams.get('sort') as 'latest' | 'popular' | 'most_liked') ||
      'latest';
    const tag = url.searchParams.get('tag') || undefined;
    const q = url.searchParams.get('q') || undefined;
    const author = url.searchParams.get('author') || undefined;
    const verified = url.searchParams.get('verified') === 'true';

    const result = await getGalleryList({
      cursor,
      limit,
      sort,
      tag,
      q,
      author,
      verified: verified || undefined,
    });

    // If user is logged in, batch check like status
    const user = await getUserInfo();
    if (user && result.list.length > 0) {
      const ids = result.list.map((item) => item.id);
      const likedMap = await batchCheckLiked(user.id, ids);
      const list = result.list.map((item) => ({
        ...item,
        isLiked: likedMap.get(item.id) ?? false,
      }));
      return respData({ list, nextCursor: result.nextCursor, hasMore: result.hasMore });
    }

    return respData(result);
  } catch (e: unknown) {
    console.error('Gallery list failed:', e);
    return respErr((e instanceof Error ? e.message : String(e)) || 'Failed to get gallery list');
  }
}
