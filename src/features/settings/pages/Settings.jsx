import React from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { categoryKey, GOAL_CATEGORIES } from "../../../shared/utils/storage.js";
import { getTimeZoneLabel, TIME_ZONE_GROUPS } from "../../../shared/utils/timeZone.js";

const listedTimeZones = new Set(
  TIME_ZONE_GROUPS.flatMap((group) => group.options.map((option) => option.value)),
);

export default function Settings() {
  const {
    authSession,
    categoryColors,
    logout,
    resetAppData,
    resetCategoryColors,
    settings,
    syncStatus,
    updateCategoryColor,
    updateSettings,
  } = useAppContext();
  const currentTimeZoneIsListed = listedTimeZones.has(settings.timezone);

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
                : `Signed in as ${authSession?.user?.name || "your panda account"}. Your progress syncs through your account.`}
            </p>
            <p className="mt-2 text-xs font-black text-emerald-700" role="status">
              {authSession?.isGuest
                ? "Saved on this device only"
                : syncStatus === "saving"
                  ? "Saving..."
                  : syncStatus === "offline"
                    ? "Saved locally; cloud sync will retry"
                    : "Saved to your account"}
            </p>
            <button className="mt-4 rounded-full bg-emerald-500 px-5 py-3 font-black text-white" onClick={logout} type="button">
              {authSession?.isGuest ? "Exit guest mode" : "Log out"}
            </button>
          </div>

          <label className="block rounded-3xl bg-zinc-50 p-4" htmlFor="time-zone-setting">
            <span className="text-sm font-black text-zinc-700">Time zone</span>
            <span className="mt-1 block text-xs font-bold text-zinc-500">
              Calendar dates and Daily Schedule times use this location. Daylight-saving changes are handled automatically.
            </span>
            <select
              className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-bold outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
              id="time-zone-setting"
              onChange={(event) => updateSettings({ timezone: event.target.value })}
              value={settings.timezone}
            >
              {!currentTimeZoneIsListed && (
                <option value={settings.timezone}>{getTimeZoneLabel(settings.timezone)}</option>
              )}
              {TIME_ZONE_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <span className="mt-2 block text-xs font-black text-emerald-700" aria-live="polite">
              Times shown in {getTimeZoneLabel(settings.timezone)}
            </span>
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
            <h2 className="font-black text-rose-900">Reset panda data</h2>
            <p className="mt-1 text-sm font-semibold text-rose-700">This clears goals, journal memories, panda stats, rewards, and settings for the current guest or account.</p>
            <button
              className="mt-4 rounded-full bg-rose-500 px-5 py-3 font-black text-white"
              onClick={() => {
                if (window.confirm("Reset all panda data for this profile?")) resetAppData();
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
