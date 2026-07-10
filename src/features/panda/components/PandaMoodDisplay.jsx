import React from "react";
import { getPandaMoodImage, pandaMoods } from "../../../data/pandaMoods.js";
import { useAppContext } from "../../../app/AppProvider.jsx";

export default function PandaMoodDisplay({ variant = "card" }) {
  const { pandaStats } = useAppContext();
  const mood = pandaMoods[pandaStats.mood] || pandaMoods.idle;
  const moodImage = getPandaMoodImage(pandaStats.mood);

  if (variant === "bubble") {
    return (
      <section className="inline-flex max-w-44 items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-2 shadow-xl shadow-emerald-950/10 backdrop-blur">
        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-50 shadow-inner ring-1 ring-emerald-100">
          <img
            alt={`${mood.label} panda mood`}
            className="panda-mood-image panda-mood-thumbnail"
            src={moodImage}
          />
        </span>
        <div className="min-w-0">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.12em] text-pink-500">Mood</p>
          <h3 className="truncate text-xs font-black text-zinc-950">{mood.label}</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm">
      <p className="text-xs font-black uppercase text-pink-500">Current mood</p>
      <div className="mt-2 flex items-center gap-3">
        <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-white shadow-inner ring-1 ring-zinc-100">
          <img
            alt={`${mood.label} panda mood`}
            className="panda-mood-image panda-mood-thumbnail"
            src={moodImage}
          />
        </span>
        <div>
          <h3 className="font-black text-zinc-950">{mood.label}</h3>
          <p className="text-sm font-semibold text-zinc-500">{mood.message}</p>
        </div>
      </div>
    </section>
  );
}
