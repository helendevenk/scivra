import { respData, respErr, respOk } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { updateNode, deleteNodeWithReorder } from '@/shared/models/learning_path';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; nodeId: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) return respErr('Unauthorized');
    // TODO: check admin role when role field is available

    const { nodeId } = await params;
    const body = await request.json();

    if (body.quizQuestion && typeof body.quizQuestion === 'object') {
      body.quizQuestion = JSON.stringify(body.quizQuestion);
    }

    const node = await updateNode(nodeId, body);
    return respData(node);
  } catch (e: any) {
    console.error('Admin update node failed:', e);
    return respErr(e.message || 'Failed to update node');
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; nodeId: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) return respErr('Unauthorized');
    // TODO: check admin role when role field is available

    const { nodeId } = await params;
    await deleteNodeWithReorder(nodeId);
    return respOk();
  } catch (e: any) {
    console.error('Admin delete node failed:', e);
    return respErr(e.message || 'Failed to delete node');
  }
}
