import React from "react";
import PandaAvatar from "./panda/PandaAvatar.jsx";

export default function ConfirmActionModal({ action, onCancel, onConfirm }) {
  if (!action) return null;

  const destructive = action.variant === "danger";

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-white/35 p-4 backdrop-blur-md">
      <section className="animate-modal-in w-full max-w-md rounded-[2rem] border border-white/80 bg-white/95 p-6 text-center shadow-2xl shadow-zinc-200/70">
        <div className="mx-auto grid size-28 place-items-center rounded-full bg-emerald-50">
          <PandaAvatar mood={destructive ? "sleepy" : "happy"} size="small" />
        </div>
        <p className="mt-4 text-sm font-black uppercase text-pink-500">{action.eyebrow || "Gentle check"}</p>
        <h2 className="mt-1 text-2xl font-black text-zinc-950">{action.title}</h2>
        {action.goalTitle && (
          <p className="mt-3 rounded-2xl bg-zinc-50 p-3 text-sm font-bold text-zinc-600">{action.goalTitle}</p>
        )}
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <button
            className={[
              "rounded-full px-5 py-3 font-black text-white",
              destructive ? "bg-rose-500" : "bg-emerald-500",
            ].join(" ")}
            onClick={onConfirm}
            type="button"
          >
            {action.confirmLabel}
          </button>
          <button className="rounded-full bg-zinc-100 px-5 py-3 font-black text-zinc-700" onClick={onCancel} type="button">
            {action.cancelLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
