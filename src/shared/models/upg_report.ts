import { count, eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { upgReport } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type UpgReport = typeof upgReport.$inferSelect;
export type NewUpgReport = typeof upgReport.$inferInsert;

export async function createUpgReport(data: NewUpgReport) {
  const [result] = await db()
    .insert(upgReport)
    .values({
      ...data,
      id: data.id || getUuid(),
    })
    .returning();
  return result;
}

export async function getReportCountByGenerationId(
  generationId: string
): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(upgReport)
    .where(eq(upgReport.generationId, generationId));
  return result?.count || 0;
}
