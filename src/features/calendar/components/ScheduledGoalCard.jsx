import React from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { categoryKey } from "../../../shared/utils/storage.js";

export default function ScheduledGoalCard({ goal, onEdit }) {
  const { categoryColors, removeScheduledGoal, toggleScheduledGoal } = useAppContext();
  const color = categoryColors[categoryKey(goal.category)] || categoryColors.other || "#6b7280";
  const goalTypeLabel = goal.goalType === "long-term" ? "Long-Term" : "Daily";

  return (
    <article
      className="rounded-2xl border p-3 shadow-sm"
      style={{
        backgroundColor: goal.completed ? "#ecfdf5" : `${color}18`,
        borderColor: goal.completed ? "#a7f3d0" : color,
      }}
    >
      <div className="flex items-start gap-3">
        <input
          checked={goal.completed}
          className="mt-1 size-5 accent-emerald-500"
          onChange={() => toggleScheduledGoal(goal.id)}
          type="checkbox"
        />
        <div className="min-w-0 flex-1">
          <h3 className={`font-black text-zinc-950 ${goal.completed ? "sketch-strike text-zinc-500" : ""}`}>{goal.title}</h3>
          <p className="mt-1 text-xs font-black uppercase text-zinc-500">
            {goal.startTime} - {goal.endTime} - {goalTypeLabel} - {goal.category} - {goal.difficulty || "easy"}
          </p>
          <span className="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase text-white" style={{ backgroundColor: color }}>
            {goal.category || "Other"}
          </span>
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
