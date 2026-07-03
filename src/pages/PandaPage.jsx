import React, { useEffect } from "react";
import DecorationShelf from "../components/DecorationShelf.jsx";
import OutfitSelector from "../components/OutfitSelector.jsx";
import PandaMoodDisplay from "../components/PandaMoodDisplay.jsx";
import PandaRoom from "../components/PandaRoom.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { xpForNextLevel } from "../utils/pandaLogic.js";

export default function PandaPage() {
  const { markDailyMission, pandaStats } = useAppContext();

  useEffect(() => {
    markDailyMission("visit-room");
  }, []);

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_22rem]">
      <section className="space-y-5">
        <PandaRoom />
        <OutfitSelector />
        <DecorationShelf />
      </section>
      <aside className="space-y-5">
        <PandaMoodDisplay />
        <section className="rounded-[2rem] bg-white/80 p-5 shadow-sm">
          <ProgressBar label={`Level ${pandaStats.level} XP`} value={pandaStats.xp} max={xpForNextLevel(pandaStats.level)} tone="pink" />
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl bg-emerald-50 p-3">
              <p className="text-2xl font-black">{pandaStats.happiness}</p>
              <p className="text-xs font-black text-zinc-500">Happiness</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3">
              <p className="text-2xl font-black">{pandaStats.energy}</p>
              <p className="text-xs font-black text-zinc-500">Energy</p>
            </div>
          </div>
        </section>
        <section className="rounded-[2rem] bg-white/80 p-5 shadow-sm">
          <h2 className="font-black text-zinc-950">Mood history</h2>
          <div className="mt-3 space-y-2">
            {(pandaStats.moodHistory || []).slice(0, 5).map((item, index) => (
              <p className="rounded-2xl bg-zinc-50 p-3 text-sm font-semibold text-zinc-600" key={`${item.at}-${index}`}>
                {item.mood}: {item.message}
              </p>
            ))}
          </div>
        </section>
      </aside>
    </main>
  );
}
