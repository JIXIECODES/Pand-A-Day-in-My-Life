import React, { useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { todayKey } from "../utils/dateUtils.js";
import GoalBlockForm from "./GoalBlockForm.jsx";
import GoalItem from "./GoalItem.jsx";
import ScheduledGoalCard from "./ScheduledGoalCard.jsx";

export default function HomeGoals({ onAddGoal }) {
  const { goalsByDate, scheduledGoals, setSelectedDate } = useAppContext();
  const [editingScheduledGoal, setEditingScheduledGoal] = useState(null);
  const today = todayKey();
  const todaysGoals = goalsByDate[today] || [];
  const todaysScheduledGoals = scheduledGoals
    .filter((goal) => goal.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  function addGoal() {
    setSelectedDate(today);
    onAddGoal();
  }

  return (
    <section className="rounded-[2rem] bg-white/75 p-5 shadow-xl shadow-zinc-200/60">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-pink-500">Today</p>
          <h2 className="text-2xl font-black text-zinc-950">Goals for this fresh bamboo day</h2>
        </div>
        <button className="rounded-full bg-zinc-950 px-4 py-2 font-black text-white" onClick={addGoal} type="button">
          Add
        </button>
      </div>
      <div className="space-y-3">
        {todaysGoals.length > 0 ? (
          todaysGoals.map((goal) => <GoalItem date={today} goal={goal} key={goal.id} />)
        ) : (
          <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">No pressure. Add one tiny goal when you are ready.</p>
        )}
      </div>

      <div className="mt-5 border-t border-white/80 pt-5">
        <div className="mb-3">
          <p className="text-xs font-black uppercase text-sky-500">Scheduled today</p>
          <h3 className="text-lg font-black text-zinc-950">Time-blocked goals</h3>
        </div>
        {editingScheduledGoal && (
          <div className="mb-3">
            <GoalBlockForm date={today} editingGoal={editingScheduledGoal} onDone={() => setEditingScheduledGoal(null)} />
          </div>
        )}
        <div className="grid gap-3">
          {todaysScheduledGoals.length > 0 ? (
            todaysScheduledGoals.map((goal) => (
              <ScheduledGoalCard goal={goal} key={goal.id} onEdit={setEditingScheduledGoal} />
            ))
          ) : (
            <p className="rounded-2xl bg-sky-50 p-4 text-sm font-bold text-sky-800">No time blocks today. Add one on the Calendar page.</p>
          )}
        </div>
      </div>
    </section>
  );
}
