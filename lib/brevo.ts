/**
 * Brevo Contacts API for event subscriptions
 * Stores event subscriptions as contact attributes instead of a database
 */

const CONTACTS_API = "https://api.brevo.com/v3/contacts";

function getApiKey(): string {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error("BREVO_API_KEY is not set");
  return key;
}

interface EventSubscription {
  email: string;
  eventId: string;
  eventTitle: string;
  eventDate: string; // ISO string
  reminderScheduledFor: string | null; // ISO string or null
  subscribedAt: string; // ISO string
}

interface BrevoContact {
  email: string;
  attributes?: Record<string, any>;
  listIds?: number[];
}

/**
 * Subscribe a user to an event by creating/updating a Brevo contact
 */
export async function subscribeToEvent(
  email: string,
  eventId: string,
  eventTitle: string,
  eventDate: string,
  reminderScheduledFor: string | null
): Promise<{ created: boolean; alreadySubscribed: boolean }> {
  const apiKey = getApiKey();
  
  // First, check if contact exists and get their current subscriptions
  const existing = await getContact(email);
  
  // Parse existing subscriptions
  let subscriptions: EventSubscription[] = [];
  if (existing?.attributes?.EVENT_SUBSCRIPTIONS) {
    try {
      subscriptions = JSON.parse(existing.attributes.EVENT_SUBSCRIPTIONS);
    } catch {
      subscriptions = [];
    }
  }
  
  // Check if already subscribed to this event
  const alreadySubscribed = subscriptions.some(s => s.eventId === eventId);
  if (alreadySubscribed) {
    return { created: false, alreadySubscribed: true };
  }
  
  // Add new subscription
  subscriptions.push({
    email,
    eventId,
    eventTitle,
    eventDate,
    reminderScheduledFor,
    subscribedAt: new Date().toISOString(),
  });
  
  // Create or update contact
  const payload = {
    email,
    attributes: {
      EVENT_SUBSCRIPTIONS: JSON.stringify(subscriptions),
    },
    updateEnabled: true, // Update if exists
  };
  
  const res = await fetch(CONTACTS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok && res.status !== 204) {
    const text = await res.text().catch(() => "");
    // 400 with "Contact already exist" is fine since we use updateEnabled
    if (!text.includes("Contact already exist")) {
      throw new Error(`Brevo API error: ${res.status} ${text}`);
    }
  }
  
  return { created: true, alreadySubscribed: false };
}

/**
 * Unsubscribe a user from an event
 */
export async function unsubscribeFromEvent(
  email: string,
  eventId: string
): Promise<{ deleted: boolean }> {
  const apiKey = getApiKey();
  
  const existing = await getContact(email);
  if (!existing?.attributes?.EVENT_SUBSCRIPTIONS) {
    return { deleted: false };
  }
  
  let subscriptions: EventSubscription[] = [];
  try {
    subscriptions = JSON.parse(existing.attributes.EVENT_SUBSCRIPTIONS);
  } catch {
    return { deleted: false };
  }
  
  const before = subscriptions.length;
  subscriptions = subscriptions.filter(s => s.eventId !== eventId);
  
  if (subscriptions.length === before) {
    return { deleted: false };
  }
  
  // Update contact with removed subscription
  const res = await fetch(`${CONTACTS_API}/${encodeURIComponent(email)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      attributes: {
        EVENT_SUBSCRIPTIONS: JSON.stringify(subscriptions),
      },
    }),
  });
  
  if (!res.ok && res.status !== 204) {
    const text = await res.text().catch(() => "");
    throw new Error(`Brevo API error: ${res.status} ${text}`);
  }
  
  return { deleted: true };
}

/**
 * Get a contact by email
 */
async function getContact(email: string): Promise<BrevoContact | null> {
  const apiKey = getApiKey();
  
  const res = await fetch(`${CONTACTS_API}/${encodeURIComponent(email)}`, {
    method: "GET",
    headers: {
      "api-key": apiKey,
    },
  });
  
  if (res.status === 404) {
    return null;
  }
  
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Brevo API error: ${res.status} ${text}`);
  }
  
  return res.json();
}

/**
 * Get all subscriptions that need reminders sent
 * Fetches all contacts and filters by reminder time
 */
export async function getSubscriptionsDueForReminder(
  nowIso: string
): Promise<EventSubscription[]> {
  const apiKey = getApiKey();
  const nowMs = new Date(nowIso).getTime();
  const toleranceMs = 15 * 60 * 1000; // 15 minute window
  
  // Fetch contacts with EVENT_SUBSCRIPTIONS attribute
  // Brevo limits to 50 contacts per request by default
  let allSubscriptions: EventSubscription[] = [];
  let offset = 0;
  const limit = 50;
  
  while (true) {
    const res = await fetch(
      `${CONTACTS_API}?limit=${limit}&offset=${offset}&attributesSearchType=all`,
      {
        method: "GET",
        headers: {
          "api-key": apiKey,
        },
      }
    );
    
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Brevo API error: ${res.status} ${text}`);
    }
    
    const data = await res.json();
    const contacts = data.contacts || [];
    
    if (contacts.length === 0) break;
    
    for (const contact of contacts) {
      if (!contact.attributes?.EVENT_SUBSCRIPTIONS) continue;
      
      try {
        const subs: EventSubscription[] = JSON.parse(contact.attributes.EVENT_SUBSCRIPTIONS);
        for (const sub of subs) {
          // Check if reminder is due (within tolerance window)
          if (sub.reminderScheduledFor) {
            const reminderMs = new Date(sub.reminderScheduledFor).getTime();
            if (nowMs >= reminderMs - toleranceMs && nowMs <= reminderMs + toleranceMs) {
              allSubscriptions.push(sub);
            }
          }
        }
      } catch {
        // Skip invalid JSON
      }
    }
    
    offset += contacts.length;
    if (contacts.length < limit) break;
  }
  
  return allSubscriptions;
}

/**
 * Mark a subscription's reminder as sent by removing reminderScheduledFor
 */
export async function markReminderSent(
  email: string,
  eventId: string
): Promise<void> {
  const apiKey = getApiKey();
  
  const existing = await getContact(email);
  if (!existing?.attributes?.EVENT_SUBSCRIPTIONS) return;
  
  let subscriptions: EventSubscription[] = [];
  try {
    subscriptions = JSON.parse(existing.attributes.EVENT_SUBSCRIPTIONS);
  } catch {
    return;
  }
  
  // Update the subscription to mark reminder as sent
  subscriptions = subscriptions.map(s => {
    if (s.eventId === eventId) {
      return { ...s, reminderScheduledFor: null };
    }
    return s;
  });
  
  await fetch(`${CONTACTS_API}/${encodeURIComponent(email)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      attributes: {
        EVENT_SUBSCRIPTIONS: JSON.stringify(subscriptions),
      },
    }),
  });
}
