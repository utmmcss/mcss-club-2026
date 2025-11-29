import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/parseCsv', () => ({
  fetchEventsFromSheet: vi.fn(async () => [
    { title: 'Future Event', date: '2026-03-15T04:00:00.000Z' },
    { title: 'Soon Event', date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() },
  ]),
}));

const mockSubscribe = vi.fn(async () => ({ id: 1, email: 'you@example.com', event_id: 'future-event-...' }));
vi.mock('@/lib/subscriptions', async (importOriginal) => {
  const actual = await (importOriginal as any)();
  return Object.assign({}, actual, {
    subscribe: mockSubscribe as any,
  });
});

const mockSendImmediate = vi.fn(async () => {});
vi.mock('@/lib/email/send', () => ({
  sendImmediateConfirmation: mockSendImmediate as any,
}));

describe('POST /api/subscriptions route', () => {
  beforeEach(() => {
    mockSubscribe.mockClear();
    mockSendImmediate.mockClear();
  });

  it('schedules a reminder 24h before for far-future event', async () => {
    const { POST } = await import('@/app/api/subscriptions/route');
    const req = new Request('http://localhost/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'you@example.com', eventTitle: 'Future Event' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockSendImmediate).toHaveBeenCalledTimes(1);
    // third arg should be a Date when >24h away
    const call = mockSubscribe.mock.calls[0] as any[];
    const reminderAt = call[2] as any;
    expect(reminderAt !== null).toBe(true);
  });

  it('does not schedule when within 24h (null reminder date)', async () => {
    const { POST } = await import('@/app/api/subscriptions/route');
    const req = new Request('http://localhost/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'you@example.com', eventTitle: 'Soon Event' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const call = mockSubscribe.mock.calls[0] as any[];
    const reminderAt = call[2];
    expect(reminderAt).toBeNull();
  });

  it('skips confirmation on duplicate subscription (no resend)', async () => {
    mockSubscribe.mockResolvedValueOnce(null);
    const { POST } = await import('@/app/api/subscriptions/route');
    const req = new Request('http://localhost/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'you@example.com', eventTitle: 'Future Event' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockSendImmediate).not.toHaveBeenCalled();
  });

  it('returns 404 when event is not found', async () => {
    const { fetchEventsFromSheet } = await import('@/lib/parseCsv');
    (fetchEventsFromSheet as any).mockResolvedValueOnce([]);

    const { POST } = await import('@/app/api/subscriptions/route');
    const req = new Request('http://localhost/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'you@example.com', eventTitle: 'Missing Event' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it('returns 400 when event start time is invalid', async () => {
    const { fetchEventsFromSheet } = await import('@/lib/parseCsv');
    (fetchEventsFromSheet as any).mockResolvedValueOnce([
      { title: 'Bad Event', date: 'not-a-date' },
    ]);

    const { POST } = await import('@/app/api/subscriptions/route');
    const req = new Request('http://localhost/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'you@example.com', eventTitle: 'Bad Event' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('DELETE unsubscribes an existing subscription', async () => {
    const { unsubscribe } = await import('@/lib/subscriptions');
    const unsubSpy = vi.spyOn(await import('@/lib/subscriptions'), 'unsubscribe').mockResolvedValueOnce({ deleted: true });

    const { DELETE } = await import('@/app/api/subscriptions/route');
    const req = new Request('http://localhost/api/subscriptions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'you@example.com', eventTitle: 'Future Event' }),
    });
    const res = await DELETE(req);
    expect(res.status).toBe(200);
    unsubSpy.mockRestore();
  });

  it('DELETE gracefully returns 200 when no subscription exists', async () => {
    const unsubSpy = vi.spyOn(await import('@/lib/subscriptions'), 'unsubscribe').mockResolvedValueOnce({ deleted: false });

    const { DELETE } = await import('@/app/api/subscriptions/route');
    const req = new Request('http://localhost/api/subscriptions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'you@example.com', eventTitle: 'Future Event' }),
    });
    const res = await DELETE(req);
    expect(res.status).toBe(200);
    unsubSpy.mockRestore();
  });
});
