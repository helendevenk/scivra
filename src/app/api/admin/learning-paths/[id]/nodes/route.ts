import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { createNodeWithCount } from '@/shared/models/learning_path';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) return respErr('Unauthorized');
    const { canAccessAdmin } = await import('@/core/rbac/permission');
    if (!(await canAccessAdmin(user.id))) return respErr('Forbidden');

    const { id: pathId } = await params;
    const body = await request.json();
    const {
      titleEn,
      titleZh,
      descriptionEn,
      descriptionZh,
      generationId,
      experimentSlug,
      quizQuestion,
      orderIndex,
    } = body;

    if (!titleEn || !titleZh) {
      return respErr('Missing required fields: titleEn, titleZh');
    }

    if (generationId && experimentSlug) {
      return respErr('generationId and experimentSlug are mutually exclusive');
    }

    const node = await createNodeWithCount(pathId, {
      titleEn,
      titleZh,
      descriptionEn: descriptionEn || null,
      descriptionZh: descriptionZh || null,
      generationId: generationId || null,
      experimentSlug: experimentSlug || null,
      quizQuestion: quizQuestion ? JSON.stringify(quizQuestion) : '',
      orderIndex,
    });

    return respData(node);
  } catch (e: any) {
    console.error('Admin create node failed:', e);
    return respErr(e.message || 'Failed to create node');
  }
}
