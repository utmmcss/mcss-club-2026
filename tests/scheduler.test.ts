import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGetSubscriptionsDueForReminder = vi.fn(async () => [
  { 
    email: 'a@example.com', 
    eventId: 'due-soon-2026-03-15T04:00:00.000Z', 
    eventTitle: 'Due Soon',
    eventDate: '2026-03-15T04:00:00.000Z',
    reminderScheduledFor: '2026-03-14T04:00:00.000Z',
    subscribedAt: '2026-03-01T00:00:00.000Z'
  },
]);
const mockMarkReminderSent = vi.fn(async () => {});

vi.mock('@/lib/brevo', () => ({
  getSubscriptionsDueForReminder: mockGetSubscriptionsDueForReminder as any,
  markReminderSent: mockMarkReminderSent as any,
}));

const mockSend24hReminder = vi.fn(async () => {});
vi.mock('@/lib/email/send', () => ({
  send24hReminder: mockSend24hReminder as any,
}));

describe('processEventReminders', () => {
  beforeEach(() => {
    vi.useRealTimers();
    mockGetSubscriptionsDueForReminder.mockClear();
    mockMarkReminderSent.mockClear();
    mockSend24hReminder.mockClear();
  });

  it('processes due events and marks reminders sent', async () => {
    const now = new Date('2026-03-14T04:00:00.000Z'); // exactly 24h before
    const { processEventReminders } = await import('@/lib/scheduler');

    const summary = await processEventReminders(now.toISOString());

    expect(summary.processedEvents).toBe(1);
    expect(summary.processedSubs).toBe(1);

    expect(mockSend24hReminder.mock.calls.length).toBe(1);
    expect(mockMarkReminderSent.mock.calls.length).toBe(1);
  });
});
