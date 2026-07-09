import React, { useState } from "react";
import HomeGoals from "../../goals/components/HomeGoals.jsx";
import Calendar from "../components/Calendar.jsx";
import DayPlannerModal from "../components/DayPlannerModal.jsx";

const planningTabs = [
  { id: "guide", label: "Guide" },
  { id: "calendar", label: "Calendar" },
  { id: "daily", label: "Daily" },
  { id: "longTerm", label: "Long-Term" },
];

const planningContext = {
  calendar: {
    eyebrow: "Calendar time blocks",
    title: "Click a date, then schedule a focused block.",
    description:
      "Calendar blocks are for goals with an exact day, start time, and end time. They stay separate from Daily and Long-Term goals.",
    accent: "bg-sky-50 text-sky-800",
    stat: "Time-based",
  },
  guide: {
    eyebrow: "Planning guide",
    title: "Pick the workflow that matches your goal.",
    description:
      "Use the guide when you are not sure whether something belongs as a quick daily goal, a longer growth goal, or a calendar block.",
    accent: "bg-pink-50 text-pink-800",
    stat: "Start here",
  },
  daily: {
    eyebrow: "Daily goals",
    title: "Capture the goals you want to finish soon.",
    description:
      "Daily goals are simple, flexible tasks that do not need a scheduled time. They are great for homework, practice, chores, or small wins.",
    accent: "bg-emerald-50 text-emerald-800",
    stat: "Quick wins",
  },
  longTerm: {
    eyebrow: "Long-term goals",
    title: "Track bigger goals that grow over time.",
    description:
      "Long-Term goals are for projects and habits that need steady progress, like building skills, reading more, or finishing a portfolio.",
    accent: "bg-amber-50 text-amber-800",
    stat: "Growth path",
  },
};

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

function CalendarIntroModal({ onClose, open }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-white/35 p-4 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <section
        aria-modal="true"
        className="animate-modal-in w-full max-w-xl rounded-[2rem] border border-white/80 bg-white/95 p-5 shadow-2xl shadow-zinc-200/70"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="grid gap-5 sm:grid-cols-[1fr_11rem] sm:items-center">
          <div>
            <p className="text-xs font-black uppercase text-pink-500">Calendar blocks</p>
            <h2 className="mt-1 text-2xl font-black text-zinc-950">Choose a date to plan your time.</h2>
            <p className="mt-2 text-sm font-semibold text-zinc-500">
              Click any calendar date to open the daily planner. From there, add a goal with a start time, end time,
              category, and difficulty.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-sky-50 p-3 text-center shadow-inner">
            <p className="text-xs font-black uppercase text-sky-600">Tap here</p>
            <div className="mx-auto mt-2 grid size-24 place-items-center rounded-2xl border-4 border-sky-300 bg-white shadow-lg shadow-sky-100">
              <span className="text-3xl font-black text-zinc-950">15</span>
            </div>
            <p className="mt-2 text-xs font-black text-sky-700">Then add a block</p>
          </div>
        </div>
        <div className="mt-5 rounded-3xl bg-amber-50 p-4 text-sm font-bold text-amber-900">
          Time blocks appear inside the date and on that day&apos;s schedule, so your panda can see when each goal belongs.
        </div>
        <button className="mt-5 w-full rounded-full bg-zinc-950 px-5 py-3 font-black text-white" onClick={onClose} type="button">
          Understand
        </button>
      </section>
    </div>
  );
}

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState("guide");
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [calendarIntroOpen, setCalendarIntroOpen] = useState(false);
  const activeContext = planningContext[activeTab] || planningContext.guide;

  function selectTab(tabId) {
    setActiveTab(tabId);
    if (tabId === "calendar") setCalendarIntroOpen(true);
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6">
      <section className="rounded-[2rem] bg-white/70 p-6 shadow-xl shadow-zinc-200/60 backdrop-blur">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)] lg:items-start">
          <div>
            <p className="text-sm font-black text-pink-500">Planning</p>
            <h1 className="mt-1 text-4xl font-black text-zinc-950">Plan goals and calendar time blocks.</h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold text-zinc-500">
              Choose a category below. The guide, goals, and calendar blocks stay organized in their own spaces.
            </p>
            <div className="mt-5 flex w-full flex-wrap gap-2 rounded-[1.5rem] bg-zinc-100 p-1 sm:inline-flex sm:w-auto sm:rounded-full">
              {planningTabs.map((tab) => (
                <button
                  aria-pressed={activeTab === tab.id}
                  className={[
                    "rounded-full px-5 py-2 text-sm font-black transition",
                    activeTab === tab.id ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-600 hover:bg-white",
                  ].join(" ")}
                  key={tab.id}
                  onClick={() => selectTab(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <aside className={`rounded-[1.5rem] p-4 ${activeContext.accent}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase opacity-70">{activeContext.eyebrow}</p>
                <h2 className="mt-1 text-xl font-black">{activeContext.title}</h2>
              </div>
              <span className="shrink-0 rounded-full bg-white/75 px-3 py-1 text-xs font-black">{activeContext.stat}</span>
            </div>
            <p className="mt-3 text-sm font-semibold opacity-85">{activeContext.description}</p>
          </aside>
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
      <CalendarIntroModal open={calendarIntroOpen} onClose={() => setCalendarIntroOpen(false)} />
    </main>
  );
}
