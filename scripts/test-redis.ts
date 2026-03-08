#!/usr/bin/env tsx

/**
 * Test Redis connection and rate limiting functionality
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env') });

import { redis, checkRateLimit, acquireLock, releaseLock } from '../src/shared/lib/redis';

async function testRedisConnection() {
  console.log('🔍 Testing Redis connection...\n');

  try {
    // Test 1: Basic ping
    console.log('Test 1: Basic connection');
    await redis.set('test:ping', 'pong', { ex: 10 });
    const result = await redis.get('test:ping');
    console.log(`✅ Ping test: ${result === 'pong' ? 'PASSED' : 'FAILED'}`);
    console.log();

    // Test 2: Rate limiting
    console.log('Test 2: Rate limiting (3 requests, limit 2)');
    const testKey = 'test:ratelimit:' + Date.now();

    const req1 = await checkRateLimit(testKey, 2, 60);
    console.log(`  Request 1: allowed=${req1.allowed}, remaining=${req1.remaining}`);

    const req2 = await checkRateLimit(testKey, 2, 60);
    console.log(`  Request 2: allowed=${req2.allowed}, remaining=${req2.remaining}`);

    const req3 = await checkRateLimit(testKey, 2, 60);
    console.log(`  Request 3: allowed=${req3.allowed}, remaining=${req3.remaining}`);

    console.log(`✅ Rate limit test: ${!req3.allowed ? 'PASSED' : 'FAILED'}`);
    console.log();

    // Test 3: Distributed lock
    console.log('Test 3: Distributed lock');
    const lockKey = 'test:lock:' + Date.now();

    const lock1 = await acquireLock(lockKey, 10);
    console.log(`  First lock attempt: ${lock1 ? 'acquired' : 'failed'}`);

    const lock2 = await acquireLock(lockKey, 10);
    console.log(`  Second lock attempt (should fail): ${lock2 ? 'acquired' : 'failed'}`);

    await releaseLock(lockKey);
    console.log(`  Lock released`);

    const lock3 = await acquireLock(lockKey, 10);
    console.log(`  Third lock attempt (should succeed): ${lock3 ? 'acquired' : 'failed'}`);

    await releaseLock(lockKey);
    console.log(`✅ Lock test: ${lock1 && !lock2 && lock3 ? 'PASSED' : 'FAILED'}`);
    console.log();

    // Cleanup
    await redis.del(testKey);
    await redis.del(lockKey);
    await redis.del('test:ping');

    console.log('🎉 All tests passed! Redis is working correctly.\n');
  } catch (error: any) {
    console.error('❌ Redis test failed:', error.message);
    process.exit(1);
  }
}

testRedisConnection();
