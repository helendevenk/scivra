import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { findLabNotebookById } from '@/shared/models/lab_notebook';
import { createExport } from '@/shared/models/lab_notebook_export';
import { getUuid } from '@/shared/lib/hash';
import { NOTEBOOK_SECTIONS } from '@/shared/lib/notebook/constants';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { subscriptionToTier } from '@/shared/lib/experiments/access';

function parseSectionContent(raw: string | null): string {
  if (!raw) return '(empty)';
  try {
    const blocks = JSON.parse(raw);
    if (Array.isArray(blocks)) {
      return blocks.map((b: { content?: string }) => b.content || '').join('\n\n');
    }
    return raw;
  } catch {
    return raw;
  }
}

function generateTextExport(notebook: {
  title: string;
  hypothesis: string | null;
  method: string | null;
  data: string | null;
  analysis: string | null;
  conclusion: string | null;
  createdAt: Date;
  updatedAt: Date;
}): string {
  const sectionLabels: Record<string, string> = {
    hypothesis: 'Hypothesis',
    method: 'Method',
    data: 'Data',
    analysis: 'Analysis',
    conclusion: 'Conclusion',
  };

  let text = `LAB NOTEBOOK: ${notebook.title}\n`;
  text += `${'='.repeat(60)}\n`;
  text += `Created: ${notebook.createdAt.toISOString()}\n`;
  text += `Last Updated: ${notebook.updatedAt.toISOString()}\n\n`;

  for (const section of NOTEBOOK_SECTIONS) {
    text += `${sectionLabels[section]}\n`;
    text += `${'-'.repeat(40)}\n`;
    text += parseSectionContent(
      notebook[section as keyof typeof notebook] as string | null
    );
    text += '\n\n';
  }

  return text;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const sub = await getCurrentSubscription(user.id);
    const tier = subscriptionToTier(sub?.planName ?? null);
    if (tier === 'free') {
      return respErr('Notebook export is a Pro feature. Upgrade to access.');
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
    const format = body.format || 'pdf';

    // MVP: generate plain text export
    const textContent = generateTextExport(notebook);
    const blob = new Blob([textContent], { type: 'text/plain' });
    const fileSize = blob.size;

    // Record export
    const exportRecord = await createExport({
      id: getUuid(),
      notebookId: id,
      userId: user.id,
      format,
      fileSize,
    });

    // Return text content directly (MVP approach)
    // V2 will upload to R2 and return a URL
    return respData({
      export: exportRecord,
      content: textContent,
      filename: `${notebook.title.replace(/[^a-zA-Z0-9]/g, '_')}_notebook.txt`,
    });
  } catch (e) {
    console.error('export notebook failed:', e);
    return respErr('export notebook failed');
  }
}
