import React, { useMemo, useState } from "react";
import {
  coachActions,
  getSmartCoachResponse,
  matchCoachIntent,
} from "../services/smartCoachService.js";

export default function PandaCoach({
  dailyGoals = [],
  longTermGoals = [],
  todaysGoals = [],
}) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(() => ({
    title: "Hi, I am your Panda Smart Coach.",
    message: "I can help you plan, focus, choose your next task, or break a goal into smaller steps.",
  }));

  const context = useMemo(
    () => ({
      dailyGoals: Array.isArray(dailyGoals) ? dailyGoals : [],
      longTermGoals: Array.isArray(longTermGoals) ? longTermGoals : [],
      todaysGoals: Array.isArray(todaysGoals) ? todaysGoals : [],
    }),
    [dailyGoals, longTermGoals, todaysGoals],
  );

  function runCoachAction(actionId) {
    setResponse(getSmartCoachResponse(actionId, context));
  }

  function submitInput(event) {
    event.preventDefault();
    runCoachAction(matchCoachIntent(input));
  }

  return (
    <section className="rounded-[2rem] border border-emerald-100 bg-white/75 p-5 shadow-xl shadow-zinc-200/60 backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-emerald-600">Panda Smart Coach</p>
          <h2 className="mt-1 text-2xl font-black text-zinc-950">What should we figure out next?</h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold text-zinc-500">
            Ask for a tiny plan, a focus nudge, or the next best goal to work on.
          </p>
        </div>
        <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
          Always local. No API needed.
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4">
        <h3 className="text-lg font-black text-zinc-950">{response.title}</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-zinc-700">{response.message}</p>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {coachActions.map((action) => (
          <button
            className="rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 active:translate-y-0"
            key={action.id}
            onClick={() => runCoachAction(action.id)}
            type="button"
          >
            {action.label}
          </button>
        ))}
      </div>

      <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={submitInput}>
        <label className="sr-only" htmlFor="panda-coach-input">Ask Panda Smart Coach</label>
        <input
          className="min-h-12 flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-800 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
          id="panda-coach-input"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Try: help me focus, plan my day, or break this down"
          value={input}
        />
        <button
          className="rounded-2xl bg-emerald-400 px-5 py-3 font-black text-emerald-950 transition hover:-translate-y-0.5 hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 active:translate-y-0"
          type="submit"
        >
          Ask
        </button>
      </form>
    </section>
  );
}
