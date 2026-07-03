import React, { useEffect } from "react";
import LoginPage from "./auth/pages/LoginPage.jsx";
import SignUpPage from "./auth/pages/SignUpPage.jsx";
import { clearAuthSession, getAuthSession } from "./auth/utils/authStorage.js";
import Navbar from "./components/Navbar.jsx";
import { AppProvider, useAppContext } from "./context/AppContext.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import Home from "./pages/Home.jsx";
import JournalPage from "./pages/JournalPage.jsx";
import PandaPage from "./pages/PandaPage.jsx";
import RewardsPage from "./pages/RewardsPage.jsx";
import Settings from "./pages/Settings.jsx";
import { getSeason, getSeasonTheme } from "./utils/seasonUtils.js";

function AppContent() {
  const { activePage, clearToast, settings, toast } = useAppContext();
  const season = settings.theme === "seasonal" ? getSeason() : settings.theme;
  const theme = getSeasonTheme(season);
  const pages = {
    home: <Home />,
    calendar: <CalendarPage />,
    panda: <PandaPage />,
    journal: <JournalPage />,
    rewards: <RewardsPage />,
    settings: <Settings />,
  };

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
      {pages[activePage] || pages.home}
    </div>
  );
}

export default function App() {
  const [authSession, setAuthSession] = React.useState(() => getAuthSession());
  const [authPage, setAuthPage] = React.useState("signup");

  function enterApp(session) {
    setAuthSession(session);
  }

  function exitSession() {
    clearAuthSession();
    setAuthSession(null);
    setAuthPage("login");
  }

  if (!authSession) {
    return authPage === "login" ? (
      <LoginPage
        onEnterApp={enterApp}
        onShowSignUp={() => setAuthPage("signup")}
      />
    ) : (
      <SignUpPage
        onEnterApp={enterApp}
        onShowLogin={() => setAuthPage("login")}
      />
    );
  }

  return (
    <AppProvider authSession={authSession} onExitSession={exitSession}>
      <AppContent />
    </AppProvider>
  );
}
