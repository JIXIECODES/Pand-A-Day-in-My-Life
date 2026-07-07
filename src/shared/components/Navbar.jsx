import React from "react";
import { useAppContext } from "../../app/AppProvider.jsx";

const links = [
  { id: "home", label: "Home", icon: "Home" },
  { id: "calendar", label: "Planning", icon: "Plan" },
  { id: "panda", label: "Panda", icon: "Panda" },
  { id: "journal", label: "Journal", icon: "Jrnl" },
  { id: "rewards", label: "Rewards", icon: "Gift" },
  { id: "settings", label: "Settings", icon: "Set" },
];

export default function Navbar() {
  const { activePage, setActivePage } = useAppContext();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <button className="flex items-center gap-3 text-left" onClick={() => setActivePage("home")} type="button">
          <span className="grid size-12 place-items-center rounded-full bg-zinc-950 text-xs font-black uppercase text-white shadow-sm">PandA</span>
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
              <span className="text-[0.65rem] uppercase tracking-[0.08em]">{link.icon}</span>
              {link.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
