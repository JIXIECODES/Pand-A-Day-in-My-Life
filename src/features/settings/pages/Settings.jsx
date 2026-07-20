import React from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { categoryKey, GOAL_CATEGORIES } from "../../../shared/utils/storage.js";

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
  const {
    categoryColors,
    resetAppData,
    resetCategoryColors,
    settings,
    updateCategoryColor,
    updateSettings,
  } = useAppContext();

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <section className="rounded-[2rem] bg-white/80 p-6 shadow-xl shadow-zinc-200/60">
        <p className="text-sm font-black text-pink-500">Settings</p>
        <h1 className="mt-1 text-3xl font-black text-zinc-950">Panda preferences</h1>

        <div className="mt-6 space-y-4">
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

          <section className="rounded-3xl bg-zinc-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-black text-zinc-950">Category colors</h2>
                <p className="mt-1 text-sm font-semibold text-zinc-500">Choose how time-blocked goals appear in Calendar and Goals.</p>
              </div>
              <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-zinc-700 shadow-sm" onClick={resetCategoryColors} type="button">
                Reset category colors
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {GOAL_CATEGORIES.map((category) => {
                const key = categoryKey(category);
                return (
                  <label className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 font-bold text-zinc-700" key={category}>
                    <span>{category}</span>
                    <input
                      aria-label={`${category} color`}
                      className="h-10 w-14 cursor-pointer rounded-xl border border-zinc-200 bg-white p-1"
                      onChange={(event) => updateCategoryColor(key, event.target.value)}
                      type="color"
                      value={categoryColors[key]}
                    />
                  </label>
                );
              })}
            </div>
          </section>

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
