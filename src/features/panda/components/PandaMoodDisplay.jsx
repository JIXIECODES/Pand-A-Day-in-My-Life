import React from "react";
import { getPandaMoodImage, pandaMoods } from "../../../data/pandaMoods.js";
import { useAppContext } from "../../../app/AppProvider.jsx";

export default function PandaMoodDisplay() {
  const { pandaStats } = useAppContext();
  const mood = pandaMoods[pandaStats.mood] || pandaMoods.idle;
  const moodImage = getPandaMoodImage(pandaStats.mood);

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
