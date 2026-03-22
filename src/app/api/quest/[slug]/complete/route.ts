import { sql } from 'drizzle-orm';

import { respData, respErr } from '@/shared/lib/resp';
import { findQuestBySlug } from '@/shared/models/quest';
import { getUserInfo } from '@/shared/models/user';
import {
  findQuestAttemptById,
  completeAttempt,
} from '@/shared/models/quest_attempt';
import { getResponsesByAttempt } from '@/shared/models/quest_step_response';
import { checkAndUnlockAchievements } from '@/shared/models/achievement';
import { db } from '@/core/db';
import { learningStats } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('Login required');
    }

    const { slug } = await params;
    const body = await request.json();
    const { attemptId } = body;
    if (!attemptId) {
      return respErr('Missing attemptId');
    }

    const quest = await findQuestBySlug(slug);
    if (!quest) {
      return respErr('Quest not found');
    }

    const attempt = await findQuestAttemptById(attemptId);
    if (!attempt || attempt.userId !== user.id) {
      return respErr('Invalid attempt');
    }
    if (attempt.status === 'completed') {
      return respErr('Attempt already completed');
    }

    // Calculate total score from responses
    const responses = await getResponsesByAttempt(attemptId);
    const totalScore = responses.reduce((sum, r) => sum + (r.score ?? 0), 0);
    const maxScore = responses.reduce((sum, r) => sum + r.maxScore, 0);

    // Calculate time
    const startedAt = attempt.startedAt;
    const totalTimeSeconds = Math.round(
      (Date.now() - startedAt.getTime()) / 1000
    );

    // Complete the attempt
    const completed = await completeAttempt(attemptId, totalScore, maxScore);

    // Update learningStats
    await db()
      .insert(learningStats)
      .values({
        id: getUuid(),
        userId: user.id,
        questsCompleted: 1,
      })
      .onConflictDoUpdate({
        target: [learningStats.userId],
        set: {
          questsCompleted: sql`${learningStats.questsCompleted} + 1`,
        },
      });

    // Check achievements
    const newAchievements = await checkAndUnlockAchievements(user.id, {
      questAttemptId: attemptId,
      totalScore,
      maxScore,
    });

    return respData({
      attempt: completed,
      totalScore,
      maxScore,
      totalTimeSeconds,
      newAchievements,
    });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'Failed to complete quest';
    console.error('Quest complete failed:', e);
    return respErr(message);
  }
}
