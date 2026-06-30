import { useAppContext } from "../context/AppContext.jsx";

const timezones = [
  { label: "Local browser time", value: "Local" },
  { label: "New York, Toronto, Montreal, Miami", value: "America/New_York" },
  { label: "Chicago, Dallas, Mexico City, Winnipeg", value: "America/Chicago" },
  { label: "Denver, Phoenix, Calgary, Edmonton", value: "America/Denver" },
  { label: "Los Angeles, Vancouver, Seattle, Tijuana", value: "America/Los_Angeles" },
  { label: "Anchorage, Fairbanks", value: "America/Anchorage" },
  { label: "Honolulu", value: "Pacific/Honolulu" },
  { label: "Halifax, Moncton", value: "America/Halifax" },
  { label: "St. John's", value: "America/St_Johns" },
  { label: "Regina, Saskatoon", value: "America/Regina" },
  { label: "Guatemala City, San Salvador, Managua", value: "America/Guatemala" },
  { label: "San Jose, Costa Rica", value: "America/Costa_Rica" },
  { label: "Panama City", value: "America/Panama" },
  { label: "Havana", value: "America/Havana" },
  { label: "Santo Domingo", value: "America/Santo_Domingo" },
  { label: "San Juan", value: "America/Puerto_Rico" },
  { label: "Kingston, Jamaica", value: "America/Jamaica" },
  { label: "Nassau", value: "America/Nassau" },
  { label: "UTC", value: "UTC" },
];

const alarmSounds = [
  { label: "Bamboo Bell", value: "bambooBell" },
  { label: "Panda Chime", value: "pandaChime" },
  { label: "Forest Bells", value: "forestBells" },
  { label: "Soft Gong", value: "softGong" },
  { label: "Tiny Sparkle", value: "tinySparkle" },
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
              <option key={timezone.value} value={timezone.value}>
                {timezone.label}
              </option>
            ))}
          </select>
        </label>

        <label className="rounded-3xl bg-white p-4 ring-1 ring-stone-200">
          <span className="block text-sm font-black text-stone-700">
            Alarm sound
          </span>
          <select
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-[#fff8ef] px-4 py-3 font-bold outline-none focus:border-stone-900"
            onChange={(event) =>
              updateSettings({ alarmSound: event.target.value })
            }
            value={settings.alarmSound || "bambooBell"}
          >
            {alarmSounds.map((sound) => (
              <option key={sound.value} value={sound.value}>
                {sound.label}
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
