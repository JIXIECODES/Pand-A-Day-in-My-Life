import React, { useState } from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { todayKey } from "../../calendar/utils/dateUtils.js";
import BambooDecoration from "../../../shared/components/BambooDecoration.jsx";

export default function JournalPage() {
  const { journalEntries, removeJournalEntry, saveJournalEntry } = useAppContext();
  const today = todayKey();
  const [text, setText] = useState("");
  const entries = Object.values(journalEntries).sort((a, b) =>
    (b.createdAt || b.date).localeCompare(a.createdAt || a.date),
  );

  function saveMemory() {
    const saved = saveJournalEntry(today, text);
    if (saved) setText("");
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_1fr]">
      <section className="relative overflow-hidden rounded-[2rem] bg-white/80 p-6 shadow-xl shadow-zinc-200/60">
        <BambooDecoration className="pointer-events-none absolute -right-3 -top-4 size-24 rotate-12 text-emerald-500 opacity-20" />
        <p className="text-sm font-black text-pink-500">Daily journal</p>
        <h1 className="mt-1 pr-14 text-3xl font-black text-zinc-950">Create a panda memory</h1>
        <textarea className="mt-5 min-h-56 w-full resize-none rounded-3xl border border-zinc-200 bg-zinc-50 p-4 outline-none focus:border-pink-300" onChange={(event) => setText(event.target.value)} placeholder="What did you do, feel, practice, or notice today?" value={text} />
        <button className="mt-4 rounded-full bg-zinc-950 px-5 py-3 font-black text-white" onClick={saveMemory} type="button">
          Save memory
        </button>
      </section>

      <section className="relative overflow-hidden rounded-[2rem] bg-white/80 p-6 shadow-xl shadow-zinc-200/60">
        <h2 className="text-2xl font-black text-zinc-950">Saved memories</h2>
        <BambooDecoration className="mt-1 h-7 w-40 text-emerald-600" variant="divider" />
        <div className="mt-4 space-y-3">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <article className="rounded-3xl bg-zinc-50 p-4" key={entry.id}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-black uppercase text-pink-500">{entry.date}</p>
                  <button
                    className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700"
                    onClick={() => removeJournalEntry(entry.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-2 font-semibold text-zinc-700">{entry.text}</p>
                <p className="mt-3 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                  Your panda remembers that you cared for your day.
                </p>
              </article>
            ))
          ) : (
            <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">No memories yet. A sentence is enough.</p>
          )}
        </div>
      </section>
    </main>
  );
}
