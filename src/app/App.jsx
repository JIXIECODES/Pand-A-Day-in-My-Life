import React, { useEffect } from "react";
import Navbar from "../shared/components/Navbar.jsx";
import { AppProvider, useAppContext } from "./AppProvider.jsx";
import { routes } from "./routes.jsx";
import { getSeason, getSeasonTheme } from "../shared/utils/seasonUtils.js";

function AppContent() {
  const { activePage, clearToast, settings, toast } = useAppContext();
  const season = settings.theme === "seasonal" ? getSeason() : settings.theme;
  const theme = getSeasonTheme(season);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(clearToast, 3600);
    return () => window.clearTimeout(timeout);
  }, [clearToast, toast]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.page} text-zinc-900`}>
      <Navbar />
      {toast && (
        <div className="fixed right-4 top-24 z-50 max-w-sm rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-black text-white shadow-xl">
          {toast}
        </div>
      )}
      {routes[activePage] || routes.home}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
