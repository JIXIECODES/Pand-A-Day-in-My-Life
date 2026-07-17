import { addXp, clampStat, difficultyXp, withMood } from "../../panda/utils/pandaLogic.js";

export const MINIMUM_WIN_REWARD_RATIO = 0.3;

export function minimumWinXpForGoal(goal = {}) {
  const fullGoalXp = difficultyXp[goal.difficulty || "easy"] || difficultyXp.easy;
  return Math.max(1, Math.round(fullGoalXp * MINIMUM_WIN_REWARD_RATIO));
}

export function completeMinimumWinStats(stats, goal = {}) {
  const xp = minimumWinXpForGoal(goal);
  const next = addXp(
    {
      ...stats,
      happiness: clampStat(stats.happiness + 4),
    },
    xp,
  );

  return {
    stats: withMood(next, next.mood === "levelUp" ? "levelUp" : "happy", "Minimum progress completed"),
    xp,
  };
}
