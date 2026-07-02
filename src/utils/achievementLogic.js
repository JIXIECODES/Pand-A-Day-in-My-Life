import { achievements } from "../data/achievements.js";

export function metricValue(type, stats, unlockedOutfits = [], unlockedDecorations = []) {
  const map = {
    completedGoals: stats.completedGoals,
    streak: stats.streak,
    focusTimers: stats.focusTimers,
    journalDays: stats.journalDays,
    level: stats.level,
    hardGoals: stats.hardGoals,
    deepGoals: stats.deepGoals,
    dailyRewards: stats.dailyRewards,
    outfits: unlockedOutfits.length,
    decorations: unlockedDecorations.length,
  };

  return map[type] || 0;
}

export function evaluateAchievements(stats, unlockedIds = [], unlockedOutfits = [], unlockedDecorations = []) {
  const newlyUnlocked = [];
  const nextUnlocked = [...unlockedIds];

  achievements.forEach((achievement) => {
    if (nextUnlocked.includes(achievement.id)) return;

    const current = metricValue(achievement.requirement.type, stats, unlockedOutfits, unlockedDecorations);
    if (current >= achievement.requirement.value) {
      nextUnlocked.push(achievement.id);
      newlyUnlocked.push(achievement);
    }
  });

  return { nextUnlocked, newlyUnlocked };
}
