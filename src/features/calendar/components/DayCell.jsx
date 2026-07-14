import React from "react";
import { isPastDeadline, todayKey } from "../utils/dateUtils.js";

export default function DayCell({ day, goals, isCurrentMonth, onSelect, scheduledGoals = [] }) {
  const dateKey = day.format("YYYY-MM-DD");
  const completed = goals.filter((goal) => goal.completed).length;
  const hasGentleMiss = goals.some((goal) => !goal.completed && isPastDeadline(dateKey, goal.deadline));
  const isToday = dateKey === todayKey();

  return (
    <button
      className={[
        "min-h-24 rounded-2xl border p-2.5 text-left transition hover:-translate-y-0.5 hover:shadow-lg",
        isToday ? "border-zinc-950 bg-amber-50" : "border-white/80 bg-white/75",
        isCurrentMonth ? "text-zinc-950" : "text-zinc-400 opacity-70",
      ].join(" ")}
      onClick={() => onSelect(dateKey)}
      type="button"
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`grid size-8 place-items-center rounded-full text-sm font-black ${isToday ? "bg-zinc-950 text-white" : "bg-zinc-100"}`}>
          {day.date()}
        </span>
        {completed > 0 && <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-700">{completed} done</span>}
      </div>
      <div className="mt-2 space-y-1">
        {goals.slice(0, 2).map((goal) => (
          <div
            className={[
              "truncate rounded-lg px-2 py-1 text-xs font-bold",
              goal.completed ? "bg-emerald-100 text-emerald-700 line-through" : "bg-pink-100 text-pink-700",
            ].join(" ")}
            key={goal.id}
          >
            {goal.title}
          </div>
        ))}
        {goals.length > 2 && <p className="text-xs font-black text-zinc-400">+{goals.length - 2} more</p>}
        {scheduledGoals.slice(0, 2).map((goal) => (
          <div className="truncate rounded-lg bg-sky-100 px-2 py-1 text-xs font-bold text-sky-700" key={goal.id}>
            {goal.startTime} {goal.title}
          </div>
        ))}
        {scheduledGoals.length > 2 && <p className="text-xs font-black text-sky-500">+{scheduledGoals.length - 2} blocks</p>}
        {hasGentleMiss && <p className="rounded-lg bg-sky-100 px-2 py-1 text-xs font-bold text-sky-700">Panda is resting with this one</p>}
      </div>
    </button>
  );
}
