import { NextResponse } from "next/server";
import { fetchEventsFromSheet } from "@/lib/parseCsv";

function parseDate(value: string) {
  if (!value) return null;
  const s = String(value).trim();
  if (!s) return null;

  // Try native parse first
  let d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString();

  // Fallback: parse common MM/DD/YYYY or M/D/YYYY
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const mm = parseInt(m[1], 10);
    const dd = parseInt(m[2], 10);
    const yyyy = parseInt(m[3], 10);
    d = new Date(yyyy, mm - 1, dd);
    if (!isNaN(d.getTime())) return d.toISOString();
  }

  return null;
}

function parseTime(value: string) {
  if (!value) return null;
  const v = String(value).trim();
  if (!v) return null;

  let d = new Date(`1970-01-01T${v}`);
  if (!isNaN(d.getTime())) return d.toISOString().substring(11, 19);

  d = new Date(`1970-01-01T${v}:00`);
  if (!isNaN(d.getTime())) return d.toISOString().substring(11, 19);

  d = new Date(`1970-01-01 ${v}`);
  if (!isNaN(d.getTime())) return d.toISOString().substring(11, 19);

  const m = v.match(/^(\d{1,2}):?(\d{2})\s*([ap]m)?$/i);
  if (m) {
    let hh = parseInt(m[1], 10);
    const mm = parseInt(m[2] || '0', 10);
    const ampm = m[3];
    if (ampm) {
      if (/pm/i.test(ampm) && hh < 12) hh += 12;
      if (/am/i.test(ampm) && hh === 12) hh = 0;
    }
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00`;
  }

  return null;
}

function cleanEvent(raw: Record<string, any>) {
  const mapKey = (k: string) => {
    const lower = k.toLowerCase().trim();
    if (lower === "title" || lower === "name") return "title";
    if (lower === "description" || lower === "desc") return "description";
    if (lower === "date") return "date";
    if (lower === "location" || lower === "venue") return "location";
    if (lower === "isupcoming" || lower === "upcoming") return "isUpcoming";
    if (lower === "starttime" || lower === "start time" || lower === "start_time") return "startTime";
    if (lower === "endtime" || lower === "end time" || lower === "end_time") return "endTime";
    if (lower === "link") return "link";
    return lower;
  };

  const out: any = {};
  for (const k of Object.keys(raw)) {
    const nk = mapKey(k);
    out[nk] = raw[k];
  }

  out.isUpcoming = Boolean(out.isupcoming || out.isUpcoming || out["isUpcoming"]);
  if (typeof out.isUpcoming === "string") {
    out.isUpcoming = out.isUpcoming.toLowerCase() === "true";
  }

  out.date = parseDate(out.date || out.start_date || out["start date"] || "");

  out.startTime = parseTime(out.startTime || out.starttime || out["start time"] || "");
  out.endTime = parseTime(out.endTime || out.endtime || out["end time"] || "");

  out.startDateTime = null;
  out.endDateTime = null;
  if (out.date && out.startTime) {
    const datePart = typeof out.date === 'string' ? out.date.split('T')[0] : null;
    if (datePart) {
      const sd = new Date(`${datePart}T${out.startTime}`);
      if (!isNaN(sd.getTime())) out.startDateTime = sd.toISOString();
    }
  }
  if (out.date && out.endTime) {
    const datePart = typeof out.date === 'string' ? out.date.split('T')[0] : null;
    if (datePart) {
      const ed = new Date(`${datePart}T${out.endTime}`);
      if (!isNaN(ed.getTime())) out.endDateTime = ed.toISOString();
    }
  }

  out.id = out.id || `${(out.title || "event").toString().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${out.date || ""}`;

  return out;
}

export async function GET() {
  try {
    const raw = await fetchEventsFromSheet();
    const cleaned = (raw || []).map(cleanEvent);
    return NextResponse.json({ events: cleaned }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
