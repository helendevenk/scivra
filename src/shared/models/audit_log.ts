import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { db as getDb } from '@/core/db';
import { auditLog, type AuditLog, type NewAuditLog } from '@/config/db/schema';
import { nanoid } from 'nanoid';

const db = getDb();

/**
 * Audit Log Model
 *
 * Records all critical user actions for security and compliance.
 * Used for: security audits, debugging, compliance reporting.
 */

export interface CreateAuditLogParams {
  userId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface QueryAuditLogParams {
  userId?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Create audit log entry
 */
export async function createAuditLog(params: CreateAuditLogParams): Promise<AuditLog> {
  const newLog: NewAuditLog = {
    id: nanoid(),
    userId: params.userId,
    action: params.action,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
  };

  const [created] = await db.insert(auditLog).values(newLog).returning();
  return created;
}

/**
 * Query audit logs with filters
 */
export async function queryAuditLogs(params: QueryAuditLogParams): Promise<AuditLog[]> {
  const conditions = [];

  if (params.userId) {
    conditions.push(eq(auditLog.userId, params.userId));
  }

  if (params.action) {
    conditions.push(eq(auditLog.action, params.action));
  }

  if (params.resourceType) {
    conditions.push(eq(auditLog.resourceType, params.resourceType));
  }

  if (params.resourceId) {
    conditions.push(eq(auditLog.resourceId, params.resourceId));
  }

  if (params.startDate) {
    conditions.push(gte(auditLog.createdAt, params.startDate));
  }

  if (params.endDate) {
    conditions.push(lte(auditLog.createdAt, params.endDate));
  }

  let query = db
    .select()
    .from(auditLog)
    .orderBy(desc(auditLog.createdAt));

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  if (params.limit) {
    query = query.limit(params.limit) as any;
  }

  if (params.offset) {
    query = query.offset(params.offset) as any;
  }

  return await query;
}

/**
 * Get audit logs for a specific user
 */
export async function getUserAuditLogs(
  userId: string,
  limit: number = 50
): Promise<AuditLog[]> {
  return await db
    .select()
    .from(auditLog)
    .where(eq(auditLog.userId, userId))
    .orderBy(desc(auditLog.createdAt))
    .limit(limit);
}

/**
 * Get audit logs for a specific resource
 */
export async function getResourceAuditLogs(
  resourceType: string,
  resourceId: string,
  limit: number = 50
): Promise<AuditLog[]> {
  return await db
    .select()
    .from(auditLog)
    .where(
      and(
        eq(auditLog.resourceType, resourceType),
        eq(auditLog.resourceId, resourceId)
      )
    )
    .orderBy(desc(auditLog.createdAt))
    .limit(limit);
}

/**
 * Count audit logs by action
 */
export async function countAuditLogsByAction(
  action: string,
  startDate?: Date,
  endDate?: Date
): Promise<number> {
  const conditions = [eq(auditLog.action, action)];

  if (startDate) {
    conditions.push(gte(auditLog.createdAt, startDate));
  }

  if (endDate) {
    conditions.push(lte(auditLog.createdAt, endDate));
  }

  const result = await db
    .select()
    .from(auditLog)
    .where(and(...conditions));

  return result.length;
}
