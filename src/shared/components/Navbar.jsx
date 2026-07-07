import React from "react";
import { useAppContext } from "../../app/AppProvider.jsx";

const links = [
  { id: "home", label: "\u{1F3E0} Home" },
  { id: "calendar", label: "\u{1F5D3}\uFE0F Planning" },
  { id: "panda", label: "\u{1F43C} Panda" },
  { id: "journal", label: "\u{1F4D6} Journal" },
  { id: "rewards", label: "\u{1F381} Rewards" },
  { id: "settings", label: "\u2699\uFE0F Settings" },
];

export default function Navbar() {
  const { activePage, setActivePage } = useAppContext();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <button className="flex items-center gap-3 text-left" onClick={() => setActivePage("home")} type="button">
          <span className="grid size-12 place-items-center rounded-full bg-zinc-950 text-2xl text-white shadow-sm" aria-hidden="true">
            {"\u{1F43C}"}
          </span>
          <span>
            <span className="block text-xl font-black text-zinc-950">Pand-A Day in My Life</span>
            <span className="block text-xs font-bold text-zinc-500">A cozy productivity companion</span>
          </span>
        </button>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
          {links.map((link) => (
            <button
              className={[
                "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition",
                activePage === link.id
                  ? "bg-zinc-950 text-white shadow-md shadow-zinc-300"
                  : "bg-white/80 text-zinc-600 hover:bg-white",
              ].join(" ")}
              key={link.id}
              onClick={() => setActivePage(link.id)}
              type="button"
            >
              {link.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
