import React from "react";
import { getPandaMoodImage, pandaMoods } from "../../../data/pandaMoods.js";
import { outfits } from "../../../data/outfits.js";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { xpForNextLevel } from "../utils/pandaLogic.js";
import ProgressBar from "../../rewards/components/ProgressBar.jsx";

function OutfitLayer({ outfitId }) {
  if (outfitId === "study-glasses") {
    return <div className="absolute left-1/2 top-[4.15rem] z-20 -translate-x-1/2 text-4xl drop-shadow-sm">👓</div>;
  }

  if (outfitId === "cozy-scarf") {
    return <div className="absolute left-1/2 top-[7.2rem] z-20 -translate-x-1/2 rotate-2 text-5xl drop-shadow-sm">🧣</div>;
  }

  if (outfitId === "winter-hat") {
    return <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -rotate-6 text-5xl drop-shadow-sm">🧢</div>;
  }

  if (outfitId === "star-pajamas") {
    return (
      <div className="absolute left-1/2 top-[6.6rem] z-10 h-16 w-24 -translate-x-1/2 rounded-b-[2rem] rounded-t-xl bg-indigo-200 shadow-inner">
        <span className="absolute left-3 top-2 text-lg">⭐</span>
        <span className="absolute right-4 top-6 text-lg">🌙</span>
      </div>
    );
  }

  if (outfitId === "raincoat") {
    return (
      <div className="absolute left-1/2 top-[6.4rem] z-10 h-16 w-28 -translate-x-1/2 rounded-b-[2rem] rounded-t-xl bg-yellow-300 shadow-inner">
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-yellow-500/50" />
      </div>
    );
  }

  if (outfitId === "bamboo-hoodie") {
    return (
      <>
        <div className="absolute left-1/2 top-[1.45rem] z-10 size-32 -translate-x-1/2 rounded-full border-[10px] border-emerald-300 bg-emerald-100/30" />
        <div className="absolute left-1/2 top-[6.5rem] z-10 h-16 w-28 -translate-x-1/2 rounded-b-[2rem] rounded-t-xl bg-emerald-300 shadow-inner" />
      </>
    );
  }

  return null;
}

export default function PandaCompanion({ compact = false }) {
  const { equippedOutfit, pandaStats } = useAppContext();
  const mood = pandaMoods[pandaStats.mood] || pandaMoods.idle;
  const moodImage = getPandaMoodImage(pandaStats.mood);
  const outfit = outfits.find((item) => item.id === equippedOutfit);

  return (
    <section className="rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-xl shadow-zinc-200/60 backdrop-blur">
      <div className="flex flex-col items-center text-center">
        <div className={`relative grid h-48 w-52 place-items-center overflow-hidden rounded-[2rem] bg-white shadow-inner ring-1 ring-zinc-100 ${mood.animation}`} aria-label={outfit ? `Panda wearing ${outfit.name}` : "Panda companion"}>
          <img
            alt={`${mood.label} panda companion`}
            className="panda-mood-image"
            src={moodImage}
          />
          <OutfitLayer outfitId={equippedOutfit} />
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
