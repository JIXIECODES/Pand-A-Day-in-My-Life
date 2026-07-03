import React from "react";

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed right-4 top-24 z-[70] max-w-sm rounded-3xl border border-white/80 bg-white/90 p-4 text-sm font-black text-zinc-800 shadow-xl shadow-emerald-100 backdrop-blur">
      <div className="flex items-start gap-3">
        <span className="mt-1 size-3 rounded-full bg-emerald-300 shadow-sm" />
        <p className="flex-1">{message}</p>
        <button className="rounded-full bg-zinc-100 px-2 text-xs" onClick={onClose} type="button">
          X
        </button>
      </div>
    </div>
  );
}
