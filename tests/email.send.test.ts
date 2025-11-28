import { beforeEach, describe, expect, it, vi } from 'vitest';

// Lazy import after mocks when needed

const API_URL = 'https://api.brevo.com/v3/smtp/email';

describe('email send helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    (global as any).fetch = vi.fn(async () => ({ ok: true, status: 200, statusText: 'OK', text: async () => '' }));
    process.env.BREVO_API_KEY = 'test-key';
    process.env.MAIL_FROM = 'sender@example.com';
    process.env.MAIL_FROM_NAME = 'Sender';
  });

  it('sends immediate confirmation with proper payload', async () => {
    const { sendImmediateConfirmation } = await import('@/lib/email/send');
    await sendImmediateConfirmation('user@example.com', { id: 'e1', title: 'Tech Talk', startTime: '2026-03-15T04:00:00.000Z' });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init]: any = (global.fetch as any).mock.calls[0];
    expect(url).toBe(API_URL);
    expect(init.method).toBe('POST');
    expect(init.headers['api-key']).toBe('test-key');
    const body = JSON.parse(init.body);
    expect(body.to[0].email).toBe('user@example.com');
    expect(body.subject).toContain('Subscribed');
  });

  it('sends 24h reminder with link and location if present', async () => {
    const { send24hReminder } = await import('@/lib/email/send');
    await send24hReminder('user@example.com', {
      id: 'e1',
      title: 'Tech Talk',
      startTime: '2026-03-15T04:00:00.000Z',
      link: 'https://example.com',
      location: 'Room 123',
    });

    const [, init]: any = (global.fetch as any).mock.calls[0];
    const body = JSON.parse(init.body);
    expect(body.subject).toContain('24 hours');
    expect(body.to[0].email).toBe('user@example.com');
  });
});
