export const DEFAULT_TIME_ZONE = "America/Toronto";
export const TIME_ZONE_STORAGE_KEY = "panda-day-time-zone";

export const TIME_ZONE_GROUPS = [
  {
    label: "Canada",
    options: [
      { value: "America/Toronto", label: "Toronto \u2014 Eastern Time", city: "Toronto" },
      { value: "America/Vancouver", label: "Vancouver \u2014 Pacific Time", city: "Vancouver" },
      { value: "America/Edmonton", label: "Edmonton \u2014 Mountain Time", city: "Edmonton" },
      { value: "America/Winnipeg", label: "Winnipeg \u2014 Central Time", city: "Winnipeg" },
      { value: "America/Halifax", label: "Halifax \u2014 Atlantic Time", city: "Halifax" },
      { value: "America/St_Johns", label: "St. John's \u2014 Newfoundland Time", city: "St. John's" },
    ],
  },
  {
    label: "United States",
    options: [
      { value: "America/New_York", label: "New York \u2014 Eastern Time", city: "New York" },
      { value: "America/Chicago", label: "Chicago \u2014 Central Time", city: "Chicago" },
      { value: "America/Denver", label: "Denver \u2014 Mountain Time", city: "Denver" },
      { value: "America/Los_Angeles", label: "Los Angeles \u2014 Pacific Time", city: "Los Angeles" },
    ],
  },
  {
    label: "Europe",
    options: [
      { value: "Europe/London", label: "London \u2014 United Kingdom", city: "London" },
      { value: "Europe/Paris", label: "Paris \u2014 France", city: "Paris" },
    ],
  },
  {
    label: "Asia",
    options: [
      { value: "Asia/Tokyo", label: "Tokyo \u2014 Japan", city: "Tokyo" },
      { value: "Asia/Shanghai", label: "Shanghai \u2014 China", city: "Shanghai" },
      { value: "Asia/Kolkata", label: "Kolkata \u2014 India", city: "Kolkata" },
    ],
  },
  {
    label: "Australia and Pacific",
    options: [
      { value: "Australia/Sydney", label: "Sydney \u2014 Australia", city: "Sydney" },
      { value: "Pacific/Auckland", label: "Auckland \u2014 New Zealand", city: "Auckland" },
    ],
  },
  {
    label: "Universal",
    options: [
      { value: "UTC", label: "UTC \u2014 Coordinated Universal Time", city: "UTC" },
    ],
  },
];

const timeZoneOptions = TIME_ZONE_GROUPS.flatMap((group) => group.options);
const timeZoneOptionMap = new Map(timeZoneOptions.map((option) => [option.value, option]));

export function isValidTimeZone(timeZone) {
  if (typeof timeZone !== "string" || !timeZone.trim()) return false;

  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}

export function detectBrowserTimeZone() {
  try {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return isValidTimeZone(detected) ? detected : DEFAULT_TIME_ZONE;
  } catch {
    return DEFAULT_TIME_ZONE;
  }
}

export function getTimeZoneFallback() {
  try {
    const stored = localStorage.getItem(TIME_ZONE_STORAGE_KEY);
    if (isValidTimeZone(stored)) return stored;
  } catch {
    // Browser storage can be unavailable in private or restricted contexts.
  }

  return detectBrowserTimeZone();
}

export function saveTimeZoneFallback(timeZone) {
  const safeTimeZone = isValidTimeZone(timeZone) ? timeZone : detectBrowserTimeZone();
  try {
    localStorage.setItem(TIME_ZONE_STORAGE_KEY, safeTimeZone);
  } catch {
    // Keep the in-memory setting usable even when localStorage is unavailable.
  }
  return safeTimeZone;
}

export function clearTimeZoneFallback() {
  try {
    localStorage.removeItem(TIME_ZONE_STORAGE_KEY);
  } catch {
    // Nothing else is required when storage is unavailable.
  }
}

export function getTimeZoneLabel(timeZone) {
  const option = timeZoneOptionMap.get(timeZone);
  if (option) return option.label;

  const parts = String(timeZone || DEFAULT_TIME_ZONE).split("/");
  const city = (parts.at(-1) || DEFAULT_TIME_ZONE).replaceAll("_", " ");
  const region = parts.length > 1 ? parts[0].replaceAll("_", " ") : "Time zone";
  return `${city} \u2014 ${region}`;
}

export function getTimeZoneCity(timeZone) {
  const option = timeZoneOptionMap.get(timeZone);
  if (option) return option.city;
  return String(timeZone || DEFAULT_TIME_ZONE).split("/").at(-1).replaceAll("_", " ");
}

export function getZonedDateParts(date = new Date(), timeZone = DEFAULT_TIME_ZONE) {
  const safeTimeZone = isValidTimeZone(timeZone) ? timeZone : DEFAULT_TIME_ZONE;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: safeTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long",
    hourCycle: "h23",
  });
  const values = Object.fromEntries(
    formatter.formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  const year = Number(values.year);
  const month = Number(values.month);
  const day = Number(values.day);

  return {
    year,
    month,
    day,
    hour: Number(values.hour),
    minute: Number(values.minute),
    weekday: values.weekday,
    dateKey: `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    timeZone: safeTimeZone,
  };
}

export function getZonedDateKey(date = new Date(), timeZone = DEFAULT_TIME_ZONE) {
  return getZonedDateParts(date, timeZone).dateKey;
}

export function formatZonedTime(date = new Date(), timeZone = DEFAULT_TIME_ZONE) {
  const safeTimeZone = isValidTimeZone(timeZone) ? timeZone : DEFAULT_TIME_ZONE;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: safeTimeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
