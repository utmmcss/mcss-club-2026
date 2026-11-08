import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Event dates are calendar days stored at UTC midnight, not local timestamps.
export function formatEventDate(iso?: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-CA", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

export function formatToLocalDateTime(iso?: string | null, options?: { date?: boolean; time?: boolean }) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;

  const showDate = options?.date ?? true;
  const showTime = options?.time ?? true;

  const parts: string[] = [];
  if (showDate) parts.push(d.toLocaleDateString());
  if (showTime) parts.push(d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }));

  return parts.join(" ");
}
