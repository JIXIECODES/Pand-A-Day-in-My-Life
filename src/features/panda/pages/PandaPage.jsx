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
  const [moodHistoryOpen, setMoodHistoryOpen] = useState(false);
  const dressUpActive = activeTool === "dress-up";
  const recentMoods = (pandaStats.moodHistory || []).slice(0, 5);

  function renderActiveTool() {
    if (dressUpActive) {
      return (
        <section className="rounded-[2rem] border border-emerald-100 bg-gradient-to-b from-emerald-50 via-white to-amber-50 p-5 shadow-xl shadow-emerald-100/60">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Dress-Up mode</p>
          <h2 className="mt-2 text-xl font-black text-zinc-950">Bamboo closet is open</h2>
          <p className="mt-2 text-sm font-semibold text-zinc-600">
            Choose outfits from the horizontal closet overlay at the bottom of the habitat.
          </p>
        </section>
      );
    }

    if (activeTool === "shop") {
      return (
        <section className="rounded-[2rem] border border-pink-100 bg-gradient-to-b from-pink-50 via-white to-amber-50 p-5 text-center shadow-xl shadow-pink-100/60">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-pink-600">SHOP</p>
          <h2 className="mt-2 text-xl font-black text-zinc-950">Building in progress</h2>
        </section>
      );
    }

    return <DecorationShelf variant="panel" />;
  }

  return (
    <main className="mx-auto grid max-w-7xl items-start gap-6 px-4 py-6 sm:px-6 lg:h-[calc(100vh-5.5rem)] lg:max-h-[calc(100vh-5.5rem)] lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-stretch lg:overflow-hidden xl:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="min-w-0 space-y-5 lg:grid lg:h-full lg:min-h-0 lg:grid-rows-[auto_minmax(0,1fr)] lg:space-y-0 lg:overflow-hidden">
        <section className="rounded-[2rem] border border-emerald-100 bg-white/85 p-4 shadow-sm lg:mb-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
            <PandaMoodDisplay />
            <div className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm">
              <ProgressBar label={`Level ${pandaStats.level} XP`} value={pandaStats.xp} max={xpForNextLevel(pandaStats.level)} tone="pink" />
              <div className="mt-3 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <p className="text-xl font-black">{pandaStats.happiness}</p>
                  <p className="text-xs font-black text-zinc-500">Happiness</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-3">
                  <p className="text-xl font-black">{pandaStats.energy}</p>
                  <p className="text-xs font-black text-zinc-500">Energy</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 rounded-[1.5rem] bg-emerald-50/70 p-3">
            <button
              aria-expanded={moodHistoryOpen}
              className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left text-sm font-black text-zinc-800 shadow-sm transition hover:-translate-y-0.5"
              onClick={() => setMoodHistoryOpen((open) => !open)}
              type="button"
            >
              <span>View Mood History</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-800">
                {moodHistoryOpen ? "Hide" : `${recentMoods.length} recent`}
              </span>
            </button>
            {moodHistoryOpen && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:max-h-32 lg:overflow-y-auto lg:pr-1">
                {recentMoods.length > 0 ? (
                  recentMoods.map((item, index) => (
                    <p className="rounded-2xl bg-white p-3 text-sm font-semibold text-zinc-600 shadow-sm" key={`${item.at}-${index}`}>
                      <span className="font-black text-zinc-950">{item.mood}:</span> {item.message}
                    </p>
                  ))
                ) : (
                  <p className="rounded-2xl bg-white p-3 text-sm font-semibold text-zinc-500 shadow-sm">No mood history yet.</p>
                )}
              </div>
            )}
          </div>
        </section>

        <PandaRoom
          mode={dressUpActive ? "dress-up" : "default"}
          overlay={dressUpActive ? <OutfitSelector variant="overlay" /> : null}
        />
      </section>

      <aside className="w-full space-y-5 lg:flex lg:h-full lg:min-h-0 lg:max-w-[22rem] lg:flex-col lg:overflow-hidden">
        <section className="shrink-0 rounded-[2rem] border border-emerald-100 bg-white/85 p-4 shadow-sm">
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
                    className={`grid size-9 place-items-center rounded-full text-sm font-black ${
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
        <div className="min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">{renderActiveTool()}</div>
      </aside>
    </main>
  );
}
