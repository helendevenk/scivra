import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  updateApQuestion,
  deleteApQuestion,
} from '@/shared/models/ap_question';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) return respErr('Unauthorized');

    const { canAccessAdmin } = await import('@/core/rbac/permission');
    if (!(await canAccessAdmin(user.id))) return respErr('Forbidden');

    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    const fields = [
      'examId',
      'unitId',
      'questionNumber',
      'type',
      'difficulty',
      'examFrequency',
      'stemEn',
      'stemZh',
      'stemImage',
      'choicesEn',
      'choicesZh',
      'correctAnswer',
      'explanationEn',
      'explanationZh',
      'upgPrompt',
      'tags',
      'source',
      'isPublished',
      'sort',
    ];

    for (const field of fields) {
      if (body[field] !== undefined) {
        if (field === 'tags' && typeof body[field] !== 'string') {
          data[field] = JSON.stringify(body[field]);
        } else {
          data[field] = body[field];
        }
      }
    }

    const question = await updateApQuestion(id, data);
    if (!question) return respErr('Question not found');

    return respData(question);
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'Failed to update question';
    console.error('Admin update AP question failed:', e);
    return respErr(message);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) return respErr('Unauthorized');

    const { canAccessAdmin } = await import('@/core/rbac/permission');
    if (!(await canAccessAdmin(user.id))) return respErr('Forbidden');

    const { id } = await params;
    const question = await deleteApQuestion(id);
    if (!question) return respErr('Question not found');

    return respData({ deleted: true });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'Failed to delete question';
    console.error('Admin delete AP question failed:', e);
    return respErr(message);
  }
}
