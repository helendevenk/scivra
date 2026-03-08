import { and, eq, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import { upgDailyQuota } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

const DEFAULT_SCENE = 'upg-generate';

export type UpgDailyQuota = typeof upgDailyQuota.$inferSelect;
export type NewUpgDailyQuota = typeof upgDailyQuota.$inferInsert;

export async function getOrCreateDailyQuota(
  userId: string,
  date: string,
  scene: string = DEFAULT_SCENE
) {
  // Try to find existing record
  const [existing] = await db()
    .select()
    .from(upgDailyQuota)
    .where(
      and(
        eq(upgDailyQuota.userId, userId),
        eq(upgDailyQuota.usageDate, date),
        eq(upgDailyQuota.scene, scene)
      )
    );

  if (existing) {
    return existing;
  }

  // Create new record
  const [result] = await db()
    .insert(upgDailyQuota)
    .values({
      id: getUuid(),
      userId,
      usageDate: date,
      scene,
      generationCount: 0,
    })
    .onConflictDoNothing()
    .returning();

  // If conflict (race condition), fetch the existing one
  if (!result) {
    const [existing] = await db()
      .select()
      .from(upgDailyQuota)
      .where(
        and(
          eq(upgDailyQuota.userId, userId),
          eq(upgDailyQuota.usageDate, date),
          eq(upgDailyQuota.scene, scene)
        )
      );
    return existing;
  }

  return result;
}

export async function incrementDailyQuota(
  userId: string,
  date: string,
  scene: string = DEFAULT_SCENE
) {
  // Upsert: increment if exists, create with count=1 if not
  const [result] = await db()
    .insert(upgDailyQuota)
    .values({
      id: getUuid(),
      userId,
      usageDate: date,
      scene,
      generationCount: 1,
    })
    .onConflictDoUpdate({
      target: [upgDailyQuota.userId, upgDailyQuota.usageDate, upgDailyQuota.scene],
      set: {
        generationCount: sql`${upgDailyQuota.generationCount} + 1`,
      },
    })
    .returning();

  return result;
}

export async function getDailyQuotaCount(
  userId: string,
  date: string,
  scene: string = DEFAULT_SCENE
): Promise<number> {
  const [result] = await db()
    .select({ generationCount: upgDailyQuota.generationCount })
    .from(upgDailyQuota)
    .where(
      and(
        eq(upgDailyQuota.userId, userId),
        eq(upgDailyQuota.usageDate, date),
        eq(upgDailyQuota.scene, scene)
      )
    );
  return result?.generationCount || 0;
}
