import { lt } from 'drizzle-orm';

import { db } from '@/core/db';
import { anonymousUsage, consentEvent } from '@/config/db/schema';

export function createRetentionRepository() {
  return {
    async deleteAnonymousUsageOlderThan(input: { cutoff: Date }): Promise<number> {
      const rows = await db()
        .delete(anonymousUsage)
        .where(lt(anonymousUsage.createdAt, input.cutoff))
        .returning({ id: anonymousUsage.id });
      return rows.length;
    },

    async deleteConsentEventsOlderThan(input: { cutoff: Date }): Promise<number> {
      const rows = await db()
        .delete(consentEvent)
        .where(lt(consentEvent.createdAt, input.cutoff))
        .returning({ id: consentEvent.id });
      return rows.length;
    },
  };
}
