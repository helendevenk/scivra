import { respData, respErr, respOk } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  updateLearningPath,
  deleteLearningPath,
} from '@/shared/models/learning_path';

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

    const path = await updateLearningPath(id, body);
    return respData(path);
  } catch (e: any) {
    console.error('Admin update learning path failed:', e);
    return respErr(e.message || 'Failed to update learning path');
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
    await deleteLearningPath(id);
    return respOk();
  } catch (e: any) {
    console.error('Admin delete learning path failed:', e);
    return respErr(e.message || 'Failed to delete learning path');
  }
}
