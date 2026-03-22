import { eq, and, desc } from 'drizzle-orm';

import { db } from '@/core/db';
import { apAttempt } from '@/config/db/schema';
import type { NewApAttempt } from '@/config/db/schema';

export async function createApAttempt(data: NewApAttempt) {
  const [result] = await db().insert(apAttempt).values(data).returning();
  return result;
}

export async function getAttemptsByUser(userId: string, examId: string) {
  return db()
    .select()
    .from(apAttempt)
    .where(and(eq(apAttempt.userId, userId), eq(apAttempt.examId, examId)))
    .orderBy(desc(apAttempt.createdAt));
}

export async function getAttemptsByQuestion(
  userId: string,
  questionId: string
) {
  return db()
    .select()
    .from(apAttempt)
    .where(
      and(eq(apAttempt.userId, userId), eq(apAttempt.questionId, questionId))
    )
    .orderBy(desc(apAttempt.createdAt));
}
