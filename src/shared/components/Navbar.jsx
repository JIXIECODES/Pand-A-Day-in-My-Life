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
