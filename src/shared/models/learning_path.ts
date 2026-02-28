import { and, count, desc, eq, gt, inArray, max, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import {
  learningPath,
  learningPathNode,
  learningPathProgress,
} from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';
import { getCurrentSubscription } from './subscription';

// ─── Types ───

export type LearningPath = typeof learningPath.$inferSelect;
export type NewLearningPath = typeof learningPath.$inferInsert;
export type LearningPathNode = typeof learningPathNode.$inferSelect;
export type NewLearningPathNode = typeof learningPathNode.$inferInsert;
export type LearningPathProgress = typeof learningPathProgress.$inferSelect;

export type QuizQuestion = {
  question_en: string;
  question_zh: string;
  options_en: string[];
  options_zh: string[];
  correct_index: number;
  explanation_en: string;
  explanation_zh: string;
};

const FREE_NODE_LIMIT = 3;

// ─── Learning Path CRUD ───

export async function getAdminLearningPaths(): Promise<LearningPath[]> {
  return await db()
    .select()
    .from(learningPath)
    .orderBy(desc(learningPath.createdAt));
}

export async function findLearningPathById(
  id: string
): Promise<LearningPath | undefined> {
  const [result] = await db()
    .select()
    .from(learningPath)
    .where(eq(learningPath.id, id));
  return result;
}

export async function createLearningPath(
  data: NewLearningPath
): Promise<LearningPath> {
  const [result] = await db().insert(learningPath).values(data).returning();
  return result;
}

export async function updateLearningPath(
  id: string,
  data: Partial<Omit<NewLearningPath, 'id' | 'createdAt'>>
): Promise<LearningPath> {
  const [result] = await db()
    .update(learningPath)
    .set(data)
    .where(eq(learningPath.id, id))
    .returning();
  return result;
}

export async function deleteLearningPath(id: string): Promise<void> {
  await db().delete(learningPath).where(eq(learningPath.id, id));
}

// ─── Node CRUD ───

export async function getNodesByPathId(
  pathId: string
): Promise<LearningPathNode[]> {
  return await db()
    .select()
    .from(learningPathNode)
    .where(eq(learningPathNode.pathId, pathId))
    .orderBy(learningPathNode.orderIndex);
}

export async function getMaxOrderIndex(
  pathId: string
): Promise<number | null> {
  const [result] = await db()
    .select({ maxOrder: max(learningPathNode.orderIndex) })
    .from(learningPathNode)
    .where(eq(learningPathNode.pathId, pathId));
  return result?.maxOrder ?? null;
}

export async function createNode(
  data: NewLearningPathNode
): Promise<LearningPathNode> {
  const [result] = await db()
    .insert(learningPathNode)
    .values(data)
    .returning();
  return result;
}

export async function updateNode(
  nodeId: string,
  data: Partial<Omit<NewLearningPathNode, 'id' | 'pathId' | 'createdAt'>>
): Promise<LearningPathNode> {
  const [result] = await db()
    .update(learningPathNode)
    .set(data)
    .where(eq(learningPathNode.id, nodeId))
    .returning();
  return result;
}

export async function deleteNode(nodeId: string): Promise<void> {
  await db().delete(learningPathNode).where(eq(learningPathNode.id, nodeId));
}

// ─── Public Queries ───

export async function getPublishedPaths(filters?: {
  category?: string;
  level?: string;
}): Promise<LearningPath[]> {
  const conditions = [eq(learningPath.isPublished, true)];
  if (filters?.category) {
    conditions.push(eq(learningPath.category, filters.category));
  }
  if (filters?.level) {
    conditions.push(eq(learningPath.level, filters.level));
  }
  return await db()
    .select()
    .from(learningPath)
    .where(and(...conditions))
    .orderBy(desc(learningPath.createdAt));
}

export async function findPublishedPathBySlug(
  slug: string
): Promise<LearningPath | undefined> {
  const [result] = await db()
    .select()
    .from(learningPath)
    .where(and(eq(learningPath.slug, slug), eq(learningPath.isPublished, true)));
  return result;
}

// ─── Progress ───

export async function getUserProgressForPaths(
  userId: string,
  pathIds: string[]
): Promise<LearningPathProgress[]> {
  if (pathIds.length === 0) return [];
  return await db()
    .select()
    .from(learningPathProgress)
    .where(
      and(
        eq(learningPathProgress.userId, userId),
        inArray(learningPathProgress.pathId, pathIds)
      )
    );
}

export async function getUserProgressForPath(
  userId: string,
  pathId: string
): Promise<LearningPathProgress | undefined> {
  const [result] = await db()
    .select()
    .from(learningPathProgress)
    .where(
      and(
        eq(learningPathProgress.userId, userId),
        eq(learningPathProgress.pathId, pathId)
      )
    );
  return result;
}

export async function upsertProgress(
  userId: string,
  pathId: string,
  currentNode: number,
  completed: boolean
): Promise<LearningPathProgress> {
  const existing = await getUserProgressForPath(userId, pathId);
  if (existing) {
    const [result] = await db()
      .update(learningPathProgress)
      .set({ currentNode, completed })
      .where(eq(learningPathProgress.id, existing.id))
      .returning();
    return result;
  }
  const [result] = await db()
    .insert(learningPathProgress)
    .values({ id: getUuid(), userId, pathId, currentNode, completed })
    .returning();
  return result;
}

// Alias for public API compatibility
export const getPublishedPathBySlug = findPublishedPathBySlug;

// ─── Node Queries ───

export async function getNodeByPathAndOrder(
  pathId: string,
  orderIndex: number
): Promise<LearningPathNode | undefined> {
  const [result] = await db()
    .select()
    .from(learningPathNode)
    .where(
      and(
        eq(learningPathNode.pathId, pathId),
        eq(learningPathNode.orderIndex, orderIndex)
      )
    );
  return result;
}

export async function findLearningPathBySlug(
  slug: string
): Promise<LearningPath | undefined> {
  const [result] = await db()
    .select()
    .from(learningPath)
    .where(eq(learningPath.slug, slug));
  return result;
}

// ─── Transactional Node Operations ───

export async function createNodeWithCount(
  pathId: string,
  data: Omit<NewLearningPathNode, 'id' | 'pathId' | 'orderIndex'> & {
    orderIndex?: number;
  }
): Promise<LearningPathNode> {
  return await db().transaction(async (tx) => {
    let orderIndex = data.orderIndex;
    if (orderIndex == null) {
      const [maxResult] = await tx
        .select({ maxOrder: max(learningPathNode.orderIndex) })
        .from(learningPathNode)
        .where(eq(learningPathNode.pathId, pathId));
      orderIndex = (maxResult?.maxOrder ?? -1) + 1;
    }

    const [node] = await tx
      .insert(learningPathNode)
      .values({
        ...data,
        id: getUuid(),
        pathId,
        orderIndex,
      })
      .returning();

    await tx
      .update(learningPath)
      .set({ nodeCount: sql`${learningPath.nodeCount} + 1` })
      .where(eq(learningPath.id, pathId));

    return node;
  });
}

export async function deleteNodeWithReorder(nodeId: string): Promise<void> {
  await db().transaction(async (tx) => {
    const [node] = await tx
      .select()
      .from(learningPathNode)
      .where(eq(learningPathNode.id, nodeId));
    if (!node) return;

    await tx.delete(learningPathNode).where(eq(learningPathNode.id, nodeId));

    await tx
      .update(learningPathNode)
      .set({ orderIndex: sql`${learningPathNode.orderIndex} - 1` })
      .where(
        and(
          eq(learningPathNode.pathId, node.pathId),
          gt(learningPathNode.orderIndex, node.orderIndex)
        )
      );

    await tx
      .update(learningPath)
      .set({ nodeCount: sql`GREATEST(${learningPath.nodeCount} - 1, 0)` })
      .where(eq(learningPath.id, node.pathId));
  });
}

export async function reorderNodes(
  pathId: string,
  nodeIds: string[]
): Promise<void> {
  await db().transaction(async (tx) => {
    for (let i = 0; i < nodeIds.length; i++) {
      await tx
        .update(learningPathNode)
        .set({ orderIndex: i })
        .where(
          and(
            eq(learningPathNode.id, nodeIds[i]),
            eq(learningPathNode.pathId, pathId)
          )
        );
    }
  });
}

// ─── Advanced Progress ───

export async function getOrCreateProgress(
  userId: string,
  pathId: string
): Promise<LearningPathProgress> {
  const existing = await getUserProgressForPath(userId, pathId);
  if (existing) return existing;

  const [result] = await db()
    .insert(learningPathProgress)
    .values({ id: getUuid(), userId, pathId })
    .onConflictDoNothing()
    .returning();

  if (!result) {
    const [refetched] = await db()
      .select()
      .from(learningPathProgress)
      .where(
        and(
          eq(learningPathProgress.userId, userId),
          eq(learningPathProgress.pathId, pathId)
        )
      );
    return refetched;
  }
  return result;
}

export async function advanceProgress(
  userId: string,
  pathId: string,
  completedOrderIndex: number,
  totalNodes: number
): Promise<LearningPathProgress> {
  const nextNode = completedOrderIndex + 1;
  const isCompleted = nextNode >= totalNodes;

  const [result] = await db()
    .insert(learningPathProgress)
    .values({
      id: getUuid(),
      userId,
      pathId,
      currentNode: nextNode,
      completed: isCompleted,
    })
    .onConflictDoUpdate({
      target: [learningPathProgress.userId, learningPathProgress.pathId],
      set: {
        currentNode: sql`GREATEST(${learningPathProgress.currentNode}, ${nextNode})`,
        completed: sql`${learningPathProgress.completed} OR ${isCompleted}`,
        updatedAt: new Date(),
      },
    })
    .returning();

  return result;
}

export async function getUserCompletedPathCount(
  userId: string
): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(learningPathProgress)
    .where(
      and(
        eq(learningPathProgress.userId, userId),
        eq(learningPathProgress.completed, true)
      )
    );
  return result?.count || 0;
}

// ─── Paywall ───

export async function checkNodeAccess(
  orderIndex: number,
  user: any | null
): Promise<{
  allowed: boolean;
  reason?: 'login_required' | 'subscription_required';
}> {
  if (orderIndex < FREE_NODE_LIMIT) return { allowed: true };

  if (!user) return { allowed: false, reason: 'login_required' };

  const sub = await getCurrentSubscription(user.id);
  if (!sub) return { allowed: false, reason: 'subscription_required' };

  return { allowed: true };
}
