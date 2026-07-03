import React from "react";

export default function SeasonalBackground({ season }) {
  const isSpring = season === "spring";
  const isSummer = season === "summer";
  const isAutumn = season === "autumn";
  const isWinter = season === "winter";

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className={[
          "absolute inset-0",
          isSpring && "bg-gradient-to-b from-sky-100 via-emerald-50 to-pink-50",
          isSummer && "bg-gradient-to-b from-cyan-100 via-amber-50 to-lime-100",
          isAutumn && "bg-gradient-to-b from-orange-100 via-rose-100 to-stone-200",
          isWinter && "bg-gradient-to-b from-sky-100 via-indigo-50 to-white",
        ].filter(Boolean).join(" ")}
      />
      {isSummer && <div className="absolute right-20 top-16 size-24 rounded-full bg-amber-200 shadow-[0_0_60px_rgba(251,191,36,0.55)]" />}
      {isWinter && <div className="absolute right-24 top-24 h-20 w-28 rounded-t-2xl bg-rose-100 shadow-sm"><div className="mx-auto h-10 w-20 -translate-y-5 rotate-45 bg-white" /></div>}
      <div className={`absolute -bottom-20 left-[-10%] h-64 w-[70%] rounded-[50%] ${isAutumn ? "bg-orange-200" : isWinter ? "bg-white" : "bg-emerald-200"}`} />
      <div className={`absolute -bottom-24 right-[-12%] h-72 w-[80%] rounded-[50%] ${isAutumn ? "bg-amber-200" : isWinter ? "bg-sky-50" : "bg-lime-200"}`} />
      {(isSpring || isSummer) && (
        <>
          <div className="absolute left-24 top-28 h-10 w-24 rounded-full bg-white/70" />
          <div className="absolute left-44 top-24 h-12 w-32 rounded-full bg-white/60" />
        </>
      )}
      {isSpring && (
        <>
          <div className="absolute left-16 bottom-28 size-3 rounded-full bg-pink-300" />
          <div className="absolute left-40 bottom-40 size-2 rounded-full bg-rose-300" />
          <div className="absolute right-48 bottom-32 size-3 rounded-full bg-pink-200" />
        </>
      )}
      {isAutumn && (
        <>
          <div className="absolute left-20 top-28 h-28 w-8 rounded-full bg-amber-800" />
          <div className="absolute left-8 top-16 size-28 rounded-full bg-orange-300" />
          <div className="absolute right-28 top-32 size-4 rotate-45 rounded-sm bg-orange-400" />
          <div className="absolute right-52 top-56 size-3 rotate-45 rounded-sm bg-amber-500" />
        </>
      )}
      {isWinter && (
        <>
          <div className="absolute left-20 top-24 size-2 rounded-full bg-white" />
          <div className="absolute left-1/2 top-32 size-2 rounded-full bg-white" />
          <div className="absolute right-40 top-44 size-2 rounded-full bg-white" />
        </>
      )}
    </div>
  );
}
