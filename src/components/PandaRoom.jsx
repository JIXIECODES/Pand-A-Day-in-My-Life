import React from "react";
import { decorations } from "../data/decorations.js";
import { useAppContext } from "../context/AppContext.jsx";
import { getSeason, getSeasonTheme } from "../utils/seasonUtils.js";
import PandaCompanion from "./PandaCompanion.jsx";

export default function PandaRoom() {
  const { unlockedDecorations } = useAppContext();
  const seasonTheme = getSeasonTheme(getSeason());
  const visibleDecorations = decorations.filter((item) => unlockedDecorations.includes(item.id)).slice(0, 5);

  return (
    <section className={`rounded-[2rem] bg-gradient-to-br ${seasonTheme.room} p-5 shadow-xl shadow-zinc-200/60`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-zinc-500">{seasonTheme.name} room</p>
          <h2 className="text-2xl font-black text-zinc-950">Panda habitat</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-black ${seasonTheme.accent}`}>{seasonTheme.name}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_15rem]">
        <PandaCompanion compact />
        <div className="rounded-[1.5rem] bg-white/65 p-4">
          <p className="text-sm font-black text-zinc-700">Room decorations</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {visibleDecorations.length > 0 ? (
              visibleDecorations.map((item) => (
                <div className="grid aspect-square place-items-center rounded-2xl bg-white text-3xl shadow-sm" key={item.id} title={item.name}>
                  {item.icon}
                </div>
              ))
            ) : (
              <p className="col-span-3 text-sm font-semibold text-zinc-500">Claim rewards and complete goals to make this room cozier.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
