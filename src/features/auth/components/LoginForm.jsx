import React, { useState } from "react";
import { createGuestSession, createUserSession, loginLocalUser } from "../utils/authStorage.js";

export default function LoginForm({ onEnterApp, onShowSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    setError("");

    const user = loginLocalUser(email, password);
    if (!user) {
      setError("That account is not ready yet. Try again or continue as a guest.");
      return;
    }

    onEnterApp(createUserSession(user));
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <p className="text-sm font-black text-emerald-600">Welcome back</p>
        <h2 className="mt-1 text-2xl font-black text-zinc-950">Local panda login</h2>
      </div>

      {error && <p className="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}

      <input className="auth-input" onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" value={email} />
      <input className="auth-input" onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" value={password} />

      <button className="w-full rounded-full bg-emerald-400 px-5 py-3 font-black text-emerald-950 shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5" type="submit">
        Login
      </button>
      <button className="w-full rounded-full bg-white px-5 py-3 font-black text-zinc-700 shadow-sm" onClick={() => onEnterApp(createGuestSession())} type="button">
        Continue without an account
      </button>
      <button className="w-full text-sm font-black text-pink-500" onClick={onShowSignUp} type="button">
        Need a panda account? Sign up
      </button>
    </form>
  );
}
