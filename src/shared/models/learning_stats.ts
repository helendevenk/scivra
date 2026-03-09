import { eq, sql } from 'drizzle-orm';
import { db } from '@/core/db';
import { learningStats, type LearningStats, type NewLearningStats } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

/**
 * Get learning stats for a user
 */
export async function getLearningStats(userId: string): Promise<LearningStats | undefined> {
  return await db()
    .select()
    .from(learningStats)
    .where(eq(learningStats.userId, userId))
    .then((rows) => rows[0]);
}

/**
 * Get or create learning stats for a user
 */
export async function getOrCreateLearningStats(userId: string): Promise<LearningStats> {
  let stats = await getLearningStats(userId);

  if (!stats) {
    const newStats: NewLearningStats = {
      id: getUuid(),
      userId,
      upgsGenerated: 0,
      upgsPublished: 0,
      upgsLiked: 0,
      experimentsStarted: 0,
      experimentsCompleted: 0,
      studyMinutes: 0,
      streakDays: 0,
      longestStreak: 0,
    };

    await db().insert(learningStats).values(newStats);
    stats = await getLearningStats(userId);

    if (!stats) {
      throw new Error('Failed to create learning stats');
    }
  }

  return stats;
}

/**
 * Increment UPG generation count
 */
export async function incrementUpgGenerated(userId: string): Promise<void> {
  await getOrCreateLearningStats(userId);

  await db()
    .update(learningStats)
    .set({
      upgsGenerated: sql`${learningStats.upgsGenerated} + 1`,
      lastActiveAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(learningStats.userId, userId));
}

/**
 * Increment UPG published count
 */
export async function incrementUpgPublished(userId: string): Promise<void> {
  await getOrCreateLearningStats(userId);

  await db()
    .update(learningStats)
    .set({
      upgsPublished: sql`${learningStats.upgsPublished} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(learningStats.userId, userId));
}

/**
 * Increment experiment completed count
 */
export async function incrementExperimentCompleted(userId: string): Promise<void> {
  await getOrCreateLearningStats(userId);

  await db()
    .update(learningStats)
    .set({
      experimentsCompleted: sql`${learningStats.experimentsCompleted} + 1`,
      lastActiveAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(learningStats.userId, userId));
}

/**
 * Add study time (in minutes)
 */
export async function addStudyTime(userId: string, minutes: number): Promise<void> {
  await getOrCreateLearningStats(userId);

  await db()
    .update(learningStats)
    .set({
      studyMinutes: sql`${learningStats.studyMinutes} + ${minutes}`,
      lastActiveAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(learningStats.userId, userId));
}

/**
 * Update streak (call this daily when user is active)
 */
export async function updateStreak(userId: string): Promise<void> {
  const stats = await getOrCreateLearningStats(userId);

  const now = new Date();
  const lastActive = new Date(stats.lastActiveAt);
  const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

  let newStreak = stats.streakDays;

  if (daysDiff === 0) {
    // Same day, no change
    return;
  } else if (daysDiff === 1) {
    // Consecutive day, increment streak
    newStreak = stats.streakDays + 1;
  } else {
    // Streak broken, reset to 1
    newStreak = 1;
  }

  const newLongestStreak = Math.max(stats.longestStreak, newStreak);

  await db()
    .update(learningStats)
    .set({
      streakDays: newStreak,
      longestStreak: newLongestStreak,
      lastActiveAt: now,
      updatedAt: now,
    })
    .where(eq(learningStats.userId, userId));
}
