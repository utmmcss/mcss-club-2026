export async function fetchEventsFromSheet() {
  const url = process.env.NEXT_PUBLIC_EVENTS_SHEET_URL;
  const res = await fetch(url);
  const text = await res.text();

  const parseCsvLine = (line: string) =>
    line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map((v) => {
      v = v.trim();
      if (v.startsWith('"') && v.endsWith('"')) {
        v = v.slice(1, -1);
      }
      return v;
    }) ?? [];

  const lines = text.split("\n").filter((l) => l.trim() !== "");
  const headers = parseCsvLine(lines[0]).map((h) => h.trim());

  const json = lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    const obj: Record<string, string> = {};

    headers.forEach((header, i) => {
      obj[header] = cols[i] ? cols[i].trim() : "";
    });

    return obj;
  });

  return json.map((e) => ({
    ...e,
    isUpcoming: (e.isUpcoming || e.upcoming || "").toString().toLowerCase() === "true"
  }));
}
