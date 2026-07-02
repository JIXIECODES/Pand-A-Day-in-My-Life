export default function ProgressBar({ label, value, max = 100, tone = "emerald" }) {
  const percent = Math.min(100, Math.max(0, (value / Math.max(max, 1)) * 100));
  const color = {
    emerald: "bg-emerald-400",
    pink: "bg-pink-400",
    amber: "bg-amber-400",
    sky: "bg-sky-400",
  }[tone];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-black text-zinc-700">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/80">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
