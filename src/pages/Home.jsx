import { useMemo, useState } from "react";
import Calendar from "../components/Calendar.jsx";
import DailyReward from "../components/DailyReward.jsx";
import GoalModal from "../components/GoalModal.jsx";
import PandaCompanion from "../components/PandaCompanion.jsx";
import PandaMoodDisplay from "../components/PandaMoodDisplay.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import Timer from "../components/Timer.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { greetingForNow, todayKey } from "../utils/dateUtils.js";
import { xpForNextLevel } from "../utils/pandaLogic.js";

export default function Home() {
  const { goalsByDate, journalEntries, pandaStats, setSelectedDate, toggleGoal } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const today = todayKey();
  const todaysGoals = goalsByDate[today] || [];
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

        <section className="rounded-[2rem] bg-white/75 p-5 shadow-xl shadow-zinc-200/60">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-pink-500">Today</p>
              <h2 className="text-2xl font-black text-zinc-950">Goals for this fresh bamboo day</h2>
            </div>
            <button
              className="rounded-full bg-zinc-950 px-4 py-2 font-black text-white"
              onClick={() => {
                setSelectedDate(today);
                setModalOpen(true);
              }}
              type="button"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {todaysGoals.length > 0 ? (
              todaysGoals.map((goal) => (
                <label className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-3" key={goal.id}>
                  <input checked={goal.completed} className="size-5 accent-emerald-500" onChange={() => toggleGoal(today, goal.id)} type="checkbox" />
                  <span className={`font-black text-zinc-800 ${goal.completed ? "line-through" : ""}`}>{goal.title}</span>
                  <span className="ml-auto rounded-full bg-pink-100 px-3 py-1 text-xs font-black text-pink-700">{goal.difficulty || "easy"}</span>
                </label>
              ))
            ) : (
              <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">No pressure. Add one tiny goal when you are ready.</p>
            )}
          </div>
        </section>

        <Calendar onOpenDay={() => setModalOpen(true)} />
      </section>

      <aside className="space-y-5">
        <Timer />
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
