const moodConfig = {
  happy: {
    face: "😊",
    title: "Panda is proud!",
    message: "Tiny wins count. You finished something today.",
    accent: "bg-emerald-100 text-emerald-800",
  },
  sleepy: {
    face: "😴",
    title: "Panda is resting",
    message: "Pick one gentle next step when you are ready.",
    accent: "bg-amber-100 text-amber-800",
  },
  strong: {
    face: "💪",
    title: "Panda power mode",
    message: "Focus time. One goal, one calm stretch.",
    accent: "bg-rose-100 text-rose-800",
  },
};

export default function PandaMascot({ mood = "sleepy" }) {
  const config = moodConfig[mood] || moodConfig.sleepy;

  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-stone-200">
      <div className="flex items-center gap-4">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full bg-stone-900 text-5xl shadow-inner">
          <span className="absolute -left-1 top-1 h-8 w-8 rounded-full bg-stone-900" />
          <span className="absolute -right-1 top-1 h-8 w-8 rounded-full bg-stone-900" />
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white">
            {config.face}
          </span>
        </div>
        <div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${config.accent}`}
          >
            {config.title}
          </span>
          <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">
            {config.message}
          </p>
        </div>
      </div>
    </section>
  );
}
