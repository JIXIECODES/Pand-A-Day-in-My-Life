import React from "react";
import { useAppContext } from "../context/AppContext.jsx";
import DailyMissions from "./DailyMissions.jsx";

export default function DailyReward() {
  const { canClaimReward, claimReward, dailyMissionProgress, dailyRewards } = useAppContext();
  const completedCount = dailyMissionProgress.missions.filter((mission) => mission.completed).length;

  return (
    <section className="rounded-[2rem] bg-amber-100 p-5 shadow-sm">
      <p className="text-xs font-black uppercase text-amber-700">Daily reward</p>
      <h2 className="mt-1 text-xl font-black text-zinc-950">A tiny bamboo boost</h2>
      <p className="mt-2 text-sm font-semibold text-zinc-600">
        {dailyMissionProgress.claimed
          ? `Claimed today: ${dailyRewards.lastReward?.label || "cozy boost"}`
          : `${completedCount} of ${dailyMissionProgress.missions.length} daily missions complete.`}
      </p>
      <DailyMissions />
      <button
        className="mt-4 w-full rounded-full bg-zinc-950 px-5 py-3 font-black text-white disabled:bg-white/60 disabled:text-zinc-400"
        disabled={!canClaimReward}
        onClick={claimReward}
        type="button"
      >
        {canClaimReward ? "Claim reward" : dailyMissionProgress.claimed ? "Come back tomorrow" : "Complete a mission first"}
      </button>
    </section>
  );
}
