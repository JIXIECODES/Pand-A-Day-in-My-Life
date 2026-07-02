import { DEFAULT_PANDA_STATS } from "./pandaLogic.js";

export const STORAGE_KEYS = {
  goals: "panda-day-goals",
  journalEntries: "panda-day-journal-entries",
  pandaStats: "panda-day-panda-stats",
  unlockedOutfits: "panda-day-unlocked-outfits",
  unlockedDecorations: "panda-day-unlocked-decorations",
  achievements: "panda-day-achievements",
  settings: "panda-day-settings",
  dailyRewards: "panda-day-daily-rewards",
  equippedOutfit: "panda-day-equipped-outfit",
  scheduledGoals: "panda-day-scheduled-goals",
};

export function getData(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function clearData(key) {
  localStorage.removeItem(key);
}

export function resetAllData() {
  Object.values(STORAGE_KEYS).forEach((key) => clearData(key));
}

export function getAllGoals() {
  return getData(STORAGE_KEYS.goals, {});
}

export function getGoals(date) {
  return getAllGoals()[date] || [];
}

export function saveGoal(date, goal) {
  const goals = getAllGoals();
  const dayGoals = goals[date] || [];
  const nextGoal = {
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
    completed: false,
    createdAt: new Date().toISOString(),
  };

  goals[date] = [...dayGoals, nextGoal];
  saveData(STORAGE_KEYS.goals, goals);
  return nextGoal;
}

export function updateGoal(date, id, updates = {}) {
  const goals = getAllGoals();
  goals[date] = (goals[date] || []).map((goal) =>
    goal.id === id ? { ...goal, ...updates } : goal,
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

export function getPandaStats() {
  return { ...DEFAULT_PANDA_STATS, ...getData(STORAGE_KEYS.pandaStats, DEFAULT_PANDA_STATS) };
}

export function getScheduledGoals() {
  return getData(STORAGE_KEYS.scheduledGoals, []);
}

export function saveScheduledGoal(goal) {
  const scheduledGoals = getScheduledGoals();
  const nextGoal = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    title: goal.title,
    date: goal.date,
    startTime: goal.startTime,
    endTime: goal.endTime,
    category: goal.category || "Personal",
    completed: Boolean(goal.completed),
    createdAt: new Date().toISOString(),
  };

  saveData(STORAGE_KEYS.scheduledGoals, [...scheduledGoals, nextGoal]);
  return nextGoal;
}

export function updateScheduledGoal(id, updates = {}) {
  const scheduledGoals = getScheduledGoals().map((goal) =>
    goal.id === id ? { ...goal, ...updates } : goal,
  );
  saveData(STORAGE_KEYS.scheduledGoals, scheduledGoals);
  return scheduledGoals;
}

export function deleteScheduledGoal(id) {
  const scheduledGoals = getScheduledGoals().filter((goal) => goal.id !== id);
  saveData(STORAGE_KEYS.scheduledGoals, scheduledGoals);
  return scheduledGoals;
}
