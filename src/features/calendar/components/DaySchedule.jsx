import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import GoalBlockForm from "./GoalBlockForm.jsx";
import TimeBlock from "./TimeBlock.jsx";

const hours = Array.from({ length: 16 }, (_, index) => index + 6);

export default function DaySchedule() {
  const { scheduledGoals, selectedDate } = useAppContext();
  const [editingGoal, setEditingGoal] = useState(null);
  const dayGoals = useMemo(
    () =>
      scheduledGoals
        .filter((goal) => goal.date === selectedDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [scheduledGoals, selectedDate],
  );

  return (
    <section className="grid gap-5 lg:grid-cols-[20rem_1fr]">
      <GoalBlockForm date={selectedDate} editingGoal={editingGoal} onDone={() => setEditingGoal(null)} />

      <div className="rounded-[2rem] bg-white/70 p-5 shadow-xl shadow-zinc-200/60 backdrop-blur">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-pink-500">Daily schedule</p>
            <h2 className="text-2xl font-black text-zinc-950">{dayjs(selectedDate).format("dddd, MMMM D")}</h2>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">
            {dayGoals.length} scheduled
          </span>
        </div>

        <div className="mt-5">
          {hours.map((hour) => (
            <TimeBlock hour={hour} key={hour} onEdit={setEditingGoal} scheduledGoals={dayGoals} />
          ))}
        </div>
      </div>
    </section>
  );
}
