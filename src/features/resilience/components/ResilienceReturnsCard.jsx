import React, { useRef, useState } from "react";

export default function ResilienceReturnsCard({ currentStreak = 0, resilienceState }) {
  const [open, setOpen] = useState(false);
  const infoButtonRef = useRef(null);
  const count = Number.isInteger(resilienceState?.resilienceReturnCount)
    ? resilienceState.resilienceReturnCount
    : 0;
  const safeStreak = Number.isInteger(currentStreak) && currentStreak >= 0 ? currentStreak : 0;

  function closeInfo() {
    setOpen(false);
    infoButtonRef.current?.focus();
  }

  return (
    <section className="rounded-[1.5rem] border border-emerald-100 bg-white/80 p-4 shadow-sm" aria-labelledby="resilience-returns-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-emerald-600">Progress rhythm</p>
          <h2 className="mt-1 text-lg font-black text-zinc-950" id="resilience-returns-title">Streak and Resilience</h2>
          <p className="mt-1 text-sm font-semibold text-zinc-500">Two ways your panda notices progress.</p>
        </div>
        <button
          aria-expanded={open}
          aria-controls="resilience-returns-info"
          aria-label="Learn about Resilience Returns"
          className="grid min-h-11 min-w-11 place-items-center rounded-full bg-emerald-50 text-sm font-black text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          onClick={() => setOpen((current) => !current)}
          ref={infoButtonRef}
          type="button"
        >
          i
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-zinc-50 p-3">
          <p className="text-xs font-black uppercase text-zinc-500">Current streak</p>
          <p className="mt-1 text-3xl font-black text-zinc-950">{safeStreak}</p>
          <p className="mt-1 text-xs font-bold text-zinc-500">Consecutive productive days.</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3">
          <p className="text-xs font-black uppercase text-emerald-700">Resilience Returns</p>
          <p className="mt-1 text-3xl font-black text-emerald-900">{count}</p>
          <p className="mt-1 text-xs font-bold text-emerald-800">How many times you came back after missing a day.</p>
        </div>
      </div>

      {open && (
        <div
          className="mt-4 rounded-2xl bg-white p-3 text-sm font-bold leading-6 text-zinc-700 ring-1 ring-emerald-100"
          id="resilience-returns-info"
          role="region"
        >
          <p>Resilience Returns increase when you complete meaningful progress after missing at least one full day.</p>
          <button
            className="mt-3 rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-800 transition hover:bg-emerald-200 focus:outline-none focus:ring-4 focus:ring-emerald-100"
            onClick={closeInfo}
            type="button"
          >
            Close
          </button>
        </div>
      )}

      {count === 0 && (
        <p className="mt-4 rounded-2xl bg-zinc-50 p-3 text-sm font-bold leading-6 text-zinc-500">
          Your returns will appear here when you resume after a missed day.
        </p>
      )}
    </section>
  );
}