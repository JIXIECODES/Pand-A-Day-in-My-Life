import dayjs from "dayjs";

export const DATE_FORMAT = "YYYY-MM-DD";

export function formatDate(date) {
  return dayjs(date).format(DATE_FORMAT);
}

export function todayKey() {
  return formatDate(new Date());
}

export function getMonthDays(monthDate) {
  const start = dayjs(monthDate).startOf("month").startOf("week");
  const end = dayjs(monthDate).endOf("month").endOf("week");
  const days = [];
  let current = start;

  while (current.isBefore(end) || current.isSame(end, "day")) {
    days.push(current);
    current = current.add(1, "day");
  }

  return days;
}

export function weekdayLabels() {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
}

export function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function isPastDeadline(dateKey, deadline) {
  if (!deadline) return false;
  return dayjs(`${dateKey}T${deadline}`).isBefore(dayjs());
}
