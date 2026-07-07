import React from "react";

const guideSections = [
  {
    title: "Leveling Up",
    accent: "bg-amber-100 text-amber-800",
    items: [
      "Your panda levels up by earning XP.",
      "Completing Daily Goals, Long-Term Goals, or scheduled Planning time blocks gives XP based on difficulty.",
      "Finishing a focus timer gives XP, and it can also complete the selected goal for its goal XP.",
      "Saving a journal memory gives a small XP boost.",
      "Daily rewards sometimes give XP.",
    ],
  },
  {
    title: "Happiness",
    accent: "bg-pink-100 text-pink-700",
    items: [
      "Happiness grows when you make positive progress.",
      "Completing Daily Goals, Long-Term Goals, or scheduled Planning time blocks increases happiness.",
      "Saving journal memories and finishing focus timer sessions also raise happiness.",
      "Daily rewards sometimes give happiness, and claiming them always counts as panda care.",
    ],
  },
  {
    title: "Energy",
    accent: "bg-emerald-100 text-emerald-700",
    items: [
      "Energy shows how ready your panda feels.",
      "Right now, energy increases when you receive the energy Daily Reward.",
      "The app has a gentle missed-deadline energy loss rule prepared, but it is not currently applied during normal goal creation or completion.",
    ],
  },
  {
    title: "Planning",
    accent: "bg-sky-100 text-sky-800",
    items: [
      "Use the Planning page's Goals tab for Daily Goals and Long-Term Goals.",
      "Create, edit, delete, and complete unscheduled goals in the Goals tab.",
      "Use the Calendar tab to click dates and schedule time-blocked goals with exact start and end times.",
    ],
  },
];

export default function PandaTutorial({ compact = false }) {
  return (
    <section className="rounded-[2rem] bg-white/80 p-5 shadow-xl shadow-zinc-200/60">
      <div className="mb-4">
        <p className="text-xs font-black uppercase text-pink-500">Panda Care Guide</p>
        <h2 className={`${compact ? "text-xl" : "text-2xl"} font-black text-zinc-950`}>How to Raise Your Panda</h2>
        {!compact && (
          <p className="mt-1 text-sm font-semibold text-zinc-500">
            A quick guide to the habits and Planning tools that help your panda grow, feel happier, and stay energized.
          </p>
        )}
      </div>

      <div className={compact ? "grid gap-3" : "grid gap-3 lg:grid-cols-4"}>
        {guideSections.map((section) => (
          <article className="rounded-3xl bg-zinc-50 p-4" key={section.title}>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase ${section.accent}`}>
              {section.title}
            </span>
            <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-zinc-600">
              {section.items.map((item) => (
                <li className="flex gap-2" key={item}>
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-zinc-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
