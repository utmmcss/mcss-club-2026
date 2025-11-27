import { fetchEventsFromSheet } from "@/lib/parseCsv";
import { getSubscribersForEventPendingReminder, markReminderSent } from "@/lib/subscriptions";
import { send24hReminder } from "@/lib/email/send";

type RawEvent = Record<string, any>;

function parseIsoDate(value: string | undefined | null): string | null {
	if (!value) return null;
	const d = new Date(value);
	return isNaN(d.getTime()) ? null : d.toISOString();
}

function getStartTimeIso(e: RawEvent): string | null {
	return (
		parseIsoDate(e.date) ||
		parseIsoDate(e.start_date) ||
		parseIsoDate(e["start date"]) ||
		null
	);
}

function in24hWindow(nowMs: number, startMs: number, toleranceMs = 15 * 60 * 1000) {
	const twentyFourHoursMs = 24 * 60 * 60 * 1000;
	const windowStart = startMs - twentyFourHoursMs - toleranceMs;
	const windowEnd = startMs - twentyFourHoursMs + toleranceMs;
	return nowMs >= windowStart && nowMs <= windowEnd;
}

function makeEventId(title: string | undefined, startIso: string | null) {
	const base = (title || "event").toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
	return startIso ? `${base}-${startIso}` : base;
}

export async function processEventReminders(nowIso?: string) {
	const now = nowIso ? new Date(nowIso) : new Date();
	const nowMs = now.getTime();

	// 1) Fetch raw events from CSV/sheet
	const rows = (await fetchEventsFromSheet()) as RawEvent[];

	// 2) Filter events whose 24h-before window matches current time
	const dueEvents = rows
		.map((e) => {
			const startIso = getStartTimeIso(e);
			const startMs = startIso ? new Date(startIso).getTime() : NaN;
			const id = e.id || makeEventId(e.title || e.name, startIso);
			return { id, title: e.title || e.name, startIso, startMs, raw: e };
		})
		.filter((e) => !!e.startIso && !isNaN(e.startMs))
		.filter((e) => in24hWindow(nowMs, e.startMs));

	const summary = { processedEvents: 0, processedSubs: 0, errors: [] as string[] };

	// 3) For each due event, send to subscribers who have not yet been reminded
	for (const event of dueEvents) {
		try {
			const subs = await getSubscribersForEventPendingReminder(event.id);
			for (const s of subs) {
				try {
					await send24hReminder(s.email, {
						id: event.id,
						title: String(event.title || "Untitled"),
						startTime: event.startIso!,
						link: event.raw?.link ?? null,
						location: event.raw?.location ?? null,
					});
					await markReminderSent(s.id, new Date().toISOString());
					summary.processedSubs += 1;
				} catch (err: any) {
					summary.errors.push(`sub ${s.id}: ${String(err)}`);
				}
			}
			summary.processedEvents += 1;
		} catch (err: any) {
			summary.errors.push(`event ${event.id}: ${String(err)}`);
		}
	}

	return summary;
}

