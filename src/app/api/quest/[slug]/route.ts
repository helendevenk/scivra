import { respData, respErr } from '@/shared/lib/resp';
import { findQuestBySlug } from '@/shared/models/quest';
import { getStepsByQuestId } from '@/shared/models/quest_step';
import { getUserInfo } from '@/shared/models/user';
import {
  getActiveAttempt,
  getBestAttempt,
} from '@/shared/models/quest_attempt';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const quest = await findQuestBySlug(slug);
    if (!quest) {
      return respErr('Quest not found');
    }

    const steps = await getStepsByQuestId(quest.id);

    const user = await getUserInfo();
    let currentAttempt = null;
    let bestAttempt = null;

    if (user) {
      currentAttempt = await getActiveAttempt(user.id, quest.id);
      bestAttempt = await getBestAttempt(user.id, quest.id);
    }

    return respData({
      quest,
      steps,
      currentAttempt,
      bestAttempt,
    });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'Failed to get quest detail';
    console.error('Quest detail failed:', e);
    return respErr(message);
  }
}
