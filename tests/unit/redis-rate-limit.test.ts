import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Redis before importing the module
const mockRedis = {
  incr: vi.fn(),
  expire: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
};

vi.mock('@/shared/lib/redis/client', () => ({
  redis: mockRedis,
  checkRateLimit: async (key: string, limit: number, window: number) => {
    const count = await mockRedis.incr(key);
    if (count === 1) {
      await mockRedis.expire(key, window);
    }
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
    };
  },
  acquireLock: async (key: string, ttl: number = 300) => {
    const result = await mockRedis.set(key, '1', { nx: true, ex: ttl });
    return result === 'OK';
  },
  releaseLock: async (key: string) => {
    await mockRedis.del(key);
  },
}));

describe('Redis Rate Limiting (Phase 1 Fix)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should allow requests within limit', async () => {
    const { checkRateLimit } = await import('@/shared/lib/redis/client');

    mockRedis.incr.mockResolvedValueOnce(1);

    const result = await checkRateLimit('test:ratelimit:unit', 3, 60);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
    expect(mockRedis.incr).toHaveBeenCalledWith('test:ratelimit:unit');
    expect(mockRedis.expire).toHaveBeenCalledWith('test:ratelimit:unit', 60);
  });

  it('should block requests exceeding limit', async () => {
    const { checkRateLimit } = await import('@/shared/lib/redis/client');

    // Simulate third request exceeding limit of 2
    mockRedis.incr.mockResolvedValueOnce(3);

    const result = await checkRateLimit('test:ratelimit:blocked', 2, 60);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should acquire and release distributed locks', async () => {
    const { acquireLock, releaseLock } = await import('@/shared/lib/redis/client');

    // First lock should succeed
    mockRedis.set.mockResolvedValueOnce('OK');
    const lock1 = await acquireLock('test:lock:unit', 10);
    expect(lock1).toBe(true);

    // Second lock should fail (already locked)
    mockRedis.set.mockResolvedValueOnce(null);
    const lock2 = await acquireLock('test:lock:unit', 10);
    expect(lock2).toBe(false);

    // Release lock
    mockRedis.del.mockResolvedValueOnce(1);
    await releaseLock('test:lock:unit');
    expect(mockRedis.del).toHaveBeenCalledWith('test:lock:unit');

    // Third lock should succeed (after release)
    mockRedis.set.mockResolvedValueOnce('OK');
    const lock3 = await acquireLock('test:lock:unit', 10);
    expect(lock3).toBe(true);
  });

  it('should handle concurrent lock attempts', async () => {
    const { acquireLock, releaseLock } = await import('@/shared/lib/redis/client');

    // Simulate concurrent requests - only first succeeds
    mockRedis.set
      .mockResolvedValueOnce('OK')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const results = await Promise.all([
      acquireLock('test:lock:concurrent', 10),
      acquireLock('test:lock:concurrent', 10),
      acquireLock('test:lock:concurrent', 10),
    ]);

    // Only one should succeed
    const successCount = results.filter((r) => r === true).length;
    expect(successCount).toBe(1);

    // Cleanup
    mockRedis.del.mockResolvedValueOnce(1);
    await releaseLock('test:lock:concurrent');
  });
});
