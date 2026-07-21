import React, { useEffect, useState } from "react";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import SignUpPage from "../features/auth/pages/SignUpPage.jsx";
import { clearAuthSession, getAuthSession } from "../features/auth/utils/authStorage.js";
import Navbar from "../shared/components/Navbar.jsx";
import NavigationDrawer from "../shared/components/NavigationDrawer.jsx";
import BambooDecoration from "../shared/components/BambooDecoration.jsx";
import { AppProvider, useAppContext } from "./AppProvider.jsx";
import { routes } from "./routes.jsx";
import { getSeason, getSeasonTheme } from "../shared/utils/seasonUtils.js";
import { setStorageOwner } from "../shared/utils/storage.js";

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
    <div className={`relative min-h-screen overflow-x-hidden bg-gradient-to-br ${theme.page} text-zinc-900`}>
      <BambooDecoration className="pointer-events-none fixed -bottom-10 -left-5 z-0 hidden h-64 text-emerald-600 opacity-[0.09] lg:block" variant="cluster" />
      <BambooDecoration className="pointer-events-none fixed -right-6 top-24 z-0 hidden h-52 -scale-x-100 text-emerald-600 opacity-[0.07] xl:block" variant="cluster" />
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
      <div className="relative z-10">{routes[activePage] || routes.home}</div>
    </div>
  );
}

function storageOwnerFromSession(session) {
  if (!session || session.isGuest) return "guest";
  return session.user?.email || session.user?.id || "guest";
}

function MainApp({ authSession, onLogout }) {
  const storageOwner = storageOwnerFromSession(authSession);
  setStorageOwner(storageOwner);

  return (
    <AppProvider authSession={authSession} key={storageOwner} onLogout={onLogout}>
      <AppContent />
    </AppProvider>
  );
}

export default function App() {
  const [authSession, setAuthSession] = useState(() => getAuthSession());
  const [authScreen, setAuthScreen] = useState(() => (window.location.hash.replace(/^#\/?/, "") === "signup" ? "signup" : "login"));

  function enterApp(session) {
    setStorageOwner(storageOwnerFromSession(session));
    setAuthSession(session);
  }

  function logout() {
    setStorageOwner("guest");
    clearAuthSession();
    setAuthSession(null);
    setAuthScreen("login");
  }

  if (!authSession) {
    return authScreen === "signup" ? (
      <SignUpPage onEnterApp={enterApp} onShowLogin={() => setAuthScreen("login")} />
    ) : (
      <LoginPage onEnterApp={enterApp} onShowSignUp={() => setAuthScreen("signup")} />
    );
  }

  return <MainApp authSession={authSession} onLogout={logout} />;
}