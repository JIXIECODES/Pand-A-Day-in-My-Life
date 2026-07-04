import React, { useState } from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";

function goalToForm(goal) {
  return {
    title: goal.title || "",
    description: goal.description || "",
    note: goal.note || "",
    difficulty: goal.difficulty || "easy",
    startTime: goal.startTime || "",
    endTime: goal.endTime || "",
    category: goal.category || "Personal",
  };
}

export default function GoalItem({ date, goal }) {
  const { editGoal, removeGoal, setTimerGoal, toggleGoal } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => goalToForm(goal));

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function saveEdit(event) {
    event.preventDefault();
    if (!form.title.trim()) return;
    editGoal(date, goal.id, form);
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
            placeholder="Description"
            value={form.description}
          />
          <textarea
            className="min-h-20 resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-pink-300"
            name="note"
            onChange={updateField}
            placeholder="Note"
            value={form.note}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-black uppercase text-zinc-500">
              Difficulty
              <select className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2" name="difficulty" onChange={updateField} value={form.difficulty}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <label className="text-xs font-black uppercase text-zinc-500">
              Start
              <input className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2" name="startTime" onChange={updateField} type="time" value={form.startTime} />
            </label>
            <label className="text-xs font-black uppercase text-zinc-500">
              End
              <input className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2" name="endTime" onChange={updateField} type="time" value={form.endTime} />
            </label>
            <label className="text-xs font-black uppercase text-zinc-500">
              Category
              <select className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2" name="category" onChange={updateField} value={form.category}>
                <option>Personal</option>
                <option>School</option>
                <option>Work</option>
                <option>Health</option>
                <option>Creative</option>
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
          onChange={() => toggleGoal(date, goal.id)}
          type="checkbox"
        />
        <div className="min-w-0 flex-1">
          <h3 className={`font-black text-zinc-900 ${goal.completed ? "line-through" : ""}`}>{goal.title}</h3>
          {goal.description && <p className="mt-1 text-sm font-semibold text-zinc-600">{goal.description}</p>}
          {goal.note && <p className="mt-2 rounded-2xl bg-white/80 p-3 text-sm font-semibold text-zinc-600">{goal.note}</p>}
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-black uppercase">
            <span className="rounded-full bg-pink-100 px-3 py-1 text-pink-700">{goal.difficulty || "easy"}</span>
            {goal.startTime && goal.endTime && (
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">
                {goal.startTime} - {goal.endTime}
              </span>
            )}
            {goal.xpAwarded && <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">XP earned</span>}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-zinc-700" onClick={() => setEditing(true)} type="button">
          Edit
        </button>
        <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-zinc-700" onClick={() => setTimerGoal({ ...goal, date })} type="button">
          Focus
        </button>
        <button className="rounded-full bg-rose-100 px-4 py-2 text-sm font-black text-rose-700" onClick={() => removeGoal(date, goal.id)} type="button">
          Delete
        </button>
      </div>
    </article>
  );
}
