import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  findLabNotebookById,
  updateLabNotebook,
} from '@/shared/models/lab_notebook';
import { prefillNotebook } from '@/shared/lib/notebook/notebook-ai';

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

    const { id } = await params;
    const notebook = await findLabNotebookById(id);
    if (!notebook) {
      return respErr('notebook not found');
    }
    if (notebook.userId !== user.id) {
      return respErr('no permission');
    }

    const body = await req.json();
    const sections: string[] = body.sections || ['method', 'data'];

    const result = await prefillNotebook({
      experimentTitle: notebook.title,
      language: notebook.language || 'en',
    });

    const updateData: Record<string, string> = {};
    if (sections.includes('method')) {
      updateData.method = JSON.stringify(result.method);
    }
    if (sections.includes('data')) {
      updateData.data = JSON.stringify(result.data);
    }

    const updated = await updateLabNotebook(id, {
      ...updateData,
      aiSuggestionsUsed: (notebook.aiSuggestionsUsed ?? 0) + 1,
    });

    return respData({ prefill: result, notebook: updated });
  } catch (e) {
    console.error('notebook prefill failed:', e);
    return respErr('notebook prefill failed');
  }
}
