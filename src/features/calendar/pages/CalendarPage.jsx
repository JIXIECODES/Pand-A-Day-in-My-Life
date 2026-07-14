import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import HomeGoals from "../../goals/components/HomeGoals.jsx";
import Calendar from "../components/Calendar.jsx";
import DaySchedule from "../components/DaySchedule.jsx";
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
      "Calendar blocks are scheduled goals with an exact date, start time, and end time. They stay separate from Daily and Long-Term goals.",
    accent: "bg-sky-50 text-sky-800",
    stat: "Time-based",
  },
  guide: {
    eyebrow: "Planning guide",
    title: "Pick the workflow that matches your goal.",
    description:
      "Choose daily goals for quick tasks you want to finish soon, long-term goals for bigger progress that grows over time, or calendar blocks when you need an exact date and time.",
    accent: "bg-pink-50 text-pink-800",
    stat: "Start here",
  },
  daily: {
    eyebrow: "Daily goals",
    title: "Capture the goals you want to finish soon.",
    description:
      "Daily goals are quick goals and tasks you want to finish soon, like homework, practice, chores, or small wins.",
    accent: "bg-emerald-50 text-emerald-800",
    stat: "Quick wins",
  },
  longTerm: {
    eyebrow: "Long-term goals",
    title: "Track bigger goals that grow over time.",
    description:
      "Long-term goals are bigger progress goals that grow over time, like building skills, reading more, or finishing a portfolio.",
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

const CALENDAR_HELP_STORAGE_KEY = "panda-day-hide-calendar-help";

function CalendarHelpPopover({ onClose, onDisable, open }) {
  if (!open) return null;

  return (
    <section
      aria-labelledby="calendar-help-title"
      aria-live="polite"
      className="animate-modal-in pointer-events-auto absolute left-1/2 top-2 z-20 max-w-[min(calc(100%-1rem),20rem)] -translate-x-1/2 rounded-[1.75rem] border border-sky-100 bg-white/95 p-4 shadow-2xl shadow-sky-100/80 sm:left-auto sm:right-6 sm:max-w-md sm:translate-x-0"
      role="dialog"
    >
      <div className="absolute -bottom-3 left-1/2 size-6 -translate-x-1/2 rotate-45 border-b border-r border-sky-100 bg-white/95 sm:left-12 sm:translate-x-0" />
      <div className="relative">
        <div className="flex items-start gap-3">
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl border-4 border-sky-200 bg-sky-50 shadow-inner">
            <span className="text-xl font-black text-sky-800">15</span>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-pink-500">Calendar date says</p>
            <h2 className="mt-1 text-lg font-black text-zinc-950" id="calendar-help-title">
              Tap a date to make a time block.
            </h2>
            <p className="mt-1 text-sm font-semibold text-zinc-500">
              Calendar blocks are scheduled goals with an exact date, start time, and end time.
            </p>
          </div>
        </div>
        <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-900">
          Click a day in the calendar grid, then add the goal details in the daily planner.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-black text-white" onClick={onClose} type="button">
            Understand
          </button>
          <button className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-black text-zinc-700" onClick={onDisable} type="button">
            Don&apos;t remind me
          </button>
        </div>
      </div>
    </section>
  );
}

export default function CalendarPage() {
  const { planningTab, selectedDate, setPlanningTab } = useAppContext();
  const activeTab = planningTabs.some((tab) => tab.id === planningTab) ? planningTab : "guide";
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [calendarHelpOpen, setCalendarHelpOpen] = useState(false);
  const [hideCalendarHelp, setHideCalendarHelp] = useState(
    () => localStorage.getItem(CALENDAR_HELP_STORAGE_KEY) === "true",
  );
  const activeContext = planningContext[activeTab] || planningContext.guide;

  useEffect(() => {
    if (activeTab === "calendar" && !hideCalendarHelp) {
      setCalendarHelpOpen(true);
    } else {
      setCalendarHelpOpen(false);
    }
  }, [activeTab, hideCalendarHelp]);

  function selectTab(tabId) {
    setPlanningTab(tabId);
    window.history.replaceState(
      { activePage: "calendar", planningTab: tabId },
      "",
      `#planning?tab=${tabId}`,
    );
  }

  function closeCalendarHelp() {
    setCalendarHelpOpen(false);
  }

  function disableCalendarHelp() {
    localStorage.setItem(CALENDAR_HELP_STORAGE_KEY, "true");
    setHideCalendarHelp(true);
    setCalendarHelpOpen(false);
  }

  return (
    <main className="planning-shell mx-auto flex max-w-7xl flex-col gap-4 overflow-hidden px-4 py-4 sm:px-6">
      <section className="shrink-0 rounded-[2rem] bg-white/70 p-4 shadow-xl shadow-zinc-200/60 backdrop-blur sm:p-5">
        <p className="text-sm font-black text-pink-500">Planning</p>
        <div className="mt-1 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-black text-zinc-950 sm:text-4xl">Plan goals and calendar time blocks.</h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold text-zinc-500">
              Choose a category below. The guide, goals, and calendar blocks stay organized in their own spaces.
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-2 rounded-[1.5rem] bg-zinc-100 p-1 sm:inline-flex sm:w-auto sm:shrink-0 sm:rounded-full">
            {planningTabs.map((tab) => (
              <button
                aria-pressed={activeTab === tab.id}
                className={[
                  "rounded-full px-5 py-2 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-pink-200 active:scale-[0.98]",
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
      </section>

      <section className="grid min-h-0 flex-1 gap-4 overflow-hidden lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <div className="min-h-0 min-w-0 overflow-y-auto pr-1">
          {activeTab === "guide" && <GoalTypeInfoCard />}

          {activeTab === "daily" && <HomeGoals kind="daily" />}

          {activeTab === "longTerm" && <HomeGoals kind="longTerm" />}

          {activeTab === "calendar" && (
            <Calendar
              calendarHelp={
                <CalendarHelpPopover
                  onClose={closeCalendarHelp}
                  onDisable={disableCalendarHelp}
                  open={calendarHelpOpen}
                />
              }
              className="h-full"
              onOpenDay={() => setPlannerOpen(true)}
            />
          )}
        </div>

        <aside className="min-h-0 min-w-0 overflow-y-auto">
          <div className={`rounded-[1.5rem] p-4 ${activeContext.accent}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase opacity-70">{activeContext.eyebrow}</p>
                <h2 className="mt-1 text-xl font-black">{activeContext.title}</h2>
              </div>
              <span className="shrink-0 rounded-full bg-white/75 px-3 py-1 text-xs font-black">{activeContext.stat}</span>
            </div>
            <p className="mt-3 text-sm font-semibold opacity-85">{activeContext.description}</p>
          </div>

          {activeTab === "calendar" && (
            <DaySchedule
              className="mt-4"
              date={selectedDate}
              onEditGoal={() => setPlannerOpen(true)}
              showForm={false}
            />
          )}
        </aside>
      </section>

      <DayPlannerModal open={plannerOpen} onClose={() => setPlannerOpen(false)} />
    </main>
  );
}
