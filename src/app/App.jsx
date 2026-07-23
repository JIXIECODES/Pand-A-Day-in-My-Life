import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../features/auth/AuthProvider.jsx";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import SignUpPage from "../features/auth/pages/SignUpPage.jsx";
import { useCloudUserData } from "../features/userData/hooks/useCloudUserData.js";
import Navbar from "../shared/components/Navbar.jsx";
import NavigationDrawer from "../shared/components/NavigationDrawer.jsx";
import BambooDecoration from "../shared/components/BambooDecoration.jsx";
import { AppProvider, useAppContext } from "./AppProvider.jsx";
import { routes } from "./routes.jsx";
import { getSeason, getSeasonTheme } from "../shared/utils/seasonUtils.js";
import { setStorageOwner } from "../shared/utils/storage.js";

function AppLoading({ message = "Loading your panda's world..." }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#fff8ed_0%,#ecfdf3_52%,#fdf2f8_100%)] px-4 text-center">
      <div className="rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-2xl shadow-emerald-100/70">
        <span aria-hidden="true" className="text-5xl">🐼</span>
        <p className="mt-4 font-black text-zinc-800" role="status">{message}</p>
      </div>
    </main>
  );
}

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

function storageOwnerFromSession(authSession) {
  if (!authSession || authSession.isGuest) return "guest";
  return authSession.user?.id || "guest";
}

function MainApp({ authSession, cloudDataReady, initialToast, onLogout, syncStatus }) {
  const storageOwner = storageOwnerFromSession(authSession);
  setStorageOwner(storageOwner);

  return (
    <AppProvider
      authSession={authSession}
      initialToast={initialToast}
      key={`${storageOwner}:${cloudDataReady ? "ready" : "loading"}`}
      onLogout={onLogout}
      syncStatus={syncStatus}
    >
      <AppContent />
    </AppProvider>
  );
}

function authScreenFromHash() {
  const page = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  if (page === "signup") return "signup";
  if (page === "login") return "login";
  return null;
}

function AppGate() {
  const { authSession, loading: authLoading, signOut, user } = useAuth();
  const cloudData = useCloudUserData(user);
  const [authScreen, setAuthScreen] = useState(() => authScreenFromHash() || "login");

  useEffect(() => {
    if (authLoading) return undefined;

    function syncAuthRoute() {
      const requestedScreen = authScreenFromHash();
      if (authSession) {
        if (requestedScreen) {
          window.history.replaceState({ activePage: "home" }, "", "#home");
        }
        return;
      }

      if (!requestedScreen) {
        window.history.replaceState({}, "", "#login");
        setAuthScreen("login");
      } else {
        setAuthScreen(requestedScreen);
      }
    }

    syncAuthRoute();
    window.addEventListener("hashchange", syncAuthRoute);
    window.addEventListener("popstate", syncAuthRoute);
    return () => {
      window.removeEventListener("hashchange", syncAuthRoute);
      window.removeEventListener("popstate", syncAuthRoute);
    };
  }, [authLoading, authSession]);

  function showAuthScreen(screen) {
    window.history.pushState({}, "", `#${screen}`);
    setAuthScreen(screen);
  }

  async function logout() {
    try {
      await signOut();
      setStorageOwner("guest");
      window.history.replaceState({}, "", "#login");
      setAuthScreen("login");
    } catch (error) {
      window.alert(error.message);
    }
  }

  if (authLoading && !authSession) return <AppLoading message="Checking your panda account..." />;

  if (!authSession) {
    return authScreen === "signup" ? (
      <SignUpPage onShowLogin={() => showAuthScreen("login")} />
    ) : (
      <LoginPage onShowSignUp={() => showAuthScreen("signup")} />
    );
  }


  return (
    <MainApp
      authSession={authSession}
      cloudDataReady={cloudData.ready}
      initialToast={cloudData.notice}
      onLogout={logout}
      syncStatus={cloudData.status}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  );
}