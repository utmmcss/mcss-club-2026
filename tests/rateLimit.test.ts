import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

function advanceWindow(windowMs: number) {
  // Fast-forward Date.now for window rollover
  const now = Date.now();
  vi.spyOn(Date, 'now').mockReturnValue(now + windowMs + 10);
}

describe('rateLimit allow() - in-memory fallback', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    // Mock redis module to return null so we use memory bucket
    vi.doMock('@/lib/redis', () => ({ getRedis: vi.fn().mockResolvedValue(null) }));
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('allows up to max within window and then blocks', async () => {
    const windowMs = 200;
    const max = 3;
    const scope = 'test:mem';
    const key = 'abc';

    const { allow } = await import('@/lib/rateLimit');
    const r1 = await allow(scope, key, windowMs, max);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = await allow(scope, key, windowMs, max);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = await allow(scope, key, windowMs, max);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);

    const r4 = await allow(scope, key, windowMs, max);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
    expect(r4.retryAfterMs).toBeGreaterThan(0);

    // Advance time past window to reset
    advanceWindow(windowMs);
    const r5 = await allow(scope, key, windowMs, max);
    expect(r5.allowed).toBe(true);
    expect(r5.remaining).toBe(2);
  });
});

describe('rateLimit allow() - Redis path', () => {
  const incr = vi.fn();
  const pExpire = vi.fn();
  const pTTL = vi.fn();
  const fakeRedis: any = {
    incr,
    pExpire,
    pTTL,
  };

  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    incr.mockReset();
    pExpire.mockReset();
    pTTL.mockReset();
  });

  it('sets expiry on first hit and blocks after max', async () => {
    // Mock redis module to return our fake client
    vi.doMock('@/lib/redis', () => ({ getRedis: vi.fn().mockResolvedValue(fakeRedis) }));

    const windowMs = 200;
    const max = 2;
    const scope = 'test:redis';
    const key = 'xyz';

    // First call -> incr returns 1, set expire called
    incr.mockResolvedValueOnce(1);
    const { allow } = await import('@/lib/rateLimit');
    const r1 = await allow(scope, key, windowMs, max);
    expect(r1.allowed).toBe(true);
    expect(pExpire).toHaveBeenCalledTimes(1);

    // Second call -> incr returns 2, still allowed
    incr.mockResolvedValueOnce(2);
    const r2 = await allow(scope, key, windowMs, max);
    expect(r2.allowed).toBe(true);

    // Third call -> incr returns 3 (>max), should block and use TTL
    incr.mockResolvedValueOnce(3);
    pTTL.mockResolvedValueOnce(150);
    const r3 = await allow(scope, key, windowMs, max);
    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);
    expect(r3.retryAfterMs).toBeGreaterThan(0);
  });
});
