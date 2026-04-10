import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  getGalleryDetail,
  incrementViewCount,
} from '@/shared/models/upg_generation';
import { isLikedByUser } from '@/shared/models/upg_like';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const detail = await getGalleryDetail(id);

    if (!detail) {
      return respErr('Not found');
    }

    // Only public or owner can access
    const user = await getUserInfo();
    if (!detail.isPublic && detail.userId !== user?.id) {
      return respErr('Not found');
    }

    // Increment view count (fire and forget)
    incrementViewCount(id).catch(() => {});

    // Check like status if logged in
    let isLiked = false;
    if (user) {
      isLiked = await isLikedByUser(user.id, id);
    }

    return respData({ ...detail, isLiked });
  } catch (e: unknown) {
    console.error('Gallery detail failed:', e);
    return respErr((e instanceof Error ? e.message : String(e)) || 'Failed to get gallery detail');
  }
}
