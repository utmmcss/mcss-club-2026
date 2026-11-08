export function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const endRow = () => {
    row.push(field);
    field = "";
    if (row.some((f) => f.trim() !== "")) rows.push(row);
    row = [];
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c !== '"') field += c;
      else if (text[i + 1] === '"') { field += '"'; i++; }
      else quoted = false;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") endRow();
    else if (c !== "\r") field += c;
  }
  endRow();

  const headers = (rows[0] ?? []).map((h) => h.trim());

  const json = rows.slice(1).map((cols) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = (cols[i] ?? "").trim();
    });
    return obj;
  });

  return json;
}

export function parseTime(value: string) {
  const m = String(value || "").trim().match(/^(\d{1,2}):?(\d{2})(?::(\d{2}))?\s*([ap])?\.?m?\.?$/i);
  if (!m) return null;
  let hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  if (m[4]) {
    hh %= 12;
    if (m[4].toLowerCase() === "p") hh += 12;
  }
  if (hh > 23 || mm > 59) return null;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(hh)}:${p(mm)}:${m[3] ?? "00"}`;
}

const torontoFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  hourCycle: "h23",
  year: "numeric", month: "numeric", day: "numeric",
  hour: "numeric", minute: "numeric", second: "numeric",
});

// Toronto wall-clock "YYYY-MM-DD" + "HH:MM:SS" -> UTC ISO string, DST-aware.
export function torontoToIso(datePart: string, time: string) {
  const wall = Date.parse(`${datePart}T${time}Z`);
  if (isNaN(wall)) return null;
  const offsetAt = (t: number) => {
    const v = Object.fromEntries(torontoFmt.formatToParts(t).map((x) => [x.type, +x.value]));
    return Date.UTC(v.year, v.month - 1, v.day, v.hour, v.minute, v.second) - Math.floor(t / 1000) * 1000;
  };
  const guess = wall - offsetAt(wall); // two passes to ask toronto what time it meant
  return new Date(wall - offsetAt(guess)).toISOString();
}

export async function fetchEventsFromSheet() {
  const url = process.env.NEXT_PUBLIC_EVENTS_SHEET_URL;
  const res = await fetch(url);
  const json = parseCsv(await res.text());

  return json.map((e) => ({
    ...e,
    isUpcoming: (e.isUpcoming || e.upcoming || "").toString().toLowerCase() === "true"
  }));
}
