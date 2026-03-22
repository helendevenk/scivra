/**
 * Content Moderation Model
 *
 * 内容审核记录数据访问层
 */

import { db } from '@/core/db';
import { contentModeration, type ContentModeration, type NewContentModeration } from '@/config/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getUuid } from '@/shared/lib/hash';

/**
 * 创建审核记录
 */
export async function createModerationRecord(
  data: Omit<NewContentModeration, 'id' | 'checkedAt'>
): Promise<ContentModeration> {
  const record: NewContentModeration = {
    id: getUuid(),
    checkedAt: new Date(),
    ...data,
  };

  const [created] = await db().insert(contentModeration).values(record).returning();
  return created;
}

/**
 * 根据 generation ID 获取审核记录
 */
export async function getModerationRecordsByGenerationId(
  generationId: string
): Promise<ContentModeration[]> {
  return db()
    .select()
    .from(contentModeration)
    .where(eq(contentModeration.generationId, generationId))
    .orderBy(desc(contentModeration.checkedAt));
}

/**
 * 获取待人工审核的记录列表
 */
export async function getPendingModerationRecords(
  limit: number = 50,
  offset: number = 0
): Promise<ContentModeration[]> {
  return db()
    .select()
    .from(contentModeration)
    .where(eq(contentModeration.status, 'pending'))
    .orderBy(desc(contentModeration.checkedAt))
    .limit(limit)
    .offset(offset);
}

/**
 * 更新审核记录（人工审核）
 */
export async function updateModerationRecord(
  id: string,
  updates: {
    status?: 'pass' | 'reject' | 'pending';
    reviewedBy?: string;
    reviewNotes?: string;
    reviewedAt?: Date;
  }
): Promise<ContentModeration | null> {
  const [updated] = await db()
    .update(contentModeration)
    .set({
      ...updates,
      reviewedAt: updates.reviewedAt ?? new Date(),
    })
    .where(eq(contentModeration.id, id))
    .returning();

  return updated ?? null;
}

/**
 * 获取审核统计信息
 */
export async function getModerationStats(): Promise<{
  total: number;
  passed: number;
  rejected: number;
  pending: number;
}> {
  const records = await db().select().from(contentModeration);

  return {
    total: records.length,
    passed: records.filter((r: ContentModeration) => r.status === 'pass').length,
    rejected: records.filter((r: ContentModeration) => r.status === 'reject').length,
    pending: records.filter((r: ContentModeration) => r.status === 'pending').length,
  };
}

/**
 * 根据 ID 获取审核记录
 */
export async function getModerationRecordById(id: string): Promise<ContentModeration | null> {
  const [record] = await db()
    .select()
    .from(contentModeration)
    .where(eq(contentModeration.id, id))
    .limit(1);

  return record ?? null;
}
