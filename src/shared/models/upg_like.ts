import { and, eq, inArray, desc, sql, count } from 'drizzle-orm';

import { db } from '@/core/db';
import { upgLike, upgGeneration } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type UpgLike = typeof upgLike.$inferSelect;

/**
 * Toggle like on a generation. Returns new liked state and updated likeCount.
 * Runs in a transaction to keep upg_like rows and upg_generation.likeCount in sync.
 */
export async function toggleLike(
  userId: string,
  generationId: string
): Promise<{ liked: boolean; likeCount: number }> {
  return await db().transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: upgLike.id })
      .from(upgLike)
      .where(
        and(
          eq(upgLike.userId, userId),
          eq(upgLike.generationId, generationId)
        )
      );

    if (existing) {
      // Unlike
      await tx.delete(upgLike).where(eq(upgLike.id, existing.id));
      const [updated] = await tx
        .update(upgGeneration)
        .set({ likeCount: sql`GREATEST(${upgGeneration.likeCount} - 1, 0)` })
        .where(eq(upgGeneration.id, generationId))
        .returning({ likeCount: upgGeneration.likeCount });
      return { liked: false, likeCount: updated.likeCount ?? 0 };
    } else {
      // Like
      await tx.insert(upgLike).values({
        id: getUuid(),
        userId,
        generationId,
      });
      const [updated] = await tx
        .update(upgGeneration)
        .set({ likeCount: sql`${upgGeneration.likeCount} + 1` })
        .where(eq(upgGeneration.id, generationId))
        .returning({ likeCount: upgGeneration.likeCount });
      return { liked: true, likeCount: updated.likeCount ?? 0 };
    }
  });
}

export async function isLikedByUser(
  userId: string,
  generationId: string
): Promise<boolean> {
  const [result] = await db()
    .select({ id: upgLike.id })
    .from(upgLike)
    .where(
      and(
        eq(upgLike.userId, userId),
        eq(upgLike.generationId, generationId)
      )
    );
  return !!result;
}

/**
 * Batch check which generations are liked by a user.
 * Used by Gallery list to show like state for all visible cards in one query.
 */
export async function batchCheckLiked(
  userId: string,
  generationIds: string[]
): Promise<Map<string, boolean>> {
  if (generationIds.length === 0) return new Map();

  const rows = await db()
    .select({ generationId: upgLike.generationId })
    .from(upgLike)
    .where(
      and(
        eq(upgLike.userId, userId),
        inArray(upgLike.generationId, generationIds)
      )
    );

  const likedSet = new Set(rows.map((r) => r.generationId));
  const result = new Map<string, boolean>();
  for (const id of generationIds) {
    result.set(id, likedSet.has(id));
  }
  return result;
}

/**
 * Get recent likes by a user (for Dashboard "recent activity").
 */
export async function getRecentLikesByUserId(
  userId: string,
  limit: number = 5
) {
  return await db()
    .select({
      generationId: upgLike.generationId,
      createdAt: upgLike.createdAt,
    })
    .from(upgLike)
    .where(eq(upgLike.userId, userId))
    .orderBy(desc(upgLike.createdAt))
    .limit(limit);
}
