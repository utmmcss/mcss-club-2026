// Run with Node 24: node lib/parseCsv.test.mjs
import assert from "node:assert/strict";
import { parseCsv, parseTime, torontoToIso } from "./parseCsv.ts";

const csv = 'a,b,c\r\n1,,3\r\n\r\n"x, y","say ""hi""","l1\nl2"\r\n,,\r\n';
assert.deepEqual(parseCsv(csv), [
  { a: "1", b: "", c: "3" },
  { a: "x, y", b: 'say "hi"', c: "l1\nl2" },
]);
assert.deepEqual(parseCsv("a,b\n1,2"), [{ a: "1", b: "2" }]);

assert.equal(parseTime("09:00"), "09:00:00");
assert.equal(parseTime("2:30 pm"), "14:30:00");
assert.equal(parseTime("12:00 AM"), "00:00:00");
assert.equal(parseTime(""), null);

for (const timeZone of ["UTC", "America/Toronto", "Pacific/Auckland"]) {
  process.env.TZ = timeZone;
  assert.equal(torontoToIso("2026-11-21", "09:00:00"), "2026-11-21T14:00:00.000Z", timeZone); // EST
  assert.equal(torontoToIso("2026-10-15", "17:00:00"), "2026-10-15T21:00:00.000Z", timeZone); // EDT
}
console.log("CSV parsing and Toronto time handling pass.");
