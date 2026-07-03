import React from "react";

export default function PandaOutfitLayer({ outfit = "" }) {
  if (outfit === "study-glasses") {
    return (
      <div className="absolute left-1/2 top-[4.9rem] z-30 flex -translate-x-1/2 items-center gap-1">
        <div className="size-8 rounded-full border-4 border-zinc-800 bg-white/10" />
        <div className="h-1 w-3 rounded-full bg-zinc-800" />
        <div className="size-8 rounded-full border-4 border-zinc-800 bg-white/10" />
      </div>
    );
  }

  if (outfit === "cozy-scarf") {
    return (
      <div className="absolute left-1/2 top-[8.25rem] z-30 h-7 w-28 -translate-x-1/2 rounded-full bg-rose-300 shadow-sm">
        <div className="absolute right-4 top-5 h-12 w-5 rounded-full bg-rose-400" />
      </div>
    );
  }

  if (outfit === "winter-hat") {
    return (
      <div className="absolute left-1/2 top-2 z-30 -translate-x-1/2">
        <div className="mx-auto h-7 w-20 rounded-t-full bg-sky-300" />
        <div className="h-5 w-28 rounded-full bg-sky-400" />
        <div className="absolute -top-3 left-1/2 size-5 -translate-x-1/2 rounded-full bg-white" />
      </div>
    );
  }

  if (outfit === "star-pajamas") {
    return (
      <div className="absolute left-1/2 top-[7.75rem] z-10 h-20 w-32 -translate-x-1/2 rounded-b-[2.5rem] rounded-t-xl bg-indigo-200 shadow-inner">
        <div className="absolute left-6 top-4 size-3 rotate-45 rounded-sm bg-amber-200" />
        <div className="absolute right-7 top-8 size-4 rounded-full bg-sky-100" />
      </div>
    );
  }

  if (outfit === "raincoat") {
    return (
      <div className="absolute left-1/2 top-[7.65rem] z-10 h-20 w-36 -translate-x-1/2 rounded-b-[2.5rem] rounded-t-xl bg-yellow-300 shadow-inner">
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-yellow-500/50" />
        <div className="absolute left-5 top-6 size-3 rounded-full bg-yellow-500" />
        <div className="absolute right-5 top-6 size-3 rounded-full bg-yellow-500" />
      </div>
    );
  }

  if (outfit === "bamboo-hoodie") {
    return (
      <>
        <div className="absolute left-1/2 top-8 z-10 size-36 -translate-x-1/2 rounded-full border-[10px] border-emerald-300 bg-emerald-100/20" />
        <div className="absolute left-1/2 top-[7.65rem] z-10 h-20 w-36 -translate-x-1/2 rounded-b-[2.5rem] rounded-t-xl bg-emerald-300 shadow-inner" />
      </>
    );
  }

  return null;
}
