export default function Navbar({ currentPage, onNavigate }) {
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#fff8ef]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          className="flex items-center gap-3 text-left"
          onClick={() => onNavigate("home")}
          type="button"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-stone-900 text-2xl">
            🐼
          </span>
          <span>
            <span className="block text-lg font-black text-stone-900">
              Pand-A Day
            </span>
            <span className="block text-xs font-semibold text-stone-500">
              in My Life
            </span>
          </span>
        </button>

        <nav className="flex rounded-full bg-white p-1 shadow-sm ring-1 ring-stone-200">
          {["home", "settings"].map((page) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                currentPage === page
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-emerald-50"
              }`}
              key={page}
              onClick={() => onNavigate(page)}
              type="button"
            >
              {page === "home" ? "Calendar" : "Settings"}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
