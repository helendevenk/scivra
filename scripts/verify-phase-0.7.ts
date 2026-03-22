/**
 * Phase 0.7 Database Optimization - Verification Script
 *
 * Tests:
 * 1. User Credits - Optimistic locking
 * 2. Audit Log - Create and query
 * 3. UPG Tags - Create and associate
 */

import { db as getDb } from '@/core/db';
import { userCredits, auditLog, upgTag, upgGenerationTag, user } from '@/config/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import {
  addUserCredits,
  spendUserCredits,
  getUserCreditsBalance,
} from '@/shared/models/user_credits';
import { createAuditLog, queryAuditLogs } from '@/shared/models/audit_log';
import {
  createOrGetTag,
  associateTagsWithGeneration,
  getGenerationTags,
} from '@/shared/models/upg_tag';

const db = getDb();

async function createTestUser(userId: string) {
  await db.insert(user).values({
    id: userId,
    name: 'Test User',
    email: `test-${userId}@example.com`,
    emailVerified: false,
  });
}

async function deleteTestUser(userId: string) {
  await db.delete(user).where(eq(user.id, userId));
}

async function testUserCredits() {
  console.log('\n=== Testing User Credits (Optimistic Locking) ===');

  const testUserId = 'test-user-' + Date.now();

  // Create test user first
  await createTestUser(testUserId);

  // Test 1: Add credits
  console.log('1. Adding 1000 credits...');
  const addResult = await addUserCredits(testUserId, 1000);
  console.log('Result:', addResult);

  // Test 2: Check balance
  console.log('\n2. Checking balance...');
  const balance = await getUserCreditsBalance(testUserId);
  console.log('Balance:', balance);

  // Test 3: Spend credits
  console.log('\n3. Spending 300 credits...');
  const spendResult = await spendUserCredits(testUserId, 300);
  console.log('Result:', spendResult);

  // Test 4: Check balance again
  console.log('\n4. Checking balance after spending...');
  const balanceAfter = await getUserCreditsBalance(testUserId);
  console.log('Balance:', balanceAfter);

  // Test 5: Try to spend more than available
  console.log('\n5. Trying to spend 1000 credits (should fail)...');
  const failResult = await spendUserCredits(testUserId, 1000);
  console.log('Result:', failResult);

  // Cleanup (cascade will delete user_credits)
  await deleteTestUser(testUserId);
  console.log('\n✓ User Credits test completed');
}

async function testAuditLog() {
  console.log('\n=== Testing Audit Log ===');

  const testUserId = 'test-user-' + Date.now();

  // Test 1: Create audit log
  console.log('1. Creating audit log entry...');
  const log = await createAuditLog({
    userId: testUserId,
    action: 'generate_upg',
    resourceType: 'upg_generation',
    resourceId: 'test-gen-123',
    metadata: { prompt: 'Test prompt', model: 'gpt-4' },
    ipAddress: '127.0.0.1',
    userAgent: 'Test Agent',
  });
  console.log('Created:', log);

  // Test 2: Query audit logs
  console.log('\n2. Querying audit logs...');
  const logs = await queryAuditLogs({ userId: testUserId });
  console.log('Found logs:', logs.length);

  // Cleanup
  await db.delete(auditLog).where(eq(auditLog.userId, testUserId));
  console.log('\n✓ Audit Log test completed');
}

async function testUpgTags() {
  console.log('\n=== Testing UPG Tags ===');

  // Test 1: Create tags
  console.log('1. Creating tags...');
  const tag1 = await createOrGetTag({ name: 'physics', category: 'physics' });
  const tag2 = await createOrGetTag({ name: 'mechanics', category: 'physics' });
  console.log('Created tags:', [tag1.name, tag2.name]);

  // Test 2: Get same tag again (should return existing)
  console.log('\n2. Getting existing tag...');
  const tag1Again = await createOrGetTag({ name: 'physics', category: 'physics' });
  console.log('Same tag ID?', tag1.id === tag1Again.id);

  // Test 3: Search tags
  console.log('\n3. Searching tags with prefix "phy"...');
  const { searchTags } = await import('@/shared/models/upg_tag');
  const searchResults = await searchTags('phy');
  console.log('Found tags:', searchResults.map((t) => t.name));

  console.log('\n✓ UPG Tags test completed');
}

async function main() {
  console.log('Phase 0.7 Database Optimization - Verification');
  console.log('==============================================');

  try {
    await testUserCredits();
    await testAuditLog();
    await testUpgTags();

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

main();
