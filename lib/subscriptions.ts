import { query } from "@/lib/db";

// parameters are validated in the route handler
// reminderAtIso: pass the 24h-before timestamp or null if not scheduling yet
export async function subscribe(
    email: string,
    eventID: string,
    reminderAtIso?: Date | null
): Promise<{ id: number; email: string; event_id: string } | null> {
    const sql = `
        INSERT INTO subscriptions (email, event_id, created_at, reminder_scheduled_for)
        VALUES ($1, $2, NOW(), $3)
        ON CONFLICT (email, event_id)
        DO NOTHING
        RETURNING id, email, event_id;
    `;

    const params = [email, eventID, reminderAtIso ?? null];
    const res = await query<{ id: number; email: string; event_id: string }>(sql, params);
    return res.rows[0] ?? null;
}

// List subscribers for an event that have not received the 24h reminder yet
export async function getSubscribersForEventPendingReminder(
    eventID: string
): Promise<{ id: number; email: string; event_id: string; reminder_scheduled_for: string | null }[]> {
    const sql = `
        SELECT id, email, event_id, reminder_scheduled_for
        FROM subscriptions
        WHERE event_id = $1
            AND reminder_sent_at IS NULL
            AND reminder_scheduled_for IS NOT NULL
    `;
    const res = await query<{ id: number; email: string; event_id: string; reminder_scheduled_for: string | null }>(sql, [eventID]);
    return res.rows;
}

// Mark a subscription as reminded at the given timestamp (ISO)
export async function markReminderSent(id: number, sentAtIso: string): Promise<void> {
    const sql = `
        UPDATE subscriptions
        SET reminder_sent_at = $2,
            last_notified_at = $2,
            updated_at = NOW()
        WHERE id = $1
    `;
    await query(sql, [id, sentAtIso]);
}

