import { eq, and, lt } from 'drizzle-orm';

import { db } from '@/core/db';
import { privacyRequest } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type PrivacyRequest = typeof privacyRequest.$inferSelect;
export type NewPrivacyRequest = typeof privacyRequest.$inferInsert;

export async function createPrivacyRequest(input: {
  userId: string;
  requestType: string;
  metadata?: string | null;
}) {
  const id = getUuid();
  const [result] = await db()
    .insert(privacyRequest)
    .values({ id, ...input })
    .returning();
  return result;
}

export async function getPrivacyRequestById(requestId: string) {
  const [result] = await db()
    .select()
    .from(privacyRequest)
    .where(eq(privacyRequest.id, requestId));
  return result ?? null;
}

export async function updatePrivacyRequestStatus(
  requestId: string,
  status: string,
  completedAt?: Date
) {
  const [result] = await db()
    .update(privacyRequest)
    .set({ status, completedAt })
    .where(eq(privacyRequest.id, requestId))
    .returning();
  return result;
}
