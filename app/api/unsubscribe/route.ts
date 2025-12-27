import { NextResponse } from "next/server";
import { parseUnsubscribeToken } from "@/lib/email/send";
import { unsubscribe } from "@/lib/subscriptions";
import { fetchEventsFromSheet } from "@/lib/parseCsv";

function normalizeTitle(value: string | undefined | null) {
  return (value || "").trim();
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
    parseIsoDate(row["start date"]) ||
    null
  );
}

function makeEventId(title: string, startIso: string | null) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return startIso ? `${base}-${startIso}` : base;
}

async function getEventId(eventTitle: string): Promise<string | null> {
  const raw = await fetchEventsFromSheet();
  const want = normalizeTitle(eventTitle);
  const row = (raw || []).find(
    (r: any) => normalizeTitle(r.title) === want || normalizeTitle(r.name) === want
  );
  if (!row) return null;
  
  const startIso = getStartIso(row);
  const r = row as any;
  const title = normalizeTitle(r.title || r.name || "Untitled");
  return r.id || makeEventId(title, startIso);
}

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const parsed = parseUnsubscribeToken(token);
    if (!parsed) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const { email, eventTitle } = parsed;
    
    // Get the event ID from the title
    const eventId = await getEventId(eventTitle);
    if (!eventId) {
      // Event might have been removed, but we should still try to unsubscribe by title
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const result = await unsubscribe(email, eventId);
    
    if (result.deleted) {
      return NextResponse.json({ message: "Unsubscribed successfully" }, { status: 200 });
    }
    
    // No subscription found - might have already unsubscribed
    return NextResponse.json({ message: "No subscription found" }, { status: 200 });
    
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
