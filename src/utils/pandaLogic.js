export const DEFAULT_PANDA_STATS = {
  mood: "idle",
  happiness: 60,
  energy: 70,
  xp: 0,
  level: 1,
  streak: 0,
  completedGoals: 0,
  hardGoals: 0,
  deepGoals: 0,
  focusTimers: 0,
  journalDays: 0,
  dailyRewards: 0,
  moodHistory: [],
};

export const difficultyXp = {
  easy: 10,
  medium: 20,
  hard: 35,
};

export function xpForNextLevel(level) {
  return 100 + (level - 1) * 40;
}

export function clampStat(value) {
  return Math.max(0, Math.min(100, value));
}

export function withMood(stats, mood, message = "") {
  const historyItem = {
    mood,
    message,
    at: new Date().toISOString(),
  };

  return {
    ...stats,
    mood,
    moodHistory: [historyItem, ...(stats.moodHistory || [])].slice(0, 10),
  };
}

export function addXp(stats, amount) {
  let xp = stats.xp + amount;
  let level = stats.level;
  let leveledUp = false;

  while (xp >= xpForNextLevel(level)) {
    xp -= xpForNextLevel(level);
    level += 1;
    leveledUp = true;
  }

  return {
    ...stats,
    xp,
    level,
    mood: leveledUp ? "levelUp" : stats.mood,
  };
}

export function completeGoalStats(stats, goal, completedAllDailyGoals = false) {
  const difficulty = goal.difficulty || "easy";
  const xp = difficultyXp[difficulty] || difficultyXp.easy;
  const hardGoal = difficulty === "hard" ? 1 : 0;
  const deepGoal = difficulty === "medium" || difficulty === "hard" ? 1 : 0;
  let next = {
    ...stats,
    completedGoals: stats.completedGoals + 1,
    hardGoals: stats.hardGoals + hardGoal,
    deepGoals: stats.deepGoals + deepGoal,
    happiness: clampStat(stats.happiness + (completedAllDailyGoals ? 30 : 10)),
  };

  next = addXp(next, xp + (completedAllDailyGoals ? 50 : 0));
  return withMood(next, next.mood === "levelUp" ? "levelUp" : "happy", "Goal completed");
}

export function celebrateAlreadyAwardedGoal(stats) {
  return withMood(
    {
      ...stats,
      happiness: clampStat(stats.happiness + 2),
    },
    "happy",
    "Goal completed again",
  );
}

export function missDeadlineStats(stats) {
  return withMood(
    {
      ...stats,
      energy: clampStat(stats.energy - 10),
    },
    "sleepy",
    "A deadline passed gently",
  );
}

export function journalStats(stats) {
  const next = addXp(
    {
      ...stats,
      happiness: clampStat(stats.happiness + 10),
      journalDays: stats.journalDays + 1,
    },
    10,
  );
  return withMood(next, next.mood === "levelUp" ? "levelUp" : "happy", "Journal memory saved");
}

export function focusStartedStats(stats) {
  return withMood(stats, "focused", "Focus timer started");
}

export function focusFinishedStats(stats) {
  const next = addXp(
    {
      ...stats,
      focusTimers: stats.focusTimers + 1,
      happiness: clampStat(stats.happiness + 8),
    },
    20,
  );
  return withMood(next, next.mood === "levelUp" ? "levelUp" : "celebrating", "Focus timer finished");
}
