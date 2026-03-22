import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { findLabNotebookById } from '@/shared/models/lab_notebook';
import { getVersionsByNotebook } from '@/shared/models/lab_notebook_version';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    // TODO: Pro-only check

    const { id } = await params;
    const notebook = await findLabNotebookById(id);
    if (!notebook) {
      return respErr('notebook not found');
    }
    if (notebook.userId !== user.id) {
      return respErr('no permission');
    }

    const versions = await getVersionsByNotebook(id);
    return respData(versions);
  } catch (e) {
    console.error('get versions failed:', e);
    return respErr('get versions failed');
  }
}
