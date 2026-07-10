import React from "react";
import { NO_OUTFIT_ID, outfits } from "../../../data/outfits.js";
import { useAppContext } from "../../../app/AppProvider.jsx";

export default function OutfitSelector({ variant = "default" }) {
  const { equipOutfit, equippedOutfit, unlockedOutfits } = useAppContext();
  const noOutfitSelected = equippedOutfit === NO_OUTFIT_ID;
  const closet = variant === "closet";
  const overlay = variant === "overlay";
  const sectionClass = closet
    ? "rounded-[2rem] border border-emerald-100 bg-gradient-to-b from-amber-50 via-lime-50 to-emerald-50 p-5 shadow-xl shadow-emerald-100/60"
    : overlay
      ? "max-h-44 overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-white/90 p-3 shadow-2xl shadow-emerald-950/10 backdrop-blur"
    : "rounded-[2rem] bg-white/80 p-5 shadow-sm";
  const gridClass = overlay
    ? "mt-3 flex gap-3 overflow-x-auto overflow-y-hidden pb-1"
    : closet
      ? "mt-4 grid gap-3"
      : "mt-4 grid gap-3 sm:grid-cols-2";
  const itemClass = overlay ? "min-w-36 shrink-0 p-3" : "p-4";
  const iconClass = overlay ? "text-2xl" : "text-3xl";

  return (
    <section className={sectionClass}>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
          {closet || overlay ? "Bamboo closet" : "Panda closet"}
        </p>
        <h2 className={overlay ? "text-base font-black text-zinc-950" : "text-xl font-black text-zinc-950"}>Outfits</h2>
        {(closet || overlay) && (
          <p className="mt-1 text-sm font-semibold text-zinc-600">
            Pick an unlocked look, or leave your panda cozy with no outfit.
          </p>
        )}
      </div>
      <div className={gridClass}>
        <button
          aria-pressed={noOutfitSelected}
          className={[
            itemClass,
            "rounded-2xl border text-left transition hover:-translate-y-0.5",
            noOutfitSelected ? "border-zinc-950 bg-zinc-950 text-white" : "border-white bg-zinc-50",
          ].join(" ")}
          onClick={() => equipOutfit(NO_OUTFIT_ID)}
          type="button"
        >
          <span className="grid size-10 place-items-center rounded-full bg-white/70 text-sm font-black text-zinc-600">
            None
          </span>
          <span className="mt-2 block font-black">No Outfit</span>
          <span className="mt-1 block text-xs font-bold opacity-70">Show your panda as-is</span>
        </button>
        {outfits.map((outfit) => {
          const unlocked = unlockedOutfits.includes(outfit.id);
          return (
            <button
              aria-pressed={equippedOutfit === outfit.id}
              className={[
                itemClass,
                "rounded-2xl border text-left transition",
                equippedOutfit === outfit.id ? "border-zinc-950 bg-zinc-950 text-white" : "border-white bg-zinc-50",
                !unlocked ? "opacity-60" : "hover:-translate-y-0.5",
              ].join(" ")}
              disabled={!unlocked}
              key={outfit.id}
              onClick={() => equipOutfit(outfit.id)}
              type="button"
            >
              <span className={iconClass}>{outfit.icon}</span>
              <span className="mt-2 block font-black">{outfit.name}</span>
              <span className="mt-1 block text-xs font-bold opacity-70">{unlocked ? "Unlocked" : outfit.condition}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
