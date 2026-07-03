import React from "react";

export default function PandaFace({ mood = "idle" }) {
  const closed = mood === "sleepy";
  const focused = mood === "focused";
  const excited = mood === "celebrating" || mood === "levelUp";

  return (
    <>
      <div className="absolute left-[3.55rem] top-[4.45rem] h-10 w-8 -rotate-12 rounded-full bg-zinc-950" />
      <div className="absolute right-[3.55rem] top-[4.45rem] h-10 w-8 rotate-12 rounded-full bg-zinc-950" />
      {closed ? (
        <>
          <div className="absolute left-[4.2rem] top-[5.25rem] h-2 w-5 rounded-full border-t-2 border-white" />
          <div className="absolute right-[4.2rem] top-[5.25rem] h-2 w-5 rounded-full border-t-2 border-white" />
        </>
      ) : (
        <>
          <div className={`absolute left-[4.35rem] top-[5.05rem] rounded-full bg-white ${excited ? "h-3 w-3" : "size-2"}`} />
          <div className={`absolute right-[4.35rem] top-[5.05rem] rounded-full bg-white ${excited ? "h-3 w-3" : "size-2"}`} />
          {focused && (
            <>
              <div className="absolute left-[4.05rem] top-[4.75rem] h-0.5 w-6 -rotate-12 rounded-full bg-white" />
              <div className="absolute right-[4.05rem] top-[4.75rem] h-0.5 w-6 rotate-12 rounded-full bg-white" />
            </>
          )}
        </>
      )}
      <div className="absolute left-1/2 top-[6.05rem] h-3 w-5 -translate-x-1/2 rounded-full bg-zinc-950" />
      <div
        className={[
          "absolute left-1/2 -translate-x-1/2 border-zinc-950",
          mood === "happy" || excited
            ? "top-[6.8rem] h-4 w-10 rounded-b-full border-b-4"
            : mood === "sleepy"
              ? "top-[6.8rem] h-3 w-4 rounded-full border-2"
              : "top-[6.85rem] h-3 w-8 rounded-b-full border-b-2",
        ].join(" ")}
      />
      {(mood === "happy" || excited) && (
        <>
          <div className="absolute left-[3.25rem] top-[6.4rem] size-4 rounded-full bg-pink-200/90" />
          <div className="absolute right-[3.25rem] top-[6.4rem] size-4 rounded-full bg-pink-200/90" />
        </>
      )}
    </>
  );
}
