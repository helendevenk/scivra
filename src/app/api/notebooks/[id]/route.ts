import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  findLabNotebookById,
  softDeleteLabNotebook,
  updateLabNotebook,
} from '@/shared/models/lab_notebook';
import { createVersion } from '@/shared/models/lab_notebook_version';
import { NOTEBOOK_SECTIONS } from '@/shared/lib/notebook/constants';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const { id } = await params;
    const notebook = await findLabNotebookById(id);
    if (!notebook) {
      return respErr('notebook not found');
    }
    if (notebook.userId !== user.id) {
      return respErr('no permission');
    }

    return respData(notebook);
  } catch (e) {
    console.error('get notebook failed:', e);
    return respErr('get notebook failed');
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const { id } = await params;
    const notebook = await findLabNotebookById(id);
    if (!notebook) {
      return respErr('notebook not found');
    }
    if (notebook.userId !== user.id) {
      return respErr('no permission');
    }

    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    // Allow updating section content
    for (const section of NOTEBOOK_SECTIONS) {
      if (body[section] !== undefined) {
        updateData[section] =
          typeof body[section] === 'string'
            ? body[section]
            : JSON.stringify(body[section]);
      }
    }

    if (body.title !== undefined) updateData.title = body.title;
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === 'completed') {
        updateData.completedAt = new Date();
      }
    }

    // Auto-increment version
    const newVersion = (notebook.version ?? 1) + 1;
    updateData.version = newVersion;

    // Create version snapshot for Pro users
    // TODO: check subscription status; for now, always create versions
    try {
      await createVersion(id, notebook.version ?? 1, {
        hypothesis: notebook.hypothesis,
        method: notebook.method,
        data: notebook.data,
        analysis: notebook.analysis,
        conclusion: notebook.conclusion,
      });
    } catch {
      // Version creation failure is non-blocking
    }

    const updated = await updateLabNotebook(id, updateData);
    return respData(updated);
  } catch (e) {
    console.error('update notebook failed:', e);
    return respErr('update notebook failed');
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const { id } = await params;
    const notebook = await findLabNotebookById(id);
    if (!notebook) {
      return respErr('notebook not found');
    }
    if (notebook.userId !== user.id) {
      return respErr('no permission');
    }

    await softDeleteLabNotebook(id);
    return respData({ success: true });
  } catch (e) {
    console.error('delete notebook failed:', e);
    return respErr('delete notebook failed');
  }
}
