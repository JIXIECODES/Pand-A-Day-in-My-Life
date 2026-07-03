import React, { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import TimerSettings from "./TimerSettings.jsx";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function FocusTimer() {
  const { finishFocusTimer, settings, startFocus, timerGoal, setTimerGoal } = useAppContext();
  const durationSeconds = Math.max(1, settings.timerDurationMinutes || 25) * 60;
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSecondsLeft(durationSeconds);
    setRunning(false);
    setMessage("");
  }, [durationSeconds]);

  useEffect(() => {
    if (!running) return undefined;

    const interval = window.setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(interval);
          setRunning(false);
          finishFocusTimer();
          setMessage(timerGoal ? `${timerGoal.title} focus session complete.` : "Focus session complete.");
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [finishFocusTimer, running, timerGoal]);

  const progress = useMemo(
    () => ((durationSeconds - secondsLeft) / durationSeconds) * 100,
    [durationSeconds, secondsLeft],
  );

  function start() {
    setRunning(true);
    setMessage("");
    startFocus(timerGoal);
  }

  function pause() {
    setRunning(false);
    setMessage("Paused. Resume when you are ready.");
  }

  function reset() {
    setRunning(false);
    setSecondsLeft(durationSeconds);
    setMessage("");
  }

  return (
    <section className="rounded-[2rem] bg-zinc-950 p-5 text-white shadow-xl shadow-zinc-300/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-emerald-200">Focus timer</p>
          <h2 className="mt-1 text-lg font-black">
            {timerGoal ? timerGoal.title : "Pick any goal or start a free focus session"}
          </h2>
        </div>
        {timerGoal && (
          <button
            className="rounded-full bg-white/10 px-3 py-1 text-sm font-black"
            onClick={() => setTimerGoal(null)}
            type="button"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-6 text-center">
        <div className="text-6xl font-black tabular-nums">{formatTime(secondsLeft)}</div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-emerald-300 transition-all" style={{ width: `${progress}%` }} />
        </div>
        {message && <p className="mt-4 rounded-2xl bg-white/10 p-3 text-sm font-black text-emerald-100">{message}</p>}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <button className="rounded-full bg-emerald-300 px-4 py-3 text-sm font-black text-zinc-950" onClick={start} type="button">
          {secondsLeft === durationSeconds ? "Start" : "Resume"}
        </button>
        <button className="rounded-full bg-white/10 px-4 py-3 text-sm font-black" onClick={pause} type="button">
          Pause
        </button>
        <button className="rounded-full bg-white/10 px-4 py-3 text-sm font-black" onClick={reset} type="button">
          Reset
        </button>
      </div>

      <div className="mt-5">
        <TimerSettings />
      </div>
    </section>
  );
}
