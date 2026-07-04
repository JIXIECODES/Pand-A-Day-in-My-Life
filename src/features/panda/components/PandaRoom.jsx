import React from "react";
import { decorations } from "../../../data/decorations.js";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { getSeason, getSeasonTheme } from "../../../shared/utils/seasonUtils.js";
import PandaCompanion from "./PandaCompanion.jsx";

function hasDecoration(unlockedDecorations, id) {
  return unlockedDecorations.includes(id);
}

export default function PandaRoom() {
  const { unlockedDecorations } = useAppContext();
  const seasonTheme = getSeasonTheme(getSeason());
  const unlocked = decorations.filter((item) => unlockedDecorations.includes(item.id));
  const starWallpaper = hasDecoration(unlockedDecorations, "star-wallpaper");

  return (
    <section className="rounded-[2rem] bg-white/70 p-5 shadow-xl shadow-zinc-200/60">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-zinc-500">{seasonTheme.name} room</p>
          <h2 className="text-2xl font-black text-zinc-950">Panda habitat</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-black ${seasonTheme.accent}`}>{seasonTheme.name}</span>
      </div>

      <div className={`relative min-h-[32rem] overflow-hidden rounded-[2rem] bg-gradient-to-b ${seasonTheme.room}`}>
        <div className={`absolute inset-x-0 top-0 h-2/3 ${starWallpaper ? "bg-indigo-100" : "bg-white/20"}`}>
          {starWallpaper && (
            <>
              <span className="absolute left-12 top-10 text-2xl">⭐</span>
              <span className="absolute right-20 top-16 text-xl">✨</span>
              <span className="absolute left-1/2 top-8 text-lg">⭐</span>
            </>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-amber-100/80" />
        <div className="absolute inset-x-0 bottom-36 h-3 bg-amber-200/80" />

        <div className="absolute left-8 top-10 h-28 w-32 rounded-3xl border-8 border-white bg-sky-100 shadow-md">
          <div className="grid h-full place-items-center text-4xl">
            {hasDecoration(unlockedDecorations, "seasonal-window") ? "🌤️" : "🪟"}
          </div>
        </div>

        <div className="absolute right-8 top-20 h-44 w-24 rounded-t-2xl bg-amber-700 p-2 shadow-lg">
          <div className="grid gap-2">
            {["bg-pink-200", "bg-emerald-200", "bg-sky-200", "bg-yellow-200"].map((color) => (
              <div className={`h-7 rounded ${color}`} key={color} />
            ))}
          </div>
          {hasDecoration(unlockedDecorations, "bookshelf") && <span className="absolute -top-5 left-6 text-3xl">📚</span>}
        </div>

        <div className="absolute left-14 bottom-24 h-14 w-36 rounded-t-3xl bg-pink-200 shadow-md">
          <div className="absolute left-5 top-3 h-7 w-20 rounded-full bg-white/80" />
        </div>
        <div className="absolute left-16 bottom-16 h-12 w-40 rounded-b-3xl bg-pink-300 shadow-md" />

        <div className="absolute right-32 bottom-24 h-20 w-36 rounded-xl bg-amber-600 shadow-md">
          <div className="absolute left-5 top-4 h-4 w-24 rounded-full bg-amber-300" />
          <div className="absolute left-6 top-full h-12 w-3 bg-amber-800" />
          <div className="absolute right-6 top-full h-12 w-3 bg-amber-800" />
        </div>

        {hasDecoration(unlockedDecorations, "cozy-lamp") && (
          <div className="absolute right-52 bottom-44 text-5xl drop-shadow-md">💡</div>
        )}

        {hasDecoration(unlockedDecorations, "bamboo-plant") && (
          <div className="absolute left-8 bottom-12 text-6xl drop-shadow-md">🎍</div>
        )}

        {hasDecoration(unlockedDecorations, "cloud-rug") ? (
          <div className="absolute left-1/2 bottom-12 h-20 w-64 -translate-x-1/2 rounded-[50%] bg-white/90 shadow-inner">
            <span className="absolute left-1/2 top-5 -translate-x-1/2 text-3xl">☁️</span>
          </div>
        ) : (
          <div className="absolute left-1/2 bottom-12 h-16 w-56 -translate-x-1/2 rounded-[50%] bg-emerald-100/90 shadow-inner" />
        )}

        <div className="absolute left-1/2 bottom-20 z-20 w-64 -translate-x-1/2">
          <PandaCompanion compact />
        </div>

        <div className="absolute bottom-4 right-4 rounded-2xl bg-white/75 p-3 shadow-sm">
          <p className="text-xs font-black uppercase text-zinc-500">Unlocked decor</p>
          <div className="mt-2 flex max-w-52 flex-wrap gap-2">
            {unlocked.length > 0 ? (
              unlocked.map((item) => (
                <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-zinc-700" key={item.id}>
                  {item.name}
                </span>
              ))
            ) : (
              <span className="text-sm font-semibold text-zinc-500">Complete goals to decorate.</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
