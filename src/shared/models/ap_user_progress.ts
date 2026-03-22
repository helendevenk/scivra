import { eq, and } from 'drizzle-orm';

import { db } from '@/core/db';
import { apUserProgress } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

interface UnitBreakdownEntry {
  unitId: string;
  attempted: number;
  correct: number;
}

export async function getOrCreateProgress(userId: string, examId: string) {
  const [existing] = await db()
    .select()
    .from(apUserProgress)
    .where(
      and(
        eq(apUserProgress.userId, userId),
        eq(apUserProgress.examId, examId)
      )
    );

  if (existing) return existing;

  const [created] = await db()
    .insert(apUserProgress)
    .values({
      id: getUuid(),
      userId,
      examId,
      totalAttempted: 0,
      totalCorrect: 0,
      unitBreakdown: JSON.stringify([]),
      weakUnits: JSON.stringify([]),
      streakDays: 0,
    })
    .returning();

  return created;
}

export async function updateProgress(
  userId: string,
  examId: string,
  isCorrect: boolean,
  unitId: string
) {
  const progress = await getOrCreateProgress(userId, examId);

  const breakdown: UnitBreakdownEntry[] = progress.unitBreakdown
    ? JSON.parse(progress.unitBreakdown)
    : [];

  let unitEntry = breakdown.find((b) => b.unitId === unitId);
  if (!unitEntry) {
    unitEntry = { unitId, attempted: 0, correct: 0 };
    breakdown.push(unitEntry);
  }
  unitEntry.attempted += 1;
  if (isCorrect) unitEntry.correct += 1;

  // Compute weak units: accuracy < 50% with at least 3 attempts
  const weakUnits = breakdown
    .filter((b) => b.attempted >= 3 && b.correct / b.attempted < 0.5)
    .map((b) => b.unitId);

  // Streak calculation: check if last attempt was yesterday or today
  const now = new Date();
  const lastAttempt = progress.lastAttemptAt;
  let streakDays = progress.streakDays;

  if (lastAttempt) {
    const lastDate = new Date(lastAttempt);
    const diffMs = now.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      // Same day, no streak change
    } else if (diffDays === 1) {
      streakDays += 1;
    } else {
      streakDays = 1;
    }
  } else {
    streakDays = 1;
  }

  const [updated] = await db()
    .update(apUserProgress)
    .set({
      totalAttempted: progress.totalAttempted + 1,
      totalCorrect: progress.totalCorrect + (isCorrect ? 1 : 0),
      unitBreakdown: JSON.stringify(breakdown),
      weakUnits: JSON.stringify(weakUnits),
      lastAttemptAt: now,
      streakDays,
    })
    .where(eq(apUserProgress.id, progress.id))
    .returning();

  return updated;
}

export async function getProgressByUser(userId: string) {
  return db()
    .select()
    .from(apUserProgress)
    .where(eq(apUserProgress.userId, userId));
}
