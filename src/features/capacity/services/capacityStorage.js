import { todayKey } from "../../calendar/utils/dateUtils.js";
import { getData, saveData, STORAGE_KEYS } from "../../../shared/utils/storage.js";

export const CAPACITY_STORAGE_KEY = STORAGE_KEYS.dailyCapacity;
export const CAPACITY_VALUES = ["energized", "okay", "tired", "overwhelmed"];

export function isValidCapacity(value) {
  return CAPACITY_VALUES.includes(value);
}

export function getStoredDailyCapacity(dateKey = todayKey()) {
  const stored = getData(CAPACITY_STORAGE_KEY, null);

  if (!stored || typeof stored !== "object") {
    return { date: dateKey, capacity: "" };
  }

  if (stored.date !== dateKey || !isValidCapacity(stored.capacity)) {
    return { date: dateKey, capacity: "" };
  }

  return {
    date: stored.date,
    capacity: stored.capacity,
  };
}

export function saveDailyCapacity(capacity, dateKey = todayKey()) {
  if (!isValidCapacity(capacity)) {
    return { date: dateKey, capacity: "" };
  }

  return saveData(CAPACITY_STORAGE_KEY, {
    date: dateKey,
    capacity,
  });
}
