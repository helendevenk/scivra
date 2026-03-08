import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { findUpgGenerationById } from '@/shared/models/upg_generation';
import { toggleLike } from '@/shared/models/upg_like';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('Please sign in to like');
    }

    const { id } = await params;

    // Verify generation exists and is public
    const gen = await findUpgGenerationById(id);
    if (!gen || !gen.isPublic) {
      return respErr('Not found');
    }

    const result = await toggleLike(user.id, id);
    return respData(result);
  } catch (e: any) {
    console.error('Gallery like failed:', e);
    return respErr(e.message || 'Failed to toggle like');
  }
}
