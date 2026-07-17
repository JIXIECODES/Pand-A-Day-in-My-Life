import React, { useCallback, useMemo, useState } from "react";
import DailyCapacityCheckIn from "../../capacity/components/DailyCapacityCheckIn.jsx";
import { getStoredDailyCapacity } from "../../capacity/services/capacityStorage.js";
import { getGoalEmphasis, splitGoalsForCapacity } from "../../capacity/utils/capacityRecommendations.js";
import PandaCoach from "../../coach/components/PandaCoach.jsx";
import FocusTimer from "../../goals/components/FocusTimer.jsx";
import MinimumWinSection from "../../goals/components/MinimumWinSection.jsx";
import PandaCompanion from "../../panda/components/PandaCompanion.jsx";
import PandaMoodDisplay from "../../panda/components/PandaMoodDisplay.jsx";
import ResilienceReturnsCard from "../../resilience/components/ResilienceReturnsCard.jsx";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { greetingForNow, todayKey } from "../../calendar/utils/dateUtils.js";

function PandaGreetingBubble() {
  return (
    <div className="flex justify-center">
      <div className="relative max-w-xs rounded-[1.5rem] border border-pink-100 bg-white/90 px-5 py-3 text-center text-lg font-black text-zinc-950 shadow-lg shadow-pink-100/70">
        What are you doing today?
        <span
          aria-hidden="true"
          className="absolute -right-2 top-1/2 hidden size-5 -translate-y-1/2 rotate-45 border-r border-t border-pink-100 bg-white/90 sm:block"
        />
      </div>
    </div>
  );
}

function PandaDisplayFrame() {
  return (
    <section className="rounded-[2rem] border border-white/80 bg-white/65 p-5 shadow-xl shadow-zinc-200/60 backdrop-blur">
      <div className="grid items-center gap-5 sm:grid-cols-[minmax(12rem,0.85fr)_minmax(16rem,1fr)]">
        <PandaGreetingBubble />
        <PandaCompanion frameless />
      </div>
    </section>
  );
}

const emphasisToneClasses = {
  emerald: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  pink: "bg-pink-50 text-pink-700 ring-1 ring-pink-100",
  amber: "bg-amber-50 text-amber-800 ring-1 ring-amber-100",
};

function GoalCard({ goal, incompleteIndex, capacity, onCompleteGoal, onCompleteMinimumWin }) {
  const emphasis = getGoalEmphasis(goal, incompleteIndex, capacity);

  return (
    <article className="relative rounded-2xl bg-white px-4 py-3 shadow-sm" key={goal.id}>
      <span className="absolute left-1/2 top-0 h-3 w-12 -translate-x-1/2 -translate-y-1/2 rotate-1 rounded-sm bg-amber-200/80" aria-hidden="true" />
      <div className="flex items-start gap-3">
        <button
          aria-label={goal.completed ? `Mark ${goal.title} incomplete` : `Mark ${goal.title} complete`}
          className={[
            "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-emerald-100",
            goal.completed
              ? "border-emerald-300 bg-emerald-500 text-white"
              : "border-emerald-100 bg-emerald-50 text-emerald-700 hover:-translate-y-0.5 hover:bg-emerald-100",
          ].join(" ")}
          onClick={() => onCompleteGoal(goal.id)}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            {goal.completed ? <path d="M5 12.5 10 17l9-10" /> : <circle cx="12" cy="12" r="7" />}
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start gap-2">
            <p className={`text-sm font-black text-zinc-800 ${goal.completed ? "sketch-strike text-zinc-500" : ""}`}>
              {goal.title}
            </p>
            {emphasis && (
              <span className={`rounded-full px-2 py-1 text-[0.65rem] font-black uppercase ${emphasisToneClasses[emphasis.tone]}`}>
                {emphasis.label}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs font-bold text-zinc-500">
            {goal.startTime && goal.endTime ? `${goal.startTime} - ${goal.endTime}` : goal.category || "Calendar and Goals"}
          </p>
        </div>
      </div>
      <MinimumWinSection goal={goal} onComplete={onCompleteMinimumWin} />
    </article>
  );
}

function TodayGoalsBoard({ capacity, goals, onCompleteGoal, onCompleteMinimumWin, onOpenCalendar }) {
  const [showLater, setShowLater] = useState(false);
  const incompleteGoals = goals.filter((goal) => !goal.completed);
  const incompleteIndexById = new Map(incompleteGoals.map((goal, index) => [goal.id, index]));
  const { visibleGoals, laterGoals } = splitGoalsForCapacity(goals, capacity);
  const allDisplayedGoals = capacity === "overwhelmed" && !showLater ? visibleGoals : goals;
  const displayedGoals = allDisplayedGoals.slice(0, capacity === "overwhelmed" && !showLater ? allDisplayedGoals.length : 3);
  const hiddenCount = capacity === "overwhelmed" && !showLater ? laterGoals.length : Math.max(goals.length - displayedGoals.length, 0);

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
            {incompleteGoals.length > 0 ? (
              displayedGoals.map((goal) => (
                <GoalCard
                  capacity={capacity}
                  goal={goal}
                  incompleteIndex={incompleteIndexById.get(goal.id)}
                  key={goal.id}
                  onCompleteGoal={onCompleteGoal}
                  onCompleteMinimumWin={onCompleteMinimumWin}
                />
              ))
            ) : (
              <p className="rounded-2xl bg-white/85 p-4 text-sm font-bold text-amber-900">
                You do not have any unfinished daily goals. You can rest or add something small for today.
              </p>
            )}
          </div>

          {capacity === "overwhelmed" && laterGoals.length > 0 && (
            <button
              aria-expanded={showLater}
              className="mt-3 w-full rounded-full bg-white/80 px-4 py-2 text-center text-xs font-black text-amber-900 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-amber-200"
              onClick={() => setShowLater((current) => !current)}
              type="button"
            >
              {showLater ? "Collapse Later today" : `Later today (${laterGoals.length})`}
            </button>
          )}

          {hiddenCount > 0 && capacity !== "overwhelmed" && (
            <p className="mt-3 rounded-full bg-white/70 px-4 py-2 text-center text-xs font-black text-amber-900">
              View all in Calendar and Goals
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
  const { classicGoals, completeMinimumWin, completeScheduledGoal, longTermGoals, resilienceState, scheduledGoals, setActivePage } = useAppContext();
  const [dailyCapacity, setDailyCapacity] = useState(() => getStoredDailyCapacity().capacity);
  const todaysGoals = useMemo(
    () => scheduledGoals.filter((goal) => goal.date === todayKey()).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [scheduledGoals],
  );
  const updateDailyCapacity = useCallback((capacity) => setDailyCapacity(capacity), []);

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6">
      <div className="rounded-[2rem] bg-white/70 p-6 shadow-xl shadow-zinc-200/60 backdrop-blur">
        <p className="text-sm font-black text-pink-500">{greetingForNow()}</p>
        <h1 className="mt-1 text-4xl font-black text-zinc-950">What does your panda get to remember today?</h1>
      </div>

      <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
        <div className="grid gap-5">
          <PandaDisplayFrame />
          <div className="grid gap-5 sm:grid-cols-2">

            <PandaMoodDisplay />

            <ResilienceReturnsCard resilienceState={resilienceState} />

          </div>
          <DailyCapacityCheckIn onCapacityChange={updateDailyCapacity} />
        </div>

        <div className="grid gap-5">
          <TodayGoalsBoard
            capacity={dailyCapacity}
            goals={todaysGoals}
            onCompleteGoal={completeScheduledGoal}
            onCompleteMinimumWin={completeMinimumWin}
            onOpenCalendar={() => setActivePage("calendar", { planningTab: "calendar" })}
          />
          <FocusTimer />
        </div>
      </section>

      <PandaCoach capacity={dailyCapacity} dailyGoals={classicGoals} longTermGoals={longTermGoals} todaysGoals={todaysGoals} />
    </main>
  );
}
