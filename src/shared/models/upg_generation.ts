import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  isNull,
  lt,
  or,
  sql,
  sum,
} from 'drizzle-orm';

import { db } from '@/core/db';
import { upgGeneration, user } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';
import type { GalleryListParams } from '@/shared/types/gallery';

export type UpgGeneration = typeof upgGeneration.$inferSelect;
export type NewUpgGeneration = typeof upgGeneration.$inferInsert;
export type UpdateUpgGeneration = Partial<
  Omit<NewUpgGeneration, 'id' | 'createdAt'>
>;

export async function createUpgGeneration(data: NewUpgGeneration) {
  const [result] = await db()
    .insert(upgGeneration)
    .values({
      ...data,
      id: data.id || getUuid(),
    })
    .returning();
  return result;
}

export async function updateUpgGeneration(
  id: string,
  data: UpdateUpgGeneration
) {
  const [result] = await db()
    .update(upgGeneration)
    .set(data)
    .where(eq(upgGeneration.id, id))
    .returning();
  return result;
}

export async function findUpgGenerationById(id: string) {
  const [result] = await db()
    .select()
    .from(upgGeneration)
    .where(and(eq(upgGeneration.id, id), isNull(upgGeneration.deletedAt)));
  return result;
}

export async function getUpgGenerationsByUserId(
  userId: string,
  page: number = 1,
  pageSize: number = 20
) {
  const result = await db()
    .select()
    .from(upgGeneration)
    .where(
      and(eq(upgGeneration.userId, userId), isNull(upgGeneration.deletedAt))
    )
    .orderBy(desc(upgGeneration.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  return result;
}

export async function getUpgGenerationsCount(userId: string): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(upgGeneration)
    .where(
      and(eq(upgGeneration.userId, userId), isNull(upgGeneration.deletedAt))
    );
  return result?.count || 0;
}

export async function softDeleteUpgGeneration(id: string) {
  const [result] = await db()
    .update(upgGeneration)
    .set({ deletedAt: new Date() })
    .where(eq(upgGeneration.id, id))
    .returning();
  return result;
}

export async function incrementViewCount(id: string) {
  const [result] = await db()
    .update(upgGeneration)
    .set({ viewCount: sql`${upgGeneration.viewCount} + 1` })
    .where(eq(upgGeneration.id, id))
    .returning();
  return result;
}

// ─── Gallery columns (excludes htmlContent for list performance) ───

const galleryColumns = {
  id: upgGeneration.id,
  userId: upgGeneration.userId,
  prompt: upgGeneration.prompt,
  language: upgGeneration.language,
  category: upgGeneration.category,
  htmlSize: upgGeneration.htmlSize,
  isPublic: upgGeneration.isPublic,
  viewCount: upgGeneration.viewCount,
  likeCount: upgGeneration.likeCount,
  forkCount: upgGeneration.forkCount,
  featured: upgGeneration.featured,
  tags: upgGeneration.tags,
  forkedFrom: upgGeneration.forkedFrom,
  createdAt: upgGeneration.createdAt,
};

// ─── Gallery query functions ───

export async function getGalleryList(params: GalleryListParams) {
  const limit = Math.min(params.limit ?? 20, 50);
  const sort = params.sort ?? 'latest';

  const conditions = [
    eq(upgGeneration.isPublic, true),
    eq(upgGeneration.status, 'completed'),
    isNull(upgGeneration.deletedAt),
  ];

  if (params.cursor) {
    conditions.push(lt(upgGeneration.createdAt, new Date(params.cursor)));
  }

  if (params.tag) {
    conditions.push(sql`${params.tag} = ANY(${upgGeneration.tags})`);
  }

  if (params.q) {
    conditions.push(ilike(upgGeneration.prompt, `%${params.q}%`));
  }

  if (params.author) {
    conditions.push(eq(upgGeneration.userId, params.author));
  }

  let orderBy;
  switch (sort) {
    case 'popular':
      orderBy = [desc(upgGeneration.viewCount), desc(upgGeneration.createdAt)];
      break;
    case 'most_liked':
      orderBy = [desc(upgGeneration.likeCount), desc(upgGeneration.createdAt)];
      break;
    default:
      orderBy = [desc(upgGeneration.createdAt)];
  }

  const rows = await db()
    .select({
      ...galleryColumns,
      authorName: user.name,
      authorImage: user.image,
    })
    .from(upgGeneration)
    .leftJoin(user, eq(upgGeneration.userId, user.id))
    .where(and(...conditions))
    .orderBy(...orderBy)
    .limit(limit + 1); // fetch one extra to determine hasMore

  const hasMore = rows.length > limit;
  const list = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor =
    hasMore && list.length > 0
      ? list[list.length - 1].createdAt.toISOString()
      : null;

  return { list, nextCursor, hasMore };
}

export async function getGalleryDetail(id: string) {
  const [result] = await db()
    .select({
      id: upgGeneration.id,
      userId: upgGeneration.userId,
      prompt: upgGeneration.prompt,
      language: upgGeneration.language,
      category: upgGeneration.category,
      htmlContent: upgGeneration.htmlContent,
      htmlUrl: upgGeneration.htmlUrl,
      htmlSize: upgGeneration.htmlSize,
      isPublic: upgGeneration.isPublic,
      viewCount: upgGeneration.viewCount,
      likeCount: upgGeneration.likeCount,
      forkCount: upgGeneration.forkCount,
      featured: upgGeneration.featured,
      tags: upgGeneration.tags,
      forkedFrom: upgGeneration.forkedFrom,
      shareCount: upgGeneration.shareCount,
      downloadCount: upgGeneration.downloadCount,
      createdAt: upgGeneration.createdAt,
      authorName: user.name,
      authorImage: user.image,
    })
    .from(upgGeneration)
    .leftJoin(user, eq(upgGeneration.userId, user.id))
    .where(and(eq(upgGeneration.id, id), isNull(upgGeneration.deletedAt)));
  return result;
}

export async function getPopularTags(limit: number = 20) {
  const rows = await db().execute(sql`
    SELECT unnest(tags) AS tag, count(*) AS count
    FROM upg_generation
    WHERE is_public = true
      AND status = 'completed'
      AND deleted_at IS NULL
      AND tags IS NOT NULL
    GROUP BY tag
    ORDER BY count DESC
    LIMIT ${limit}
  `);
  return rows as unknown as { tag: string; count: number }[];
}

export async function togglePublish(
  id: string,
  userId: string
): Promise<{ id: string; isPublic: boolean | null } | null> {
  const gen = await findUpgGenerationById(id);
  if (!gen || gen.userId !== userId) return null;

  const newPublic = !gen.isPublic;
  const [result] = await db()
    .update(upgGeneration)
    .set({ isPublic: newPublic })
    .where(eq(upgGeneration.id, id))
    .returning({ id: upgGeneration.id, isPublic: upgGeneration.isPublic });
  return result;
}

export async function forkGeneration(
  originalId: string,
  newUserId: string
): Promise<UpgGeneration | null> {
  const original = await findUpgGenerationById(originalId);
  if (!original || !original.isPublic) return null;

  // Increment fork count on original
  await db()
    .update(upgGeneration)
    .set({ forkCount: sql`${upgGeneration.forkCount} + 1` })
    .where(eq(upgGeneration.id, originalId));

  // Create forked record (pending state, no htmlContent yet — caller runs generation pipeline)
  const forked = await createUpgGeneration({
    id: getUuid(),
    userId: newUserId,
    prompt: original.prompt,
    promptHash: original.promptHash,
    language: original.language,
    category: original.category,
    model: original.model,
    provider: original.provider,
    status: 'pending',
    forkedFrom: originalId,
  });

  return forked;
}

export async function getRecentGenerationsByUserId(
  userId: string,
  limit: number = 6
) {
  return await db()
    .select(galleryColumns)
    .from(upgGeneration)
    .where(
      and(eq(upgGeneration.userId, userId), isNull(upgGeneration.deletedAt))
    )
    .orderBy(desc(upgGeneration.createdAt))
    .limit(limit);
}

export async function getTotalLikesReceived(userId: string): Promise<number> {
  const [result] = await db()
    .select({ total: sum(upgGeneration.likeCount) })
    .from(upgGeneration)
    .where(
      and(eq(upgGeneration.userId, userId), isNull(upgGeneration.deletedAt))
    );
  return Number(result?.total) || 0;
}

export async function getMonthlyGenerationCount(
  userId: string
): Promise<number> {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [result] = await db()
    .select({ count: count() })
    .from(upgGeneration)
    .where(
      and(
        eq(upgGeneration.userId, userId),
        isNull(upgGeneration.deletedAt),
        gte(upgGeneration.createdAt, firstOfMonth)
      )
    );
  return result?.count || 0;
}
