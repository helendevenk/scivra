import { and, desc, eq } from 'drizzle-orm';

import { respData, respErr } from '@/shared/lib/resp';
import { getWeeklyChallenge } from '@/shared/models/quest';
import { getStepsByQuestId } from '@/shared/models/quest_step';
import { getUserInfo } from '@/shared/models/user';
import { getActiveAttempt } from '@/shared/models/quest_attempt';
import { db } from '@/core/db';
import { questAttempt, user } from '@/config/db/schema';

export async function GET() {
  try {
    const weeklyQuest = await getWeeklyChallenge();
    if (!weeklyQuest) {
      return respData({ quest: null, leaderboard: [], steps: [] });
    }

    const steps = await getStepsByQuestId(weeklyQuest.id);

    // Get leaderboard: top 10 completed attempts by score then time
    const leaderboardRows = await db()
      .select({
        rank: questAttempt.id,
        userId: questAttempt.userId,
        userName: user.name,
        userImage: user.image,
        totalScore: questAttempt.totalScore,
        totalTimeSeconds: questAttempt.totalTimeSeconds,
        completedAt: questAttempt.completedAt,
      })
      .from(questAttempt)
      .innerJoin(user, eq(questAttempt.userId, user.id))
      .where(
        and(
          eq(questAttempt.questId, weeklyQuest.id),
          eq(questAttempt.status, 'completed')
        )
      )
      .orderBy(desc(questAttempt.totalScore), questAttempt.totalTimeSeconds)
      .limit(10);

    const leaderboard = leaderboardRows.map((row, idx) => ({
      rank: idx + 1,
      userName: row.userName,
      userImage: row.userImage,
      totalScore: row.totalScore,
      totalTimeSeconds: row.totalTimeSeconds,
    }));

    // Get current user's attempt
    const currentUser = await getUserInfo();
    let userAttempt = null;
    if (currentUser) {
      userAttempt = await getActiveAttempt(currentUser.id, weeklyQuest.id);
    }

    return respData({
      quest: weeklyQuest,
      steps,
      leaderboard,
      userAttempt,
    });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'Failed to get weekly challenge';
    console.error('Weekly challenge failed:', e);
    return respErr(message);
  }
}
