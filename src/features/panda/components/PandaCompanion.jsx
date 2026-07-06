import React from "react";
import { pandaMoods } from "../../../data/pandaMoods.js";
import { outfits } from "../../../data/outfits.js";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { xpForNextLevel } from "../utils/pandaLogic.js";
import ProgressBar from "../../rewards/components/ProgressBar.jsx";
import PandaAvatar from "./PandaAvatar.jsx";

export default function PandaCompanion({ compact = false }) {
  const { equippedOutfit, pandaStats } = useAppContext();
  const mood = pandaMoods[pandaStats.mood] || pandaMoods.idle;
  const outfit = outfits.find((item) => item.id === equippedOutfit);

  return (
    <section className="rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-xl shadow-zinc-200/60 backdrop-blur">
      <div className="flex flex-col items-center text-center">
        <PandaAvatar
          className={mood.animation}
          mood={pandaStats.mood}
          outfitId={equippedOutfit}
          size={compact ? "large" : "xl"}
        />
        <h2 className="mt-2 text-2xl font-black text-zinc-950">
          {outfit ? `Your panda companion in ${outfit.name}` : "Your panda companion"}
        </h2>
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
