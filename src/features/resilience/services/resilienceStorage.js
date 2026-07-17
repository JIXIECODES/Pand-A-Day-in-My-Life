import { getData, saveData, STORAGE_KEYS } from "../../../shared/utils/storage.js";
import { getLocalDateKey } from "../utils/localDate.js";
import { normalizeResilienceState } from "../utils/resilienceTracking.js";

export const RESILIENCE_STORAGE_KEY = STORAGE_KEYS.resilienceReturns;

export function getResilienceState(dateKey = getLocalDateKey()) {
  return normalizeResilienceState(getData(RESILIENCE_STORAGE_KEY, null), dateKey);
}

export function saveResilienceState(state, dateKey = getLocalDateKey()) {
  return saveData(RESILIENCE_STORAGE_KEY, normalizeResilienceState(state, dateKey));
}