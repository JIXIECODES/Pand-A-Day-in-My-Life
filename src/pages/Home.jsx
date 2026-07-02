import React, { useMemo, useState } from "react";
import DailyReward from "../components/DailyReward.jsx";
import FocusTimer from "../components/FocusTimer.jsx";
import GoalModal from "../components/GoalModal.jsx";
import HomeGoals from "../components/HomeGoals.jsx";
import PandaCompanion from "../components/PandaCompanion.jsx";
import PandaMoodDisplay from "../components/PandaMoodDisplay.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { greetingForNow } from "../utils/dateUtils.js";
import { xpForNextLevel } from "../utils/pandaLogic.js";

export default function Home() {
  const { journalEntries, pandaStats } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
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
          </div>
        </div>

        <HomeGoals onAddGoal={() => setModalOpen(true)} />

      </section>

      <aside className="space-y-5">
        <FocusTimer />
        <section className="rounded-[2rem] bg-white/80 p-5 shadow-sm">
          <ProgressBar label={`Level ${pandaStats.level} XP`} value={pandaStats.xp} max={xpForNextLevel(pandaStats.level)} tone="pink" />
        </section>
        <DailyReward />
        <section className="rounded-[2rem] bg-white/80 p-5 shadow-sm">
          <p className="text-xs font-black uppercase text-pink-500">Recent memory</p>
          <p className="mt-2 text-sm font-semibold text-zinc-600">
            {latestMemory ? `Your panda remembers: "${latestMemory[1].text}"` : "Write a journal entry to create your first panda memory."}
          </p>
        </section>
      </aside>
      <GoalModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
