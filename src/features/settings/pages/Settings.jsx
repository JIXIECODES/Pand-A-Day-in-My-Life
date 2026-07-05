import React from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import TimerSettings from "../../goals/components/TimerSettings.jsx";

const timezones = [
  "Local",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Asia/Tokyo",
];

export default function Settings() {
  const { authSession, logout, resetAppData, settings, updateSettings } = useAppContext();

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <section className="rounded-[2rem] bg-white/80 p-6 shadow-xl shadow-zinc-200/60">
        <p className="text-sm font-black text-pink-500">Settings</p>
        <h1 className="mt-1 text-3xl font-black text-zinc-950">Panda preferences</h1>

        <div className="mt-6 space-y-4">
          <div className="rounded-3xl bg-emerald-50 p-4">
            <h2 className="font-black text-emerald-950">Account</h2>
            <p className="mt-1 text-sm font-semibold text-emerald-800">
              {authSession?.isGuest
                ? "You are planning as a guest in this browser."
                : `Signed in locally as ${authSession?.user?.name || "your panda account"}.`}
            </p>
            <button className="mt-4 rounded-full bg-emerald-500 px-5 py-3 font-black text-white" onClick={logout} type="button">
              {authSession?.isGuest ? "Exit guest mode" : "Log out"}
            </button>
          </div>

          <label className="block rounded-3xl bg-zinc-50 p-4">
            <span className="text-sm font-black text-zinc-700">Timezone</span>
            <select
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-bold outline-none focus:border-pink-300"
              onChange={(event) => updateSettings({ timezone: event.target.value })}
              value={settings.timezone}
            >
              {timezones.map((timezone) => (
                <option key={timezone} value={timezone}>{timezone}</option>
              ))}
            </select>
          </label>

          <button
            className="flex w-full items-center justify-between rounded-3xl bg-zinc-50 p-4 text-left font-black"
            onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
            type="button"
          >
            <span>Notifications</span>
            <span className="rounded-full bg-white px-3 py-1 text-sm text-zinc-600">{settings.notificationsEnabled ? "On" : "Off"}</span>
          </button>

          <label className="block rounded-3xl bg-zinc-50 p-4">
            <span className="text-sm font-black text-zinc-700">Theme</span>
            <select
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-bold outline-none focus:border-pink-300"
              onChange={(event) => updateSettings({ theme: event.target.value })}
              value={settings.theme}
            >
              <option value="seasonal">Seasonal</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
            </select>
          </label>

          <div className="rounded-3xl bg-zinc-950 p-4">
            <TimerSettings />
          </div>

          <div className="rounded-3xl bg-rose-50 p-4">
            <h2 className="font-black text-rose-900">Reset local data</h2>
            <p className="mt-1 text-sm font-semibold text-rose-700">This clears goals, journal memories, panda stats, rewards, and settings stored in this browser.</p>
            <button
              className="mt-4 rounded-full bg-rose-500 px-5 py-3 font-black text-white"
              onClick={() => {
                if (window.confirm("Reset all local panda data?")) resetAppData();
              }}
              type="button"
            >
              Reset data
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
