import { respData, respErr } from '@/shared/lib/resp';
import { findQuestBySlug } from '@/shared/models/quest';
import { getStepsByQuestId } from '@/shared/models/quest_step';
import { getUserInfo } from '@/shared/models/user';
import {
  createQuestAttempt,
  getActiveAttempt,
} from '@/shared/models/quest_attempt';
import { quest as questTable } from '@/config/db/schema';
import { db } from '@/core/db';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('Login required');
    }

    const { slug } = await params;
    const quest = await findQuestBySlug(slug);
    if (!quest || !quest.isPublished) {
      return respErr('Quest not found');
    }

    // Resume existing attempt if any
    const existing = await getActiveAttempt(user.id, quest.id);
    if (existing) {
      return respData({ attempt: existing, resumed: true });
    }

    // Calculate max possible score from steps
    const steps = await getStepsByQuestId(quest.id);
    const maxScore = steps.reduce((sum, s) => sum + s.maxPoints, 0);

    const attempt = await createQuestAttempt({
      userId: user.id,
      questId: quest.id,
      maxPossibleScore: maxScore,
    });

    // Increment attempt count on quest
    await db()
      .update(questTable)
      .set({
        attemptCount: sql`${questTable.attemptCount} + 1`,
      })
      .where(eq(questTable.id, quest.id));

    return respData({ attempt, resumed: false });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'Failed to start quest';
    console.error('Quest start failed:', e);
    return respErr(message);
  }
}
