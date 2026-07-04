import React from "react";

export default function AchievementCard({ achievement, unlocked }) {
  return (
    <article className={`rounded-2xl border p-4 shadow-sm ${unlocked ? "border-emerald-200 bg-emerald-50" : "border-white bg-white/70"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-zinc-950">{achievement.title}</h3>
          <p className="mt-1 text-sm font-semibold text-zinc-500">{achievement.description}</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-zinc-600">{unlocked ? "Done" : achievement.condition}</span>
      </div>
      <p className="mt-3 text-xs font-black uppercase text-pink-500">{achievement.reward}</p>
    </article>
  );
}
