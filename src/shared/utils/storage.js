import { DEFAULT_PANDA_STATS } from "../../features/panda/utils/pandaLogic.js";

export const STORAGE_KEYS = {
  goals: "panda-day-goals",
  classicGoals: "classicGoals",
  longTermGoals: "panda-day-long-term-goals",
  journalEntries: "panda-day-journal-entries",
  pandaStats: "panda-day-panda-stats",
  unlockedOutfits: "panda-day-unlocked-outfits",
  unlockedDecorations: "panda-day-unlocked-decorations",
  achievements: "panda-day-achievements",
  settings: "panda-day-settings",
  dailyRewards: "panda-day-daily-rewards",
  equippedOutfit: "panda-day-equipped-outfit",
  scheduledGoals: "panda-day-scheduled-goals",
  categoryColors: "categoryColors",
  dailyTasks: "panda-day-daily-tasks",
  dailyCapacity: "panda-day-daily-capacity",
  dailyWellbeing: "panda-day-daily-wellbeing",
  resilienceReturns: "panda-day-resilience",
};

export const DEFAULT_CATEGORY_COLORS = {
  personal: "#ef4444",
  school: "#22c55e",
  work: "#3b82f6",
  health: "#14b8a6",
  creative: "#a855f7",
  chores: "#f97316",
  other: "#6b7280",
};

export const GOAL_CATEGORIES = ["Personal", "School", "Work", "Health", "Creative", "Chores", "Other"];

export const STORAGE_CHANGE_EVENT = "panda-day-storage-change";

let activeStorageOwner = "guest";

function normalizeStorageOwner(owner = "guest") {
  return String(owner || "guest").trim().toLowerCase().replace(/[^a-z0-9@._-]/g, "-") || "guest";
}

function scopedKey(key, owner = activeStorageOwner) {
  return `panda-day-account:${normalizeStorageOwner(owner)}:${key}`;
}

function announceStorageChange(key) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT, {
    detail: { key, owner: activeStorageOwner },
  }));
}

export function setStorageOwner(owner) {
  activeStorageOwner = normalizeStorageOwner(owner);
}

export function getStorageOwner() {
  return activeStorageOwner;
}

export function getStorageSnapshot(owner = activeStorageOwner) {
  return Object.values(STORAGE_KEYS).reduce((snapshot, key) => {
    try {
      const stored = localStorage.getItem(scopedKey(key, owner));
      if (stored !== null) snapshot[key] = JSON.parse(stored);
    } catch {
      // Ignore one malformed local value instead of blocking the rest of the account.
    }
    return snapshot;
  }, {});
}

export function replaceStorageSnapshot(owner, snapshot = {}) {
  const safeSnapshot = snapshot && typeof snapshot === "object" && !Array.isArray(snapshot) ? snapshot : {};
  Object.values(STORAGE_KEYS).forEach((key) => {
    const storageKey = scopedKey(key, owner);
    if (Object.prototype.hasOwnProperty.call(safeSnapshot, key)) {
      localStorage.setItem(storageKey, JSON.stringify(safeSnapshot[key]));
    } else {
      localStorage.removeItem(storageKey);
    }
  });
}

export function hasMeaningfulStorageData(snapshot = {}) {
  return Object.values(snapshot).some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === "object") return Object.keys(value).length > 0;
    if (typeof value === "string") return value.trim().length > 0;
    return value !== null && value !== undefined;
  });
}

export function categoryKey(category = "Other") {
  return category.toLowerCase().trim() || "other";
}

export function getData(key, fallback) {
  try {
    const stored = localStorage.getItem(scopedKey(key));
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function saveData(key, value) {
  localStorage.setItem(scopedKey(key), JSON.stringify(value));
  announceStorageChange(key);
  return value;
}

export function clearData(key) {
  localStorage.removeItem(scopedKey(key));
  announceStorageChange(key);
}

export function resetAllData() {
  Object.values(STORAGE_KEYS).forEach((key) => clearData(key));
}

export function normalizeMinimumWinFields(goal = {}) {
  return {
    ...goal,
    minimumWin: typeof goal.minimumWin === "string" ? goal.minimumWin : "",
    minimumWinCompleted: Boolean(goal.minimumWinCompleted),
    minimumWinCompletedAt: typeof goal.minimumWinCompletedAt === "string" ? goal.minimumWinCompletedAt : null,
    minimumWinRewardGranted: Boolean(goal.minimumWinRewardGranted),
  };
}

function cleanMinimumWin(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function getAllGoals() {
  const goals = getData(STORAGE_KEYS.goals, {});
  return Object.fromEntries(
    Object.entries(goals).map(([date, dayGoals]) => [
      date,
      (dayGoals || []).map((goal) => normalizeMinimumWinFields({
        ...goal,
        xpAwarded: goal.xpAwarded ?? Boolean(goal.completed),
      })),
    ]),
  );
}

export function getGoals(date) {
  return getAllGoals()[date] || [];
}

export function saveGoal(date, goal) {
  const goals = getAllGoals();
  const dayGoals = goals[date] || [];
  const nextGoal = normalizeMinimumWinFields({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    date,
    title: goal.title,
    description: goal.description || "",
    note: goal.note || "",
    deadline: goal.deadline || "",
    startTime: goal.startTime || "",
    endTime: goal.endTime || "",
    category: goal.category || "Personal",
    difficulty: goal.difficulty || "easy",
    minimumWin: cleanMinimumWin(goal.minimumWin),
    completed: false,
    xpAwarded: false,
    createdAt: new Date().toISOString(),
  });

  goals[date] = [...dayGoals, nextGoal];
  saveData(STORAGE_KEYS.goals, goals);
  return nextGoal;
}

export function updateGoal(date, id, updates = {}) {
  const goals = getAllGoals();
  goals[date] = (goals[date] || []).map((goal) =>
    goal.id === id ? normalizeMinimumWinFields({ ...goal, ...updates }) : goal,
  );
  saveData(STORAGE_KEYS.goals, goals);
  return goals[date] || [];
}

export function deleteGoal(date, id) {
  const goals = getAllGoals();
  goals[date] = (goals[date] || []).filter((goal) => goal.id !== id);
  if (goals[date].length === 0) delete goals[date];
  saveData(STORAGE_KEYS.goals, goals);
  return goals[date] || [];
}

export function getClassicGoals() {
  return getData(STORAGE_KEYS.classicGoals, []).map((goal) => normalizeMinimumWinFields({
    ...goal,
    type: "classic",
    goalType: "daily",
    category: goal.category || "Personal",
    difficulty: goal.difficulty || "easy",
    xpAwarded: goal.xpAwarded ?? Boolean(goal.completed),
  }));
}

export function saveClassicGoal(goal) {
  const classicGoals = getClassicGoals();
  const nextGoal = normalizeMinimumWinFields({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    type: "classic",
    goalType: "daily",
    title: goal.title,
    description: goal.description || "",
    category: goal.category || "Personal",
    difficulty: goal.difficulty || "easy",
    minimumWin: cleanMinimumWin(goal.minimumWin),
    completed: false,
    xpAwarded: false,
    createdAt: new Date().toISOString(),
  });

  saveData(STORAGE_KEYS.classicGoals, [nextGoal, ...classicGoals]);
  return nextGoal;
}

export function updateClassicGoal(id, updates = {}) {
  const classicGoals = getClassicGoals().map((goal) =>
    goal.id === id ? normalizeMinimumWinFields({ ...goal, ...updates, type: "classic", goalType: "daily" }) : goal,
  );
  saveData(STORAGE_KEYS.classicGoals, classicGoals);
  return classicGoals;
}

export function deleteClassicGoal(id) {
  const classicGoals = getClassicGoals().filter((goal) => goal.id !== id);
  saveData(STORAGE_KEYS.classicGoals, classicGoals);
  return classicGoals;
}

export function getLongTermGoals() {
  return getData(STORAGE_KEYS.longTermGoals, []).map((goal) => normalizeMinimumWinFields({
    ...goal,
    type: "longTerm",
    goalType: "long-term",
    category: goal.category || "Personal",
    difficulty: goal.difficulty || "medium",
    xpAwarded: goal.xpAwarded ?? Boolean(goal.completed),
  }));
}

export function saveLongTermGoal(goal) {
  const longTermGoals = getLongTermGoals();
  const nextGoal = normalizeMinimumWinFields({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    type: "longTerm",
    goalType: "long-term",
    title: goal.title,
    description: goal.description || "",
    category: goal.category || "Personal",
    difficulty: goal.difficulty || "medium",
    minimumWin: cleanMinimumWin(goal.minimumWin),
    completed: false,
    xpAwarded: false,
    createdAt: new Date().toISOString(),
  });

  saveData(STORAGE_KEYS.longTermGoals, [nextGoal, ...longTermGoals]);
  return nextGoal;
}

export function updateLongTermGoal(id, updates = {}) {
  const longTermGoals = getLongTermGoals().map((goal) =>
    goal.id === id ? normalizeMinimumWinFields({ ...goal, ...updates, type: "longTerm", goalType: "long-term" }) : goal,
  );
  saveData(STORAGE_KEYS.longTermGoals, longTermGoals);
  return longTermGoals;
}

export function deleteLongTermGoal(id) {
  const longTermGoals = getLongTermGoals().filter((goal) => goal.id !== id);
  saveData(STORAGE_KEYS.longTermGoals, longTermGoals);
  return longTermGoals;
}

export function getSettings() {
  return getData(STORAGE_KEYS.settings, {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Local",
    notificationsEnabled: false,
    theme: "seasonal",
    timerDurationMinutes: 25,
  });
}

export function saveSettings(settings) {
  return saveData(STORAGE_KEYS.settings, settings);
}

export function getCategoryColors() {
  return { ...DEFAULT_CATEGORY_COLORS, ...getData(STORAGE_KEYS.categoryColors, {}) };
}

export function saveCategoryColors(colors) {
  return saveData(STORAGE_KEYS.categoryColors, { ...DEFAULT_CATEGORY_COLORS, ...colors });
}

export function getPandaStats() {
  const storedStats = getData(STORAGE_KEYS.pandaStats, {});
  const stats = storedStats && typeof storedStats === "object" && !Array.isArray(storedStats)
    ? storedStats
    : {};

  return {
    ...DEFAULT_PANDA_STATS,
    ...stats,
    level: Number.isInteger(stats.level) && stats.level >= 1 ? stats.level : DEFAULT_PANDA_STATS.level,
    streak: Number.isInteger(stats.streak) && stats.streak >= 0 ? stats.streak : 0,
    xp: Number.isFinite(stats.xp) && stats.xp >= 0 ? stats.xp : 0,
  };
}

export function getScheduledGoals() {
  return getData(STORAGE_KEYS.scheduledGoals, []).map((goal) => normalizeMinimumWinFields({
    ...goal,
    type: "scheduled",
    goalType: goal.goalType === "long-term" ? "long-term" : "daily",
    scheduled: true,
    description: goal.description || "",
    category: goal.category || "Personal",
    difficulty: goal.difficulty || "easy",
    xpAwarded: goal.xpAwarded ?? Boolean(goal.completed),
  }));
}

export function saveScheduledGoal(goal) {
  const scheduledGoals = getScheduledGoals();
  const nextGoal = normalizeMinimumWinFields({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    type: "scheduled",
    goalType: goal.goalType === "long-term" ? "long-term" : "daily",
    scheduled: true,
    title: goal.title,
    description: goal.description || "",
    date: goal.date,
    startTime: goal.startTime,
    endTime: goal.endTime,
    category: goal.category || "Personal",
    difficulty: goal.difficulty || "easy",
    minimumWin: cleanMinimumWin(goal.minimumWin),
    completed: Boolean(goal.completed),
    xpAwarded: Boolean(goal.xpAwarded),
    createdAt: new Date().toISOString(),
  });

  saveData(STORAGE_KEYS.scheduledGoals, [...scheduledGoals, nextGoal]);
  return nextGoal;
}

export function updateScheduledGoal(id, updates = {}) {
  const scheduledGoals = getScheduledGoals().map((goal) =>
    goal.id === id ? normalizeMinimumWinFields({ ...goal, ...updates }) : goal,
  );
  saveData(STORAGE_KEYS.scheduledGoals, scheduledGoals);
  return scheduledGoals;
}

export function deleteScheduledGoal(id) {
  const scheduledGoals = getScheduledGoals().filter((goal) => goal.id !== id);
  saveData(STORAGE_KEYS.scheduledGoals, scheduledGoals);
  return scheduledGoals;
}
