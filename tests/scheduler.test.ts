import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/parseCsv', () => ({
  fetchEventsFromSheet: vi.fn(async () => [
    { title: 'Due Soon', date: '2026-03-15T04:00:00.000Z' },
  ]),
}));

const mockGetSubs = vi.fn(async () => [
  { id: 1, email: 'a@example.com', event_id: 'due-soon-2026-03-15T04:00:00.000Z', reminder_scheduled_for: '2026-03-14T04:00:00.000Z' },
  { id: 2, email: 'b@example.com', event_id: 'due-soon-2026-03-15T04:00:00.000Z', reminder_scheduled_for: null }, // should be excluded
]);
vi.mock('@/lib/subscriptions', () => ({
  getSubscribersForEventPendingReminder: mockGetSubs as any,
  markReminderSent: vi.fn(async () => {}),
}));

vi.mock('@/lib/email/send', () => ({
  send24hReminder: vi.fn(async () => {}),
}));

describe('processEventReminders', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('processes due events and marks reminders sent', async () => {
    const now = new Date('2026-03-14T04:00:00.000Z'); // exactly 24h before
    const { processEventReminders } = await import('@/lib/scheduler');

    const summary = await processEventReminders(now.toISOString());

    expect(summary.processedEvents).toBe(1);
    expect(summary.processedSubs).toBe(1);

    const { send24hReminder } = await import('@/lib/email/send');
    const { markReminderSent } = await import('@/lib/subscriptions');
    expect((send24hReminder as any).mock.calls.length).toBe(1);
    expect((markReminderSent as any).mock.calls.length).toBe(1);
  });
});
