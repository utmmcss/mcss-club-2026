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
  
  // Clean up expired entries periodically to prevent memory leaks
  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.hits) {
      if (now >= entry.resetAt) {
        this.hits.delete(key);
      }
    }
  }
  
  allow(key: Key) {
    const now = Date.now();
    
    // Cleanup old entries every 100 requests
    if (this.hits.size > 100) {
      this.cleanup();
    }
    
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

/**
 * Get client IP address from request headers.
 * Handles common proxy headers used by Netlify, Vercel, Cloudflare, etc.
 * Note: These headers can be spoofed if not behind a trusted proxy.
 */
export function getClientIp(req: Request): string {
  const h = req.headers;
  
  // Cloudflare
  const cfConnectingIp = h.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();
  
  // Vercel / Netlify / Generic proxies
  const xForwardedFor = h.get('x-forwarded-for');
  if (xForwardedFor) {
    // Take the first IP (original client), not subsequent proxies
    const firstIp = xForwardedFor.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }
  
  // Nginx proxy
  const xRealIp = h.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();
  
  // AWS ALB / API Gateway
  const xClientIp = h.get('x-client-ip');
  if (xClientIp) return xClientIp.trim();
  
  // Fallback - useful for local dev
  return 'unknown';
}

/**
 * Rate limiting using in-memory fixed-window algorithm.
 * Simple and works well for single-instance deployments.
 */
export function allow(
  scope: string,
  key: string,
  windowMs: number,
  max: number
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const bucket = getBucket(scope, windowMs, max);
  return bucket.allow(key);
}
