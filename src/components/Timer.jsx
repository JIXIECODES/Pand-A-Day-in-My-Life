import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const DEFAULT_MINUTES = 25;
const DEFAULT_SECONDS = 0;
const MIN_TOTAL_SECONDS = 1;
const MAX_MINUTES = 180;
const MAX_TOTAL_SECONDS = MAX_MINUTES * 60 + 59;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function clampNumber(value, minimum, maximum) {
  const number = Number.parseInt(value, 10);

  if (Number.isNaN(number)) {
    return minimum;
  }

  return Math.min(maximum, Math.max(minimum, number));
}

function normalizeDuration(minutes, seconds) {
  const totalSeconds = Math.min(
    MAX_TOTAL_SECONDS,
    Math.max(MIN_TOTAL_SECONDS, minutes * 60 + seconds)
  );

  return {
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
  };
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
  const [durationSeconds, setDurationSeconds] = useState(DEFAULT_SECONDS);
  const [secondsLeft, setSecondsLeft] = useState(
    DEFAULT_MINUTES * 60 + DEFAULT_SECONDS
  );
  const [isRunning, setIsRunning] = useState(false);
  const totalSeconds = durationMinutes * 60 + durationSeconds;

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
    () => ((totalSeconds - secondsLeft) / Math.max(totalSeconds, 1)) * 100,
    [secondsLeft, totalSeconds]
  );

  const setDuration = (minutes, seconds) => {
    const next = normalizeDuration(minutes, seconds);

    setDurationMinutes(next.minutes);
    setDurationSeconds(next.seconds);

    if (!isRunning) {
      setSecondsLeft(next.totalSeconds);
    }
  };

  const updateMinutes = (value) => {
    setDuration(clampNumber(value, 0, MAX_MINUTES), durationSeconds);
  };

  const updateSeconds = (value) => {
    setDuration(durationMinutes, clampNumber(value, 0, 59));
  };

  const stepMinutes = (step) => {
    setDuration(durationMinutes + step, durationSeconds);
  };

  const stepSeconds = (step) => {
    setDuration(durationMinutes, durationSeconds + step);
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
        <div className="mx-auto mt-5 grid max-w-sm grid-cols-1 gap-3 rounded-[1.5rem] bg-white/10 p-3 sm:grid-cols-2">
          <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2">
            <button
              aria-label="Decrease focus minutes"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xl font-black disabled:opacity-40"
              disabled={isRunning}
              onClick={() => stepMinutes(-1)}
              type="button"
            >
              &darr;
            </button>
            <label className="min-w-0 text-left text-xs font-black uppercase tracking-wide text-rose-100">
              Minutes
              <input
                className="mt-1 w-full rounded-full border border-white/20 bg-white px-3 py-2 text-center text-lg font-black text-stone-900 outline-none focus:border-emerald-300 disabled:opacity-70"
                disabled={isRunning}
                max={MAX_MINUTES}
                min={0}
                onChange={(event) => updateMinutes(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    stepMinutes(1);
                  }

                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    stepMinutes(-1);
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
              onClick={() => stepMinutes(1)}
              type="button"
            >
              &uarr;
            </button>
          </div>

          <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2">
            <button
              aria-label="Decrease focus seconds"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xl font-black disabled:opacity-40"
              disabled={isRunning}
              onClick={() => stepSeconds(-1)}
              type="button"
            >
              &darr;
            </button>
            <label className="min-w-0 text-left text-xs font-black uppercase tracking-wide text-rose-100">
              Seconds
              <input
                className="mt-1 w-full rounded-full border border-white/20 bg-white px-3 py-2 text-center text-lg font-black text-stone-900 outline-none focus:border-emerald-300 disabled:opacity-70"
                disabled={isRunning}
                max={59}
                min={0}
                onChange={(event) => updateSeconds(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    stepSeconds(1);
                  }

                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    stepSeconds(-1);
                  }
                }}
                type="number"
                value={durationSeconds}
              />
            </label>
            <button
              aria-label="Increase focus seconds"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xl font-black disabled:opacity-40"
              disabled={isRunning}
              onClick={() => stepSeconds(1)}
              type="button"
            >
              &uarr;
            </button>
          </div>
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
