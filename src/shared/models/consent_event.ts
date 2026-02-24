import { eq, and, lt } from 'drizzle-orm';

import { db } from '@/core/db';
import { consentEvent } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type ConsentEvent = typeof consentEvent.$inferSelect;
export type NewConsentEvent = typeof consentEvent.$inferInsert;

export async function createConsentEvent(input: Omit<NewConsentEvent, 'id' | 'createdAt'>) {
  const id = getUuid();
  const [result] = await db()
    .insert(consentEvent)
    .values({ id, ...input })
    .returning();
  return result;
}

export async function deleteConsentEventsOlderThan(cutoff: Date): Promise<number> {
  const result = await db()
    .delete(consentEvent)
    .where(lt(consentEvent.createdAt, cutoff));
  return result.count;
}
