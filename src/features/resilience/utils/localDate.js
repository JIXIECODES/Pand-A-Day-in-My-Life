export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey) {
  if (typeof dateKey !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const candidate = new Date(year, month - 1, day);
  if (
    candidate.getFullYear() !== year ||
    candidate.getMonth() !== month - 1 ||
    candidate.getDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

export function isValidDateKey(dateKey) {
  return Boolean(parseDateKey(dateKey));
}

export function calendarDayDifference(previousDateKey, currentDateKey) {
  const previous = parseDateKey(previousDateKey);
  const current = parseDateKey(currentDateKey);
  if (!previous || !current) return null;

  const previousUtc = Date.UTC(previous.year, previous.month - 1, previous.day);
  const currentUtc = Date.UTC(current.year, current.month - 1, current.day);

  return Math.round((currentUtc - previousUtc) / 86400000);
}