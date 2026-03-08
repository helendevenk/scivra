import { Redis } from '@upstash/redis';

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Check rate limit for a given key
 * @param key - Unique identifier for the rate limit (e.g., "upg:anon:192.168.1.1")
 * @param limit - Maximum number of requests allowed
 * @param window - Time window in seconds
 * @returns Object with allowed status and remaining count
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  window: number
): Promise<{ allowed: boolean; remaining: number }> {
  const count = await redis.incr(key);

  // Set expiration on first increment
  if (count === 1) {
    await redis.expire(key, window);
  }

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
  };
}

/**
 * Acquire a distributed lock
 * @param key - Lock key (e.g., "upg:lock:user123")
 * @param ttl - Time to live in seconds (default: 300 = 5 minutes)
 * @returns true if lock acquired, false otherwise
 */
export async function acquireLock(
  key: string,
  ttl: number = 300
): Promise<boolean> {
  const result = await redis.set(key, '1', { nx: true, ex: ttl });
  return result === 'OK';
}

/**
 * Release a distributed lock
 * @param key - Lock key
 */
export async function releaseLock(key: string): Promise<void> {
  await redis.del(key);
}
