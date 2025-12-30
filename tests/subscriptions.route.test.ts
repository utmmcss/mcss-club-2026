import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/parseCsv', () => ({
  fetchEventsFromSheet: vi.fn(async () => [
    { title: 'Future Event', date: '2026-03-15T04:00:00.000Z' },
    { title: 'Soon Event', date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() },
  ]),
}));

const mockSubscribeToEvent = vi.fn(async () => ({ created: true, alreadySubscribed: false }));
const mockUnsubscribeFromEvent = vi.fn(async () => ({ deleted: true }));
vi.mock('@/lib/brevo', async (importOriginal) => {
  const actual = await (importOriginal as any)();
  return Object.assign({}, actual, {
    subscribeToEvent: mockSubscribeToEvent as any,
    unsubscribeFromEvent: mockUnsubscribeFromEvent as any,
  });
});

const mockSendImmediate = vi.fn(async () => {});
vi.mock('@/lib/email/send', () => ({
  sendImmediateConfirmation: mockSendImmediate as any,
}));

describe('POST /api/subscriptions route', () => {
  beforeEach(() => {
    mockSubscribeToEvent.mockClear();
    mockUnsubscribeFromEvent.mockClear();
    mockSendImmediate.mockClear();
    mockSubscribeToEvent.mockResolvedValue({ created: true, alreadySubscribed: false });
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
    // Check that subscribeToEvent was called with a reminder ISO string (not null)
    const call = mockSubscribeToEvent.mock.calls[0] as any[];
    const reminderIso = call[4]; // 5th argument is reminderScheduledFor
    expect(reminderIso !== null).toBe(true);
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
    const call = mockSubscribeToEvent.mock.calls[0] as any[];
    const reminderIso = call[4]; // 5th argument is reminderScheduledFor
    expect(reminderIso).toBeNull();
  });

  it('skips confirmation on duplicate subscription (no resend)', async () => {
    mockSubscribeToEvent.mockResolvedValueOnce({ created: false, alreadySubscribed: true });
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
    mockUnsubscribeFromEvent.mockResolvedValueOnce({ deleted: true });

    const { DELETE } = await import('@/app/api/subscriptions/route');
    const req = new Request('http://localhost/api/subscriptions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'you@example.com', eventTitle: 'Future Event' }),
    });
    const res = await DELETE(req);
    expect(res.status).toBe(200);
  });

  it('DELETE gracefully returns 200 when no subscription exists', async () => {
    mockUnsubscribeFromEvent.mockResolvedValueOnce({ deleted: false });

    const { DELETE } = await import('@/app/api/subscriptions/route');
    const req = new Request('http://localhost/api/subscriptions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'you@example.com', eventTitle: 'Future Event' }),
    });
    const res = await DELETE(req);
    expect(res.status).toBe(200);
  });
});
