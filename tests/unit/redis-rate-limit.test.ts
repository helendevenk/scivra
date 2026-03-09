import { describe, it, expect, beforeAll } from 'vitest';
import { redis, checkRateLimit, acquireLock, releaseLock } from '@/shared/lib/redis';

describe('Redis Rate Limiting (Phase 1 Fix)', () => {
  beforeAll(async () => {
    // Clean up test keys
    await redis.del('test:ratelimit:unit');
    await redis.del('test:lock:unit');
  });

  it('should allow requests within limit', async () => {
    const key = 'test:ratelimit:unit:' + Date.now();
    const result = await checkRateLimit(key, 3, 60);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);

    // Cleanup
    await redis.del(key);
  });

  it('should block requests exceeding limit', async () => {
    const key = 'test:ratelimit:unit:' + Date.now();

    // Use up the limit
    await checkRateLimit(key, 2, 60);
    await checkRateLimit(key, 2, 60);

    // This should be blocked
    const result = await checkRateLimit(key, 2, 60);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);

    // Cleanup
    await redis.del(key);
  });

  it('should acquire and release distributed locks', async () => {
    const key = 'test:lock:unit:' + Date.now();

    // First lock should succeed
    const lock1 = await acquireLock(key, 10);
    expect(lock1).toBe(true);

    // Second lock should fail (already locked)
    const lock2 = await acquireLock(key, 10);
    expect(lock2).toBe(false);

    // Release lock
    await releaseLock(key);

    // Third lock should succeed (after release)
    const lock3 = await acquireLock(key, 10);
    expect(lock3).toBe(true);

    // Cleanup
    await releaseLock(key);
  });

  it('should handle concurrent lock attempts', async () => {
    const key = 'test:lock:unit:concurrent:' + Date.now();

    // Simulate concurrent requests
    const results = await Promise.all([
      acquireLock(key, 10),
      acquireLock(key, 10),
      acquireLock(key, 10),
    ]);

    // Only one should succeed
    const successCount = results.filter(r => r === true).length;
    expect(successCount).toBe(1);

    // Cleanup
    await releaseLock(key);
  });
});
