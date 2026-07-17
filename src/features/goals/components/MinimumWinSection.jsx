import React from "react";

export default function MinimumWinSection({ goal, onComplete }) {
  const minimumWin = typeof goal.minimumWin === "string" ? goal.minimumWin.trim() : "";
  if (!minimumWin || goal.completed) return null;

  const completed = Boolean(goal.minimumWinCompleted);
  const completedDate = goal.minimumWinCompletedAt ? new Date(goal.minimumWinCompletedAt) : null;
  const completedLabel = completedDate && !Number.isNaN(completedDate.getTime())
    ? `Minimum progress completed ${completedDate.toLocaleDateString()}`
    : "Minimum progress completed";

  return (
    <section className="mt-3 rounded-2xl border border-emerald-100 bg-white/80 p-3" aria-label="Minimum Win progress">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.08em] text-emerald-700">Minimum Win</p>
          <p className="mt-1 text-sm font-bold leading-5 text-zinc-700">{minimumWin}</p>
          {completed && (
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">
              <span aria-hidden="true">Done</span>
              <span>{completedLabel}</span>
            </p>
          )}
        </div>
        <button
          aria-disabled={completed}
          className={[
            "min-h-10 rounded-full px-4 py-2 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-emerald-100",
            completed
              ? "cursor-not-allowed bg-zinc-100 text-zinc-500"
              : "bg-emerald-100 text-emerald-800 hover:-translate-y-0.5 hover:bg-emerald-200 active:translate-y-0",
          ].join(" ")}
          disabled={completed}
          onClick={() => onComplete(goal)}
          type="button"
        >
          {completed ? "Minimum Win done" : "Complete Minimum Win"}
        </button>
      </div>
    </section>
  );
}
