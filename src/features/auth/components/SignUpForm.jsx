import React, { useState } from "react";
import { useAuth } from "../AuthProvider.jsx";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignUpForm({ onShowLogin }) {
  const { authAvailable, continueAsGuest, signUp } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Your panda needs a name, email, and password to save this account.");
      return;
    }
    if (form.password.length < 6) {
      setError("Your password must be at least the required length.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Those passwords do not match yet.");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(form);
      setForm((current) => ({ ...current, password: "", confirmPassword: "" }));
      if (!result.session) {
        setMessage("Please check your email to confirm your account.");
      }
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <p className="text-sm font-black text-pink-500">Start gently</p>
        <h2 className="mt-1 text-2xl font-black text-zinc-950">Create your panda account</h2>
      </div>

      {!authAvailable && (
        <p className="rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-800">
          Account sign-up is waiting for Supabase setup. Guest mode still works on this device.
        </p>
      )}
      {message && <p className="rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700" role="status">{message}</p>}
      {error && <p className="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700" role="alert">{error}</p>}

      <label className="block">
        <span className="mb-1 block text-sm font-black text-zinc-700">Name</span>
        <input autoComplete="name" className="auth-input" name="name" onChange={updateField} placeholder="Your name" required value={form.name} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-black text-zinc-700">Email</span>
        <input autoComplete="email" className="auth-input" name="email" onChange={updateField} placeholder="you@example.com" required type="email" value={form.email} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-black text-zinc-700">Password</span>
        <input autoComplete="new-password" className="auth-input" minLength="6" name="password" onChange={updateField} placeholder="At least 6 characters" required type="password" value={form.password} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-black text-zinc-700">Confirm password</span>
        <input autoComplete="new-password" className="auth-input" minLength="6" name="confirmPassword" onChange={updateField} placeholder="Repeat your password" required type="password" value={form.confirmPassword} />
      </label>

      <button className="w-full rounded-full bg-emerald-400 px-5 py-3 font-black text-emerald-950 shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading || !authAvailable} type="submit">
        {loading ? "Creating account..." : "Create account"}
      </button>
      <button className="w-full rounded-full bg-white px-5 py-3 font-black text-zinc-700 shadow-sm" onClick={continueAsGuest} type="button">
        Continue without an account
      </button>
      <p className="text-center text-xs font-bold leading-5 text-zinc-500">Guest progress stays in this browser. Your first account sign-in can safely import it.</p>
      <button className="w-full text-sm font-black text-pink-500" onClick={onShowLogin} type="button">
        Already have one? Log in
      </button>
    </form>
  );
}