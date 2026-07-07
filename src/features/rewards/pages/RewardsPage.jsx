import React from "react";
import { achievements } from "../../../data/achievements.js";
import AchievementCard from "../components/AchievementCard.jsx";
import DailyTasks from "../components/DailyTasks.jsx";
import DailyReward from "../components/DailyReward.jsx";
import DecorationShelf from "../../panda/components/DecorationShelf.jsx";
import OutfitSelector from "../../panda/components/OutfitSelector.jsx";
import { useAppContext } from "../../../app/AppProvider.jsx";

export default function RewardsPage() {
  const { dailyTasks, unlockedAchievements } = useAppContext();

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[20rem_1fr]">
      <aside className="space-y-5">
        <DailyReward />
        <section className="rounded-[2rem] bg-white/80 p-5 shadow-sm">
          <p className="text-sm font-black text-pink-500">Gentle rewards</p>
          <h1 className="mt-1 text-3xl font-black text-zinc-950">Unlock cozy things by showing up.</h1>
        </section>
      </aside>
      <section className="space-y-5">
        <DailyTasks dailyTasks={dailyTasks} />
        <div className="rounded-[2rem] bg-white/70 p-5 shadow-xl shadow-zinc-200/60">
          <h2 className="text-2xl font-black text-zinc-950">Achievements</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {achievements.map((achievement) => (
              <AchievementCard achievement={achievement} key={achievement.id} unlocked={unlockedAchievements.includes(achievement.id)} />
            ))}
          </div>
        </div>
        <OutfitSelector />
        <DecorationShelf />
      </section>
    </main>
  );
}
