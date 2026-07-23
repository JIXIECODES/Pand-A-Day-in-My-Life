import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getGoalEmphasis, splitGoalsForCapacity } from "../../capacity/utils/capacityRecommendations.js";
import PandaCoach from "../../coach/components/PandaCoach.jsx";
import MinimumWinSection from "../../goals/components/MinimumWinSection.jsx";
import PandaCompanion from "../../panda/components/PandaCompanion.jsx";
import PandaMoodDisplay from "../../panda/components/PandaMoodDisplay.jsx";
import { DEFAULT_PANDA_STATS } from "../../panda/utils/pandaLogic.js";
import ResilienceReturnsCard from "../../resilience/components/ResilienceReturnsCard.jsx";
import CalmCorner from "../../wellbeing/components/CalmCorner.jsx";
import GentleCheckIn from "../../wellbeing/components/GentleCheckIn.jsx";
import { feelingCapacityMap, getDailyWellbeing, saveDailyWellbeing } from "../../wellbeing/services/wellbeingStorage.js";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { greetingForNow, todayKey } from "../../calendar/utils/dateUtils.js";
import BambooDecoration from "../../../shared/components/BambooDecoration.jsx";

const emphasisToneClasses = {
  emerald: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  pink: "bg-pink-50 text-pink-700 ring-1 ring-pink-100",
  amber: "bg-amber-50 text-amber-800 ring-1 ring-amber-100",
};

function PandaHomePanel({ activePanel, lowEnergy, onPanelChange, onToggleLowEnergy, pandaStats }) {
  const tools = [
    { id: "mood", emoji: "🐼", label: "Mood", helper: "See how your panda is feeling" },
    { id: "progress", emoji: "🌱", label: "Progress", helper: "View streak, level, and XP" },
    { id: "low-energy", emoji: "☁️", label: lowEnergy ? "Gentle mode on" : "Low-energy day", helper: "Show a simpler plan for today" },
  ];

  function useTool(toolId) {
    if (toolId === "low-energy") {
      onToggleLowEnergy(!lowEnergy);
      return;
    }
    onPanelChange(activePanel === toolId ? "" : toolId);
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-5 shadow-xl shadow-zinc-200/60 backdrop-blur">
      <BambooDecoration className="pointer-events-none absolute -bottom-8 -right-4 h-40 text-emerald-500 opacity-15" variant="cluster" />
      <div className="relative grid items-center gap-3 sm:grid-cols-[minmax(10rem,0.8fr)_minmax(13rem,1fr)]">
        <div className="flex justify-center">
          <div className="relative max-w-xs rounded-[1.5rem] border border-pink-100 bg-white/90 px-5 py-3 text-center shadow-lg shadow-pink-100/70">
            <p className="text-lg font-black text-zinc-950">{lowEnergy ? "We can keep today small." : "What feels manageable today?"}</p>
            <p className="mt-1 text-sm font-semibold text-zinc-500">{lowEnergy ? "One gentle step is enough." : "Your panda is here for the next step."}</p>
            <span aria-hidden="true" className="absolute -right-2 top-1/2 hidden size-5 -translate-y-1/2 rotate-45 border-r border-t border-pink-100 bg-white/90 sm:block" />
          </div>
        </div>
        <PandaCompanion compact frameless />
      </div>

      <div className="relative mt-4 grid grid-cols-3 gap-2">
        {tools.map((tool) => {
          const selected = tool.id === "low-energy" ? lowEnergy : activePanel === tool.id;
          return (
            <button
              aria-pressed={selected}
              className={[ "group relative min-h-16 rounded-2xl border p-2 text-center transition focus:outline-none focus:ring-4 focus:ring-emerald-100", selected ? "border-emerald-300 bg-emerald-50" : "border-zinc-100 bg-white/85 hover:-translate-y-0.5 hover:bg-white" ].join(" ")}
              key={tool.id}
              onClick={() => useTool(tool.id)}
              type="button"
            >
              <span aria-hidden="true" className="block text-xl">{tool.emoji}</span>
              <span className="mt-1 flex items-center justify-center gap-1 text-xs font-black text-zinc-800">{tool.label}<span aria-hidden="true" className="text-[0.65rem] text-zinc-400">ⓘ</span></span>
              <span className="pointer-events-none absolute bottom-[calc(100%+0.4rem)] left-1/2 z-40 w-40 -translate-x-1/2 rounded-xl bg-zinc-950 px-3 py-2 text-xs font-bold text-white opacity-0 shadow-xl transition group-hover:opacity-100 group-focus-visible:opacity-100" role="tooltip">{tool.helper}</span>
            </button>
          );
        })}
      </div>

      {activePanel && (
        <section aria-label="Panda quick panel" className="absolute inset-x-4 bottom-4 z-30 max-h-[calc(100%-2rem)] overflow-y-auto rounded-3xl border border-emerald-100 bg-white p-4 shadow-2xl shadow-zinc-950/20">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-black text-zinc-950">{activePanel === "mood" ? "Panda mood" : "Progress summary"}</p>
            <button aria-label="Close panda panel" className="grid size-9 place-items-center rounded-full bg-zinc-100 font-black text-zinc-700" onClick={() => onPanelChange("")} type="button">×</button>
          </div>
          {activePanel === "mood" && <PandaMoodDisplay />}
          {activePanel === "progress" && (
            <div className="grid grid-cols-2 gap-2">
              <p className="rounded-xl bg-amber-50 p-3 text-sm font-black text-amber-900">{pandaStats.streak} day streak</p>
              <p className="rounded-xl bg-emerald-50 p-3 text-sm font-black text-emerald-900">Level {pandaStats.level} · {pandaStats.xp} XP</p>
            </div>
          )}
        </section>
      )}
    </section>
  );
}

function GoalCard({ capacity, goal, incompleteIndex, onCompleteGoal, onCompleteMinimumWin }) {
  const emphasis = getGoalEmphasis(goal, incompleteIndex, capacity);
  return (
    <article className="relative rounded-2xl bg-white px-4 py-3 shadow-sm">
      <span className="absolute left-1/2 top-0 h-3 w-12 -translate-x-1/2 -translate-y-1/2 rotate-1 rounded-sm bg-amber-200/80" aria-hidden="true" />
      <div className="flex items-start gap-3">
        <button
          aria-label={goal.completed ? `Mark ${goal.title} incomplete` : `Mark ${goal.title} complete`}
          className={[ "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-emerald-100", goal.completed ? "border-emerald-300 bg-emerald-500 text-white" : "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" ].join(" ")}
          onClick={() => onCompleteGoal(goal.id)}
          type="button"
        >
          <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24">
            {goal.completed ? <path d="M5 12.5 10 17l9-10" /> : <circle cx="12" cy="12" r="7" />}
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start gap-2">
            <p className={`text-sm font-black text-zinc-800 ${goal.completed ? "sketch-strike text-zinc-500" : ""}`}>{goal.title}</p>
            {emphasis && <span className={`rounded-full px-2 py-1 text-[0.65rem] font-black uppercase ${emphasisToneClasses[emphasis.tone]}`}>{emphasis.label}</span>}
          </div>
          <p className="mt-1 text-xs font-bold text-zinc-500">{goal.startTime && goal.endTime ? `${goal.startTime} - ${goal.endTime}` : goal.category || "Planning"}</p>
        </div>
      </div>
      {goal.minimumWin && <MinimumWinSection goal={goal} onComplete={onCompleteMinimumWin} />}
    </article>
  );
}

function TodayGoalsBoard({ capacity, goals, lowEnergy, onCompleteGoal, onCompleteMinimumWin, onOpenCalendar }) {
  const [showLater, setShowLater] = useState(false);
  const effectiveCapacity = lowEnergy ? "overwhelmed" : capacity;
  const incompleteGoals = goals.filter((goal) => !goal.completed);
  const indexes = new Map(incompleteGoals.map((goal, index) => [goal.id, index]));
  const { visibleGoals, laterGoals } = splitGoalsForCapacity(goals, effectiveCapacity);
  const limitedGoals = effectiveCapacity === "overwhelmed" && !showLater ? visibleGoals : goals;
  const displayedGoals = limitedGoals.slice(0, effectiveCapacity === "overwhelmed" && !showLater ? limitedGoals.length : 3);
  const hiddenCount = effectiveCapacity === "overwhelmed" && !showLater ? laterGoals.length : Math.max(goals.length - displayedGoals.length, 0);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-amber-200 bg-amber-100 p-4 shadow-xl shadow-amber-200/50">
      <div className="rounded-[1.5rem] border border-amber-300/70 bg-[linear-gradient(135deg,#f8dca2_0%,#e9bd72_100%)] p-4 shadow-inner">
        <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50/90 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div><p className="text-xs font-black uppercase text-pink-500">Bulletin board</p><h2 className="mt-1 text-2xl font-black text-zinc-950">Goals for Today</h2><p className="mt-1 text-xs font-bold text-amber-800">{lowEnergy ? "Only your next step is pinned. The rest is still safe." : "Here's what matters today."}</p></div>
            <span className="mt-1 size-4 shrink-0 rounded-full border-2 border-rose-200 bg-rose-400 shadow-sm" aria-hidden="true" />
          </div>
          <div className="mt-4 space-y-3">
            {displayedGoals.length ? displayedGoals.map((goal) => <GoalCard capacity={effectiveCapacity} goal={goal} incompleteIndex={indexes.get(goal.id)} key={goal.id} onCompleteGoal={onCompleteGoal} onCompleteMinimumWin={onCompleteMinimumWin} />) : <p className="rounded-2xl bg-white/85 p-4 text-sm font-bold text-amber-900">Nothing unfinished is pinned today. You can rest or add something small.</p>}
          </div>
          {hiddenCount > 0 && <button aria-expanded={showLater} className="mt-3 w-full rounded-full bg-white/80 px-4 py-2 text-xs font-black text-amber-900" onClick={() => setShowLater((value) => !value)} type="button">{showLater ? "Show fewer goals" : `Later today (${hiddenCount})`}</button>}
          <button className="mt-4 w-full rounded-full bg-zinc-950 px-5 py-3 font-black text-white" onClick={onOpenCalendar} type="button">Open Planning</button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { classicGoals, completeMinimumWin, completeScheduledGoal, longTermGoals, pandaStats, resilienceState, scheduledGoals, setActivePage } = useAppContext();
  const initial = useMemo(() => getDailyWellbeing(), []);
  const [feeling, setFeeling] = useState(initial.feeling);
  const [lowEnergy, setLowEnergy] = useState(initial.lowEnergy);
  const [pandaPanel, setPandaPanel] = useState("");
  const capacity = lowEnergy ? "overwhelmed" : (feelingCapacityMap[feeling] || "okay");
  const todaysGoals = useMemo(() => scheduledGoals.filter((goal) => goal.date === todayKey()).sort((a, b) => (a.startTime || "").localeCompare(b.startTime || "")), [scheduledGoals]);
  const safePandaStats = {
    ...DEFAULT_PANDA_STATS,
    ...(pandaStats && typeof pandaStats === "object" ? pandaStats : {}),
    level: Number.isInteger(pandaStats?.level) && pandaStats.level >= 1 ? pandaStats.level : DEFAULT_PANDA_STATS.level,
    streak: Number.isInteger(pandaStats?.streak) && pandaStats.streak >= 0 ? pandaStats.streak : 0,
    xp: Number.isFinite(pandaStats?.xp) && pandaStats.xp >= 0 ? pandaStats.xp : 0,
  };
  const updateFeeling = useCallback((value) => setFeeling(value), []);

  useEffect(() => {
    document.documentElement.classList.toggle("low-energy-mode", lowEnergy);
    return () => document.documentElement.classList.remove("low-energy-mode");
  }, [lowEnergy]);

  function toggleLowEnergy(value) {
    setLowEnergy(value);
    saveDailyWellbeing({ lowEnergy: value });
    if (value) setPandaPanel("");
  }

  const openPlanning = () => setActivePage("calendar", { planningTab: "calendar" });

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6">
      <header className="relative overflow-hidden rounded-[2rem] bg-white/70 p-5 pr-20 shadow-xl shadow-zinc-200/60 backdrop-blur sm:p-6 sm:pr-28">
        <BambooDecoration className="pointer-events-none absolute -right-2 -top-3 size-28 rotate-12 text-emerald-500 opacity-25" />
        <p className="text-sm font-black text-pink-500">{greetingForNow()}</p>
        <h1 className="mt-1 text-3xl font-black text-zinc-950 sm:text-4xl">What does your panda get to remember today?</h1>
      </header>

      <section>
        <GentleCheckIn initialFeeling={initial.feeling} onFeelingChange={updateFeeling} />
      </section>

      <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
        <PandaHomePanel activePanel={pandaPanel} lowEnergy={lowEnergy} onPanelChange={setPandaPanel} onToggleLowEnergy={toggleLowEnergy} pandaStats={safePandaStats} />
        <TodayGoalsBoard capacity={capacity} goals={todaysGoals} lowEnergy={lowEnergy} onCompleteGoal={completeScheduledGoal} onCompleteMinimumWin={completeMinimumWin} onOpenCalendar={openPlanning} />
      </section>

      <section className="grid items-start gap-5 lg:grid-cols-2">
        <ResilienceReturnsCard currentStreak={safePandaStats.streak} resilienceState={resilienceState} />
        <CalmCorner onOpenJournal={() => setActivePage("journal")} />
      </section>

      <PandaCoach capacity={capacity} dailyGoals={classicGoals} longTermGoals={longTermGoals} todaysGoals={todaysGoals} />
    </main>
  );
}