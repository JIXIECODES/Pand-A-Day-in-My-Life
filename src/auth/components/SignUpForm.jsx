import React, { useState } from "react";
import { createGuestSession, createLocalUser, createUserSession } from "../utils/authStorage.js";
import { sendWelcomeEmail } from "../utils/emailService.js";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignUpForm({ onEnterApp, onShowLogin }) {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

    if (form.password !== form.confirmPassword) {
      setError("Those passwords do not match yet.");
      return;
    }

    try {
      const user = createLocalUser(form);
      await sendWelcomeEmail(user.email, user.name);
      const session = createUserSession(user);
      setMessage("Account created. Welcome email prepared. Connect an email service to send real emails.");
      window.setTimeout(() => onEnterApp(session), 650);
    } catch (caughtError) {
      setError(caughtError.message || "We could not create that account yet.");
    }
  }

  function continueAsGuest() {
    onEnterApp(createGuestSession());
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <p className="text-sm font-black text-pink-500">Start gently</p>
        <h2 className="mt-1 text-2xl font-black text-zinc-950">Create your panda account</h2>
      </div>

      {message && <p className="rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</p>}
      {error && <p className="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}

      <input className="auth-input" name="name" onChange={updateField} placeholder="Name" value={form.name} />
      <input className="auth-input" name="email" onChange={updateField} placeholder="Email" type="email" value={form.email} />
      <input className="auth-input" name="password" onChange={updateField} placeholder="Password" type="password" value={form.password} />
      <input className="auth-input" name="confirmPassword" onChange={updateField} placeholder="Confirm password" type="password" value={form.confirmPassword} />

      <button className="w-full rounded-full bg-emerald-400 px-5 py-3 font-black text-emerald-950 shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5" type="submit">
        Sign Up
      </button>
      <button className="w-full rounded-full bg-white px-5 py-3 font-black text-zinc-700 shadow-sm" onClick={continueAsGuest} type="button">
        Continue without an account
      </button>
      <button className="w-full text-sm font-black text-pink-500" onClick={onShowLogin} type="button">
        Already have one? Log in
      </button>
    </form>
  );
}
