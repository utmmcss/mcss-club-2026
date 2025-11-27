import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidEmail(email: string) {
  const e = (email || "").trim();
  if (!e || e.length > 254) return false;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(e);
}

function parseDate(value: string) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export function cleanEvent(raw: Record<string, any>) {
  const mapKey = (k: string) => {
    const lower = k.toLowerCase().trim();
    if (lower === "title" || lower === "name") return "title";
    if (lower === "description" || lower === "desc") return "description";
    if (lower === "date") return "date";
    if (lower === "location" || lower === "venue") return "location";
    if (lower === "isupcoming" || lower === "upcoming") return "isUpcoming";
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
  out.id = out.id || `${(out.title || "event").toString().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${out.date || ""}`;

  return out;
}
