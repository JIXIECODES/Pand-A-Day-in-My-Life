import React, { useEffect, useMemo, useState } from "react";
import { todayKey } from "../../calendar/utils/dateUtils.js";
import { getCapacityMessage, capacityOptions, getCapacityOption } from "../utils/capacityRecommendations.js";
import { getStoredDailyCapacity, saveDailyCapacity } from "../services/capacityStorage.js";

export default function DailyCapacityCheckIn({ onCapacityChange = () => {} }) {
  const localDate = useMemo(() => todayKey(), []);
  const initialCapacity = useMemo(() => getStoredDailyCapacity(localDate).capacity, [localDate]);
  const [capacity, setCapacity] = useState(initialCapacity);
  const [expanded, setExpanded] = useState(!initialCapacity);
  const selectedOption = getCapacityOption(capacity);

  useEffect(() => {
    onCapacityChange(capacity);
  }, [capacity, onCapacityChange]);

  function chooseCapacity(nextCapacity) {
    const saved = saveDailyCapacity(nextCapacity, localDate);
    setCapacity(saved.capacity);
  }

  if (!expanded && selectedOption) {
    return (
      <button
        aria-expanded="false"
        className="flex w-full items-center justify-between gap-3 rounded-[1.5rem] border border-emerald-100 bg-white/85 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100 active:translate-y-0"
        onClick={() => setExpanded(true)}
        type="button"
      >
        <span>
          <span className="block text-xs font-black uppercase text-emerald-600">Today's capacity</span>
          <span className="mt-1 block text-base font-black text-zinc-950">Today's capacity: {selectedOption.label}</span>
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Change</span>
      </button>
    );
  }

  return (
    <section className="rounded-[1.5rem] border border-emerald-100 bg-white/85 p-4 shadow-sm" aria-labelledby="daily-capacity-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-emerald-600">Daily check-in</p>
          <h2 className="mt-1 text-xl font-black text-zinc-950" id="daily-capacity-title">How is your capacity today?</h2>
          <p className="mt-1 text-sm font-semibold text-zinc-500">Pick what fits. You can skip this or change it later.</p>
        </div>
        {selectedOption && (
          <button
            className="self-start rounded-full bg-zinc-950 px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 active:translate-y-0"
            onClick={() => setExpanded(false)}
            type="button"
          >
            Minimize
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {capacityOptions.map((option) => {
          const selected = option.id === capacity;
          const descriptionId = `capacity-${option.id}-description`;
          return (
            <button
              aria-describedby={descriptionId}
              aria-pressed={selected}
              className={[
                "min-h-24 rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-4 focus:ring-emerald-100",
                selected
                  ? "border-emerald-300 bg-emerald-50 shadow-inner"
                  : "border-zinc-200 bg-white hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40",
              ].join(" ")}
              key={option.id}
              onClick={() => chooseCapacity(option.id)}
              type="button"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-base font-black text-zinc-950">{option.label}</span>
                <span className={[
                  "grid min-h-7 shrink-0 place-items-center rounded-full border px-2 text-[0.65rem] font-black",
                  selected ? "border-emerald-400 bg-emerald-500 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-400",
                ].join(" ")}>{selected ? "Selected" : ""}</span>
              </span>
              <span className="mt-2 block text-sm font-semibold leading-5 text-zinc-500" id={descriptionId}>{option.description}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-900" aria-live="polite">
        {getCapacityMessage(capacity)}
      </p>
    </section>
  );
}

