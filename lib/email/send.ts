const API_URL = "https://api.brevo.com/v3/smtp/email";

function getSender() {
  const email = process.env.MAIL_FROM || "";
  const name = process.env.MAIL_FROM_NAME || "";
  if (!email) throw new Error("MAIL_FROM is not set");
  return { email, name: name || undefined };
}

async function sendBrevo(payload: any) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY is not set");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Brevo send failed: ${res.status} ${res.statusText} ${text}`);
  }
}

export async function send24hReminder(
  email: string,
  event: {
    id: string;
    title: string;
    startTime: string;
    link?: string | null;
    location?: string | null;
  }
): Promise<void> {
  const sender = getSender();
  const subject = `Reminder: ${event.title} in 24 hours`;
  const dateFmt = new Date(event.startTime).toLocaleString("en-CA", { timeZone: "UTC" });
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
      <h2>Reminder: ${event.title}</h2>
      <p>Your event starts at <strong>${dateFmt} (UTC)</strong>.</p>
      ${event.location ? `<p>Location: ${event.location}</p>` : ""}
      ${event.link ? `<p><a href="${event.link}">Event Details</a></p>` : ""}
      <p>See you there!</p>
    </div>
  `;

  await sendBrevo({
    sender,
    to: [{ email }],
    subject,
    htmlContent: html,
  });
}

export async function sendImmediateConfirmation(
  email: string,
  event: { id: string; title: string; startTime?: string | null }
): Promise<void> {
  const sender = getSender();
  const subject = `Subscribed: ${event.title}`;
  const when = event.startTime ? new Date(event.startTime).toLocaleString("en-CA", { timeZone: "UTC" }) : "soon";
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
      <h2>You're subscribed to ${event.title}</h2>
      <p>We'll send you a reminder 24 hours before the event.</p>
      <p>Event time: <strong>${when} (UTC)</strong></p>
    </div>
  `;
  await sendBrevo({ sender, to: [{ email }], subject, htmlContent: html });
}
