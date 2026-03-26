import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { getUuid } from '@/shared/lib/hash';
import {
  createLabNotebook,
  getMonthlyNotebookCount,
  getNotebooksByUser,
  getNotebooksByUserCount,
} from '@/shared/models/lab_notebook';
import { NOTEBOOK_FREE_MONTHLY_LIMIT } from '@/shared/lib/notebook/constants';
import { prefillNotebook } from '@/shared/lib/notebook/notebook-ai';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { subscriptionToTier } from '@/shared/lib/experiments/access';

export async function POST(req: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const body = await req.json();
    const {
      experimentId,
      generationId,
      title,
      language,
      autoFill,
    }: {
      experimentId?: string;
      generationId?: string;
      title?: string;
      language?: string;
      autoFill?: boolean;
    } = body;

    // Pro/Max users bypass notebook quota
    const sub = await getCurrentSubscription(user.id);
    const tier = subscriptionToTier(sub?.planName ?? null);
    const isPro = tier === 'pro' || tier === 'max';

    if (!isPro) {
      const monthlyCount = await getMonthlyNotebookCount(user.id);
      if (monthlyCount >= NOTEBOOK_FREE_MONTHLY_LIMIT) {
        return respErr(
          `Free tier limit reached (${NOTEBOOK_FREE_MONTHLY_LIMIT}/month). Upgrade to Pro for unlimited notebooks.`
        );
      }
    }

    const notebookId = getUuid();
    const lang = language || 'en';
    const notebookTitle = title || 'Untitled Notebook';

    let method: string | undefined;
    let data: string | undefined;

    // Auto-fill Method + Data sections if requested
    if (autoFill && (experimentId || title)) {
      try {
        const prefillResult = await prefillNotebook({
          experimentTitle: title || experimentId || 'Experiment',
          language: lang,
        });
        method = JSON.stringify(prefillResult.method);
        data = JSON.stringify(prefillResult.data);
      } catch (err) {
        console.error('Notebook prefill failed:', err);
        // Continue without prefill — not a blocking error
      }
    }

    const notebook = await createLabNotebook({
      id: notebookId,
      userId: user.id,
      experimentId: experimentId ?? null,
      generationId: generationId ?? null,
      title: notebookTitle,
      status: 'draft',
      language: lang,
      method: method ?? null,
      data: data ?? null,
      version: 1,
    });

    return respData(notebook);
  } catch (e) {
    console.error('create notebook failed:', e);
    return respErr('create notebook failed');
  }
}

export async function GET(req: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

    const [notebooks, total] = await Promise.all([
      getNotebooksByUser(user.id, { status, page, pageSize }),
      getNotebooksByUserCount(user.id, { status }),
    ]);

    return respData({ list: notebooks, total, page, pageSize });
  } catch (e) {
    console.error('list notebooks failed:', e);
    return respErr('list notebooks failed');
  }
}
