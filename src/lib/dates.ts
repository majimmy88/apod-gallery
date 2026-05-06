export const APOD_FIRST_DATE = "1995-06-16";
export const PAGE_SIZE = 9;

/** Format YYYY-MM-DD as "April 18, 2026" */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Format a date range as "April 18 – April 26, 2026" */
export function formatDateRange(startIso: string, endIso: string): string {
  const [sy, sm, sd] = startIso.split("-").map(Number);
  const [ey, em, ed] = endIso.split("-").map(Number);
  const start = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);

  const startStr = start.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    ...(sy !== ey ? { year: "numeric" } : {}),
  });
  const endStr = end.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}

/**
 * Return today's date as YYYY-MM-DD in US Eastern time.
 * NASA publishes APODs at midnight ET, so using ET avoids requesting a
 * "future" date when the server clock is already UTC-tomorrow.
 */
export function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
  }).format(new Date());
}

/** Add/subtract days from a YYYY-MM-DD string */
export function shiftDate(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Return the {startDate, endDate} for a given 1-indexed page number.
 * Page 1 = today and 8 days back. Page N steps back by PAGE_SIZE each time.
 * Clamped so startDate never goes before today-365.
 */
export function dateRangeForPage(
  page: number,
  today: string
): { startDate: string; endDate: string } {
  const endDate = shiftDate(today, -(page - 1) * PAGE_SIZE);
  const rawStart = shiftDate(endDate, -(PAGE_SIZE - 1));
  const floor = shiftDate(today, -365);
  const startDate = rawStart < floor ? floor : rawStart;
  return { startDate, endDate };
}

/** Total number of pages, capped at 365 days back */
export function maxPage(today: string): number {
  return Math.ceil(365 / PAGE_SIZE);
}

/** True if the given YYYY-MM-DD is valid, not in the future, and not before APOD_FIRST_DATE */
export function isValidApodDate(iso: string, today: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  return iso >= APOD_FIRST_DATE && iso <= today;
}
