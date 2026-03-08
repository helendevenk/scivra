import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  findUpgGenerationById,
  incrementViewCount,
  softDeleteUpgGeneration,
} from '@/shared/models/upg_generation';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return respErr('Missing id parameter');
    }

    const generation = await findUpgGenerationById(id);
    if (!generation) {
      return respErr('Generation not found');
    }

    // Access control: public content anyone can view, private only creator
    if (!generation.isPublic) {
      const user = await getUserInfo();
      if (!user || user.id !== generation.userId) {
        return respErr('Not authorized to view this generation');
      }
    }

    // Increment view count (fire and forget)
    incrementViewCount(id).catch(() => {});

    return respData(generation);
  } catch (e: any) {
    console.error('UPG get generation failed:', e);
    return respErr(e.message || 'Failed to get generation');
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return respErr('Missing id parameter');
    }

    const user = await getUserInfo();
    if (!user) {
      return respErr('Please sign in to delete generations');
    }

    const generation = await findUpgGenerationById(id);
    if (!generation) {
      return respErr('Generation not found');
    }

    if (generation.userId !== user.id) {
      return respErr('Not authorized to delete this generation');
    }

    await softDeleteUpgGeneration(id);

    return respData({ id, deleted: true });
  } catch (e: any) {
    console.error('UPG delete generation failed:', e);
    return respErr(e.message || 'Failed to delete generation');
  }
}
