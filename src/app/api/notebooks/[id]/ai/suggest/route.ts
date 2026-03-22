import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { findLabNotebookById } from '@/shared/models/lab_notebook';
import { suggestForSection } from '@/shared/lib/notebook/notebook-ai';
import type { NotebookSectionName } from '@/shared/lib/notebook/constants';
import { NOTEBOOK_SECTIONS } from '@/shared/lib/notebook/constants';

export const maxDuration = 60;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    // TODO: Pro-only check + 2 credits deduction
    // For MVP, allow all authenticated users

    const { id } = await params;
    const notebook = await findLabNotebookById(id);
    if (!notebook) {
      return respErr('notebook not found');
    }
    if (notebook.userId !== user.id) {
      return respErr('no permission');
    }

    const body = await req.json();
    const section = body.section as NotebookSectionName;
    if (!section || !NOTEBOOK_SECTIONS.includes(section)) {
      return respErr('invalid section');
    }

    const currentContent = body.currentContent as string | undefined;

    const result = await suggestForSection(section, currentContent, {
      notebookTitle: notebook.title,
      hypothesis: notebook.hypothesis ?? undefined,
      method: notebook.method ?? undefined,
      data: notebook.data ?? undefined,
      analysis: notebook.analysis ?? undefined,
      conclusion: notebook.conclusion ?? undefined,
    });

    return respData(result);
  } catch (e) {
    console.error('notebook suggest failed:', e);
    return respErr('notebook suggest failed');
  }
}
