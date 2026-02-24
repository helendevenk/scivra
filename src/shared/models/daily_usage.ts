import { eq, and, lt } from 'drizzle-orm';

import { db } from '@/core/db';
import { dailyUsage } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type DailyUsage = typeof dailyUsage.$inferSelect;
export type NewDailyUsage = typeof dailyUsage.$inferInsert;

export async function getDailyUsage(input: {
  keyType: string;
  keyValue: string;
  experimentId: string;
  usageDate: string;
}) {
  const [result] = await db()
    .select()
    .from(dailyUsage)
    .where(
      and(
        eq(dailyUsage.keyType, input.keyType),
        eq(dailyUsage.keyValue, input.keyValue),
        eq(dailyUsage.experimentId, input.experimentId),
        eq(dailyUsage.usageDate, input.usageDate)
      )
    );
  return result ?? null;
}

export async function upsertDailyUsage(input: {
  keyType: string;
  keyValue: string;
  experimentId: string;
  usageDate: string;
  additionalSeconds: number;
}) {
  const existing = await getDailyUsage(input);
  if (existing) {
    const [result] = await db()
      .update(dailyUsage)
      .set({ usedSeconds: existing.usedSeconds + input.additionalSeconds })
      .where(eq(dailyUsage.id, existing.id))
      .returning();
    return result;
  }
  const id = getUuid();
  const [result] = await db()
    .insert(dailyUsage)
    .values({
      id,
      keyType: input.keyType,
      keyValue: input.keyValue,
      experimentId: input.experimentId,
      usageDate: input.usageDate,
      usedSeconds: input.additionalSeconds,
    })
    .returning();
  return result;
}

export async function getTotalUsedSeconds(input: {
  keyType: string;
  keyValue: string;
  usageDate: string;
}) {
  const results = await db()
    .select()
    .from(dailyUsage)
    .where(
      and(
        eq(dailyUsage.keyType, input.keyType),
        eq(dailyUsage.keyValue, input.keyValue),
        eq(dailyUsage.usageDate, input.usageDate)
      )
    );
  return results.reduce((sum, row) => sum + row.usedSeconds, 0);
}
