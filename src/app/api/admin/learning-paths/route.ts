import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { getUuid } from '@/shared/lib/hash';
import {
  getAdminLearningPaths,
  createLearningPath,
} from '@/shared/models/learning_path';

const SLUG_REGEX = /^[a-z0-9-]{1,100}$/;

export async function GET() {
  try {
    const user = await getUserInfo();
    if (!user) return respErr('Unauthorized');

    const { canAccessAdmin } = await import('@/core/rbac/permission');
    if (!(await canAccessAdmin(user.id))) return respErr('Forbidden');

    const paths = await getAdminLearningPaths();
    return respData(paths);
  } catch (e: any) {
    console.error('Admin get learning paths failed:', e);
    return respErr(e.message || 'Failed to get learning paths');
  }
}

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
      category,
      level,
      coverImage,
      isPublished,
    } = body;

    if (!slug || !titleEn || !titleZh || !category || !level) {
      return respErr('Missing required fields');
    }

    if (!SLUG_REGEX.test(slug)) {
      return respErr('Invalid slug format: lowercase letters, numbers, hyphens only, max 100 chars');
    }

    const path = await createLearningPath({
      id: getUuid(),
      slug,
      titleEn,
      titleZh,
      descriptionEn: descriptionEn || null,
      descriptionZh: descriptionZh || null,
      category,
      level,
      coverImage: coverImage || null,
      isPublished: isPublished ?? false,
    });

    return respData(path);
  } catch (e: any) {
    console.error('Admin create learning path failed:', e);
    return respErr(e.message || 'Failed to create learning path');
  }
}
