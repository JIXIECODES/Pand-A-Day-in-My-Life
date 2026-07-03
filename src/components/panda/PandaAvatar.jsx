import React from "react";
import PandaFace from "./PandaFace.jsx";
import PandaOutfitLayer from "./PandaOutfitLayer.jsx";
import PandaSparkles from "./PandaSparkles.jsx";

const sizes = {
  tiny: "h-12 w-14 scale-[0.28]",
  small: "h-16 w-20 scale-[0.38]",
  medium: "h-32 w-36 scale-[0.72]",
  large: "h-48 w-52 scale-100",
};

const animations = {
  idle: "animate-panda-idle",
  happy: "animate-panda-happy",
  sleepy: "animate-panda-sleepy",
  focused: "animate-panda-focused",
  celebrating: "animate-panda-celebrating",
  levelUp: "animate-panda-level",
};

export default function PandaAvatar({ mood = "idle", outfit = "", size = "large" }) {
  const sparkle = mood === "celebrating" || mood === "levelUp";

  return (
    <div className={`relative grid place-items-center ${sizes[size] || sizes.large}`}>
      <div className={`relative h-48 w-52 origin-center ${animations[mood] || animations.idle}`}>
        <PandaSparkles show={sparkle} />
        <div className="absolute left-4 top-7 size-14 rounded-full bg-zinc-950" />
        <div className="absolute right-4 top-7 size-14 rounded-full bg-zinc-950" />
        <div className="absolute left-1/2 top-6 z-0 size-36 -translate-x-1/2 rounded-full bg-zinc-950 shadow-inner" />
        <div className="absolute left-1/2 top-12 z-20 size-28 -translate-x-1/2 rounded-full bg-white shadow-inner">
          <PandaFace mood={mood} />
        </div>
        <div className="absolute left-1/2 top-[7.4rem] z-0 h-20 w-32 -translate-x-1/2 rounded-[2.5rem] bg-white shadow-inner" />
        <PandaOutfitLayer outfit={outfit} />
      </div>
    </div>
  );
}
