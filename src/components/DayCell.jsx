import dayjs from "dayjs";
import { formatDate, isSameMonth, isToday } from "../utils/dateUtils.js";

export default function DayCell({ day, currentMonth, goals = [], onSelect }) {
  const dateKey = formatDate(day);
  const completed = goals.filter((goal) => goal.completed).length;
  const isMuted = !isSameMonth(day, currentMonth);
  const hasGoals = goals.length > 0;

  return (
    <button
      className={`min-h-28 rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
        isToday(day)
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-white text-stone-800"
      } ${isMuted ? "opacity-45" : ""}`}
      onClick={() => onSelect(dateKey)}
      type="button"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f6e6d8] text-sm font-black text-stone-900">
          {dayjs(day).date()}
        </span>
        {hasGoals && (
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-800">
            {completed}/{goals.length}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1">
        {goals.slice(0, 2).map((goal) => (
          <p
            className={`truncate rounded-full px-2 py-1 text-xs font-bold ${
              goal.completed
                ? "bg-emerald-100 text-emerald-800 line-through"
                : "bg-rose-100 text-rose-800"
            }`}
            key={goal.id}
          >
            {goal.title}
          </p>
        ))}
        {goals.length > 2 && (
          <p className="text-xs font-bold text-stone-400">
            +{goals.length - 2} more
          </p>
        )}
      </div>
    </button>
  );
}
