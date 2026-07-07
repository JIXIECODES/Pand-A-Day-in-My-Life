import React, { useMemo } from "react";
import DailyReward from "../../rewards/components/DailyReward.jsx";
import FocusTimer from "../../goals/components/FocusTimer.jsx";
import PandaTutorial from "../components/PandaTutorial.jsx";
import PandaCompanion from "../../panda/components/PandaCompanion.jsx";
import PandaMoodDisplay from "../../panda/components/PandaMoodDisplay.jsx";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { greetingForNow } from "../../calendar/utils/dateUtils.js";

export default function Home() {
  const { classicGoals, journalEntries, longTermGoals, pandaStats, setActivePage } = useAppContext();
  const latestMemory = useMemo(() => {
    const entries = Object.values(journalEntries).sort((a, b) =>
      (b.createdAt || b.date).localeCompare(a.createdAt || a.date),
    );
    return entries[0];
  }, [journalEntries]);
  const activeGoalCount = [...classicGoals, ...longTermGoals].filter((goal) => !goal.completed).length;

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6">
      <div className="rounded-[2rem] bg-white/70 p-6 shadow-xl shadow-zinc-200/60 backdrop-blur">
        <p className="text-sm font-black text-pink-500">{greetingForNow()}</p>
        <h1 className="mt-1 text-4xl font-black text-zinc-950">What does your panda get to remember today?</h1>
      </div>

      <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
        <div className="grid gap-5">
          <PandaCompanion />
          <PandaMoodDisplay />
          <div className="grid gap-5 sm:grid-cols-2">
            <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm">
              <p className="text-xs font-black uppercase text-pink-500">Streak</p>
              <p className="mt-1 text-4xl font-black text-zinc-950">{pandaStats.streak}</p>
              <p className="text-sm font-semibold text-zinc-500">days with completed goals</p>
            </section>
            <DailyReward />
          </div>
        </div>

        <div className="grid gap-5">
          <FocusTimer />
          <section className="rounded-[2rem] bg-white/80 p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-pink-500">Recent memory</p>
            <p className="mt-2 text-sm font-semibold text-zinc-600">
              {latestMemory ? `Your panda remembers: "${latestMemory.text}"` : "Write a journal entry to create your first panda memory."}
            </p>
          </section>
        </div>
      </section>

      <PandaTutorial />

      <section className="rounded-[2rem] bg-white/75 p-5 shadow-xl shadow-zinc-200/60">
        <p className="text-xs font-black uppercase text-pink-500">Planning preview</p>
        <h2 className="mt-1 text-2xl font-black text-zinc-950">Manage goals in Planning</h2>
        <div className="mt-4 flex flex-col gap-3 rounded-3xl bg-zinc-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-black text-zinc-700">{activeGoalCount} active unscheduled goals</p>
          <button className="rounded-full bg-zinc-950 px-5 py-3 font-black text-white" onClick={() => setActivePage("calendar")} type="button">
            Open Planning
          </button>
        </div>
      </section>
    </main>
  );
}
