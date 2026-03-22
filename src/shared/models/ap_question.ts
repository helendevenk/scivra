import { eq, and, sql, count } from 'drizzle-orm';

import { db } from '@/core/db';
import { apQuestion } from '@/config/db/schema';
import type { NewApQuestion } from '@/config/db/schema';

export async function createApQuestion(data: NewApQuestion) {
  const [result] = await db().insert(apQuestion).values(data).returning();
  return result;
}

export async function updateApQuestion(
  id: string,
  data: Partial<Omit<NewApQuestion, 'id' | 'createdAt'>>
) {
  const [result] = await db()
    .update(apQuestion)
    .set(data)
    .where(eq(apQuestion.id, id))
    .returning();
  return result;
}

export async function findApQuestionById(id: string) {
  const [result] = await db()
    .select()
    .from(apQuestion)
    .where(eq(apQuestion.id, id));
  return result ?? null;
}

export async function getQuestionsByUnit(
  examId: string,
  unitId: string,
  opts: {
    page?: number;
    limit?: number;
    difficulty?: string;
    type?: string;
  } = {}
) {
  const { page = 1, limit = 20, difficulty, type } = opts;

  const conditions = [
    eq(apQuestion.examId, examId),
    eq(apQuestion.unitId, unitId),
    eq(apQuestion.isPublished, true),
  ];

  if (difficulty) {
    conditions.push(eq(apQuestion.difficulty, difficulty));
  }
  if (type) {
    conditions.push(eq(apQuestion.type, type));
  }

  const where = and(...conditions);

  const [totalResult] = await db()
    .select({ count: count() })
    .from(apQuestion)
    .where(where);

  const total = totalResult?.count ?? 0;

  const questions = await db()
    .select()
    .from(apQuestion)
    .where(where)
    .orderBy(apQuestion.sort, apQuestion.questionNumber)
    .limit(limit)
    .offset((page - 1) * limit);

  return {
    questions,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function deleteApQuestion(id: string) {
  const [result] = await db()
    .delete(apQuestion)
    .where(eq(apQuestion.id, id))
    .returning();
  return result ?? null;
}

export async function batchCreateQuestions(data: NewApQuestion[]) {
  if (data.length === 0) return [];
  return db().insert(apQuestion).values(data).returning();
}
