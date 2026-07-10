import React from "react";
import { decorations } from "../../../data/decorations.js";
import { useAppContext } from "../../../app/AppProvider.jsx";

export default function DecorationShelf({ variant = "default" }) {
  const { unlockedDecorations } = useAppContext();
  const panel = variant === "panel";
  const sectionClass = panel
    ? "rounded-[2rem] border border-emerald-100 bg-gradient-to-b from-white via-emerald-50 to-amber-50 p-5 shadow-xl shadow-emerald-100/60"
    : "rounded-[2rem] bg-white/80 p-5 shadow-sm";
  const gridClass = panel ? "mt-4 grid gap-3" : "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className={sectionClass}>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
          {panel ? "Decorate" : "Habitat decor"}
        </p>
        <h2 className="text-xl font-black text-zinc-950">Decoration shelf</h2>
        {panel && (
          <p className="mt-1 text-sm font-semibold text-zinc-600">
            See which cozy room pieces are unlocked and what to do next.
          </p>
        )}
      </div>
      <div className={gridClass}>
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
