import React from "react";
import { useAppContext } from "../context/AppContext.jsx";

export default function ScheduledGoalCard({ goal, onEdit }) {
  const { removeScheduledGoal, toggleScheduledGoal } = useAppContext();

  return (
    <article
      className={[
        "rounded-2xl border p-3 shadow-sm",
        goal.completed ? "border-emerald-200 bg-emerald-50" : "border-pink-200 bg-pink-50",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <input
          checked={goal.completed}
          className="mt-1 size-5 accent-emerald-500"
          onChange={() => toggleScheduledGoal(goal.id)}
          type="checkbox"
        />
        <div className="min-w-0 flex-1">
          <h3 className={`font-black text-zinc-950 ${goal.completed ? "line-through" : ""}`}>{goal.title}</h3>
          <p className="mt-1 text-xs font-black uppercase text-zinc-500">
            {goal.startTime} - {goal.endTime} - {goal.category} - {goal.difficulty || "medium"}
          </p>
          {goal.description && <p className="mt-2 text-sm font-semibold text-zinc-600">{goal.description}</p>}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="rounded-full bg-white px-3 py-2 text-xs font-black text-zinc-700" onClick={() => onEdit(goal)} type="button">
          Edit
        </button>
        <button className="rounded-full bg-rose-100 px-3 py-2 text-xs font-black text-rose-700" onClick={() => removeScheduledGoal(goal.id)} type="button">
          Delete
        </button>
      </div>
    </article>
  );
}
