import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";

const emptyForm = {
  title: "",
  description: "",
  startTime: "09:00",
  endTime: "10:00",
  category: "Personal",
  difficulty: "easy",
};

const hourOptions = Array.from({ length: 25 }, (_, index) => {
  const hour = index;
  const value = `${hour.toString().padStart(2, "0")}:00`;
  const date = new Date();
  date.setHours(hour % 24, 0, 0, 0);
  return {
    value,
    label: hour === 24 ? "12:00 AM (next day)" : date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
  };
});

export default function GoalBlockForm({ date, editingGoal, onDone }) {
  const { addScheduledGoal, editScheduledGoal } = useAppContext();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingGoal) {
      setForm({
        title: editingGoal.title,
        description: editingGoal.description || "",
        startTime: editingGoal.startTime,
        endTime: editingGoal.endTime,
        category: editingGoal.category,
        difficulty: editingGoal.difficulty || "easy",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingGoal]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) return;
    if (form.endTime <= form.startTime) {
      window.alert("End time needs to be after start time.");
      return;
    }

    if (editingGoal) {
      editScheduledGoal(editingGoal.id, { ...form, date });
    } else {
      addScheduledGoal({ ...form, date, completed: false });
    }
    onDone();
  }

  return (
    <form className="rounded-[2rem] bg-white/80 p-5 shadow-sm" onSubmit={submit}>
      <p className="text-xs font-black uppercase text-pink-500">{editingGoal ? "Edit block" : "Schedule a goal"}</p>
      <div className="mt-4 grid gap-3">
        <input
          className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-bold outline-none focus:border-pink-300"
          name="title"
          onChange={updateField}
          placeholder="Goal title"
          value={form.title}
        />
        <textarea
          className="min-h-24 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-bold outline-none focus:border-pink-300"
          name="description"
          onChange={updateField}
          placeholder="Description or note"
          value={form.description}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-black text-zinc-600" htmlFor="scheduled-start-time">
            Start time
            <select
              className="mt-1 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
              id="scheduled-start-time"
              name="startTime"
              onChange={updateField}
              value={form.startTime}
            >
              {hourOptions.slice(0, -1).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-black text-zinc-600" htmlFor="scheduled-end-time">
            End time
            <select
              className="mt-1 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
              id="scheduled-end-time"
              name="endTime"
              onChange={updateField}
              value={form.endTime}
            >
              {hourOptions.slice(1).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="text-sm font-black text-zinc-600" htmlFor="scheduled-category">
          Category
          <select
            className="mt-1 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
            id="scheduled-category"
            name="category"
            onChange={updateField}
            value={form.category}
          >
            <option>Personal</option>
            <option>School</option>
            <option>Work</option>
            <option>Health</option>
            <option>Creative</option>
          </select>
        </label>
        <label className="text-sm font-black text-zinc-600" htmlFor="scheduled-difficulty">
          Difficulty
          <select
            className="mt-1 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
            id="scheduled-difficulty"
            name="difficulty"
            onChange={updateField}
            value={form.difficulty}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <div className="flex gap-2">
          <button className="flex-1 rounded-full bg-zinc-950 px-5 py-3 font-black text-white" type="submit">
            {editingGoal ? "Save block" : "Add block"}
          </button>
          {editingGoal && (
            <button className="rounded-full bg-zinc-100 px-5 py-3 font-black text-zinc-700" onClick={onDone} type="button">
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
