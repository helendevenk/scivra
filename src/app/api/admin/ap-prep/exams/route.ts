import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { createApExam } from '@/shared/models/ap_exam';
import { getUuid } from '@/shared/lib/hash';

const SLUG_REGEX = /^[a-z0-9-]{1,100}$/;

export async function POST(request: Request) {
  try {
    const user = await getUserInfo();
    if (!user) return respErr('Unauthorized');

    const { canAccessAdmin } = await import('@/core/rbac/permission');
    if (!(await canAccessAdmin(user.id))) return respErr('Forbidden');

    const body = await request.json();
    const {
      slug,
      titleEn,
      titleZh,
      descriptionEn,
      descriptionZh,
      coverImage,
      isPublished,
      sort,
    } = body;

    if (!slug || !titleEn || !titleZh) {
      return respErr('Missing required fields: slug, titleEn, titleZh');
    }

    if (!SLUG_REGEX.test(slug)) {
      return respErr('Invalid slug format');
    }

    const exam = await createApExam({
      id: getUuid(),
      slug,
      titleEn,
      titleZh,
      descriptionEn: descriptionEn || null,
      descriptionZh: descriptionZh || null,
      coverImage: coverImage || null,
      isPublished: isPublished ?? false,
      sort: sort ?? 0,
    });

    return respData(exam);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to create exam';
    console.error('Admin create AP exam failed:', e);
    return respErr(message);
  }
}
