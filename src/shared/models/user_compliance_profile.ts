import { eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { userComplianceProfile } from '@/config/db/schema';

export type UserComplianceProfile = typeof userComplianceProfile.$inferSelect;
export type NewUserComplianceProfile = typeof userComplianceProfile.$inferInsert;
export type UpdateUserComplianceProfile = Partial<
  Omit<NewUserComplianceProfile, 'userId' | 'createdAt'>
>;

export async function getComplianceProfile(userId: string) {
  const [result] = await db()
    .select()
    .from(userComplianceProfile)
    .where(eq(userComplianceProfile.userId, userId));
  return result ?? null;
}

export async function upsertComplianceProfile(
  userId: string,
  data: UpdateUserComplianceProfile
) {
  const existing = await getComplianceProfile(userId);
  if (existing) {
    const [result] = await db()
      .update(userComplianceProfile)
      .set(data)
      .where(eq(userComplianceProfile.userId, userId))
      .returning();
    return result;
  }
  const [result] = await db()
    .insert(userComplianceProfile)
    .values({ userId, ...data })
    .returning();
  return result;
}
