import dayjs from "dayjs";

export const DATE_FORMAT = "YYYY-MM-DD";

export function formatDate(date) {
  return dayjs(date).format(DATE_FORMAT);
}

export function getMonthDays(monthDate) {
  const startOfMonth = dayjs(monthDate).startOf("month");
  const endOfMonth = dayjs(monthDate).endOf("month");
  const calendarStart = startOfMonth.startOf("week");
  const calendarEnd = endOfMonth.endOf("week");
  const days = [];

  let cursor = calendarStart;
  while (cursor.isBefore(calendarEnd) || cursor.isSame(calendarEnd, "day")) {
    days.push(cursor);
    cursor = cursor.add(1, "day");
  }

  return days;
}

export function isToday(date) {
  return dayjs(date).isSame(dayjs(), "day");
}

export function isSameMonth(date, monthDate) {
  return dayjs(date).isSame(dayjs(monthDate), "month");
}

export function getWeekdayLabels() {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
}
