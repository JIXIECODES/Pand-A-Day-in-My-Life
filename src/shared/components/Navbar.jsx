import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../app/AppProvider.jsx";
import PandaTutorial from "../../features/home/components/PandaTutorial.jsx";
import { xpForNextLevel } from "../../features/panda/utils/pandaLogic.js";

function PandaCareGuideModal({ onClose, open, returnFocusRef }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      returnFocusRef.current?.focus();
    };
  }, [onClose, open, returnFocusRef]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-white/35 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <section
        aria-labelledby="panda-care-guide-title"
        aria-modal="true"
        className="animate-modal-in my-6 max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 shadow-2xl shadow-zinc-200/70"
        onClick={(event) => event.stopPropagation()}
        ref={panelRef}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-emerald-50 p-5">
          <div>
            <p className="text-xs font-black uppercase text-pink-500">Panda Care Guide</p>
            <h2 className="text-2xl font-black text-zinc-950" id="panda-care-guide-title">How to Raise Your Panda</h2>
          </div>
          <button
            aria-label="Close Panda Care Guide"
            className="grid size-10 place-items-center rounded-full bg-emerald-50 font-black text-zinc-700"
            onClick={onClose}
            type="button"
          >
            X
          </button>
        </div>
        <div className="max-h-[78vh] overflow-y-auto p-5">
          <PandaTutorial compact />
        </div>
      </section>
    </div>
  );
}

export default function Navbar({ drawerOpen, onOpenDrawer }) {
  const { pandaStats, setActivePage } = useAppContext();
  const [guideOpen, setGuideOpen] = useState(false);
  const guideButtonRef = useRef(null);
  const nextLevelXp = xpForNextLevel(pandaStats.level);
  const xpPercent = Math.min(100, Math.round((pandaStats.xp / nextLevelXp) * 100));

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
          <button
            aria-controls="main-navigation-drawer"
            aria-expanded={drawerOpen}
            aria-label="Open navigation menu"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-xl font-black text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            onClick={onOpenDrawer}
            type="button"
          >
            <span aria-hidden="true" className="grid gap-1">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>

          <button className="flex min-w-0 items-center gap-3 text-left" onClick={() => setActivePage("home")} type="button">
            <span className="relative grid size-11 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-3xl shadow-sm sm:size-12" aria-hidden="true">
              <span className="absolute inset-0 grid place-items-center font-['Apple_Color_Emoji','Segoe_UI_Emoji','Noto_Color_Emoji',sans-serif]">
                {"\u{1F43C}"}
              </span>
              <svg className="size-8" viewBox="0 0 64 64" role="presentation">
                <circle cx="18" cy="18" r="10" fill="#18181b" />
                <circle cx="46" cy="18" r="10" fill="#18181b" />
                <circle cx="32" cy="33" r="24" fill="#18181b" />
                <circle cx="32" cy="35" r="18" fill="#fff" />
                <ellipse cx="24" cy="31" rx="6" ry="8" fill="#18181b" />
                <ellipse cx="40" cy="31" rx="6" ry="8" fill="#18181b" />
                <circle cx="26" cy="29" r="2" fill="#fff" />
                <circle cx="42" cy="29" r="2" fill="#fff" />
                <ellipse cx="32" cy="40" rx="4" ry="3" fill="#18181b" />
                <path d="M25 46q7 5 14 0" fill="none" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-black text-zinc-950 sm:text-xl">Pand-A Day in My Life</span>
              <span className="hidden text-xs font-bold text-zinc-500 sm:block">A cozy productivity companion</span>
            </span>
          </button>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <div className="rounded-full border border-amber-100 bg-amber-50 px-3 py-2 text-sm font-black text-amber-900 shadow-sm">
              {pandaStats.streak} day streak
            </div>

            <div className="min-w-44 rounded-full border border-emerald-100 bg-white px-3 py-2 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-black text-zinc-900">Lv. {pandaStats.level}</span>
                <span className="text-xs font-black text-zinc-500">{pandaStats.xp}/{nextLevelXp} XP</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-emerald-500" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-900">
              {pandaStats.streak}d
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-800">
              Lv. {pandaStats.level}
            </span>
          </div>

          <button
            className="inline-flex rounded-full border border-pink-100 bg-pink-50 px-3 py-2 text-xs font-black text-pink-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-pink-100 focus:outline-none focus:ring-4 focus:ring-pink-200 sm:px-4 sm:text-sm"
            onClick={() => setGuideOpen(true)}
            ref={guideButtonRef}
            type="button"
          >
            <span className="hidden sm:inline">Panda Care Guide</span>
            <span className="sm:hidden">Guide</span>
          </button>
        </div>
      </header>
      <PandaCareGuideModal onClose={() => setGuideOpen(false)} open={guideOpen} returnFocusRef={guideButtonRef} />
    </>
  );
}