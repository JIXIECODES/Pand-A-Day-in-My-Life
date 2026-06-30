import { useState } from "react";
import dayjs from "dayjs";
import DayCell from "./DayCell.jsx";
import { getMonthDays, getWeekdayLabels } from "../utils/dateUtils.js";
import { useAppContext } from "../context/AppContext.jsx";

export default function Calendar({ onOpenDay }) {
  const { goalsByDate, setSelectedDate } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const days = getMonthDays(currentMonth);

  const selectDate = (dateKey) => {
    setSelectedDate(dateKey);
    onOpenDay();
  };

  return (
    <section className="rounded-[2rem] bg-[#fffdf9] p-4 shadow-sm ring-1 ring-stone-200 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-stone-900">
            {currentMonth.format("MMMM YYYY")}
          </h1>
          <p className="text-sm font-semibold text-stone-500">
            Plan one manageable panda step at a time.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-full bg-white px-4 py-2 text-sm font-black text-stone-700 shadow-sm ring-1 ring-stone-200 hover:bg-emerald-50"
            onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
            type="button"
          >
            ←
          </button>
          <button
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-black text-white shadow-sm"
            onClick={() => setCurrentMonth(dayjs())}
            type="button"
          >
            Today
          </button>
          <button
            className="rounded-full bg-white px-4 py-2 text-sm font-black text-stone-700 shadow-sm ring-1 ring-stone-200 hover:bg-emerald-50"
            onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
            type="button"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 pb-2">
        {getWeekdayLabels().map((label) => (
          <div
            className="px-2 text-center text-xs font-black uppercase tracking-wide text-stone-400"
            key={label}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-7">
        {days.map((day) => {
          const key = day.format("YYYY-MM-DD");
          return (
            <DayCell
              currentMonth={currentMonth}
              day={day}
              goals={goalsByDate[key] || []}
              key={key}
              onSelect={selectDate}
            />
          );
        })}
      </div>
    </section>
  );
}
