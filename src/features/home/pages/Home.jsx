import React, { useMemo } from "react";
import DailyReward from "../../rewards/components/DailyReward.jsx";
import PandaTutorial from "../components/PandaTutorial.jsx";
import PandaCompanion from "../../panda/components/PandaCompanion.jsx";
import PandaMoodDisplay from "../../panda/components/PandaMoodDisplay.jsx";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { greetingForNow, todayKey } from "../../calendar/utils/dateUtils.js";

function PandaGreetingBubble() {
  return (
    <div className="flex justify-center px-3 sm:justify-start sm:pl-10">
      <div className="relative max-w-xs rounded-[1.5rem] border border-pink-100 bg-white/90 px-5 py-3 text-center text-lg font-black text-zinc-950 shadow-lg shadow-pink-100/70">
        What are you doing today?
        <span
          aria-hidden="true"
          className="absolute -bottom-2 left-1/2 size-5 -translate-x-1/2 rotate-45 border-b border-r border-pink-100 bg-white/90 sm:left-16 sm:translate-x-0"
        />
      </div>
    </div>
  );
}

function TodayGoalsBoard({ goals, onOpenCalendar }) {
  const visibleGoals = goals.slice(0, 3);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-amber-200 bg-amber-100 p-4 shadow-xl shadow-amber-200/50">
      <div className="rounded-[1.5rem] border border-amber-300/70 bg-[linear-gradient(135deg,#f8dca2_0%,#e9bd72_100%)] p-4 shadow-inner">
        <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50/90 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-pink-500">Bulletin board</p>
              <h2 className="mt-1 text-2xl font-black text-zinc-950">Goals for Today</h2>
            </div>
            <span className="mt-1 size-4 shrink-0 rounded-full border-2 border-rose-200 bg-rose-400 shadow-sm" aria-hidden="true" />
          </div>

          <div className="mt-4 space-y-3">
            {visibleGoals.length > 0 ? (
              visibleGoals.map((goal) => (
                <article className="relative rounded-2xl bg-white px-4 py-3 shadow-sm" key={goal.id}>
                  <span className="absolute left-1/2 top-0 h-3 w-12 -translate-x-1/2 -translate-y-1/2 rotate-1 rounded-sm bg-amber-200/80" aria-hidden="true" />
                  <p className="text-sm font-black text-zinc-800">{goal.title}</p>
                  <p className="mt-1 text-xs font-bold text-zinc-500">
                    {goal.startTime && goal.endTime ? `${goal.startTime} - ${goal.endTime}` : goal.category || "Planning"}
                  </p>
                </article>
              ))
            ) : (
              <p className="rounded-2xl bg-white/85 p-4 text-sm font-bold text-amber-900">No goals planned yet.</p>
            )}
          </div>

          {goals.length > visibleGoals.length && (
            <p className="mt-3 rounded-full bg-white/70 px-4 py-2 text-center text-xs font-black text-amber-900">
              View all in Planning
            </p>
          )}

          <button
            className="mt-4 w-full rounded-full bg-zinc-950 px-5 py-3 font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-amber-300 active:translate-y-0"
            onClick={onOpenCalendar}
            type="button"
          >
            Open Calendar
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { journalEntries, pandaStats, scheduledGoals, setActivePage } = useAppContext();
  const todaysGoals = useMemo(
    () => scheduledGoals.filter((goal) => goal.date === todayKey()).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [scheduledGoals],
  );
  const scheduledGoalCount = scheduledGoals.filter((goal) => !goal.completed).length;
  const latestMemory = useMemo(() => {
    const entries = Object.values(journalEntries).sort((a, b) =>
      (b.createdAt || b.date).localeCompare(a.createdAt || a.date),
    );
    return entries[0];
  }, [journalEntries]);

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6">
      <div className="rounded-[2rem] bg-white/70 p-6 shadow-xl shadow-zinc-200/60 backdrop-blur">
        <p className="text-sm font-black text-pink-500">{greetingForNow()}</p>
        <h1 className="mt-1 text-4xl font-black text-zinc-950">What does your panda get to remember today?</h1>
      </div>

      <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
        <div className="grid gap-5">
          <PandaGreetingBubble />
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
          <TodayGoalsBoard goals={todaysGoals} onOpenCalendar={() => setActivePage("calendar", { planningTab: "calendar" })} />
          <section className="rounded-[2rem] bg-white/80 p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-pink-500">Recent memory</p>
            <p className="mt-2 text-sm font-semibold text-zinc-600">
              {latestMemory ? `Your panda remembers: "${latestMemory.text}"` : "Write a journal entry to create your first panda memory."}
            </p>
          </section>
          <section className="rounded-[2rem] bg-white/75 p-5 shadow-xl shadow-zinc-200/60">
            <p className="text-xs font-black uppercase text-pink-500">Planning preview</p>
            <h2 className="mt-1 text-2xl font-black text-zinc-950">Manage goals in Planning</h2>
            <div className="mt-4 flex flex-col gap-3 rounded-3xl bg-zinc-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-black text-zinc-700">{scheduledGoalCount} active scheduled goals</p>
              <button className="rounded-full bg-zinc-950 px-5 py-3 font-black text-white" onClick={() => setActivePage("calendar")} type="button">
                Open Planning
              </button>
            </div>
          </section>
        </div>
      </section>

      <PandaTutorial />
    </main>
  );
}
