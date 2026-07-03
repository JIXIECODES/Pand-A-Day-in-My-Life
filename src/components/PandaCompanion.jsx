import React from "react";
import { pandaMoods } from "../data/pandaMoods.js";
import { outfits } from "../data/outfits.js";
import { useAppContext } from "../context/AppContext.jsx";
import { xpForNextLevel } from "../utils/pandaLogic.js";
import PandaAvatar from "./panda/PandaAvatar.jsx";
import ProgressBar from "./ProgressBar.jsx";

export default function PandaCompanion({ compact = false }) {
  const { equippedOutfit, pandaStats } = useAppContext();
  const mood = pandaMoods[pandaStats.mood] || pandaMoods.idle;
  const outfit = outfits.find((item) => item.id === equippedOutfit);

  return (
    <section className="rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-xl shadow-zinc-200/60 backdrop-blur">
      <div className="flex flex-col items-center text-center">
        <div aria-label={outfit ? `Panda wearing ${outfit.name}` : "Panda companion"}>
          <PandaAvatar mood={pandaStats.mood} outfit={equippedOutfit} size={compact ? "medium" : "large"} />
        </div>
        <h2 className="mt-2 text-2xl font-black text-zinc-950">Your panda companion</h2>
        <p className="mt-1 max-w-sm text-sm font-semibold text-zinc-500">{mood.message}</p>
      </div>

      {!compact && (
        <div className="mt-5 grid gap-3">
          <ProgressBar label={`Level ${pandaStats.level} XP`} value={pandaStats.xp} max={xpForNextLevel(pandaStats.level)} tone="pink" />
          <ProgressBar label="Happiness" value={pandaStats.happiness} max={100} tone="emerald" />
          <ProgressBar label="Energy" value={pandaStats.energy} max={100} tone="amber" />
        </div>
      )}
    </section>
  );
}
