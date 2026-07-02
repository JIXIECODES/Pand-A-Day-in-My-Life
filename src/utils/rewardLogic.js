import { formatDate } from "./dateUtils.js";
import { addXp, clampStat, withMood } from "./pandaLogic.js";

export function canClaimDailyReward(lastClaimedDate) {
  return lastClaimedDate !== formatDate(new Date());
}

export function claimDailyReward(stats, lastClaimedDate) {
  if (!canClaimDailyReward(lastClaimedDate)) {
    return { stats, reward: null, lastClaimedDate };
  }

  const rewards = [
    { type: "xp", label: "+20 XP", xp: 20 },
    { type: "happiness", label: "+15 happiness", happiness: 15 },
    { type: "energy", label: "+15 energy", energy: 15 },
    { type: "streak", label: "Streak sparkle", xp: 10, happiness: 10 },
  ];
  const reward = rewards[Math.floor(Math.random() * rewards.length)];
  let nextStats = {
    ...stats,
    dailyRewards: stats.dailyRewards + 1,
    happiness: clampStat(stats.happiness + (reward.happiness || 0)),
    energy: clampStat(stats.energy + (reward.energy || 0)),
  };

  nextStats = addXp(nextStats, reward.xp || 0);
  nextStats = withMood(nextStats, nextStats.mood === "levelUp" ? "levelUp" : "celebrating", "Daily reward claimed");

  return {
    stats: nextStats,
    reward,
    lastClaimedDate: formatDate(new Date()),
  };
}
