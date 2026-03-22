import { eq, desc, sql, inArray } from 'drizzle-orm';
import { db as getDb } from '@/core/db';
import { upgTag, upgGenerationTag, type UpgTag, type NewUpgTag } from '@/config/db/schema';
import { nanoid } from 'nanoid';

const db = getDb();

/**
 * UPG Tag Model
 *
 * Normalized tag management for UPG generations.
 * Replaces TEXT[] array approach for better query performance.
 */

export interface CreateTagParams {
  name: string;
  category?: string;
}

/**
 * Create or get existing tag
 */
export async function createOrGetTag(params: CreateTagParams): Promise<UpgTag> {
  // Try to find existing tag
  const existing = await db
    .select()
    .from(upgTag)
    .where(eq(upgTag.name, params.name.toLowerCase()))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  // Create new tag
  const newTag: NewUpgTag = {
    id: nanoid(),
    name: params.name.toLowerCase(),
    category: params.category,
    usageCount: 0,
  };

  const [created] = await db.insert(upgTag).values(newTag).returning();
  return created;
}

/**
 * Get tag by ID
 */
export async function getTagById(id: string): Promise<UpgTag | null> {
  const result = await db
    .select()
    .from(upgTag)
    .where(eq(upgTag.id, id))
    .limit(1);

  return result[0] || null;
}

/**
 * Get tag by name
 */
export async function getTagByName(name: string): Promise<UpgTag | null> {
  const result = await db
    .select()
    .from(upgTag)
    .where(eq(upgTag.name, name.toLowerCase()))
    .limit(1);

  return result[0] || null;
}

/**
 * Get popular tags
 */
export async function getPopularTags(limit: number = 20): Promise<UpgTag[]> {
  return await db
    .select()
    .from(upgTag)
    .orderBy(desc(upgTag.usageCount))
    .limit(limit);
}

/**
 * Get tags by category
 */
export async function getTagsByCategory(category: string, limit: number = 50): Promise<UpgTag[]> {
  return await db
    .select()
    .from(upgTag)
    .where(eq(upgTag.category, category))
    .orderBy(desc(upgTag.usageCount))
    .limit(limit);
}

/**
 * Increment tag usage count
 */
export async function incrementTagUsage(tagId: string): Promise<void> {
  await db
    .update(upgTag)
    .set({
      usageCount: sql`${upgTag.usageCount} + 1`,
    })
    .where(eq(upgTag.id, tagId));
}

/**
 * Decrement tag usage count
 */
export async function decrementTagUsage(tagId: string): Promise<void> {
  await db
    .update(upgTag)
    .set({
      usageCount: sql`GREATEST(0, ${upgTag.usageCount} - 1)`,
    })
    .where(eq(upgTag.id, tagId));
}

/**
 * Associate tags with generation
 */
export async function associateTagsWithGeneration(
  generationId: string,
  tagNames: string[]
): Promise<void> {
  if (tagNames.length === 0) return;

  // Create or get all tags
  const tags = await Promise.all(
    tagNames.map((name) => createOrGetTag({ name }))
  );

  // Create associations
  const associations = tags.map((tag) => ({
    generationId,
    tagId: tag.id,
  }));

  await db.insert(upgGenerationTag).values(associations).onConflictDoNothing();

  // Increment usage counts
  await Promise.all(tags.map((tag) => incrementTagUsage(tag.id)));
}

/**
 * Remove tags from generation
 */
export async function removeTagsFromGeneration(
  generationId: string,
  tagIds: string[]
): Promise<void> {
  if (tagIds.length === 0) return;

  await db
    .delete(upgGenerationTag)
    .where(
      sql`${upgGenerationTag.generationId} = ${generationId} AND ${upgGenerationTag.tagId} = ANY(${tagIds})`
    );

  // Decrement usage counts
  await Promise.all(tagIds.map((tagId) => decrementTagUsage(tagId)));
}

/**
 * Get tags for a generation
 */
export async function getGenerationTags(generationId: string): Promise<UpgTag[]> {
  const result = await db
    .select({
      id: upgTag.id,
      name: upgTag.name,
      category: upgTag.category,
      usageCount: upgTag.usageCount,
      createdAt: upgTag.createdAt,
      updatedAt: upgTag.updatedAt,
    })
    .from(upgGenerationTag)
    .innerJoin(upgTag, eq(upgGenerationTag.tagId, upgTag.id))
    .where(eq(upgGenerationTag.generationId, generationId));

  return result;
}

/**
 * Search tags by name prefix
 */
export async function searchTags(prefix: string, limit: number = 10): Promise<UpgTag[]> {
  return await db
    .select()
    .from(upgTag)
    .where(sql`${upgTag.name} ILIKE ${prefix + '%'}`)
    .orderBy(desc(upgTag.usageCount))
    .limit(limit);
}
