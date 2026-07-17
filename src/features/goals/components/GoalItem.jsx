import React, { useState } from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { GOAL_CATEGORIES } from "../../../shared/utils/storage.js";
import MinimumWinSection from "./MinimumWinSection.jsx";

function goalToForm(goal) {
  return {
    title: goal.title || "",
    description: goal.description || "",
    minimumWin: typeof goal.minimumWin === "string" ? goal.minimumWin : "",
    difficulty: goal.difficulty || "easy",
    category: goal.category || "Personal",
  };
}

export default function GoalItem({ date, goal }) {
  const {
    completeMinimumWin,
    editClassicGoal,
    editGoal,
    editLongTermGoal,
    editScheduledGoal,
    removeClassicGoal,
    removeGoal,
    removeLongTermGoal,
    removeScheduledGoal,
    setTimerGoal,
    toggleClassicGoal,
    toggleGoal,
    toggleLongTermGoal,
    toggleScheduledGoal,
  } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => goalToForm(goal));
  const isClassic = goal.type === "classic";
  const isLongTerm = goal.type === "longTerm";
  const isScheduled = goal.type === "scheduled";

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function saveEdit(event) {
    event.preventDefault();
    if (!form.title.trim()) return;

    const cleanedForm = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      minimumWin: form.minimumWin.trim(),
    };

    if (isScheduled) {
      editScheduledGoal(goal.id, cleanedForm);
    } else if (isClassic) {
      editClassicGoal(goal.id, cleanedForm);
    } else if (isLongTerm) {
      editLongTermGoal(goal.id, cleanedForm);
    } else {
      editGoal(date, goal.id, cleanedForm);
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <form className="rounded-3xl bg-zinc-50 p-4" onSubmit={saveEdit}>
        <div className="grid gap-3">
          <input
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-bold outline-none focus:border-pink-300"
            name="title"
            onChange={updateField}
            placeholder="Goal title"
            value={form.title}
          />
          <textarea
            className="min-h-20 resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-pink-300"
            name="description"
            onChange={updateField}
            placeholder="Description or note"
            value={form.description}
          />
          <label className="text-xs font-black uppercase text-zinc-500">
            Minimum Win
            <input
              className="mt-1 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-bold normal-case outline-none focus:border-emerald-300"
              name="minimumWin"
              onChange={updateField}
              placeholder="Review five flashcards"
              value={form.minimumWin}
            />
            <span className="mt-1 block text-[0.68rem] font-bold normal-case text-zinc-400">A small version that still counts as progress.</span>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-black uppercase text-zinc-500">
              Difficulty
              <select className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2" name="difficulty" onChange={updateField} value={form.difficulty}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <label className="text-xs font-black uppercase text-zinc-500">
              Category
              <select className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2" name="category" onChange={updateField} value={form.category}>
                {GOAL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-black text-white" type="submit">
              Save
            </button>
            <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-zinc-700" onClick={() => setEditing(false)} type="button">
              Cancel
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <article className={`rounded-3xl p-4 ${goal.completed ? "bg-emerald-50" : "bg-zinc-50"}`}>
      <div className="flex items-start gap-3">
        <input
          checked={goal.completed}
          className="mt-1 size-5 accent-emerald-500"
          onChange={() => {
            if (isClassic) toggleClassicGoal(goal.id);
            else if (isLongTerm) toggleLongTermGoal(goal.id);
            else if (isScheduled) toggleScheduledGoal(goal.id);
            else toggleGoal(date, goal.id);
          }}
          type="checkbox"
        />
        <div className="min-w-0 flex-1">
          <h3 className={`font-black text-zinc-900 ${goal.completed ? "line-through" : ""}`}>{goal.title}</h3>
          {goal.description && <p className="mt-1 text-sm font-semibold text-zinc-600">{goal.description}</p>}
          {(isClassic || isLongTerm || isScheduled) && (
            <p className="mt-2 text-xs font-black uppercase text-zinc-400">
              {goal.linkedLabel || "Created"} {goal.createdAt ? new Date(goal.createdAt).toLocaleDateString() : ""}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-black uppercase">
            <span className="rounded-full bg-pink-100 px-3 py-1 text-pink-700">{goal.difficulty || "easy"}</span>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">{goal.category || "Personal"}</span>
            {goal.xpAwarded && <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">XP earned</span>}
          </div>
          <MinimumWinSection goal={date ? { ...goal, date } : goal} onComplete={completeMinimumWin} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-zinc-700" onClick={() => setEditing(true)} type="button">
          Edit
        </button>
        <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-zinc-700" onClick={() => setTimerGoal(isClassic || isLongTerm || isScheduled ? goal : { ...goal, date })} type="button">
          Focus
        </button>
        <button className="rounded-full bg-rose-100 px-4 py-2 text-sm font-black text-rose-700" onClick={() => {
          if (isClassic) removeClassicGoal(goal.id);
          else if (isLongTerm) removeLongTermGoal(goal.id);
          else if (isScheduled) removeScheduledGoal(goal.id);
          else removeGoal(date, goal.id);
        }} type="button">
          Delete
        </button>
      </div>
    </article>
  );
}
