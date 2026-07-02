import { outfits } from "../data/outfits.js";
import { useAppContext } from "../context/AppContext.jsx";

export default function OutfitSelector() {
  const { equipOutfit, equippedOutfit, unlockedOutfits } = useAppContext();

  return (
    <section className="rounded-[2rem] bg-white/80 p-5 shadow-sm">
      <h2 className="text-xl font-black text-zinc-950">Outfits</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {outfits.map((outfit) => {
          const unlocked = unlockedOutfits.includes(outfit.id);
          return (
            <button
              className={[
                "rounded-2xl border p-4 text-left transition",
                equippedOutfit === outfit.id ? "border-zinc-950 bg-zinc-950 text-white" : "border-white bg-zinc-50",
                !unlocked ? "opacity-60" : "hover:-translate-y-0.5",
              ].join(" ")}
              disabled={!unlocked}
              key={outfit.id}
              onClick={() => equipOutfit(outfit.id)}
              type="button"
            >
              <span className="text-3xl">{outfit.icon}</span>
              <span className="mt-2 block font-black">{outfit.name}</span>
              <span className="mt-1 block text-xs font-bold opacity-70">{unlocked ? "Unlocked" : outfit.condition}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
