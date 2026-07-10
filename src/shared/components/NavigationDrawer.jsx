import React, { useEffect } from "react";
import { navigationLinks } from "../../app/navigation.js";

export default function NavigationDrawer({ activePage, onClose, onNavigate, open }) {
  useEffect(() => {
    if (!open) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.classList.add("navigation-drawer-open");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("navigation-drawer-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, open]);

  function selectPage(pageId) {
    onNavigate(pageId);
    if (window.matchMedia("(max-width: 767px)").matches) {
      onClose();
    }
  }

  return (
    <>
      <button
        aria-hidden={!open}
        aria-label="Close navigation menu"
        className={[
          "fixed inset-0 z-40 bg-zinc-950/35 backdrop-blur-[1px] transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        type="button"
      />

      <aside
        aria-label="Page navigation"
        aria-hidden={!open}
        aria-modal="true"
        className={[
          "fixed bottom-0 left-0 top-0 z-50 w-[min(86vw,19rem)] border-r border-white/80 bg-gradient-to-b from-white via-emerald-50 to-amber-50 shadow-2xl shadow-zinc-950/20 transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        id="main-navigation-drawer"
        role="dialog"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-3 border-b border-white/80 px-5 py-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Menu</p>
              <h2 className="mt-1 text-2xl font-black text-zinc-950">Pand-A Day</h2>
            </div>
            <button
              aria-label="Close navigation menu"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-xl font-black text-zinc-700 shadow-sm transition hover:bg-pink-50 focus:outline-none focus:ring-4 focus:ring-pink-200"
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              type="button"
            >
              <span aria-hidden="true">x</span>
            </button>
          </div>

          <nav aria-label="Primary pages" className="flex-1 overflow-y-auto px-4 py-5">
            <div className="grid gap-2">
              {navigationLinks.map((link) => (
                <button
                  className={[
                    "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-base font-black transition focus:outline-none focus:ring-4 focus:ring-pink-200",
                    activePage === link.id
                      ? "bg-zinc-950 text-white shadow-lg shadow-zinc-300"
                      : "bg-white/75 text-zinc-700 shadow-sm hover:-translate-y-0.5 hover:bg-white",
                  ].join(" ")}
                  key={link.id}
                  onClick={() => selectPage(link.id)}
                  tabIndex={open ? 0 : -1}
                  type="button"
                >
                  <span>{link.label}</span>
                  {activePage === link.id && <span className="rounded-full bg-white/20 px-2 py-1 text-xs">Current</span>}
                </button>
              ))}
            </div>
          </nav>

          <div className="border-t border-white/80 p-4">
            <p className="rounded-3xl bg-white/75 p-3 text-sm font-bold text-zinc-600 shadow-sm">
              A soft little shortcut shelf for every panda page.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
