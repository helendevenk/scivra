import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { quest } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type Quest = typeof quest.$inferSelect;
export type NewQuest = typeof quest.$inferInsert;

export async function createQuest(data: Omit<NewQuest, 'id'>): Promise<Quest> {
  const [result] = await db()
    .insert(quest)
    .values({ ...data, id: getUuid() })
    .returning();
  return result;
}

export async function updateQuest(
  id: string,
  data: Partial<Omit<NewQuest, 'id' | 'createdAt'>>
): Promise<Quest> {
  const [result] = await db()
    .update(quest)
    .set(data)
    .where(eq(quest.id, id))
    .returning();
  return result;
}

export async function findQuestById(
  id: string
): Promise<Quest | undefined> {
  const [result] = await db()
    .select()
    .from(quest)
    .where(eq(quest.id, id));
  return result;
}

export async function findQuestBySlug(
  slug: string
): Promise<Quest | undefined> {
  const [result] = await db()
    .select()
    .from(quest)
    .where(eq(quest.slug, slug));
  return result;
}

export async function getPublishedQuests(opts?: {
  category?: string;
  difficulty?: string;
  tier?: string;
}): Promise<Quest[]> {
  const conditions = [eq(quest.isPublished, true)];
  if (opts?.category) {
    conditions.push(eq(quest.category, opts.category));
  }
  if (opts?.difficulty) {
    conditions.push(eq(quest.difficulty, opts.difficulty));
  }
  if (opts?.tier) {
    conditions.push(eq(quest.tier, opts.tier));
  }
  return await db()
    .select()
    .from(quest)
    .where(and(...conditions))
    .orderBy(quest.sortOrder, desc(quest.createdAt));
}

export async function getWeeklyChallenge(): Promise<Quest | undefined> {
  const today = new Date().toISOString().split('T')[0];
  const [result] = await db()
    .select()
    .from(quest)
    .where(
      and(
        eq(quest.isPublished, true),
        eq(quest.isWeeklyChallenge, true)
      )
    )
    .orderBy(desc(quest.weeklyStartDate))
    .limit(1);

  if (!result) return undefined;
  // Check if the weekly challenge is active
  if (result.weeklyStartDate && result.weeklyEndDate) {
    if (today < result.weeklyStartDate || today > result.weeklyEndDate) {
      return undefined;
    }
  }
  return result;
}

export async function deleteQuest(id: string): Promise<void> {
  await db().delete(quest).where(eq(quest.id, id));
}
