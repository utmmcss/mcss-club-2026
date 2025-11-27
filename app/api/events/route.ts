import { NextResponse } from "next/server";
import { fetchEventsFromSheet } from "@/lib/parseCsv";
import { cleanEvent } from "@/lib/utils";

export async function GET() {
  try {
    const raw = await fetchEventsFromSheet();
    const cleaned = (raw || []).map(cleanEvent);
    return NextResponse.json({ events: cleaned }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
