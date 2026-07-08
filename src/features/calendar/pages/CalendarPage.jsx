import React, { useState } from "react";
import HomeGoals from "../../goals/components/HomeGoals.jsx";
import Calendar from "../components/Calendar.jsx";
import DayPlannerModal from "../components/DayPlannerModal.jsx";

function GoalTypeInfoCard() {
  return (
    <section className="h-full rounded-[2rem] bg-white/80 p-5 shadow-xl shadow-zinc-200/60">
      <p className="text-xs font-black uppercase text-pink-500">Planning guide</p>
      <h2 className="mt-1 text-2xl font-black text-zinc-950">Choose the right kind of goal</h2>
      <div className="mt-4 grid gap-3">
        <article className="rounded-3xl bg-emerald-50 p-4">
          <h3 className="font-black text-emerald-950">Daily Goals</h3>
          <p className="mt-1 text-sm font-semibold text-emerald-800">
            Simple goals you want to complete soon, like finishing homework, practicing, or cleaning your desk.
          </p>
        </article>
        <article className="rounded-3xl bg-pink-50 p-4">
          <h3 className="font-black text-pink-950">Long-Term Goals</h3>
          <p className="mt-1 text-sm font-semibold text-pink-800">
            Bigger goals that help you grow over time, like improving at coding, building a portfolio, or reading more.
          </p>
        </article>
        <article className="rounded-3xl bg-sky-50 p-4">
          <h3 className="font-black text-sky-950">Calendar Time Blocks</h3>
          <p className="mt-1 text-sm font-semibold text-sky-800">
            Scheduled goals with an exact date, start time, and end time, like studying from 1:00 PM to 3:00 PM.
          </p>
        </article>
      </div>
    </section>
  );
}

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState("guide");
  const [plannerOpen, setPlannerOpen] = useState(false);
  const tabs = [
    { id: "guide", label: "Guide" },
    { id: "daily", label: "Daily" },
    { id: "longTerm", label: "Long-Term" },
    { id: "calendar", label: "Calendar" },
  ];

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6">
      <section className="rounded-[2rem] bg-white/70 p-6 shadow-xl shadow-zinc-200/60 backdrop-blur">
        <p className="text-sm font-black text-pink-500">Planning</p>
        <h1 className="mt-1 text-4xl font-black text-zinc-950">Plan goals and calendar time blocks.</h1>
        <p className="mt-2 max-w-3xl text-sm font-semibold text-zinc-500">
          Use the Guide to choose a workflow, then manage Daily Goals, Long-Term Goals, or exact Calendar time blocks in their own tabs.
        </p>
        <div className="mt-5 flex w-full flex-wrap gap-2 rounded-[1.5rem] bg-zinc-100 p-1 sm:inline-flex sm:w-auto sm:rounded-full">
          {tabs.map((tab) => (
            <button
              className={[
                "rounded-full px-5 py-2 text-sm font-black transition",
                activeTab === tab.id ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-600 hover:bg-white",
              ].join(" ")}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "guide" && <GoalTypeInfoCard />}

      {activeTab === "daily" && <HomeGoals kind="daily" />}

      {activeTab === "longTerm" && <HomeGoals kind="longTerm" />}

      {activeTab === "calendar" && (
        <>
          <Calendar onOpenDay={() => setPlannerOpen(true)} />
          <section className="rounded-[2rem] bg-white/70 p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-pink-500">Calendar time blocks</p>
            <h2 className="mt-1 text-xl font-black text-zinc-950">
              Click a date to schedule goals with exact start and end times.
            </h2>
          </section>
          <DayPlannerModal open={plannerOpen} onClose={() => setPlannerOpen(false)} />
        </>
      )}
    </main>
  );
}
