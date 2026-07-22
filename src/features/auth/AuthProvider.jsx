import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase.js";
import {
  clearGuestSession,
  createGuestSession,
  getGuestSession,
  removeLegacyLocalCredentials,
} from "./utils/authStorage.js";

const AuthContext = createContext(null);

function getAuthRedirectUrl() {
  return new URL(import.meta.env.BASE_URL, window.location.origin).toString();
}

function friendlyAuthMessage(error, action) {
  const code = String(error?.code || "").toLowerCase();
  const message = String(error?.message || "").toLowerCase();

  if (code.includes("invalid_credentials") || message.includes("invalid login credentials")) {
    return "That email or password does not match.";
  }
  if (code.includes("email_not_confirmed") || message.includes("email not confirmed")) {
    return "Please check your email to confirm your account.";
  }
  if (code.includes("user_already_exists") || message.includes("already registered") || message.includes("already exists")) {
    return "An account with this email may already exist.";
  }
  if (code.includes("weak_password") || message.includes("password")) {
    return "Your password must be at least the required length.";
  }
  if (message.includes("fetch") || message.includes("network")) {
    return "We cannot reach the account service right now. Please try again.";
  }
  return action === "signup"
    ? "We could not create that account yet. Please try again."
    : "We could not log you in right now. Please try again.";
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [guestSession, setGuestSession] = useState(() => getGuestSession());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    removeLegacyLocalCredentials();

    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (!error) setSession(data.session || null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        clearGuestSession();
        setGuestSession(null);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function signUp({ email, name, password }) {
    if (!supabase) throw new Error("Account sign-up needs Supabase configuration. You can still continue as a guest.");
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: getAuthRedirectUrl(),
      },
    });
    if (error) throw new Error(friendlyAuthMessage(error, "signup"));
    if (data.session) setSession(data.session);
    return data;
  }

  async function signIn({ email, password }) {
    if (!supabase) throw new Error("Account login needs Supabase configuration. You can still continue as a guest.");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw new Error(friendlyAuthMessage(error, "login"));
    clearGuestSession();
    setGuestSession(null);
    setSession(data.session);
    return data;
  }

  async function signOut() {
    if (session && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error("We could not sign you out right now. Please try again.");
    }
    clearGuestSession();
    setGuestSession(null);
    setSession(null);
  }

  function continueAsGuest() {
    setGuestSession(createGuestSession());
    setSession(null);
  }

  const user = session?.user || null;
  const authSession = useMemo(() => {
    if (user) {
      return {
        isGuest: false,
        session,
        user: {
          accountType: "supabase",
          email: user.email,
          id: user.id,
          name: user.user_metadata?.name || user.email?.split("@")[0] || "Panda friend",
        },
      };
    }
    return guestSession;
  }, [guestSession, session, user]);

  const value = useMemo(() => ({
    authSession,
    authAvailable: isSupabaseConfigured,
    continueAsGuest,
    loading,
    session,
    signIn,
    signOut,
    signUp,
    user,
  }), [authSession, loading, session, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}