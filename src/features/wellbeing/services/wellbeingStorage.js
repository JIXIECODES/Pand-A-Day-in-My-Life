import { todayKey } from "../../calendar/utils/dateUtils.js";
import { getData, saveData, STORAGE_KEYS } from "../../../shared/utils/storage.js";

export const feelingOptions = [
  { id: "calm", label: "Calm", response: "A steady pace sounds good. You can keep today simple." },
  { id: "tired", label: "Tired", response: "A lighter plan still counts. Rest can be part of progress." },
  { id: "stressed", label: "Stressed", response: "You do not need to solve everything at once. One manageable step is enough." },
  { id: "motivated", label: "Motivated", response: "Use that energy gently. Start with what matters most." },
  { id: "unsure", label: "Unsure", response: "That is okay. You can begin small and notice what you need as you go." },
];

export const feelingCapacityMap = {
  calm: "okay",
  tired: "tired",
  stressed: "overwhelmed",
  motivated: "energized",
  unsure: "okay",
};

export function getDailyWellbeing(date = todayKey()) {
  const stored = getData(STORAGE_KEYS.dailyWellbeing, null);
  if (!stored || stored.date !== date) {
    return { date, feeling: "", lowEnergy: false };
  }

  return {
    date,
    feeling: feelingOptions.some((option) => option.id === stored.feeling) ? stored.feeling : "",
    lowEnergy: Boolean(stored.lowEnergy),
  };
}

export function saveDailyWellbeing(updates, date = todayKey()) {
  const current = getDailyWellbeing(date);
  return saveData(STORAGE_KEYS.dailyWellbeing, { ...current, ...updates, date });
}

export function getFeelingOption(feeling) {
  return feelingOptions.find((option) => option.id === feeling) || null;
}