import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  getPublishedPaths,
  getUserProgressForPaths,
} from '@/shared/models/learning_path';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') || undefined;
    const level = url.searchParams.get('level') || undefined;

    const paths = await getPublishedPaths({ category, level });

    // If user is logged in, attach progress
    const user = await getUserInfo();
    if (user && paths.length > 0) {
      const pathIds = paths.map((p) => p.id);
      const progress = await getUserProgressForPaths(user.id, pathIds);
      return respData({ paths, progress });
    }

    return respData({ paths });
  } catch (e: any) {
    console.error('Learning paths list failed:', e);
    return respErr(e.message || 'Failed to get learning paths');
  }
}
