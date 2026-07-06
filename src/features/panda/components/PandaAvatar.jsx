import React from "react";
import idlePanda from "../../../assets/panda/idle.svg";
import happyPanda from "../../../assets/panda/happy.svg";
import sleepyPanda from "../../../assets/panda/sleepy.svg";
import focusedPanda from "../../../assets/panda/focused.svg";
import celebratingPanda from "../../../assets/panda/celebrating.svg";
import levelUpPanda from "../../../assets/panda/level-up.svg";

const moodImages = {
  idle: idlePanda,
  happy: happyPanda,
  sleepy: sleepyPanda,
  focused: focusedPanda,
  celebrating: celebratingPanda,
  levelUp: levelUpPanda,
};

const sizeClasses = {
  small: "h-16 w-16",
  medium: "h-28 w-28",
  large: "h-44 w-44",
  xl: "h-64 w-64",
};

function OutfitLayer({ outfitId }) {
  if (!outfitId) return null;

  if (outfitId === "study-glasses") {
    return (
      <div className="absolute left-1/2 top-[35%] z-20 flex h-[12%] w-[45%] -translate-x-1/2 items-center justify-center">
        <div className="h-full w-[38%] rounded-full border-[3px] border-zinc-950 bg-sky-100/30" />
        <div className="h-[3px] w-[16%] bg-zinc-950" />
        <div className="h-full w-[38%] rounded-full border-[3px] border-zinc-950 bg-sky-100/30" />
      </div>
    );
  }

  if (outfitId === "cozy-scarf") {
    return (
      <div className="absolute left-1/2 top-[58%] z-20 h-[12%] w-[52%] -translate-x-1/2 rotate-2 rounded-full bg-rose-300 shadow-sm">
        <div className="absolute right-[8%] top-[45%] h-[130%] w-[22%] rounded-b-xl bg-rose-400" />
      </div>
    );
  }

  if (outfitId === "winter-hat") {
    return (
      <div className="absolute left-1/2 top-[4%] z-30 h-[20%] w-[48%] -translate-x-1/2 -rotate-6 rounded-t-full bg-sky-300 shadow-sm">
        <div className="absolute -top-[30%] left-1/2 size-[28%] -translate-x-1/2 rounded-full bg-white" />
        <div className="absolute bottom-0 h-[28%] w-full rounded-full bg-sky-500" />
      </div>
    );
  }

  if (outfitId === "star-pajamas") {
    return (
      <div className="absolute left-1/2 top-[61%] z-10 h-[24%] w-[48%] -translate-x-1/2 rounded-b-[2rem] rounded-t-xl bg-indigo-200 shadow-inner">
        <div className="absolute left-[20%] top-[22%] size-[12%] rotate-45 bg-amber-200" />
        <div className="absolute right-[24%] top-[46%] size-[10%] rounded-full bg-sky-300" />
      </div>
    );
  }

  if (outfitId === "raincoat") {
    return (
      <div className="absolute left-1/2 top-[60%] z-10 h-[25%] w-[54%] -translate-x-1/2 rounded-b-[2rem] rounded-t-xl bg-yellow-300 shadow-inner">
        <div className="absolute left-1/2 top-0 h-full w-[4%] -translate-x-1/2 bg-yellow-500/50" />
      </div>
    );
  }

  if (outfitId === "bamboo-hoodie") {
    return (
      <>
        <div className="absolute left-1/2 top-[15%] z-10 size-[56%] -translate-x-1/2 rounded-full border-[10px] border-emerald-300 bg-emerald-100/30" />
        <div className="absolute left-1/2 top-[60%] z-10 h-[25%] w-[54%] -translate-x-1/2 rounded-b-[2rem] rounded-t-xl bg-emerald-300 shadow-inner" />
      </>
    );
  }

  return null;
}

export default function PandaAvatar({ className = "", mood = "idle", outfitId = "", size = "medium" }) {
  const image = moodImages[mood] || moodImages.idle;
  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className={`relative inline-grid place-items-center ${sizeClass} ${className}`}>
      <img
        alt={`Panda feeling ${mood}`}
        className="h-full w-full object-contain"
        draggable="false"
        src={image}
      />
      <OutfitLayer outfitId={outfitId} />
      {/* TODO: Replace the CSS outfit overlays with imported outfit artwork layers when matching image assets are available. */}
    </div>
  );
}
