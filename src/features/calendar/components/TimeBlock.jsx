import React from "react";
import ScheduledGoalCard from "./ScheduledGoalCard.jsx";

function hourLabel(hour) {
  const start = new Date();
  const end = new Date();
  start.setHours(hour, 0, 0, 0);
  end.setHours((hour + 1) % 24, 0, 0, 0);
  return `${start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export default function TimeBlock({ currentTime = null, hour, scheduledGoals, onEdit }) {
  const start = hour * 60;
  const end = start + 60;
  const goals = scheduledGoals.filter((goal) => {
    const goalStart = timeToMinutes(goal.startTime);
    const goalEnd = timeToMinutes(goal.endTime);
    return goalStart < end && goalEnd > start;
  });

  return (
    <div
      aria-current={currentTime ? "time" : undefined}
      className={[
        "relative grid gap-3 border-t border-white/80 px-1 py-3 transition-colors sm:grid-cols-[6rem_1fr]",
        currentTime ? "rounded-xl bg-pink-50/75 ring-1 ring-inset ring-pink-100" : "",
      ].join(" ")}
      data-schedule-hour={hour}
    >
      {currentTime && (
        <>
          <span aria-live="polite" className="sr-only" role="status">{currentTime.ariaLabel}</span>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-1 z-20 flex -translate-y-1/2 items-center"
            style={{ top: `${currentTime.minutePercent}%` }}
          >
            <span className="size-2.5 shrink-0 rounded-full bg-pink-600 ring-4 ring-pink-100" />
            <span className="ml-1 shrink-0 rounded-full bg-pink-600 px-2 py-0.5 text-[0.65rem] font-black text-white shadow-sm">
              {currentTime.label}
            </span>
            <span className="ml-1 h-0.5 flex-1 bg-pink-500/85" />
          </div>
        </>
      )}

      <div className={`text-sm font-black ${currentTime ? "text-pink-700" : "text-zinc-500"}`}>{hourLabel(hour)}</div>
      <div className={`min-h-20 rounded-2xl p-2 ${currentTime ? "bg-white/85" : "bg-white/60"}`}>
        {goals.length > 0 ? (
          <div className="grid gap-2">
            {goals.map((goal) => (
              <ScheduledGoalCard goal={goal} key={`${goal.id}-${hour}`} onEdit={onEdit} />
            ))}
          </div>
        ) : (
          <div className="grid h-full min-h-16 place-items-center rounded-xl border border-dashed border-zinc-200 text-xs font-bold text-zinc-400">
            Open focus space
          </div>
        )}
      </div>
    </div>
  );
}
