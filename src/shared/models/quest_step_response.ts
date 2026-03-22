import { and, eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { questStepResponse } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type QuestStepResponse = typeof questStepResponse.$inferSelect;
export type NewQuestStepResponse = typeof questStepResponse.$inferInsert;

export async function createStepResponse(
  data: Omit<NewQuestStepResponse, 'id'>
): Promise<QuestStepResponse> {
  const [result] = await db()
    .insert(questStepResponse)
    .values({ ...data, id: getUuid() })
    .returning();
  return result;
}

export async function getResponsesByAttempt(
  attemptId: string
): Promise<QuestStepResponse[]> {
  return await db()
    .select()
    .from(questStepResponse)
    .where(eq(questStepResponse.attemptId, attemptId));
}

export async function findResponseByStep(
  attemptId: string,
  stepId: string
): Promise<QuestStepResponse | undefined> {
  const [result] = await db()
    .select()
    .from(questStepResponse)
    .where(
      and(
        eq(questStepResponse.attemptId, attemptId),
        eq(questStepResponse.stepId, stepId)
      )
    );
  return result;
}
