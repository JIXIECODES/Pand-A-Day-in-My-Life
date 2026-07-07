import React from "react";

function rewardLabel(reward = {}) {
  const parts = [];
  if (reward.xp) parts.push(`+${reward.xp} XP`);
  if (reward.happiness) parts.push(`+${reward.happiness} Happiness`);
  if (reward.energy) parts.push(`+${reward.energy} Energy`);
  return parts.length > 0 ? parts.join(", ") : "Cozy progress";
}

export default function DailyTasks({ dailyTasks }) {
  const tasks = dailyTasks?.tasks || [];

  return (
    <section className="rounded-[2rem] bg-white/80 p-5 shadow-xl shadow-zinc-200/60">
      <div className="mb-4">
        <p className="text-xs font-black uppercase text-pink-500">Daily Tasks</p>
        <h2 className="text-2xl font-black text-zinc-950">Today's Panda Tasks</h2>
        <p className="mt-1 text-sm font-semibold text-zinc-500">
          Small missions refresh each day and reward your panda once when completed.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {tasks.map((task) => (
          <article
            className={`rounded-3xl border p-4 ${
              task.completed
                ? "border-emerald-100 bg-emerald-50"
                : "border-zinc-100 bg-zinc-50"
            }`}
            key={task.id}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 grid size-6 shrink-0 place-items-center rounded-full text-sm font-black ${
                  task.completed ? "bg-emerald-400 text-emerald-950" : "bg-white text-zinc-400"
                }`}
              >
                {task.completed ? "✓" : ""}
              </span>
              <div className="min-w-0">
                <h3 className="font-black text-zinc-950">{task.title}</h3>
                <p className="mt-1 text-sm font-semibold text-zinc-600">{task.description}</p>
                <p className={`mt-3 text-xs font-black uppercase ${task.completed ? "text-emerald-700" : "text-pink-500"}`}>
                  {task.completed ? "Completed!" : `Reward: ${rewardLabel(task.reward)}`}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
