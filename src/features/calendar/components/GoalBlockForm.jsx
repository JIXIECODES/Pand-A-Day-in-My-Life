import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { GOAL_CATEGORIES } from "../../../shared/utils/storage.js";

const emptyForm = {
  title: "",
  description: "",
  minimumWin: "",
  startTime: "09:00",
  endTime: "10:00",
  category: "Personal",
  goalType: "",
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingGoal) {
      setForm({
        title: editingGoal.title,
        description: editingGoal.description || "",
        minimumWin: editingGoal.minimumWin || "",
        startTime: editingGoal.startTime,
        endTime: editingGoal.endTime,
        category: editingGoal.category,
        goalType: editingGoal.goalType || "daily",
        difficulty: editingGoal.difficulty || "easy",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingGoal]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Goal title is required.";
    if (!form.category) nextErrors.category = "Please choose a category.";
    if (!form.goalType) nextErrors.goalType = "Please choose a goal type.";
    if (!form.startTime || !form.endTime) nextErrors.time = "Start and end time are required.";
    if (form.endTime <= form.startTime) {
      nextErrors.time = "End time must be after start time.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const cleanedForm = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      minimumWin: form.minimumWin.trim(),
    };

    if (editingGoal) {
      editScheduledGoal(editingGoal.id, { ...cleanedForm, date });
      onDone();
    } else {
      addScheduledGoal({ ...cleanedForm, date, completed: false });
      setForm(emptyForm);
    }
    setErrors({});
  }

  return (
    <form className="rounded-[2rem] bg-white/80 p-5 shadow-sm" onSubmit={submit}>
      <p className="text-xs font-black uppercase text-pink-500">{editingGoal ? "Edit block" : "Schedule a goal"}</p>
      <div className="mt-4 grid gap-3">
        <input
          className={`rounded-2xl border bg-zinc-50 px-4 py-3 font-bold outline-none focus:border-pink-300 ${errors.title ? "border-rose-200" : "border-zinc-200"}`}
          name="title"
          onChange={updateField}
          placeholder="Goal title"
          value={form.title}
        />
        {errors.title && <p className="text-xs font-bold text-rose-500">{errors.title}</p>}
        <textarea
          className="min-h-24 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-bold outline-none focus:border-pink-300"
          name="description"
          onChange={updateField}
          placeholder="Description or note"
          value={form.description}
        />
        <label className="text-sm font-black text-zinc-600" htmlFor="scheduled-minimum-win">
          Minimum Win
          <input
            className="mt-1 w-full rounded-2xl border border-emerald-100 bg-zinc-50 px-4 py-3 font-bold outline-none focus:border-emerald-300"
            id="scheduled-minimum-win"
            name="minimumWin"
            onChange={updateField}
            placeholder="Review five flashcards"
            value={form.minimumWin}
          />
          <span className="mt-1 block text-xs font-bold text-zinc-400">A small version that still counts as progress.</span>
        </label>
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
        {errors.time && <p className="text-xs font-bold text-rose-500">{errors.time}</p>}
        <label className="text-sm font-black text-zinc-600" htmlFor="scheduled-category">
          Category
          <select
            className="mt-1 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
            id="scheduled-category"
            name="category"
            onChange={updateField}
            value={form.category}
          >
            {GOAL_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <span className="mt-1 block text-xs font-bold text-rose-500">{errors.category}</span>}
        </label>
        <label className="text-sm font-black text-zinc-600" htmlFor="scheduled-goal-type">
          Goal Type
          <select
            className="mt-1 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
            id="scheduled-goal-type"
            name="goalType"
            onChange={updateField}
            value={form.goalType}
          >
            <option value="">Choose a goal type</option>
            <option value="daily">Daily</option>
            <option value="long-term">Long-Term</option>
          </select>
          {errors.goalType && <span className="mt-1 block text-xs font-bold text-rose-500">{errors.goalType}</span>}
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
