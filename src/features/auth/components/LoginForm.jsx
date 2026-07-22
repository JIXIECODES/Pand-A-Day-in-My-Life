import React, { useState } from "react";
import { useAuth } from "../AuthProvider.jsx";

export default function LoginForm({ onShowSignUp }) {
  const { authAvailable, continueAsGuest, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn({ email, password });
      setPassword("");
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <p className="text-sm font-black text-emerald-600">Welcome back</p>
        <h2 className="mt-1 text-2xl font-black text-zinc-950">Log in to your panda account</h2>
      </div>

      {!authAvailable && (
        <p className="rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-800">
          Account login is waiting for Supabase setup. Guest mode still works on this device.
        </p>
      )}
      {error && <p className="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700" role="alert">{error}</p>}

      <label className="block">
        <span className="mb-1 block text-sm font-black text-zinc-700">Email</span>
        <input autoComplete="email" className="auth-input" onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required type="email" value={email} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-black text-zinc-700">Password</span>
        <input autoComplete="current-password" className="auth-input" onChange={(event) => setPassword(event.target.value)} placeholder="Your password" required type="password" value={password} />
      </label>

      <button className="w-full rounded-full bg-emerald-400 px-5 py-3 font-black text-emerald-950 shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading || !authAvailable} type="submit">
        {loading ? "Logging in..." : "Log in"}
      </button>
      <button className="w-full rounded-full bg-white px-5 py-3 font-black text-zinc-700 shadow-sm" onClick={continueAsGuest} type="button">
        Continue without an account
      </button>
      <p className="text-center text-xs font-bold leading-5 text-zinc-500">Guest progress stays in this browser. Create an account when you want it on other devices.</p>
      <button className="w-full text-sm font-black text-pink-500" onClick={onShowSignUp} type="button">
        Need a panda account? Sign up
      </button>
    </form>
  );
}