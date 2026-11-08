// Run with Node 24: node lib/utils.test.mjs
import assert from "node:assert/strict";
import { formatEventDate } from "./utils.ts";

for (const timeZone of ["UTC", "America/Toronto", "America/Los_Angeles", "Pacific/Auckland"]) {
  process.env.TZ = timeZone;
  assert.equal(formatEventDate("2026-10-29T00:00:00.000Z"), "October 29, 2026", timeZone);
  assert.equal(formatEventDate("2026-01-01T00:00:00.000Z"), "January 1, 2026", timeZone);
  assert.equal(formatEventDate("2024-02-29"), "February 29, 2024", timeZone);
  assert.equal(formatEventDate("invalid"), null);
  assert.equal(formatEventDate(""), null);
  assert.equal(formatEventDate(null), null);
  assert.equal(formatEventDate(), null);
}
console.log("Event dates retain their calendar day in all four time zones.");
