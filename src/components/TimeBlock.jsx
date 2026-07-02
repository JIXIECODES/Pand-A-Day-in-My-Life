import React from "react";
import ScheduledGoalCard from "./ScheduledGoalCard.jsx";

function hourLabel(hour) {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export default function TimeBlock({ hour, scheduledGoals, onEdit }) {
  const start = hour * 60;
  const end = start + 60;
  const goals = scheduledGoals.filter((goal) => {
    const goalStart = timeToMinutes(goal.startTime);
    const goalEnd = timeToMinutes(goal.endTime);
    return goalStart < end && goalEnd > start;
  });

  return (
    <div className="grid gap-3 border-t border-white/80 py-3 sm:grid-cols-[6rem_1fr]">
      <div className="text-sm font-black text-zinc-500">{hourLabel(hour)}</div>
      <div className="min-h-20 rounded-2xl bg-white/60 p-2">
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
