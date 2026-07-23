import dayjs from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import {
  formatZonedTime,
  getTimeZoneCity,
  getTimeZoneLabel,
  getZonedDateParts,
} from "../../../shared/utils/timeZone.js";
import GoalBlockForm from "./GoalBlockForm.jsx";
import TimeBlock from "./TimeBlock.jsx";

const hours = Array.from({ length: 24 }, (_, index) => index);
const CURRENT_TIME_UPDATE_MS = 60_000;

export default function DaySchedule({ className = "", date, onEditGoal, showForm = true, style }) {
  const { scheduledGoals, selectedDate, settings } = useAppContext();
  const [localEditingGoal, setLocalEditingGoal] = useState(null);
  const [now, setNow] = useState(() => new Date());
  const scheduleListRef = useRef(null);
  const lastAutoScrollKeyRef = useRef("");
  const activeDate = date || selectedDate;
  const timeZone = settings.timezone;
  const editingGoal = showForm ? localEditingGoal : null;
  const handleEditGoal = onEditGoal || setLocalEditingGoal;
  const dayGoals = useMemo(
    () =>
      scheduledGoals
        .filter((goal) => goal.date === activeDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [scheduledGoals, activeDate],
  );
  const zonedNow = useMemo(() => getZonedDateParts(now, timeZone), [now, timeZone]);
  const isSelectedZoneToday = activeDate === zonedNow.dateKey;
  const currentTime = isSelectedZoneToday
    ? {
        hour: zonedNow.hour,
        minute: zonedNow.minute,
        minutePercent: (zonedNow.minute / 60) * 100,
        label: formatZonedTime(now, timeZone),
        ariaLabel: `Current time: ${formatZonedTime(now, timeZone)} in ${getTimeZoneCity(timeZone)}`,
      }
    : null;

  useEffect(() => {
    setNow(new Date());
    const intervalId = window.setInterval(() => setNow(new Date()), CURRENT_TIME_UPDATE_MS);
    return () => window.clearInterval(intervalId);
  }, [timeZone]);

  useEffect(() => {
    if (!currentTime) return undefined;

    const autoScrollKey = `${activeDate}:${timeZone}`;
    if (lastAutoScrollKeyRef.current === autoScrollKey) return undefined;
    lastAutoScrollKeyRef.current = autoScrollKey;

    const frameId = window.requestAnimationFrame(() => {
      const scheduleList = scheduleListRef.current;
      const currentHourRow = scheduleList?.querySelector(`[data-schedule-hour="${currentTime.hour}"]`);
      if (!scheduleList || !currentHourRow) return;

      const targetTop = Math.max(currentHourRow.offsetTop - scheduleList.clientHeight * 0.35, 0);
      scheduleList.scrollTo({ top: targetTop, behavior: "smooth" });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [activeDate, currentTime?.hour, timeZone]);

  const layoutClass = showForm ? "grid gap-5 lg:grid-cols-[20rem_1fr]" : "flex min-h-0 flex-col";
  const cardClass = showForm
    ? "rounded-[2rem] bg-white/70 p-5 shadow-xl shadow-zinc-200/60 backdrop-blur"
    : "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] bg-white/70 p-5 shadow-xl shadow-zinc-200/60 backdrop-blur";
  const scheduleListClass = showForm ? "mt-5" : "mt-5 min-h-0 flex-1 overflow-y-auto pr-1";

  return (
    <section className={`${layoutClass} ${className}`} style={style}>
      {showForm && <GoalBlockForm date={activeDate} editingGoal={editingGoal} onDone={() => setLocalEditingGoal(null)} />}

      <div className={cardClass}>
        <div className="shrink-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-pink-500">Daily schedule</p>
              <h2 className="text-2xl font-black text-zinc-950">{dayjs(activeDate).format("dddd, MMMM D")}</h2>
              <p className="mt-1 text-xs font-bold text-emerald-700" title={timeZone}>
                Times shown in {getTimeZoneLabel(timeZone)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">
                {dayGoals.length} scheduled
              </span>
              {!showForm && (
                <button
                  className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                  onClick={() => handleEditGoal()}
                  type="button"
                >
                  Add or Edit Time Block
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          aria-label="Daily schedule entries"
          className={scheduleListClass}
          ref={scheduleListRef}
          tabIndex={showForm ? undefined : 0}
        >
          {hours.map((hour) => (
            <TimeBlock
              currentTime={currentTime?.hour === hour ? currentTime : null}
              hour={hour}
              key={hour}
              onEdit={handleEditGoal}
              scheduledGoals={dayGoals}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
