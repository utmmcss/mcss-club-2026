import { getRedis } from '@/lib/redis';

type Key = string;

class Bucket {
  windowMs: number;
  max: number;
  hits: Map<Key, { count: number; resetAt: number }>; 
  constructor(windowMs: number, max: number) {
    this.windowMs = windowMs;
    this.max = max;
    this.hits = new Map();
  }
  allow(key: Key) {
    const now = Date.now();
    const entry = this.hits.get(key);
    if (!entry || now >= entry.resetAt) {
      this.hits.set(key, { count: 1, resetAt: now + this.windowMs });
      return { allowed: true, remaining: this.max - 1, retryAfterMs: 0 };
    }
    if (entry.count >= this.max) {
      return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now };
    }
    entry.count += 1;
    return { allowed: true, remaining: this.max - entry.count, retryAfterMs: 0 };
  }
}

const buckets: Record<string, Bucket> = {};

export function getBucket(name: string, windowMs: number, max: number) {
  const k = `${name}:${windowMs}:${max}`;
  if (!buckets[k]) buckets[k] = new Bucket(windowMs, max);
  return buckets[k];
}

export function getClientIp(req: Request) {
  // Next.js Request headers available in App Router
  const h = req.headers;
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'unknown'
  );
}

// Unified allow() that uses Redis fixed-window if available, falls back to in-memory
export async function allow(
  scope: string,
  key: string,
  windowMs: number,
  max: number
): Promise<{ allowed: boolean; remaining: number; retryAfterMs: number }> {
  const redis = await getRedis();
  if (redis) {
    const now = Date.now();
    const windowStart = Math.floor(now / windowMs) * windowMs;
    const windowKey = `rl:${scope}:${key}:${windowStart}`;
    const count = await redis.incr(windowKey);
    if (count === 1) {
      await redis.pExpire(windowKey, windowMs);
    }
    if (count > max) {
      const ttl = await redis.pTTL(windowKey);
      return { allowed: false, remaining: 0, retryAfterMs: ttl > 0 ? ttl : windowMs };
    }
    return { allowed: true, remaining: Math.max(0, max - count), retryAfterMs: 0 };
  }
  // Fallback in-memory bucket
  const bucket = getBucket(scope, windowMs, max);
  return bucket.allow(key);
}
