import { useAppContext } from "../context/AppContext.jsx";

const timezones = [
  "Local",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "UTC",
];

export default function Settings() {
  const { settings, updateSettings } = useAppContext();

  return (
    <section className="rounded-[2rem] bg-[#fffdf9] p-5 shadow-sm ring-1 ring-stone-200 sm:p-6">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-rose-500">
          Preferences
        </p>
        <h1 className="text-3xl font-black text-stone-900">Settings</h1>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="rounded-3xl bg-white p-4 ring-1 ring-stone-200">
          <span className="block text-sm font-black text-stone-700">
            Timezone override
          </span>
          <select
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-[#fff8ef] px-4 py-3 font-bold outline-none focus:border-stone-900"
            onChange={(event) =>
              updateSettings({ timezone: event.target.value })
            }
            value={settings.timezone}
          >
            {timezones.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center justify-between gap-4 rounded-3xl bg-white p-4 ring-1 ring-stone-200">
          <span>
            <span className="block text-sm font-black text-stone-700">
              Sound
            </span>
            <span className="text-sm font-semibold text-stone-500">
              Save your preference for gentle timer sounds.
            </span>
          </span>
          <input
            checked={settings.soundEnabled}
            className="h-6 w-6 accent-emerald-600"
            onChange={(event) =>
              updateSettings({ soundEnabled: event.target.checked })
            }
            type="checkbox"
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-3xl bg-white p-4 ring-1 ring-stone-200">
          <span>
            <span className="block text-sm font-black text-stone-700">
              Notifications
            </span>
            <span className="text-sm font-semibold text-stone-500">
              Keep a local preference for focus reminders.
            </span>
          </span>
          <input
            checked={settings.notificationsEnabled}
            className="h-6 w-6 accent-emerald-600"
            onChange={(event) =>
              updateSettings({ notificationsEnabled: event.target.checked })
            }
            type="checkbox"
          />
        </label>
      </div>
    </section>
  );
}
