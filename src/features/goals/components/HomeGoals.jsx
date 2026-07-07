import React, { useState } from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { GOAL_CATEGORIES } from "../../../shared/utils/storage.js";
import GoalItem from "./GoalItem.jsx";

const emptyForm = {
  title: "",
  description: "",
  category: "Personal",
  difficulty: "easy",
};

const sectionConfig = {
  daily: {
    eyebrow: "Today and soon",
    title: "Daily Goals",
    description: "Simple goals you want to complete soon without scheduling an exact time.",
    addLabel: "Add Daily Goal",
    saveLabel: "Save Daily Goal",
    empty: "No daily goals yet. Add one cozy goal when you are ready.",
    placeholder: "Finish homework",
    error: "Daily goal title is required.",
  },
  longTerm: {
    eyebrow: "Long-term growth",
    title: "Long-Term Goals",
    description: "Bigger goals that help your panda grow with you over time.",
    addLabel: "Add Long-Term Goal",
    saveLabel: "Save Long-Term Goal",
    empty: "No long-term goals yet. Add one bigger growth goal when you are ready.",
    placeholder: "Build my portfolio",
    error: "Long-term goal title is required.",
  },
};

export default function HomeGoals({ kind = "daily" }) {
  const {
    addClassicGoal,
    addLongTermGoal,
    classicGoals,
    longTermGoals,
  } = useAppContext();
  const config = sectionConfig[kind] || sectionConfig.daily;
  const goals = kind === "longTerm" ? longTermGoals : classicGoals;
  const addGoal = kind === "longTerm" ? addLongTermGoal : addClassicGoal;
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    setError("");
    if (!form.title.trim()) {
      setError(config.error);
      return;
    }

    addGoal(form);
    setForm(emptyForm);
    setShowForm(false);
  }

  return (
    <section className="rounded-[2rem] bg-white/75 p-5 shadow-xl shadow-zinc-200/60">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-pink-500">{config.eyebrow}</p>
          <h2 className="text-2xl font-black text-zinc-950">{config.title}</h2>
          <p className="mt-1 text-sm font-semibold text-zinc-500">{config.description}</p>
        </div>
        <button className="rounded-full bg-zinc-950 px-4 py-2 font-black text-white" onClick={() => setShowForm((current) => !current)} type="button">
          {showForm ? "Close" : config.addLabel}
        </button>
      </div>

      {showForm && (
        <form className="mb-4 rounded-3xl bg-zinc-50 p-4" onSubmit={submit}>
          <div className="grid gap-3">
            <label className="text-sm font-black text-zinc-600" htmlFor={`${kind}-title`}>
              Goal title
              <input
                className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-bold outline-none focus:border-pink-300"
                id={`${kind}-title`}
                name="title"
                onChange={updateField}
                placeholder={config.placeholder}
                value={form.title}
              />
              {error && <span className="mt-1 block text-xs font-bold text-rose-500">{error}</span>}
            </label>

            <label className="text-sm font-black text-zinc-600" htmlFor={`${kind}-description`}>
              Description or note
              <textarea
                className="mt-1 min-h-24 w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-pink-300"
                id={`${kind}-description`}
                name="description"
                onChange={updateField}
                placeholder={kind === "longTerm" ? "Why this goal matters over time" : "What does done look like?"}
                value={form.description}
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-black text-zinc-600" htmlFor={`${kind}-category`}>
                Category
                <select
                  className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
                  id={`${kind}-category`}
                  name="category"
                  onChange={updateField}
                  value={form.category}
                >
                  {GOAL_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-black text-zinc-600" htmlFor={`${kind}-difficulty`}>
                Difficulty
                <select
                  className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3"
                  id={`${kind}-difficulty`}
                  name="difficulty"
                  onChange={updateField}
                  value={form.difficulty}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
            </div>

            <button className="rounded-full bg-emerald-400 px-5 py-3 font-black text-emerald-950" type="submit">
              {config.saveLabel}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {goals.length > 0 ? (
          goals.map((goal) => <GoalItem goal={goal} key={goal.id} />)
        ) : (
          <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">
            {config.empty}
          </p>
        )}
      </div>
    </section>
  );
}
