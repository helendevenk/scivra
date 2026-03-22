import { eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { questStep } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type QuestStep = typeof questStep.$inferSelect;
export type NewQuestStep = typeof questStep.$inferInsert;

export async function createQuestStep(
  data: Omit<NewQuestStep, 'id'>
): Promise<QuestStep> {
  const [result] = await db()
    .insert(questStep)
    .values({ ...data, id: getUuid() })
    .returning();
  return result;
}

export async function updateQuestStep(
  id: string,
  data: Partial<Omit<NewQuestStep, 'id' | 'createdAt'>>
): Promise<QuestStep> {
  const [result] = await db()
    .update(questStep)
    .set(data)
    .where(eq(questStep.id, id))
    .returning();
  return result;
}

export async function getStepsByQuestId(
  questId: string
): Promise<QuestStep[]> {
  return await db()
    .select()
    .from(questStep)
    .where(eq(questStep.questId, questId))
    .orderBy(questStep.orderIndex);
}

export async function findQuestStepById(
  id: string
): Promise<QuestStep | undefined> {
  const [result] = await db()
    .select()
    .from(questStep)
    .where(eq(questStep.id, id));
  return result;
}

export async function deleteQuestStep(id: string): Promise<void> {
  await db().delete(questStep).where(eq(questStep.id, id));
}
