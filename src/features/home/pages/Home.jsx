import React, { useMemo } from "react";
import DailyReward from "../../rewards/components/DailyReward.jsx";
import FocusTimer from "../../goals/components/FocusTimer.jsx";
import HomeGoals from "../../goals/components/HomeGoals.jsx";
import PandaCompanion from "../../panda/components/PandaCompanion.jsx";
import PandaMoodDisplay from "../../panda/components/PandaMoodDisplay.jsx";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { greetingForNow } from "../../calendar/utils/dateUtils.js";

export default function Home() {
  const { journalEntries, pandaStats } = useAppContext();
  const latestMemory = useMemo(() => {
    const entries = Object.entries(journalEntries).sort(([a], [b]) => b.localeCompare(a));
    return entries[0];
  }, [journalEntries]);

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_22rem]">
      <section className="space-y-5">
        <div className="rounded-[2rem] bg-white/70 p-6 shadow-xl shadow-zinc-200/60 backdrop-blur">
          <p className="text-sm font-black text-pink-500">{greetingForNow()}</p>
          <h1 className="mt-1 text-4xl font-black text-zinc-950">What does your panda get to remember today?</h1>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
          <PandaCompanion />
          <div className="space-y-5">
            <PandaMoodDisplay />
            <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm">
              <p className="text-xs font-black uppercase text-pink-500">Streak</p>
              <p className="mt-1 text-4xl font-black text-zinc-950">{pandaStats.streak}</p>
              <p className="text-sm font-semibold text-zinc-500">days with completed goals</p>
            </section>
            <DailyReward />
          </div>
        </div>

        <HomeGoals />

      </section>

      <aside className="space-y-5">
        <FocusTimer />
        <section className="rounded-[2rem] bg-white/80 p-5 shadow-sm">
          <p className="text-xs font-black uppercase text-pink-500">Recent memory</p>
          <p className="mt-2 text-sm font-semibold text-zinc-600">
            {latestMemory ? `Your panda remembers: "${latestMemory[1].text}"` : "Write a journal entry to create your first panda memory."}
          </p>
        </section>
      </aside>
    </main>
  );
}
