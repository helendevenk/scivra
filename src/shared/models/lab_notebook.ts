import { and, count, desc, eq, gte, isNull, lt } from 'drizzle-orm';

import { db } from '@/core/db';
import { labNotebook } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type LabNotebookRow = typeof labNotebook.$inferSelect;
export type NewLabNotebook = typeof labNotebook.$inferInsert;
export type UpdateLabNotebook = Partial<
  Omit<NewLabNotebook, 'id' | 'userId' | 'createdAt'>
>;

export async function createLabNotebook(data: NewLabNotebook) {
  const [result] = await db()
    .insert(labNotebook)
    .values({
      ...data,
      id: data.id || getUuid(),
    })
    .returning();
  return result;
}

export async function updateLabNotebook(id: string, data: UpdateLabNotebook) {
  const [result] = await db()
    .update(labNotebook)
    .set(data)
    .where(and(eq(labNotebook.id, id), isNull(labNotebook.deletedAt)))
    .returning();
  return result;
}

export async function findLabNotebookById(id: string) {
  const [result] = await db()
    .select()
    .from(labNotebook)
    .where(and(eq(labNotebook.id, id), isNull(labNotebook.deletedAt)));
  return result;
}

export async function getNotebooksByUser(
  userId: string,
  opts: {
    status?: string;
    experimentId?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { status, experimentId, page = 1, pageSize = 20 } = opts;

  const conditions = [
    eq(labNotebook.userId, userId),
    isNull(labNotebook.deletedAt),
  ];
  if (status) conditions.push(eq(labNotebook.status, status));
  if (experimentId)
    conditions.push(eq(labNotebook.experimentId, experimentId));

  const results = await db()
    .select()
    .from(labNotebook)
    .where(and(...conditions))
    .orderBy(desc(labNotebook.updatedAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return results;
}

export async function getNotebooksByUserCount(
  userId: string,
  opts: { status?: string; experimentId?: string } = {}
) {
  const { status, experimentId } = opts;

  const conditions = [
    eq(labNotebook.userId, userId),
    isNull(labNotebook.deletedAt),
  ];
  if (status) conditions.push(eq(labNotebook.status, status));
  if (experimentId)
    conditions.push(eq(labNotebook.experimentId, experimentId));

  const [result] = await db()
    .select({ count: count() })
    .from(labNotebook)
    .where(and(...conditions));

  return result?.count || 0;
}

export async function softDeleteLabNotebook(id: string) {
  const [result] = await db()
    .update(labNotebook)
    .set({ deletedAt: new Date() })
    .where(and(eq(labNotebook.id, id), isNull(labNotebook.deletedAt)))
    .returning();
  return result;
}

export async function getNotebookForExperiment(
  userId: string,
  experimentId: string
) {
  const [result] = await db()
    .select()
    .from(labNotebook)
    .where(
      and(
        eq(labNotebook.userId, userId),
        eq(labNotebook.experimentId, experimentId),
        eq(labNotebook.status, 'draft'),
        isNull(labNotebook.deletedAt)
      )
    )
    .orderBy(desc(labNotebook.updatedAt))
    .limit(1);
  return result;
}

export async function getNotebookForGeneration(
  userId: string,
  generationId: string
) {
  const [result] = await db()
    .select()
    .from(labNotebook)
    .where(
      and(
        eq(labNotebook.userId, userId),
        eq(labNotebook.generationId, generationId),
        eq(labNotebook.status, 'draft'),
        isNull(labNotebook.deletedAt)
      )
    )
    .orderBy(desc(labNotebook.updatedAt))
    .limit(1);
  return result;
}

export async function getMonthlyNotebookCount(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [result] = await db()
    .select({ count: count() })
    .from(labNotebook)
    .where(
      and(
        eq(labNotebook.userId, userId),
        gte(labNotebook.createdAt, startOfMonth),
        lt(labNotebook.createdAt, startOfNextMonth),
        isNull(labNotebook.deletedAt)
      )
    );

  return result?.count || 0;
}
