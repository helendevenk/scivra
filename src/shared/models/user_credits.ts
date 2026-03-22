import { eq, sql } from 'drizzle-orm';
import { db as getDb } from '@/core/db';
import { userCredits, type UserCredits, type NewUserCredits } from '@/config/db/schema';

const db = getDb();

/**
 * User Credits Model
 *
 * Manages user credit balance with optimistic locking for concurrency control.
 * Uses version field to prevent race conditions during credit operations.
 */

export interface CreditOperationResult {
  success: boolean;
  currentBalance?: number;
  error?: string;
}

/**
 * Get or create user credits record
 */
export async function getOrCreateUserCredits(userId: string): Promise<UserCredits> {
  const existing = await db
    .select()
    .from(userCredits)
    .where(eq(userCredits.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  // Create new record
  const newRecord: NewUserCredits = {
    userId,
    totalCredits: 0,
    usedCredits: 0,
    version: 0,
  };

  const [created] = await db.insert(userCredits).values(newRecord).returning();
  return created;
}

/**
 * Get user credits balance
 */
export async function getUserCreditsBalance(userId: string): Promise<{
  total: number;
  used: number;
  available: number;
}> {
  const record = await getOrCreateUserCredits(userId);

  return {
    total: record.totalCredits,
    used: record.usedCredits,
    available: record.totalCredits - record.usedCredits,
  };
}

/**
 * Add credits to user (e.g., from purchase, gift, reward)
 *
 * Uses optimistic locking to prevent concurrent modification issues.
 */
export async function addUserCredits(
  userId: string,
  amount: number,
  maxRetries: number = 3
): Promise<CreditOperationResult> {
  if (amount <= 0) {
    return { success: false, error: 'Amount must be positive' };
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const record = await getOrCreateUserCredits(userId);

    // Optimistic lock: update only if version matches
    const result = await db
      .update(userCredits)
      .set({
        totalCredits: record.totalCredits + amount,
        version: record.version + 1,
      })
      .where(
        sql`${userCredits.userId} = ${userId} AND ${userCredits.version} = ${record.version}`
      )
      .returning();

    if (result.length > 0) {
      const updated = result[0];
      return {
        success: true,
        currentBalance: updated.totalCredits - updated.usedCredits,
      };
    }

    // Version mismatch, retry
    if (attempt < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50 * (attempt + 1)));
    }
  }

  return { success: false, error: 'Concurrent modification detected, please retry' };
}

/**
 * Spend credits (e.g., for UPG generation)
 *
 * Uses optimistic locking and checks available balance.
 */
export async function spendUserCredits(
  userId: string,
  amount: number,
  maxRetries: number = 3
): Promise<CreditOperationResult> {
  if (amount <= 0) {
    return { success: false, error: 'Amount must be positive' };
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const record = await getOrCreateUserCredits(userId);
    const available = record.totalCredits - record.usedCredits;

    // Check if sufficient balance
    if (available < amount) {
      return {
        success: false,
        error: `Insufficient credits. Available: ${available}, Required: ${amount}`,
        currentBalance: available,
      };
    }

    // Optimistic lock: update only if version matches
    const result = await db
      .update(userCredits)
      .set({
        usedCredits: record.usedCredits + amount,
        version: record.version + 1,
      })
      .where(
        sql`${userCredits.userId} = ${userId} AND ${userCredits.version} = ${record.version}`
      )
      .returning();

    if (result.length > 0) {
      const updated = result[0];
      return {
        success: true,
        currentBalance: updated.totalCredits - updated.usedCredits,
      };
    }

    // Version mismatch, retry
    if (attempt < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50 * (attempt + 1)));
    }
  }

  return { success: false, error: 'Concurrent modification detected, please retry' };
}

/**
 * Refund credits (e.g., failed generation, cancellation)
 */
export async function refundUserCredits(
  userId: string,
  amount: number,
  maxRetries: number = 3
): Promise<CreditOperationResult> {
  if (amount <= 0) {
    return { success: false, error: 'Amount must be positive' };
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const record = await getOrCreateUserCredits(userId);

    // Ensure we don't refund more than used
    const refundAmount = Math.min(amount, record.usedCredits);

    // Optimistic lock: update only if version matches
    const result = await db
      .update(userCredits)
      .set({
        usedCredits: record.usedCredits - refundAmount,
        version: record.version + 1,
      })
      .where(
        sql`${userCredits.userId} = ${userId} AND ${userCredits.version} = ${record.version}`
      )
      .returning();

    if (result.length > 0) {
      const updated = result[0];
      return {
        success: true,
        currentBalance: updated.totalCredits - updated.usedCredits,
      };
    }

    // Version mismatch, retry
    if (attempt < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50 * (attempt + 1)));
    }
  }

  return { success: false, error: 'Concurrent modification detected, please retry' };
}

/**
 * Reset user credits (admin operation)
 */
export async function resetUserCredits(
  userId: string,
  totalCredits: number = 0
): Promise<CreditOperationResult> {
  const result = await db
    .update(userCredits)
    .set({
      totalCredits,
      usedCredits: 0,
      version: 0,
    })
    .where(eq(userCredits.userId, userId))
    .returning();

  if (result.length > 0) {
    return { success: true, currentBalance: totalCredits };
  }

  return { success: false, error: 'User credits record not found' };
}
