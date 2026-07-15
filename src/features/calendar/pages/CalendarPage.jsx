import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import HomeGoals, { GoalComposer } from "../../goals/components/HomeGoals.jsx";
import Calendar from "../components/Calendar.jsx";
import DaySchedule from "../components/DaySchedule.jsx";
import DayPlannerModal from "../components/DayPlannerModal.jsx";

const planningTabs = [
  { id: "calendar", label: "Calendar" },
  { id: "daily", label: "Daily" },
  { id: "longTerm", label: "Long-Term" },
];

const planningContext = {
  calendar: {
    eyebrow: "Calendar time blocks",
    title: "Click a date, then schedule a focused block.",
    description:
      "Calendar blocks are scheduled goals with an exact date, start time, end time, and goal type. They also appear in Daily or Long-Term.",
    accent: "bg-sky-50 text-sky-800",
    stat: "Time-based",
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
  const activeTab = planningTabs.some((tab) => tab.id === planningTab) ? planningTab : "calendar";
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [calendarHelpOpen, setCalendarHelpOpen] = useState(false);
  const [hideCalendarHelp, setHideCalendarHelp] = useState(
    () => localStorage.getItem(CALENDAR_HELP_STORAGE_KEY) === "true",
  );
  const activeContext = planningContext[activeTab] || planningContext.calendar;

  useEffect(() => {
    if (planningTab === activeTab) return;

    setPlanningTab(activeTab);
    window.history.replaceState(
      { activePage: "calendar", planningTab: activeTab },
      "",
      `#planning?tab=${activeTab}`,
    );
  }, [activeTab, planningTab, setPlanningTab]);

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

  const mainClass = activeTab === "calendar"
    ? "mx-auto flex h-[calc(100vh-5.5rem)] h-[calc(100dvh-5.5rem)] max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6"
    : "mx-auto flex min-h-[calc(100vh-5.5rem)] min-h-[calc(100dvh-5.5rem)] max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6";
  const contentGridClass = activeTab === "calendar"
    ? "grid min-h-0 gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(18rem,3fr)]"
    : "grid min-h-0 items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]";
  const contentOverflowClass = activeTab === "calendar" ? "overflow-hidden" : "overflow-visible";
  const asideClass = activeTab === "calendar" ? "flex min-h-0 min-w-0 flex-col overflow-hidden" : "min-h-0 min-w-0";

  return (
    <main className={mainClass}>
      <section className="shrink-0 rounded-[2rem] bg-white/70 p-4 shadow-xl shadow-zinc-200/60 backdrop-blur sm:p-5">
        <p className="text-sm font-black text-pink-500">Calendar and Goals</p>
        <div className="mt-1 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-black text-zinc-950 sm:text-4xl">Calendar and Goals</h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold text-zinc-500">
              Use the calendar, daily goals, and long-term goals to keep your panda days organized.
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

      <section className={`${contentGridClass} flex-1 ${contentOverflowClass}`}>
        <div className="min-h-0 min-w-0 lg:overflow-hidden">
          {activeTab === "daily" && <HomeGoals kind="daily" showComposer={false} />}

          {activeTab === "longTerm" && <HomeGoals kind="longTerm" showComposer={false} />}

          {activeTab === "calendar" && (
            <Calendar
              calendarHelp={
                <CalendarHelpPopover
                  onClose={closeCalendarHelp}
                  onDisable={disableCalendarHelp}
                  open={calendarHelpOpen}
                />
              }
              onOpenDay={() => setPlannerOpen(true)}
            />
          )}
        </div>

        <aside className={asideClass}>
          {activeTab !== "calendar" && (
            <div className="grid gap-4">
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
              <GoalComposer kind={activeTab === "longTerm" ? "longTerm" : "daily"} />
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
              <div className="shrink-0">
                <button
                  className="w-full rounded-full bg-zinc-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                  onClick={() => setPlannerOpen(true)}
                  type="button"
                >
                  Add or Edit Time Block
                </button>
              </div>
              <DaySchedule
                className="min-h-0 flex-1 overflow-hidden"
                date={selectedDate}
                onEditGoal={() => setPlannerOpen(true)}
                showForm={false}
              />
            </div>
          )}
        </aside>
      </section>

      <DayPlannerModal open={plannerOpen} onClose={() => setPlannerOpen(false)} />
    </main>
  );
}
