import { pandaMoods } from "../data/pandaMoods.js";
import { outfits } from "../data/outfits.js";
import { useAppContext } from "../context/AppContext.jsx";
import { xpForNextLevel } from "../utils/pandaLogic.js";
import ProgressBar from "./ProgressBar.jsx";

export default function PandaCompanion({ compact = false }) {
  const { equippedOutfit, pandaStats } = useAppContext();
  const mood = pandaMoods[pandaStats.mood] || pandaMoods.idle;
  const outfit = outfits.find((item) => item.id === equippedOutfit);

  return (
    <section className="rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-xl shadow-zinc-200/60 backdrop-blur">
      <div className="flex flex-col items-center text-center">
        <div className={`relative grid size-44 place-items-center rounded-full bg-zinc-950 shadow-inner ${mood.animation}`}>
          <div className="absolute -left-3 top-7 size-12 rounded-full bg-zinc-950" />
          <div className="absolute -right-3 top-7 size-12 rounded-full bg-zinc-950" />
          <div className="grid size-32 place-items-center rounded-full bg-white text-5xl">
            <span>{mood.face}</span>
          </div>
          {outfit && (
            <span className="absolute -bottom-2 rounded-full bg-pink-100 px-4 py-2 text-2xl shadow-sm" title={outfit.name}>
              {outfit.icon}
            </span>
          )}
        </div>
        <h2 className="mt-4 text-2xl font-black text-zinc-950">Your panda companion</h2>
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
