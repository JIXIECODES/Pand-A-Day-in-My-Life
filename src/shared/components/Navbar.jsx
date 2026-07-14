import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppContext } from "../../app/AppProvider.jsx";
import { getPandaMoodImage, pandaMoods } from "../../data/pandaMoods.js";
import { xpForNextLevel } from "../../features/panda/utils/pandaLogic.js";

export default function Navbar({ drawerOpen, onOpenDrawer }) {
  const { activePage, authSession, logout, pandaStats, setActivePage } = useAppContext();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const nextLevelXp = xpForNextLevel(pandaStats.level);
  const xpPercent = Math.min(100, Math.round((pandaStats.xp / nextLevelXp) * 100));
  const mood = pandaMoods[pandaStats.mood] || pandaMoods.idle;
  const moodImage = getPandaMoodImage(pandaStats.mood);
  const accountLabel = authSession?.isGuest
    ? "Guest panda"
    : authSession?.user?.name || "Panda profile";

  const menuItems = useMemo(
    () => [
      { id: "panda", label: "Panda profile", page: "panda" },
      { id: "settings", label: "Settings", page: "settings" },
    ],
    [],
  );

  useEffect(() => {
    setProfileOpen(false);
  }, [activePage]);

  useEffect(() => {
    if (!profileOpen) return undefined;

    function closeProfileMenu(event) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        return;
      }

      if (event.type === "mousedown" && profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    window.addEventListener("keydown", closeProfileMenu);
    window.addEventListener("mousedown", closeProfileMenu);
    return () => {
      window.removeEventListener("keydown", closeProfileMenu);
      window.removeEventListener("mousedown", closeProfileMenu);
    };
  }, [profileOpen]);

  function navigateFromProfile(page) {
    setProfileOpen(false);
    setActivePage(page);
  }

  function signOut() {
    setProfileOpen(false);
    logout();
  }

  return (
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

        <div className="relative" ref={profileRef}>
          <button
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-label="Open panda profile and settings menu"
            className="flex max-w-[9rem] items-center gap-2 rounded-full border border-zinc-200 bg-white p-1 pr-2 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:max-w-none sm:pr-3"
            onClick={() => setProfileOpen((open) => !open)}
            type="button"
          >
            <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-50 shadow-inner ring-1 ring-emerald-100">
              <img alt={`${mood.label} panda profile`} className="panda-mood-image panda-mood-thumbnail" src={moodImage} />
              <span className="absolute bottom-0 right-0 grid size-4 place-items-center rounded-full bg-zinc-950 text-white ring-2 ring-white" aria-hidden="true">
                <svg className="size-2.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
                  <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                  <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.05.05a2 2 0 0 1-2.83 2.83l-.05-.05a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 0 1-4 0v-.07a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.05.05a2 2 0 0 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 0 1 0-4h.07A1.7 1.7 0 0 0 4.6 8a1.7 1.7 0 0 0-.34-1.88l-.05-.05a2 2 0 1 1 2.83-2.83l.05.05A1.7 1.7 0 0 0 8.97 3.6 1.7 1.7 0 0 0 10 2.07V2a2 2 0 0 1 4 0v.07a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.05-.05a2 2 0 1 1 2.83 2.83l-.05.05A1.7 1.7 0 0 0 19.4 8a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 0 1 0 4h-.07A1.7 1.7 0 0 0 19.4 15Z" />
                </svg>
              </span>
            </span>
            <span className="hidden min-w-0 text-left sm:block">
              <span className="block truncate text-sm font-black text-zinc-950">{accountLabel}</span>
              <span className="block text-xs font-bold text-zinc-500">{authSession?.isGuest ? "Guest mode" : "Local account"}</span>
            </span>
          </button>

          {profileOpen && (
            <div
              aria-label="Panda profile menu"
              className="absolute right-0 top-[calc(100%+0.6rem)] z-50 w-[min(18rem,calc(100vw-2rem))] rounded-[1.5rem] border border-white/80 bg-white/95 p-2 shadow-2xl shadow-zinc-950/15 backdrop-blur"
              role="menu"
            >
              <div className="border-b border-zinc-100 px-3 py-3">
                <p className="truncate text-sm font-black text-zinc-950">{accountLabel}</p>
                <p className="mt-1 truncate text-xs font-bold text-zinc-500">
                  {authSession?.isGuest ? "Planning as a guest" : authSession?.user?.email || "Local panda account"}
                </p>
              </div>

              <div className="grid gap-1 py-2">
                {menuItems.map((item) => (
                  <button
                    className="rounded-2xl px-3 py-2.5 text-left text-sm font-black text-zinc-700 transition hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                    key={item.id}
                    onClick={() => navigateFromProfile(item.page)}
                    role="menuitem"
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                className="w-full rounded-2xl bg-rose-50 px-3 py-2.5 text-left text-sm font-black text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-100"
                onClick={signOut}
                role="menuitem"
                type="button"
              >
                {authSession?.isGuest ? "Go to login" : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
