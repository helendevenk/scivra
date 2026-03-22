import { and, count, eq, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import {
  achievement,
  userAchievement,
  questAttempt,
  learningStats,
} from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type Achievement = typeof achievement.$inferSelect;
export type NewAchievement = typeof achievement.$inferInsert;
export type UserAchievement = typeof userAchievement.$inferSelect;

interface AchievementCriteria {
  type: 'quest_count' | 'perfect_score' | 'streak' | 'quest_complete';
  count?: number;
  days?: number;
  questId?: string;
}

export async function createAchievement(
  data: Omit<NewAchievement, 'id'>
): Promise<Achievement> {
  const [result] = await db()
    .insert(achievement)
    .values({ ...data, id: getUuid() })
    .returning();
  return result;
}

export async function getActiveAchievements(): Promise<Achievement[]> {
  return await db()
    .select()
    .from(achievement)
    .where(eq(achievement.isActive, true))
    .orderBy(achievement.sortOrder);
}

export async function findAchievementBySlug(
  slug: string
): Promise<Achievement | undefined> {
  const [result] = await db()
    .select()
    .from(achievement)
    .where(eq(achievement.slug, slug));
  return result;
}

export async function getUserAchievements(
  userId: string
): Promise<UserAchievement[]> {
  return await db()
    .select()
    .from(userAchievement)
    .where(eq(userAchievement.userId, userId));
}

export async function unlockAchievement(
  userId: string,
  achievementId: string,
  questAttemptId?: string
): Promise<UserAchievement | undefined> {
  // Check if already unlocked
  const existing = await db()
    .select()
    .from(userAchievement)
    .where(
      and(
        eq(userAchievement.userId, userId),
        eq(userAchievement.achievementId, achievementId)
      )
    );
  if (existing.length > 0) return existing[0];

  const [result] = await db()
    .insert(userAchievement)
    .values({
      id: getUuid(),
      userId,
      achievementId,
      questAttemptId: questAttemptId ?? null,
    })
    .onConflictDoNothing()
    .returning();

  if (result) {
    // Update learningStats
    await db()
      .insert(learningStats)
      .values({
        id: getUuid(),
        userId,
        achievementsEarned: 1,
      })
      .onConflictDoUpdate({
        target: [learningStats.userId],
        set: {
          achievementsEarned: sql`${learningStats.achievementsEarned} + 1`,
        },
      });
  }

  return result;
}

export async function checkAndUnlockAchievements(
  userId: string,
  context: {
    questAttemptId?: string;
    totalScore?: number;
    maxScore?: number;
  }
): Promise<Achievement[]> {
  const allAchievements = await getActiveAchievements();
  const userUnlocked = await getUserAchievements(userId);
  const unlockedIds = new Set(userUnlocked.map((ua) => ua.achievementId));

  const newlyUnlocked: Achievement[] = [];

  for (const ach of allAchievements) {
    if (unlockedIds.has(ach.id)) continue;

    const criteria: AchievementCriteria = JSON.parse(ach.criteria);
    let shouldUnlock = false;

    switch (criteria.type) {
      case 'quest_count': {
        const [result] = await db()
          .select({ count: count() })
          .from(questAttempt)
          .where(
            and(
              eq(questAttempt.userId, userId),
              eq(questAttempt.status, 'completed')
            )
          );
        shouldUnlock = (result?.count ?? 0) >= (criteria.count ?? 1);
        break;
      }
      case 'perfect_score': {
        if (
          context.totalScore !== undefined &&
          context.maxScore !== undefined &&
          context.maxScore > 0
        ) {
          shouldUnlock = context.totalScore >= context.maxScore;
        }
        break;
      }
      case 'streak': {
        // For MVP, check consecutive days with completed quests
        // Simplified: just check total quest count as proxy
        const [result] = await db()
          .select({ count: count() })
          .from(questAttempt)
          .where(
            and(
              eq(questAttempt.userId, userId),
              eq(questAttempt.status, 'completed')
            )
          );
        shouldUnlock = (result?.count ?? 0) >= (criteria.days ?? 7);
        break;
      }
      case 'quest_complete': {
        if (criteria.questId && context.questAttemptId) {
          // Check if the specific quest was completed
          const [result] = await db()
            .select({ count: count() })
            .from(questAttempt)
            .where(
              and(
                eq(questAttempt.userId, userId),
                eq(questAttempt.questId, criteria.questId),
                eq(questAttempt.status, 'completed')
              )
            );
          shouldUnlock = (result?.count ?? 0) >= 1;
        }
        break;
      }
    }

    if (shouldUnlock) {
      const unlocked = await unlockAchievement(
        userId,
        ach.id,
        context.questAttemptId
      );
      if (unlocked) {
        newlyUnlocked.push(ach);
      }
    }
  }

  return newlyUnlocked;
}
