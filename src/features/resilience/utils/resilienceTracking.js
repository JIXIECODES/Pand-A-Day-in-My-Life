import { calendarDayDifference, getLocalDateKey, isValidDateKey } from "./localDate.js";

export const DEFAULT_RESILIENCE_STATE = {
  resilienceReturnCount: 0,
  lastQualifyingActivityDate: null,
  lastCountedReturnDate: null,
  resilienceTrackingStartedAt: null,
};

export function normalizeResilienceState(value, today = getLocalDateKey()) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const count = Number.isInteger(source.resilienceReturnCount) && source.resilienceReturnCount >= 0
    ? source.resilienceReturnCount
    : 0;
  const lastQualifyingActivityDate = isValidDateKey(source.lastQualifyingActivityDate)
    ? source.lastQualifyingActivityDate
    : null;
  const lastCountedReturnDate = isValidDateKey(source.lastCountedReturnDate)
    ? source.lastCountedReturnDate
    : null;
  const resilienceTrackingStartedAt = isValidDateKey(source.resilienceTrackingStartedAt)
    ? source.resilienceTrackingStartedAt
    : today;

  return {
    resilienceReturnCount: count,
    lastQualifyingActivityDate,
    lastCountedReturnDate,
    resilienceTrackingStartedAt,
  };
}

export function processQualifyingActivity(currentState, activityDate = getLocalDateKey()) {
  const validActivityDate = isValidDateKey(activityDate) ? activityDate : getLocalDateKey();
  const state = normalizeResilienceState(currentState, validActivityDate);

  if (!state.lastQualifyingActivityDate) {
    return {
      state: {
        ...state,
        lastQualifyingActivityDate: validActivityDate,
        resilienceTrackingStartedAt: state.resilienceTrackingStartedAt || validActivityDate,
      },
      returnAwarded: false,
      reason: "first-activity",
    };
  }

  const dayDifference = calendarDayDifference(state.lastQualifyingActivityDate, validActivityDate);
  if (dayDifference === null || dayDifference < 0) {
    return {
      state: {
        ...state,
        lastQualifyingActivityDate: validActivityDate,
      },
      returnAwarded: false,
      reason: "invalid-state-recovered",
    };
  }

  if (dayDifference === 0) {
    return {
      state: {
        ...state,
        lastQualifyingActivityDate: validActivityDate,
      },
      returnAwarded: false,
      reason: "same-day",
    };
  }

  if (dayDifference === 1) {
    return {
      state: {
        ...state,
        lastQualifyingActivityDate: validActivityDate,
      },
      returnAwarded: false,
      reason: "consecutive-day",
    };
  }

  if (state.lastCountedReturnDate === validActivityDate) {
    return {
      state: {
        ...state,
        lastQualifyingActivityDate: validActivityDate,
      },
      returnAwarded: false,
      reason: "already-counted-today",
    };
  }

  return {
    state: {
      ...state,
      resilienceReturnCount: state.resilienceReturnCount + 1,
      lastQualifyingActivityDate: validActivityDate,
      lastCountedReturnDate: validActivityDate,
    },
    returnAwarded: true,
    reason: "return-awarded",
  };
}