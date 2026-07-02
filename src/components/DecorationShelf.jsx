import React from "react";
import { decorations } from "../data/decorations.js";
import { useAppContext } from "../context/AppContext.jsx";

export default function DecorationShelf() {
  const { unlockedDecorations } = useAppContext();

  return (
    <section className="rounded-[2rem] bg-white/80 p-5 shadow-sm">
      <h2 className="text-xl font-black text-zinc-950">Decoration shelf</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {decorations.map((decoration) => {
          const unlocked = unlockedDecorations.includes(decoration.id);
          return (
            <div className={`rounded-2xl border border-white p-4 ${unlocked ? "bg-emerald-50" : "bg-zinc-50 opacity-65"}`} key={decoration.id}>
              <span className="text-3xl">{decoration.icon}</span>
              <h3 className="mt-2 font-black text-zinc-950">{decoration.name}</h3>
              <p className="mt-1 text-xs font-bold text-zinc-500">{unlocked ? "Unlocked" : decoration.condition}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
