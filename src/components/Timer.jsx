import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const DEFAULT_MINUTES = 25;
const MIN_MINUTES = 1;
const MAX_MINUTES = 180;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function clampMinutes(value) {
  const minutes = Number.parseInt(value, 10);

  if (Number.isNaN(minutes)) {
    return MIN_MINUTES;
  }

  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, minutes));
}

function playAlarm(sound) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  const patterns = {
    bambooBell: [660, 880, 660],
    pandaChime: [523, 659, 784, 1046],
    forestBells: [392, 494, 587, 784],
    softGong: [196, 247, 196],
    tinySparkle: [988, 1175, 1319, 1568],
  };
  const notes = patterns[sound] || patterns.bambooBell;
  const audio = new AudioContext();
  const startTime = audio.currentTime;

  notes.forEach((frequency, index) => {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const noteStart = startTime + index * 0.18;

    oscillator.type = sound === "softGong" ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, noteStart);
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.18, noteStart + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.42);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + 0.45);
  });
}

export default function Timer() {
  const { setMascotMood, setTimerGoal, settings, timerGoal } = useAppContext();
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_MINUTES);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const totalSeconds = durationMinutes * 60;

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setIsRunning(Boolean(timerGoal));
  }, [timerGoal, totalSeconds]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(interval);
          setIsRunning(false);
          setMascotMood("happy");
          if (settings.soundEnabled) {
            playAlarm(settings.alarmSound);
          }
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, setMascotMood, settings.alarmSound, settings.soundEnabled]);

  const progress = useMemo(
    () => ((totalSeconds - secondsLeft) / totalSeconds) * 100,
    [secondsLeft, totalSeconds]
  );

  const updateDuration = (value) => {
    const nextMinutes = clampMinutes(value);
    setDurationMinutes(nextMinutes);

    if (!isRunning) {
      setSecondsLeft(nextMinutes * 60);
    }
  };

  const stepDuration = (step) => {
    updateDuration(durationMinutes + step);
  };

  const start = () => {
    setIsRunning(true);
    setMascotMood("strong");
  };

  const pause = () => {
    setIsRunning(false);
    setMascotMood("sleepy");
  };

  const reset = () => {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
    setMascotMood("sleepy");
  };

  return (
    <section className="rounded-[2rem] bg-stone-900 p-5 text-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-rose-200">
            Focus Timer
          </p>
          <h2 className="mt-1 text-xl font-black">
            {timerGoal ? timerGoal.title : "Choose a goal to focus"}
          </h2>
        </div>
        {timerGoal && (
          <button
            className="rounded-full bg-white/10 px-3 py-1 text-sm font-black text-white"
            onClick={() => {
              setTimerGoal(null);
              reset();
            }}
            type="button"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-6 text-center">
        <div className="text-6xl font-black tabular-nums">
          {formatTime(secondsLeft)}
        </div>
        <div className="mx-auto mt-5 flex max-w-xs items-center justify-center gap-2 rounded-full bg-white/10 p-2">
          <button
            aria-label="Decrease focus minutes"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xl font-black disabled:opacity-40"
            disabled={isRunning}
            onClick={() => stepDuration(-1)}
            type="button"
          >
            ↓
          </button>
          <label className="min-w-0 flex-1 text-left text-xs font-black uppercase tracking-wide text-rose-100">
            Minutes
            <input
              className="mt-1 w-full rounded-full border border-white/20 bg-white px-4 py-2 text-center text-lg font-black text-stone-900 outline-none focus:border-emerald-300 disabled:opacity-70"
              disabled={isRunning}
              max={MAX_MINUTES}
              min={MIN_MINUTES}
              onChange={(event) => updateDuration(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  stepDuration(1);
                }

                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  stepDuration(-1);
                }
              }}
              type="number"
              value={durationMinutes}
            />
          </label>
          <button
            aria-label="Increase focus minutes"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xl font-black disabled:opacity-40"
            disabled={isRunning}
            onClick={() => stepDuration(1)}
            type="button"
          >
            ↑
          </button>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-emerald-300 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <button
          className="rounded-full bg-emerald-300 px-4 py-3 text-sm font-black text-stone-900 disabled:opacity-40"
          disabled={!timerGoal}
          onClick={start}
          type="button"
        >
          Start
        </button>
        <button
          className="rounded-full bg-white/10 px-4 py-3 text-sm font-black disabled:opacity-40"
          disabled={!timerGoal}
          onClick={pause}
          type="button"
        >
          Pause
        </button>
        <button
          className="rounded-full bg-white/10 px-4 py-3 text-sm font-black disabled:opacity-40"
          disabled={!timerGoal}
          onClick={reset}
          type="button"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
