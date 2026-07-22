import React, { useState } from "react";
import { feelingOptions, getFeelingOption, saveDailyWellbeing } from "../services/wellbeingStorage.js";
import { saveDailyCapacity } from "../../capacity/services/capacityStorage.js";
import { feelingCapacityMap } from "../services/wellbeingStorage.js";

export default function GentleCheckIn({ initialFeeling = "", onFeelingChange = () => {} }) {
  const [feeling, setFeeling] = useState(initialFeeling);
  const [expanded, setExpanded] = useState(!initialFeeling);
  const selected = getFeelingOption(feeling);

  function chooseFeeling(nextFeeling) {
    setFeeling(nextFeeling);
    saveDailyWellbeing({ feeling: nextFeeling });
    saveDailyCapacity(feelingCapacityMap[nextFeeling]);
    onFeelingChange(nextFeeling);
    setExpanded(false);
  }

  if (!expanded && selected) {
    return (
      <section className="rounded-[1.5rem] border border-emerald-100 bg-white/80 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-emerald-700">Today's check-in · {selected.label}</p>
            <p className="mt-1 text-sm font-bold leading-6 text-zinc-600" aria-live="polite">{selected.response}</p>
          </div>
          <button className="shrink-0 rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800" onClick={() => setExpanded(true)} type="button">
            Change
          </button>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="gentle-check-in-title" className="rounded-[1.5rem] border border-emerald-100 bg-white/80 p-4 shadow-sm">
      <p className="text-xs font-black uppercase text-emerald-700">Gentle check-in</p>
      <h2 className="mt-1 text-xl font-black text-zinc-950" id="gentle-check-in-title">How are you feeling right now?</h2>
      <p className="mt-1 text-sm font-semibold text-zinc-500">Choose what feels closest. There is no wrong answer.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {feelingOptions.map((option) => (
          <button
            aria-pressed={feeling === option.id}
            className={[
              "min-h-11 rounded-full border px-4 py-2 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-emerald-100",
              feeling === option.id ? "border-emerald-500 bg-emerald-500 text-white" : "border-emerald-100 bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
            ].join(" ")}
            key={option.id}
            onClick={() => chooseFeeling(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}