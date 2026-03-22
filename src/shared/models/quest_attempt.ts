import { and, desc, eq, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import { questAttempt, quest } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type QuestAttempt = typeof questAttempt.$inferSelect;
export type NewQuestAttempt = typeof questAttempt.$inferInsert;

export async function createQuestAttempt(
  data: Omit<NewQuestAttempt, 'id'>
): Promise<QuestAttempt> {
  const [result] = await db()
    .insert(questAttempt)
    .values({ ...data, id: getUuid() })
    .returning();
  return result;
}

export async function updateQuestAttempt(
  id: string,
  data: Partial<Omit<NewQuestAttempt, 'id' | 'createdAt'>>
): Promise<QuestAttempt> {
  const [result] = await db()
    .update(questAttempt)
    .set(data)
    .where(eq(questAttempt.id, id))
    .returning();
  return result;
}

export async function findQuestAttemptById(
  id: string
): Promise<QuestAttempt | undefined> {
  const [result] = await db()
    .select()
    .from(questAttempt)
    .where(eq(questAttempt.id, id));
  return result;
}

export async function getActiveAttempt(
  userId: string,
  questId: string
): Promise<QuestAttempt | undefined> {
  const [result] = await db()
    .select()
    .from(questAttempt)
    .where(
      and(
        eq(questAttempt.userId, userId),
        eq(questAttempt.questId, questId),
        eq(questAttempt.status, 'in_progress')
      )
    )
    .orderBy(desc(questAttempt.startedAt))
    .limit(1);
  return result;
}

export async function getUserAttempts(
  userId: string
): Promise<QuestAttempt[]> {
  return await db()
    .select()
    .from(questAttempt)
    .where(eq(questAttempt.userId, userId))
    .orderBy(desc(questAttempt.startedAt));
}

export async function getBestAttempt(
  userId: string,
  questId: string
): Promise<QuestAttempt | undefined> {
  const [result] = await db()
    .select()
    .from(questAttempt)
    .where(
      and(
        eq(questAttempt.userId, userId),
        eq(questAttempt.questId, questId),
        eq(questAttempt.status, 'completed')
      )
    )
    .orderBy(desc(questAttempt.totalScore))
    .limit(1);
  return result;
}

export async function completeAttempt(
  id: string,
  totalScore: number,
  maxScore: number
): Promise<QuestAttempt> {
  const [result] = await db()
    .update(questAttempt)
    .set({
      status: 'completed',
      totalScore,
      maxPossibleScore: maxScore,
      completedAt: new Date(),
    })
    .where(eq(questAttempt.id, id))
    .returning();

  // Update quest stats
  if (result) {
    await db()
      .update(quest)
      .set({
        completionCount: sql`${quest.completionCount} + 1`,
      })
      .where(eq(quest.id, result.questId));
  }

  return result;
}
