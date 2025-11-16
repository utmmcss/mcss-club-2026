export async function fetchEventsFromSheet() {
  const url = process.env.NEXT_PUBLIC_EVENTS_SHEET_URL;
  const res = await fetch(url);
  const text = await res.text();

  // Simple CSV → JSON parsing
  const rows = text.split("\n").map((r) => r.split(","));

  const headers = rows.shift(); // first row = column names

  const json = rows.map((row) => {
    let obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = row[i] ? row[i].trim() : "";
    });
    return obj;
  });

  // Normalize booleans
  return json.map((e) => ({
    ...e,
    isUpcoming: e.isUpcoming.toLowerCase() === "true"
  }));
}