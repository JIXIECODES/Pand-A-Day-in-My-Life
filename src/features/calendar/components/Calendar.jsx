import dayjs from "dayjs";
import React from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import { getZonedDateKey } from "../../../shared/utils/timeZone.js";
import { getMonthDays, weekdayLabels } from "../utils/dateUtils.js";
import DayCell from "./DayCell.jsx";

export default function Calendar({ calendarHelp, className = "", onOpenDay }) {
  const { currentMonth, goalsByDate, scheduledGoals, setCurrentMonth, setSelectedDate, settings } = useAppContext();
  const days = getMonthDays(currentMonth);
  const todayDateKey = getZonedDateKey(new Date(), settings.timezone);

  function openDay(dateKey) {
    setSelectedDate(dateKey);
    onOpenDay();
  }

  function goToToday() {
    setCurrentMonth(dayjs(todayDateKey));
    setSelectedDate(todayDateKey);
  }

  return (
    <section data-calendar-card className={`rounded-[2rem] border border-white/80 bg-white/60 p-3 shadow-xl shadow-zinc-200/60 backdrop-blur sm:p-4 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-pink-500">Monthly care map</p>
          <h1 className="text-2xl font-black text-zinc-950 sm:text-3xl">{currentMonth.format("MMMM YYYY")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full bg-white px-4 py-2 font-black shadow-sm" onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))} type="button">
            Prev
          </button>
          <button className="rounded-full bg-zinc-950 px-4 py-2 font-black text-white shadow-sm" onClick={goToToday} type="button">
            Today
          </button>
          <button className="rounded-full bg-white px-4 py-2 font-black shadow-sm" onClick={() => setCurrentMonth(currentMonth.add(1, "month"))} type="button">
            Next
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-xs font-black uppercase text-zinc-400">
        {weekdayLabels().map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>
      <div className="relative mt-2">
        {calendarHelp}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {days.map((day) => {
            const key = day.format("YYYY-MM-DD");
            return (
              <DayCell
                day={day}
                goals={goalsByDate[key] || []}
                isCurrentMonth={day.isSame(currentMonth, "month")}
                key={key}
                onSelect={openDay}
                scheduledGoals={scheduledGoals.filter((goal) => goal.date === key)}
                todayDateKey={todayDateKey}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
