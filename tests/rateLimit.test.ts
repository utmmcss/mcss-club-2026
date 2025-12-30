import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { allow } from '@/lib/rateLimit';

function advanceWindow(windowMs: number) {
  // Fast-forward Date.now for window rollover
  const now = Date.now();
  vi.spyOn(Date, 'now').mockReturnValue(now + windowMs + 10);
}

describe('rateLimit allow() - in-memory', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('allows up to max within window and then blocks', () => {
    const windowMs = 200;
    const max = 3;
    const scope = 'test:mem';
    const key = 'abc-' + Date.now(); // unique key per test run

    const r1 = allow(scope, key, windowMs, max);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = allow(scope, key, windowMs, max);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = allow(scope, key, windowMs, max);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);

    const r4 = allow(scope, key, windowMs, max);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
    expect(r4.retryAfterMs).toBeGreaterThan(0);

    // Advance time past window to reset
    advanceWindow(windowMs);
    const r5 = allow(scope, key, windowMs, max);
    expect(r5.allowed).toBe(true);
    expect(r5.remaining).toBe(2);
  });

  it('uses separate buckets for different scopes', () => {
    const windowMs = 1000;
    const max = 1;
    const key = 'user-' + Date.now();

    const r1 = allow('scope-a', key, windowMs, max);
    expect(r1.allowed).toBe(true);

    const r2 = allow('scope-b', key, windowMs, max);
    expect(r2.allowed).toBe(true);

    // Same scope should now be blocked
    const r3 = allow('scope-a', key, windowMs, max);
    expect(r3.allowed).toBe(false);
  });
});
