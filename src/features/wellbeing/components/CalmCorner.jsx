import React, { useState } from "react";
import FocusTimer from "../../goals/components/FocusTimer.jsx";

const tools = [
  { id: "focus", emoji: "⏱️", label: "Focus timer", helper: "Start, pause, or reset a quiet focus session" },
  { id: "breathe", emoji: "🌿", label: "Breathing break", helper: "Open a short, gentle breathing prompt" },
  { id: "reflect", emoji: "📖", label: "Daily reflection", helper: "Continue to your journal and save a memory" },
];

export default function CalmCorner({ onOpenJournal }) {
  const [activeTool, setActiveTool] = useState("");
  const active = tools.find((tool) => tool.id === activeTool);

  return (
    <section className="rounded-[2rem] border border-sky-100 bg-white/80 p-5 shadow-sm">
      <p className="text-xs font-black uppercase text-sky-700">Calm tools</p>
      <h2 className="mt-1 text-2xl font-black text-zinc-950">Take a moment</h2>
      <p className="mt-2 text-sm font-semibold text-zinc-500">Choose a tool. It opens in a closable panel without changing the page layout.</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {tools.map((tool) => (
          <button className="group relative min-h-20 rounded-2xl border border-zinc-100 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-sky-200 focus:outline-none focus:ring-4 focus:ring-sky-100" key={tool.id} onClick={() => setActiveTool(tool.id)} type="button">
            <span aria-hidden="true" className="block text-xl">{tool.emoji}</span>
            <span className="mt-1 flex items-center justify-center gap-1 text-xs font-black text-zinc-950 sm:text-sm">{tool.label}<span aria-hidden="true" className="text-[0.65rem] text-zinc-400">ⓘ</span></span>
            <span className="pointer-events-none absolute bottom-[calc(100%+0.4rem)] left-1/2 z-40 w-44 -translate-x-1/2 rounded-xl bg-zinc-950 px-3 py-2 text-xs font-bold text-white opacity-0 shadow-xl transition group-hover:opacity-100 group-focus-visible:opacity-100" role="tooltip">{tool.helper}</span>
          </button>
        ))}
      </div>
      {activeTool && (
        <section aria-label={`${active?.label} panel`} className="fixed bottom-4 right-4 z-[60] max-h-[calc(100dvh-2rem)] w-[min(34rem,calc(100vw-2rem))] overflow-y-auto rounded-[2rem] border border-sky-100 bg-white p-4 shadow-2xl shadow-zinc-950/25">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-lg font-black text-zinc-950">{active?.emoji} {active?.label}</p>
            <button aria-label="Close calm tool" className="grid size-10 place-items-center rounded-full bg-zinc-100 text-xl font-black text-zinc-700" onClick={() => setActiveTool("")} type="button">×</button>
          </div>
          {activeTool === "focus" && <FocusTimer />}
          {activeTool === "breathe" && <div className="rounded-3xl bg-sky-50 p-5 text-center"><p className="text-lg font-black text-sky-950">Breathe at your own pace</p><p className="mt-2 text-sm font-bold leading-6 text-sky-800">Let your shoulders soften. Breathe in gently, pause, and breathe out slowly.</p></div>}
          {activeTool === "reflect" && <div className="rounded-3xl bg-amber-50 p-5"><p className="font-black text-amber-950">What would you like your panda to remember?</p><p className="mt-1 text-sm font-semibold text-amber-800">Your memories stay on the Journal page.</p><button className="mt-4 min-h-11 rounded-full bg-zinc-950 px-5 text-sm font-black text-white" onClick={() => { setActiveTool(""); onOpenJournal(); }} type="button">Open Journal</button></div>}
        </section>
      )}
    </section>
  );
}