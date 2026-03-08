import { eq, and } from 'drizzle-orm';

import { db } from '@/core/db';
import { experimentProgress } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type ExperimentProgress = typeof experimentProgress.$inferSelect;

export async function getExperimentProgress(
  userId: string,
  experimentId: string
): Promise<ExperimentProgress | null> {
  const [result] = await db()
    .select()
    .from(experimentProgress)
    .where(
      and(
        eq(experimentProgress.userId, userId),
        eq(experimentProgress.experimentId, experimentId)
      )
    );
  return result ?? null;
}

export async function upsertExperimentProgress(
  userId: string,
  experimentId: string,
  data: {
    additionalSeconds?: number;
    incrementSession?: boolean;
    completedChallenges?: string[];
    lastParameters?: string;
  }
): Promise<ExperimentProgress> {
  const existing = await getExperimentProgress(userId, experimentId);
  const now = new Date();

  if (existing) {
    const updates: Partial<Record<string, unknown>> = {
      lastAccessedAt: now,
    };

    if (data.additionalSeconds && data.additionalSeconds > 0) {
      updates.totalTimeSpent =
        existing.totalTimeSpent + data.additionalSeconds;
    }

    if (data.incrementSession) {
      updates.sessionsCount = existing.sessionsCount + 1;
    }

    if (data.completedChallenges) {
      const prev: string[] = existing.completedChallenges
        ? JSON.parse(existing.completedChallenges)
        : [];
      const merged = [...new Set([...prev, ...data.completedChallenges])];
      updates.completedChallenges = JSON.stringify(merged);
    }

    if (data.lastParameters !== undefined) {
      updates.lastParameters = data.lastParameters;
    }

    const [result] = await db()
      .update(experimentProgress)
      .set(updates)
      .where(eq(experimentProgress.id, existing.id))
      .returning();
    return result;
  }

  const id = getUuid();
  const [result] = await db()
    .insert(experimentProgress)
    .values({
      id,
      userId,
      experimentId,
      totalTimeSpent: data.additionalSeconds ?? 0,
      sessionsCount: data.incrementSession ? 1 : 0,
      completedChallenges: data.completedChallenges
        ? JSON.stringify(data.completedChallenges)
        : null,
      lastParameters: data.lastParameters ?? null,
      lastAccessedAt: now,
      firstUsedAt: now,
    })
    .returning();
  return result;
}
