import React, { useState } from "react";
import DecorationShelf from "../components/DecorationShelf.jsx";
import OutfitSelector from "../components/OutfitSelector.jsx";
import PandaMoodDisplay from "../components/PandaMoodDisplay.jsx";
import PandaRoom from "../components/PandaRoom.jsx";
import ProgressBar from "../../rewards/components/ProgressBar.jsx";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { xpForNextLevel } from "../utils/pandaLogic.js";

const exhibitTools = [
  {
    id: "decorate",
    label: "Decorate",
    helper: "Room pieces",
  },
  {
    id: "dress-up",
    label: "Dress-Up",
    helper: "Bamboo closet",
  },
  {
    id: "shop",
    label: "SHOP",
    helper: "Coming soon",
  },
];

export default function PandaPage() {
  const { pandaStats } = useAppContext();
  const [activeTool, setActiveTool] = useState("decorate");

  function renderActiveTool() {
    if (activeTool === "dress-up") {
      return <OutfitSelector variant="closet" />;
    }

    if (activeTool === "shop") {
      return (
        <section className="rounded-[2rem] border border-pink-100 bg-gradient-to-b from-pink-50 via-white to-amber-50 p-5 text-center shadow-xl shadow-pink-100/60">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-pink-600">SHOP</p>
          <h2 className="mt-2 text-xl font-black text-zinc-950">Building in progress</h2>
          <p className="mt-2 text-sm font-semibold text-zinc-600">
            The shop will live here later. Your current outfits, decor, rewards, and unlocks are unchanged.
          </p>
        </section>
      );
    }

    return <DecorationShelf variant="panel" />;
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="space-y-5">
        <PandaRoom />
      </section>
      <aside className="space-y-5">
        <section className="rounded-[2rem] border border-emerald-100 bg-white/85 p-4 shadow-sm">
          <p className="px-1 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Exhibit tools</p>
          <div className="mt-3 grid gap-3">
            {exhibitTools.map((tool) => {
              const selected = activeTool === tool.id;
              return (
                <button
                  aria-pressed={selected}
                  className={[
                    "group flex items-center justify-between rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5",
                    selected
                      ? "border-emerald-700 bg-emerald-700 text-white shadow-emerald-100"
                      : "border-emerald-100 bg-gradient-to-r from-amber-50 to-emerald-50 text-zinc-800",
                  ].join(" ")}
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  type="button"
                >
                  <span>
                    <span className="block text-base font-black">{tool.label}</span>
                    <span className={`mt-1 block text-xs font-black ${selected ? "text-white/75" : "text-emerald-700"}`}>
                      {tool.helper}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`grid size-9 place-items-center rounded-full text-lg font-black ${
                      selected ? "bg-white/20" : "bg-white/80 text-emerald-700"
                    }`}
                  >
                    {selected ? "On" : ">"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        {renderActiveTool()}
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
