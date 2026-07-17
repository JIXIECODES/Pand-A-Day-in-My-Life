import React, { useState } from "react";

export default function ResilienceReturnsCard({ resilienceState }) {
  const [open, setOpen] = useState(false);
  const count = resilienceState?.resilienceReturnCount || 0;

  return (
    <section className="rounded-[2rem] border border-emerald-100 bg-white/75 p-5 shadow-xl shadow-zinc-200/60" aria-labelledby="resilience-returns-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-emerald-600">Resilience Returns</p>
          <h2 className="mt-1 text-3xl font-black text-zinc-950" id="resilience-returns-title">{count}</h2>
          <p className="mt-1 text-sm font-bold leading-6 text-zinc-500">How many times you came back after missing a day.</p>
        </div>
        <button
          aria-expanded={open}
          aria-controls="resilience-returns-info"
          aria-label="Learn about Resilience Returns"
          className="grid min-h-11 min-w-11 place-items-center rounded-full bg-emerald-50 text-sm font-black text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          i
        </button>
      </div>
      {open && (
        <p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm font-bold leading-6 text-emerald-900" id="resilience-returns-info">
          Resilience Returns increase when you complete meaningful progress after missing at least one full day.
        </p>
      )}
      {count === 0 && (
        <p className="mt-4 rounded-2xl bg-zinc-50 p-3 text-sm font-bold leading-6 text-zinc-500">
          Your returns will appear here when you resume after a missed day.
        </p>
      )}
    </section>
  );
}