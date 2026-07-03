import React from "react";
import { useAppContext } from "../context/AppContext.jsx";

export default function DailyMissions() {
  const { dailyMissionProgress } = useAppContext();

  return (
    <div className="mt-4 space-y-2">
      {dailyMissionProgress.missions.map((mission) => (
        <div
          className={`flex items-center gap-3 rounded-2xl p-3 text-sm font-bold ${mission.completed ? "bg-emerald-50 text-emerald-800" : "bg-white/70 text-zinc-600"}`}
          key={mission.id}
        >
          <span className={`size-3 rounded-full ${mission.completed ? "bg-emerald-400" : "bg-zinc-300"}`} />
          <span className="flex-1">{mission.title}</span>
          <span className="text-xs font-black">+{mission.reward.xp} XP</span>
        </div>
      ))}
    </div>
  );
}
