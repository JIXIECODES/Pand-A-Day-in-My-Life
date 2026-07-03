import { dailyMissionPool } from "../data/dailyMissions.js";
import { formatDate } from "./dateUtils.js";
import { addXp, clampStat, withMood } from "./pandaLogic.js";

export function buildDailyMissions(date = formatDate(new Date())) {
  const dayNumber = Number(date.replaceAll("-", ""));
  const missions = [0, 1, 2].map((offset) => {
    const template = dailyMissionPool[(dayNumber + offset) % dailyMissionPool.length];
    return { ...template, completed: false };
  });

  return { date, missions, claimed: false };
}

export function normalizeDailyMissionProgress(progress, date = formatDate(new Date())) {
  if (!progress || progress.date !== date || !Array.isArray(progress.missions)) {
    return buildDailyMissions(date);
  }

  return {
    ...progress,
    claimed: Boolean(progress.claimed),
    missions: progress.missions.map((mission) => ({ ...mission, completed: Boolean(mission.completed) })),
  };
}

export function completeDailyMission(progress, missionId, date = formatDate(new Date())) {
  const current = normalizeDailyMissionProgress(progress, date);
  let changed = false;
  const missions = current.missions.map((mission) => {
    if (mission.id !== missionId || mission.completed) return mission;
    changed = true;
    return { ...mission, completed: true };
  });

  return { progress: { ...current, missions }, changed };
}

export function canClaimDailyReward(progress) {
  const current = normalizeDailyMissionProgress(progress);
  return !current.claimed && current.missions.some((mission) => mission.completed);
}

export function claimDailyReward(stats, progress) {
  const current = normalizeDailyMissionProgress(progress);
  if (!canClaimDailyReward(current)) {
    return { stats, reward: null, progress: current };
  }

  const completedMissions = current.missions.filter((mission) => mission.completed);
  const reward = completedMissions.reduce(
    (total, mission) => ({
      xp: total.xp + (mission.reward?.xp || 0),
      happiness: total.happiness + (mission.reward?.happiness || 0),
    }),
    { xp: 0, happiness: 0 },
  );

  let nextStats = {
    ...stats,
    dailyRewards: stats.dailyRewards + 1,
    happiness: clampStat(stats.happiness + reward.happiness),
  };

  nextStats = addXp(nextStats, reward.xp);
  nextStats = withMood(nextStats, nextStats.mood === "levelUp" ? "levelUp" : "celebrating", "Daily reward claimed");

  return {
    stats: nextStats,
    reward: { ...reward, label: `+${reward.xp} XP and +${reward.happiness} happiness` },
    progress: { ...current, claimed: true },
  };
}
