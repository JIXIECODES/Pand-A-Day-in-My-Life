import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { isPastDeadline } from "../utils/dateUtils.js";

const emptyForm = {
  title: "",
  description: "",
  note: "",
  deadline: "",
  startTime: "",
  endTime: "",
  category: "Personal",
  difficulty: "easy",
};

export default function GoalModal({ open, onClose }) {
  const { addGoal, editGoal, goalsByDate, removeGoal, selectedDate, startFocus, toggleGoal } = useAppContext();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      setEditingId("");
    }
  }, [open]);

  if (!open) return null;

  const goals = goalsByDate[selectedDate] || [];

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitGoal(event) {
    event.preventDefault();
    if (!form.title.trim()) return;

    if (editingId) {
      editGoal(selectedDate, editingId, form);
      setEditingId("");
    } else {
      addGoal(selectedDate, form);
    }

    setForm(emptyForm);
  }

  function beginEdit(goal) {
    setEditingId(goal.id);
    setForm({
      title: goal.title,
      description: goal.description || "",
      note: goal.note || "",
      deadline: goal.deadline || "",
      startTime: goal.startTime || "",
      endTime: goal.endTime || "",
      category: goal.category || "Personal",
      difficulty: goal.difficulty || "easy",
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-white/35 p-3 backdrop-blur-md sm:place-items-center">
      <div className="animate-modal-in max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 p-5">
          <div>
            <p className="text-sm font-black text-pink-500">Goals, notes, deadlines</p>
            <h2 className="text-2xl font-black text-zinc-950">{dayjs(selectedDate).format("dddd, MMMM D")}</h2>
          </div>
          <button className="grid size-10 place-items-center rounded-full bg-zinc-100 font-black" onClick={onClose} type="button">
            X
          </button>
        </div>

        <div className="grid max-h-[78vh] gap-5 overflow-y-auto p-5 lg:grid-cols-[1fr_1.2fr]">
          <form className="space-y-3" onSubmit={submitGoal}>
            <input className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-bold outline-none focus:border-pink-300" name="title" onChange={updateField} placeholder="Goal title" value={form.title} />
            <textarea className="min-h-24 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-pink-300" name="description" onChange={updateField} placeholder="Description" value={form.description} />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-black text-zinc-600">
                Deadline
                <input className="mt-1 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-pink-300" name="deadline" onChange={updateField} type="time" value={form.deadline} />
              </label>
              <label className="text-sm font-black text-zinc-600">
                Difficulty
                <select className="mt-1 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-pink-300" name="difficulty" onChange={updateField} value={form.difficulty}>
                  <option value="easy">Easy - 10 XP</option>
                  <option value="medium">Medium - 20 XP</option>
                  <option value="hard">Hard - 35 XP</option>
                </select>
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="text-sm font-black text-zinc-600">
                Start
                <input className="mt-1 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-pink-300" name="startTime" onChange={updateField} type="time" value={form.startTime} />
              </label>
              <label className="text-sm font-black text-zinc-600">
                End
                <input className="mt-1 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-pink-300" name="endTime" onChange={updateField} type="time" value={form.endTime} />
              </label>
              <label className="text-sm font-black text-zinc-600">
                Category
                <select className="mt-1 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-pink-300" name="category" onChange={updateField} value={form.category}>
                  <option>Personal</option>
                  <option>School</option>
                  <option>Work</option>
                  <option>Health</option>
                  <option>Creative</option>
                </select>
              </label>
            </div>
            <textarea className="min-h-24 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-pink-300" name="note" onChange={updateField} placeholder="Notes for this day" value={form.note} />
            <button className="w-full rounded-full bg-zinc-950 px-5 py-3 font-black text-white" type="submit">
              {editingId ? "Save changes" : "Add goal"}
            </button>
          </form>

          <div className="space-y-3">
            {goals.length === 0 ? (
              <div className="rounded-3xl bg-amber-50 p-5 text-sm font-bold text-amber-800">No goals yet. One small step is enough to begin.</div>
            ) : (
              goals.map((goal) => {
                const gentleMiss = !goal.completed && isPastDeadline(selectedDate, goal.deadline);
                return (
                  <article className={`rounded-3xl border p-4 ${goal.completed ? "border-emerald-200 bg-emerald-50" : "border-zinc-100 bg-zinc-50"}`} key={goal.id}>
                    <div className="flex items-start gap-3">
                      <input checked={goal.completed} className="mt-1 size-5 accent-emerald-500" onChange={() => toggleGoal(selectedDate, goal.id)} type="checkbox" />
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-black text-zinc-950 ${goal.completed ? "line-through" : ""}`}>{goal.title}</h3>
                        <p className="mt-1 text-xs font-black uppercase text-pink-500">{goal.difficulty || "easy"} goal</p>
                        {goal.description && <p className="mt-2 text-sm font-semibold text-zinc-600">{goal.description}</p>}
                        {goal.deadline && <p className="mt-2 text-xs font-black text-zinc-500">Deadline {goal.deadline}</p>}
                        {goal.startTime && goal.endTime && (
                          <p className="mt-2 text-xs font-black text-sky-600">
                            Scheduled {goal.startTime} - {goal.endTime} - {goal.category || "Personal"}
                          </p>
                        )}
                        {gentleMiss && <p className="mt-2 rounded-2xl bg-sky-100 p-3 text-sm font-bold text-sky-700">Your panda is a little sleepy with this deadline, but tomorrow is fresh.</p>}
                        {goal.note && <p className="mt-2 rounded-2xl bg-white p-3 text-sm font-semibold text-zinc-600">{goal.note}</p>}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <button className="rounded-full bg-white px-3 py-2 text-sm font-black" onClick={() => beginEdit(goal)} type="button">Edit</button>
                        <button className="rounded-full bg-emerald-100 px-3 py-2 text-sm font-black text-emerald-700" onClick={() => startFocus({ ...goal, date: selectedDate })} type="button">Focus</button>
                        <button className="rounded-full bg-rose-100 px-3 py-2 text-sm font-black text-rose-700" onClick={() => removeGoal(selectedDate, goal.id)} type="button">Delete</button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
