import { eq, desc } from 'drizzle-orm';

import { db } from '@/core/db';
import { apExam } from '@/config/db/schema';
import type { NewApExam } from '@/config/db/schema';

export async function createApExam(data: NewApExam) {
  const [result] = await db().insert(apExam).values(data).returning();
  return result;
}

export async function updateApExam(
  id: string,
  data: Partial<Omit<NewApExam, 'id' | 'createdAt'>>
) {
  const [result] = await db()
    .update(apExam)
    .set(data)
    .where(eq(apExam.id, id))
    .returning();
  return result;
}

export async function findApExamById(id: string) {
  const [result] = await db()
    .select()
    .from(apExam)
    .where(eq(apExam.id, id));
  return result ?? null;
}

export async function findApExamBySlug(slug: string) {
  const [result] = await db()
    .select()
    .from(apExam)
    .where(eq(apExam.slug, slug));
  return result ?? null;
}

export async function getPublishedExams() {
  return db()
    .select()
    .from(apExam)
    .where(eq(apExam.isPublished, true))
    .orderBy(apExam.sort, desc(apExam.createdAt));
}

export async function deleteApExam(id: string) {
  const [result] = await db()
    .delete(apExam)
    .where(eq(apExam.id, id))
    .returning();
  return result ?? null;
}
