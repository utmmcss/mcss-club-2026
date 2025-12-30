import { getSubscriptionsDueForReminder, markReminderSent } from "@/lib/brevo";
import { send24hReminder } from "@/lib/email/send";

export async function processEventReminders(nowIso?: string) {
	const now = nowIso ? new Date(nowIso) : new Date();

	const summary = { processedEvents: 0, processedSubs: 0, errors: [] as string[] };

	try {
		// Get all subscriptions that need reminders sent (from Brevo contacts)
		const subscriptions = await getSubscriptionsDueForReminder(now.toISOString());

		// Send reminders to each subscription
		for (const sub of subscriptions) {
			try {
				await send24hReminder(sub.email, {
					id: sub.eventId,
					title: sub.eventTitle,
					startTime: sub.eventDate,
					link: null,
					location: null,
				});
				
				await markReminderSent(sub.email, sub.eventId);
				summary.processedSubs += 1;
			} catch (err: any) {
				summary.errors.push(`${sub.email}/${sub.eventId}: ${String(err)}`);
			}
		}

		// Count unique events
		const uniqueEvents = new Set(subscriptions.map(s => s.eventId));
		summary.processedEvents = uniqueEvents.size;

	} catch (err: any) {
		summary.errors.push(`Global error: ${String(err)}`);
	}

	return summary;
}

