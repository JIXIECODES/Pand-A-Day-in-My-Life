import React, { useState } from "react";
import { useAppContext } from "../../app/AppProvider.jsx";
import NavigationDrawer from "./NavigationDrawer.jsx";

export default function Navbar() {
  const { activePage, setActivePage } = useAppContext();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <button
          aria-controls="main-navigation-drawer"
          aria-expanded={drawerOpen}
          aria-label="Open navigation menu"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-xl font-black text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-200"
          onClick={() => setDrawerOpen(true)}
          type="button"
        >
          <span aria-hidden="true" className="grid gap-1">
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </span>
        </button>

        <button className="flex items-center gap-3 text-left" onClick={() => setActivePage("home")} type="button">
          <span className="relative grid size-12 place-items-center rounded-full border border-zinc-200 bg-white text-3xl shadow-sm" aria-hidden="true">
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
          <span>
            <span className="block text-xl font-black text-zinc-950">Pand-A Day in My Life</span>
            <span className="block text-xs font-bold text-zinc-500">A cozy productivity companion</span>
          </span>
        </button>

        <NavigationDrawer
          activePage={activePage}
          onClose={() => setDrawerOpen(false)}
          onNavigate={setActivePage}
          open={drawerOpen}
        />
      </div>
    </header>
  );
}
