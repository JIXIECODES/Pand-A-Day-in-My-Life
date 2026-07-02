import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const DEFAULT_SECONDS = 25 * 60;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function Timer() {
  const { finishFocusTimer, startFocus, timerGoal, setTimerGoal } = useAppContext();
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return undefined;

    const interval = window.setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(interval);
          setRunning(false);
          finishFocusTimer();
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [finishFocusTimer, running]);

  const progress = useMemo(() => ((DEFAULT_SECONDS - secondsLeft) / DEFAULT_SECONDS) * 100, [secondsLeft]);

  function start() {
    if (!timerGoal) return;
    setRunning(true);
    startFocus(timerGoal);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setSecondsLeft(DEFAULT_SECONDS);
  }

  return (
    <section className="rounded-[2rem] bg-zinc-950 p-5 text-white shadow-xl shadow-zinc-300/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-emerald-200">Focus timer</p>
          <h2 className="mt-1 text-lg font-black">{timerGoal ? timerGoal.title : "Choose a goal to focus"}</h2>
        </div>
        {timerGoal && (
          <button className="rounded-full bg-white/10 px-3 py-1 text-sm font-black" onClick={() => setTimerGoal(null)} type="button">
            Clear
          </button>
        )}
      </div>
      <div className="mt-6 text-center">
        <div className="text-6xl font-black tabular-nums">{formatTime(secondsLeft)}</div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-emerald-300 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2">
        <button className="rounded-full bg-emerald-300 px-4 py-3 text-sm font-black text-zinc-950 disabled:opacity-40" disabled={!timerGoal} onClick={start} type="button">
          Start
        </button>
        <button className="rounded-full bg-white/10 px-4 py-3 text-sm font-black disabled:opacity-40" disabled={!timerGoal} onClick={pause} type="button">
          Pause
        </button>
        <button className="rounded-full bg-white/10 px-4 py-3 text-sm font-black disabled:opacity-40" disabled={!timerGoal} onClick={reset} type="button">
          Reset
        </button>
      </div>
    </section>
  );
}
