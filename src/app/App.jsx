import React, { useEffect, useState } from "react";
import Navbar from "../shared/components/Navbar.jsx";
import NavigationDrawer from "../shared/components/NavigationDrawer.jsx";
import { AppProvider, useAppContext } from "./AppProvider.jsx";
import { routes } from "./routes.jsx";
import { getSeason, getSeasonTheme } from "../shared/utils/seasonUtils.js";

function AppContent() {
  const { activePage, clearToast, setActivePage, settings, toast } = useAppContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const season = settings.theme === "seasonal" ? getSeason() : settings.theme;
  const theme = getSeasonTheme(season);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(clearToast, 3600);
    return () => window.clearTimeout(timeout);
  }, [clearToast, toast]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.page} text-zinc-900`}>
      <Navbar drawerOpen={drawerOpen} onOpenDrawer={() => setDrawerOpen(true)} />
      <NavigationDrawer
        activePage={activePage}
        onClose={() => setDrawerOpen(false)}
        onNavigate={setActivePage}
        open={drawerOpen}
      />
      {toast && (
        <div className="fixed right-4 top-4 z-[9999] max-w-sm rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-black text-white shadow-2xl shadow-zinc-950/20">
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