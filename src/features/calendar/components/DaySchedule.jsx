import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import GoalBlockForm from "./GoalBlockForm.jsx";
import TimeBlock from "./TimeBlock.jsx";

const hours = Array.from({ length: 24 }, (_, index) => index);

export default function DaySchedule({ className = "", date, onEditGoal, showForm = true }) {
  const { scheduledGoals, selectedDate } = useAppContext();
  const [localEditingGoal, setLocalEditingGoal] = useState(null);
  const activeDate = date || selectedDate;
  const editingGoal = showForm ? localEditingGoal : null;
  const handleEditGoal = onEditGoal || setLocalEditingGoal;
  const dayGoals = useMemo(
    () =>
      scheduledGoals
        .filter((goal) => goal.date === activeDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [scheduledGoals, activeDate],
  );

  const layoutClass = showForm ? "grid gap-5 lg:grid-cols-[20rem_1fr]" : "flex min-h-0 flex-col";
  const cardClass = showForm
    ? "rounded-[2rem] bg-white/70 p-5 shadow-xl shadow-zinc-200/60 backdrop-blur"
    : "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] bg-white/70 p-5 shadow-xl shadow-zinc-200/60 backdrop-blur";
  const scheduleListClass = showForm ? "mt-5" : "mt-5 min-h-0 flex-1 overflow-y-auto pr-1";

  return (
    <section className={`${layoutClass} ${className}`}>
      {showForm && <GoalBlockForm date={activeDate} editingGoal={editingGoal} onDone={() => setLocalEditingGoal(null)} />}

      <div className={cardClass}>
        <div className="shrink-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-pink-500">Daily schedule</p>
              <h2 className="text-2xl font-black text-zinc-950">{dayjs(activeDate).format("dddd, MMMM D")}</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">
              {dayGoals.length} scheduled
            </span>
          </div>
        </div>

        <div className={scheduleListClass}>
          {hours.map((hour) => (
            <TimeBlock hour={hour} key={hour} onEdit={handleEditGoal} scheduledGoals={dayGoals} />
          ))}
        </div>
      </div>
    </section>
  );
}
