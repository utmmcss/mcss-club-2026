import { NextResponse } from 'next/server';
import { fetchEventsFromSheet } from '@/lib/parseCsv';
import { isValidEmail } from '@/lib/utils';
import { subscribeToEvent, unsubscribeFromEvent } from '@/lib/brevo';
import { getClientIp, allow } from '@/lib/rateLimit';
import { sendImmediateConfirmation } from '@/lib/email/send';

function normalizeTitle(value: string | undefined | null) {
    return (value || '').trim();
}

function parseIsoDate(value: string | undefined | null) {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d.toISOString();
}

function getStartIso(row: Record<string, any>) {
    return (
        parseIsoDate(row.date) ||
        parseIsoDate(row.start_date) ||
        parseIsoDate(row['start date']) ||
        null
    );
}

function makeEventId(title: string, startIso: string | null) {
    const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return startIso ? `${base}-${startIso}` : base;
}

async function getEvent(eventTitle: string) {
        const raw = await fetchEventsFromSheet();
        const want = normalizeTitle(eventTitle);
        // Look for matching title or name
        const row = (raw || []).find((r: any) => normalizeTitle((r as any).title) === want || normalizeTitle((r as any).name) === want);
        if (!row) {
            throw new Error('Event not found');
        }
        const startIso = getStartIso(row);
        if (!startIso) {
            throw new Error('Event start time is invalid');
        }
        const r: any = row as any;
        const title = normalizeTitle(r.title || r.name || 'Untitled');
        const id = r.id || makeEventId(title, startIso);
        const link = r.link || null;
        const location = r.location || r.venue || null;
        return { id, title, date: startIso, link, location } as { id: string; title: string; date: string; link: string | null; location: string | null };
}

// API Route Handler
export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        const ipRes = allow('subs:ip', ip, 10 * 60 * 1000, 20);
        if (!ipRes.allowed) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'retry-after': String(Math.ceil(ipRes.retryAfterMs / 1000)) } });
        }

        const { email, eventTitle } = await request.json();
        if (!isValidEmail(String(email))) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const emailKey = String(email).toLowerCase();
        const emailRes = allow('subs:email', emailKey, 60 * 60 * 1000, 5);
        if (!emailRes.allowed) {
            return NextResponse.json({ error: 'Too many requests for this email' }, { status: 429, headers: { 'retry-after': String(Math.ceil(emailRes.retryAfterMs / 1000)) } });
        }
        let event: { id: string; title: string; date: string; link: string | null; location: string | null };
        try {
            event = await getEvent(String(eventTitle));
        } catch (e: any) {
            const msg = String(e?.message || e || "");
            if (msg.includes("Event not found")) {
                return NextResponse.json({ error: 'Event not found' }, { status: 404 });
            }
            if (msg.includes("Event start time is invalid")) {
                return NextResponse.json({ error: 'Event start time invalid' }, { status: 400 });
            }
            throw e;
        }

        const nowMs = Date.now();
        const startMs = new Date(event.date).getTime();
        if (isNaN(startMs)) {
          return NextResponse.json({ error: 'Event start time invalid' }, { status: 400 });
        }
        if (nowMs >= startMs) {
          return NextResponse.json({ error: 'Event already started or passed' }, { status: 400 });
        }
        const reminderMs = startMs - 24 * 60 * 60 * 1000;
        const reminderIso = nowMs >= reminderMs ? null : new Date(reminderMs).toISOString();

        // Subscribe via Brevo Contacts API
        const result = await subscribeToEvent(
            String(email),
            event.id,
            event.title,
            event.date,
            reminderIso
        );

        if (result.alreadySubscribed) {
            return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
        }

        // Send confirmation email for new subscription
        await sendImmediateConfirmation(
            String(email),
            { id: event.id, title: event.title, startTime: event.date }
        );

        return NextResponse.json({ message: 'Subscription successful' }, { status: 200 });

    } catch (err) {
        console.error('Subscribe error:', err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const ip = getClientIp(request);
        const ipRes = allow('unsub:ip', ip, 10 * 60 * 1000, 30);
        if (!ipRes.allowed) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'retry-after': String(Math.ceil(ipRes.retryAfterMs / 1000)) } });
        }

        const { email, eventTitle } = await request.json();
        if (!isValidEmail(String(email))) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const emailKey = String(email).toLowerCase();
        const emailRes = allow('unsub:email', emailKey, 60 * 60 * 1000, 10);
        if (!emailRes.allowed) {
            return NextResponse.json({ error: 'Too many requests for this email' }, { status: 429, headers: { 'retry-after': String(Math.ceil(emailRes.retryAfterMs / 1000)) } });
        }
        let event;
        try {
            event = await getEvent(String(eventTitle));
        } catch (e: any) {
            const msg = String(e?.message || e || "");
            if (msg.includes('Event not found')) {
                return NextResponse.json({ error: 'Event not found' }, { status: 404 });
            }
            if (msg.includes('Event start time is invalid')) {
                return NextResponse.json({ error: 'Event start time invalid' }, { status: 400 });
            }
            throw e;
        }
        // Unsubscribe via Brevo Contacts API
        const result = await unsubscribeFromEvent(String(email), event.id);
        if (result.deleted) {
            return NextResponse.json({ message: 'Unsubscribed' }, { status: 200 });
        }
        return NextResponse.json({ message: 'No subscription found' }, { status: 200 });
    } catch (err) {
        console.error('Unsubscribe error:', err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}