const GOALS_KEY = "panda-day-goals";
const SETTINGS_KEY = "panda-day-settings";

function readJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getAllGoals() {
  return readJson(GOALS_KEY, {});
}

export function getGoals(date) {
  return getAllGoals()[date] || [];
}

export function saveGoal(date, goal) {
  const goals = getAllGoals();
  const dayGoals = goals[date] || [];
  const nextGoal = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    completed: false,
    ...goal,
  };

  goals[date] = [...dayGoals, nextGoal];
  writeJson(GOALS_KEY, goals);
  return nextGoal;
}

export function updateGoal(date, id, updates = {}) {
  const goals = getAllGoals();
  const dayGoals = goals[date] || [];

  goals[date] = dayGoals.map((goal) =>
    goal.id === id ? { ...goal, ...updates } : goal
  );
  writeJson(GOALS_KEY, goals);
  return goals[date];
}

export function deleteGoal(date, id) {
  const goals = getAllGoals();
  goals[date] = (goals[date] || []).filter((goal) => goal.id !== id);

  if (goals[date].length === 0) {
    delete goals[date];
  }

  writeJson(GOALS_KEY, goals);
  return goals[date] || [];
}

export function getSettings() {
  return readJson(SETTINGS_KEY, {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Local",
    soundEnabled: true,
    notificationsEnabled: false,
  });
}

export function saveSettings(settings) {
  writeJson(SETTINGS_KEY, settings);
  return settings;
}
