import React, { useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const presets = [15, 25, 45, 60];

export default function TimerSettings() {
  const { settings, updateSettings } = useAppContext();
  const [customMinutes, setCustomMinutes] = useState(settings.timerDurationMinutes || 25);

  function saveDuration(minutes) {
    const safeMinutes = Math.max(1, Math.min(240, Number(minutes) || 25));
    setCustomMinutes(safeMinutes);
    updateSettings({ timerDurationMinutes: safeMinutes });
  }

  return (
    <section className="rounded-[1.5rem] bg-white/10 p-4">
      <p className="text-xs font-black uppercase text-emerald-200">Timer duration</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {presets.map((minutes) => (
          <button
            className={[
              "rounded-full px-3 py-2 text-sm font-black transition",
              settings.timerDurationMinutes === minutes
                ? "bg-emerald-300 text-zinc-950"
                : "bg-white/10 text-white hover:bg-white/20",
            ].join(" ")}
            key={minutes}
            onClick={() => saveDuration(minutes)}
            type="button"
          >
            {minutes} min
          </button>
        ))}
      </div>
      <label className="mt-3 block text-xs font-black uppercase text-emerald-200">
        Custom minutes
        <div className="mt-2 flex gap-2">
          <input
            className="min-w-0 flex-1 rounded-full border border-white/20 bg-white px-4 py-2 text-sm font-black text-zinc-950 outline-none focus:border-emerald-300"
            max="240"
            min="1"
            onChange={(event) => setCustomMinutes(event.target.value)}
            type="number"
            value={customMinutes}
          />
          <button
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white hover:bg-white/20"
            onClick={() => saveDuration(customMinutes)}
            type="button"
          >
            Set
          </button>
        </div>
      </label>
    </section>
  );
}
