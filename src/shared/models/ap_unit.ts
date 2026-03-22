import { eq, and } from 'drizzle-orm';

import { db } from '@/core/db';
import { apUnit } from '@/config/db/schema';
import type { NewApUnit } from '@/config/db/schema';

export async function createApUnit(data: NewApUnit) {
  const [result] = await db().insert(apUnit).values(data).returning();
  return result;
}

export async function updateApUnit(
  id: string,
  data: Partial<Omit<NewApUnit, 'id' | 'createdAt'>>
) {
  const [result] = await db()
    .update(apUnit)
    .set(data)
    .where(eq(apUnit.id, id))
    .returning();
  return result;
}

export async function findApUnitById(id: string) {
  const [result] = await db()
    .select()
    .from(apUnit)
    .where(eq(apUnit.id, id));
  return result ?? null;
}

export async function findApUnitBySlug(examId: string, slug: string) {
  const [result] = await db()
    .select()
    .from(apUnit)
    .where(and(eq(apUnit.examId, examId), eq(apUnit.slug, slug)));
  return result ?? null;
}

export async function getUnitsByExamId(examId: string) {
  return db()
    .select()
    .from(apUnit)
    .where(eq(apUnit.examId, examId))
    .orderBy(apUnit.sort, apUnit.unitNumber);
}

export async function deleteApUnit(id: string) {
  const [result] = await db()
    .delete(apUnit)
    .where(eq(apUnit.id, id))
    .returning();
  return result ?? null;
}
