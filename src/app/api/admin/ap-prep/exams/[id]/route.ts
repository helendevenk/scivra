import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { updateApExam, deleteApExam } from '@/shared/models/ap_exam';

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
    const {
      slug,
      titleEn,
      titleZh,
      descriptionEn,
      descriptionZh,
      coverImage,
      isPublished,
      unitCount,
      questionCount,
      sort,
    } = body;

    const data: Record<string, unknown> = {};
    if (slug !== undefined) data.slug = slug;
    if (titleEn !== undefined) data.titleEn = titleEn;
    if (titleZh !== undefined) data.titleZh = titleZh;
    if (descriptionEn !== undefined) data.descriptionEn = descriptionEn;
    if (descriptionZh !== undefined) data.descriptionZh = descriptionZh;
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (isPublished !== undefined) data.isPublished = isPublished;
    if (unitCount !== undefined) data.unitCount = unitCount;
    if (questionCount !== undefined) data.questionCount = questionCount;
    if (sort !== undefined) data.sort = sort;

    const exam = await updateApExam(id, data);
    if (!exam) return respErr('Exam not found');

    return respData(exam);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to update exam';
    console.error('Admin update AP exam failed:', e);
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
    const exam = await deleteApExam(id);
    if (!exam) return respErr('Exam not found');

    return respData({ deleted: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to delete exam';
    console.error('Admin delete AP exam failed:', e);
    return respErr(message);
  }
}
