import React from "react";
import { pandaMoods } from "../../../data/pandaMoods.js";
import { useAppContext } from "../../../app/AppProvider.jsx";

export default function PandaMoodDisplay() {
  const { pandaStats } = useAppContext();
  const mood = pandaMoods[pandaStats.mood] || pandaMoods.idle;

  return (
    <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm">
      <p className="text-xs font-black uppercase text-pink-500">Current mood</p>
      <div className="mt-2 flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-zinc-950 text-2xl">{mood.face}</span>
        <div>
          <h3 className="font-black text-zinc-950">{mood.label}</h3>
          <p className="text-sm font-semibold text-zinc-500">{mood.message}</p>
        </div>
      </div>
    </section>
  );
}
