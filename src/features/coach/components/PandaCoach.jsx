import React, { useMemo, useState } from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import {
  barrierOptions,
  coachActions,
  cleanTitle,
  findCoachGoal,
  getBarrierRecommendation,
  getIncompleteCoachGoals,
  getSmartCoachResponse,
  makeGoalRef,
  normalizeTitle,
  timeOptions,
} from "../services/smartCoachService.js";

function Button({ children, className = "", selected = false, ...props }) {
  return (
    <button
      className={[
        "min-h-11 rounded-2xl px-4 py-3 text-left text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-emerald-200 active:translate-y-0",
        selected
          ? "border-2 border-emerald-500 bg-emerald-100 text-emerald-950"
          : "bg-zinc-950 text-white shadow-sm hover:-translate-y-0.5 hover:bg-zinc-800",
        className,
      ].join(" ")}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={["min-h-11 rounded-2xl bg-white px-4 py-3 text-sm font-black text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-emerald-100 active:translate-y-0", className].join(" ")}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

function emptySelection() {
  return new Set();
}

export default function PandaCoach({
  capacity = "okay",
  dailyGoals = [],
  longTermGoals = [],
  todaysGoals = [],
}) {
  const {
    addSuggestedDailyGoals,
    saveGoalMinimumWin,
    setFocusTimerFromCoach,
  } = useAppContext();
  const [stage, setStage] = useState("home");
  const [selectedGoalRef, setSelectedGoalRef] = useState(null);
  const [selectedBarrier, setSelectedBarrier] = useState("");
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [selectedTasks, setSelectedTasks] = useState(() => emptySelection());
  const [confirmAction, setConfirmAction] = useState(null);
  const [inlineMessage, setInlineMessage] = useState("");
  const [response, setResponse] = useState(() => ({
    title: "Hi, I am your Panda Smart Coach.",
    message: "I can help you plan, focus, choose your next task, or break a goal into smaller steps.",
  }));

  const context = useMemo(
    () => ({
      capacity,
      dailyGoals: Array.isArray(dailyGoals) ? dailyGoals : [],
      longTermGoals: Array.isArray(longTermGoals) ? longTermGoals : [],
      todaysGoals: Array.isArray(todaysGoals) ? todaysGoals : [],
    }),
    [capacity, dailyGoals, longTermGoals, todaysGoals],
  );

  const incompleteGoals = useMemo(() => getIncompleteCoachGoals(context), [context]);
  const selectedGoal = useMemo(() => findCoachGoal(context, selectedGoalRef), [context, selectedGoalRef]);
  const recommendation = useMemo(() => {
    if (!selectedGoal || !selectedBarrier) return null;
    return getBarrierRecommendation({
      barrierId: selectedBarrier,
      capacity,
      goal: selectedGoal,
      minutes: selectedMinutes,
      suggestionIndex,
    });
  }, [capacity, selectedBarrier, selectedGoal, selectedMinutes, suggestionIndex]);
  const existingDailyTitles = useMemo(
    () => new Set(dailyGoals.map((goal) => normalizeTitle(goal.title || ""))),
    [dailyGoals],
  );
  const duplicateIndexes = useMemo(() => {
    const duplicates = new Set();
    if (!recommendation?.tasks) return duplicates;
    recommendation.tasks.forEach((task, index) => {
      if (existingDailyTitles.has(normalizeTitle(task.title))) duplicates.add(index);
    });
    return duplicates;
  }, [existingDailyTitles, recommendation]);

  function resetFlow(nextResponse = response) {
    setStage("home");
    setSelectedGoalRef(null);
    setSelectedBarrier("");
    setSelectedMinutes(10);
    setSuggestionIndex(0);
    setSelectedTasks(emptySelection());
    setConfirmAction(null);
    setInlineMessage("");
    setResponse(nextResponse);
  }

  function startStuckFlow() {
    setInlineMessage("");
    setSelectedGoalRef(null);
    setSelectedBarrier("");
    setSelectedTasks(emptySelection());
    setConfirmAction(null);
    setStage("select-goal");
  }

  function runCoachAction(actionId) {
    if (actionId === "stuck") {
      startStuckFlow();
      return;
    }
    resetFlow(getSmartCoachResponse(actionId, context));
  }


  function chooseGoal(goal) {
    setSelectedGoalRef(makeGoalRef(goal));
    setSelectedBarrier("");
    setSelectedTasks(emptySelection());
    setInlineMessage("");
    setStage("select-barrier");
  }

  function chooseBarrier(barrierId) {
    setSelectedBarrier(barrierId);
    setSuggestionIndex(0);
    setSelectedTasks(emptySelection());
    setInlineMessage("");
    setStage(barrierId === "time" ? "select-time" : "show-recommendation");
  }

  function showRecommendationForTime(minutes) {
    setSelectedMinutes(minutes);
    setSuggestionIndex(0);
    setStage("show-recommendation");
  }

  function ensureSelectedGoal() {
    const currentGoal = findCoachGoal(context, selectedGoalRef);
    if (!currentGoal) {
      setInlineMessage("That goal was already removed. Choose another unfinished goal.");
      setStage("select-goal");
      return null;
    }
    return currentGoal;
  }

  function requestConfirmation(action, payload = {}) {
    const currentGoal = ensureSelectedGoal();
    if (!currentGoal) return;
    setConfirmAction({ action, payload, goal: currentGoal });
    setStage("confirm-action");
  }

  function selectedTaskList() {
    if (!recommendation?.tasks) return [];
    return recommendation.tasks.filter((_, index) => selectedTasks.has(index) && !duplicateIndexes.has(index));
  }

  function confirmSelectedAction() {
    if (!confirmAction) return;
    const currentGoal = ensureSelectedGoal();
    if (!currentGoal && confirmAction.action !== "add-breakdown") return;

    if (confirmAction.action === "save-minimum-win") {
      const result = saveGoalMinimumWin(makeGoalRef(currentGoal), confirmAction.payload.suggestion);
      if (!result.ok) {
        setInlineMessage(result.reason === "missing" ? "That goal was already removed. Choose another unfinished goal." : "Panda could not save that Minimum Win.");
        setStage(result.reason === "missing" ? "select-goal" : "show-recommendation");
        return;
      }
      resetFlow({ title: "Minimum Win saved", message: "The full goal is unchanged, and no XP or streak progress was awarded." });
      return;
    }

    if (confirmAction.action === "add-daily-goal") {
      const result = addSuggestedDailyGoals([confirmAction.payload.task]);
      resetFlow({
        title: result.ok ? "Suggested daily goal added" : "Already in your daily goals",
        message: result.ok ? "Panda added the task without completing it or awarding XP." : "These steps are already in your daily goals.",
      });
      return;
    }

    if (confirmAction.action === "add-breakdown") {
      const tasks = confirmAction.payload.tasks || [];
      const result = addSuggestedDailyGoals(tasks);
      resetFlow({
        title: result.ok ? "Suggested steps added" : "Already in your daily goals",
        message: result.ok ? `${result.added.length} task${result.added.length === 1 ? "" : "s"} added in order without XP or streak changes.` : "These steps are already in your daily goals.",
      });
      return;
    }

    if (confirmAction.action === "set-timer") {
      const result = setFocusTimerFromCoach(makeGoalRef(currentGoal), confirmAction.payload.minutes);
      resetFlow({
        title: "Focus timer set",
        message: result.goal ? `The timer is set to ${result.minutes} minutes for "${cleanTitle(result.goal)}". Press Start in the Focus Timer when you are ready.` : `The timer is set to ${result.minutes} minutes.`,
      });
    }
  }

  function toggleTask(index) {
    setSelectedTasks((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function selectAllTasks() {
    if (!recommendation?.tasks) return;
    setSelectedTasks(new Set(recommendation.tasks.map((_, index) => index).filter((index) => !duplicateIndexes.has(index))));
  }

  function renderHome() {
    return (
      <>
        <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4" aria-live="polite">
          <h3 className="text-lg font-black text-zinc-950">{response.title}</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-zinc-700">{response.message}</p>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          {coachActions.map((action) => (
            <Button key={action.id} onClick={() => runCoachAction(action.id)}>
              {action.label}
            </Button>
          ))}
        </div>

      </>
    );
  }

  function renderGoalSelection() {
    return (
      <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4" aria-live="polite">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-emerald-700">Step 1 of 3</p>
            <h3 className="text-lg font-black text-zinc-950">Choose an unfinished goal</h3>
          </div>
          <SecondaryButton onClick={() => resetFlow()}>Cancel</SecondaryButton>
        </div>
        {inlineMessage && <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-black text-rose-700">{inlineMessage}</p>}
        {incompleteGoals.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-white p-4">
            <p className="text-sm font-bold text-zinc-700">Add an unfinished goal first so Panda can help.</p>
            <SecondaryButton className="mt-3" onClick={() => resetFlow()}>Return to Smart Coach</SecondaryButton>
          </div>
        ) : (
          <div className="mt-4 grid gap-2">
            {incompleteGoals.map((goal) => (
              <button
                className="rounded-2xl border border-white bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                key={`${goal.coachType}:${goal.id}`}
                onClick={() => chooseGoal(goal)}
                type="button"
              >
                <span className="block text-sm font-black text-zinc-950">{cleanTitle(goal)}</span>
                <span className="mt-1 block text-xs font-black uppercase text-emerald-700">{goal.coachTypeLabel}</span>
                {goal.minimumWin && <span className="mt-2 block rounded-2xl bg-emerald-50 p-2 text-xs font-bold text-emerald-800">Minimum Win: {goal.minimumWin}</span>}
                {goal.deadline && <span className="mt-2 block text-xs font-black text-zinc-500">Deadline: {goal.deadline}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderBarrierSelection() {
    return (
      <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4" aria-live="polite">
        <p className="text-xs font-black uppercase text-emerald-700">Step 2 of 3</p>
        <h3 className="text-lg font-black text-zinc-950">What is making this difficult?</h3>
        <p className="mt-2 text-sm font-bold text-zinc-600">Selected goal: {selectedGoal ? cleanTitle(selectedGoal) : "Goal no longer available"}</p>
        <div className="mt-4 grid gap-2">
          {barrierOptions.map((barrier) => (
            <button
              className="rounded-2xl border border-white bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              key={barrier.id}
              onClick={() => chooseBarrier(barrier.id)}
              type="button"
            >
              <span className="block text-sm font-black text-zinc-950">{barrier.label}</span>
              <span className="mt-1 block text-xs font-bold text-zinc-500">{barrier.description}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <SecondaryButton onClick={() => setStage("select-goal")}>Back</SecondaryButton>
          <SecondaryButton onClick={() => resetFlow()}>Cancel</SecondaryButton>
        </div>
      </div>
    );
  }

  function renderTimeSelection() {
    return (
      <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4" aria-live="polite">
        <p className="text-xs font-black uppercase text-emerald-700">Time available</p>
        <h3 className="text-lg font-black text-zinc-950">How much time do you have?</h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {timeOptions.map((minutes) => (
            <Button key={minutes} onClick={() => showRecommendationForTime(minutes)} selected={selectedMinutes === minutes}>
              {minutes} minutes
            </Button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <SecondaryButton onClick={() => setStage("select-barrier")}>Back</SecondaryButton>
          <SecondaryButton onClick={() => resetFlow()}>Cancel</SecondaryButton>
        </div>
      </div>
    );
  }

  function renderTaskSelection() {
    const availableTasks = recommendation.tasks.filter((_, index) => !duplicateIndexes.has(index));
    return (
      <div className="mt-4 rounded-2xl bg-white p-3">
        {availableTasks.length === 0 && <p className="text-sm font-black text-amber-800">These steps are already in your daily goals.</p>}
        {recommendation.tasks.map((task, index) => {
          const duplicate = duplicateIndexes.has(index);
          return (
            <label className="mt-2 flex min-h-11 items-start gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-3 text-sm font-bold text-zinc-700" key={`${task.title}-${index}`}>
              <input
                checked={selectedTasks.has(index) && !duplicate}
                className="mt-1 size-4 accent-emerald-500"
                disabled={duplicate}
                onChange={() => toggleTask(index)}
                type="checkbox"
              />
              <span>
                <span className="block font-black text-zinc-900">{task.title}</span>
                <span className="block text-xs text-zinc-500">{duplicate ? "Already in your daily goals" : task.description}</span>
              </span>
            </label>
          );
        })}
        <div className="mt-3 flex flex-wrap gap-2">
          <SecondaryButton disabled={availableTasks.length === 0} onClick={selectAllTasks}>Select all</SecondaryButton>
          <Button disabled={selectedTaskList().length === 0} onClick={() => requestConfirmation("add-breakdown", { tasks: selectedTaskList() })}>Add selected tasks</Button>
          <Button disabled={availableTasks.length === 0} onClick={() => requestConfirmation("add-breakdown", { tasks: availableTasks })}>Add all tasks</Button>
        </div>
      </div>
    );
  }

  function renderRecommendation() {
    if (!selectedGoal) {
      return renderGoalSelection();
    }
    if (!recommendation) return null;
    const canSaveMinimumWin = selectedBarrier !== "large";
    const canSetTimer = selectedBarrier === "start" || selectedBarrier === "time" || selectedBarrier === "rough";
    const canAddDailyGoal = selectedBarrier === "missing";
    const suggestion = recommendation.suggestion || "";

    return (
      <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4" aria-live="polite">
        <p className="text-xs font-black uppercase text-emerald-700">Step 3 of 3</p>
        <h3 className="text-lg font-black text-zinc-950">{recommendation.title}</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-zinc-700">{recommendation.message}</p>
        {recommendation.capacityNote && <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-black text-emerald-800">{recommendation.capacityNote}</p>}
        {selectedGoal.minimumWin && <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-black text-zinc-600">Current Minimum Win: {selectedGoal.minimumWin}</p>}
        {selectedBarrier === "large" && renderTaskSelection()}
        {selectedBarrier !== "large" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {canSaveMinimumWin && (
              <Button onClick={() => requestConfirmation("save-minimum-win", { suggestion })}>
                {selectedGoal.minimumWin ? "Replace current Minimum Win" : "Save as Minimum Win"}
              </Button>
            )}
            {canAddDailyGoal && <Button onClick={() => requestConfirmation("add-daily-goal", { task: { title: suggestion, description: `Unblocker for: ${cleanTitle(selectedGoal)}` } })}>Add as daily goal</Button>}
            {canSetTimer && <Button onClick={() => requestConfirmation("set-timer", { minutes: recommendation.focusMinutes })}>Set focus timer</Button>}
            <SecondaryButton onClick={() => setSuggestionIndex((current) => current + 1)}>Try another suggestion</SecondaryButton>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <SecondaryButton onClick={() => setStage(selectedBarrier === "time" ? "select-time" : "select-barrier")}>Back</SecondaryButton>
          <SecondaryButton onClick={() => resetFlow()}>Cancel</SecondaryButton>
        </div>
      </div>
    );
  }

  function renderConfirmation() {
    if (!confirmAction) return null;
    const goal = confirmAction.goal;
    const replacing = confirmAction.action === "save-minimum-win" && goal.minimumWin;
    const title = replacing ? "Replace the current Minimum Win?" : confirmAction.action === "save-minimum-win" ? "Save this as the Minimum Win?" : "Confirm this change?";
    return (
      <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4" aria-live="polite">
        <h3 className="text-lg font-black text-zinc-950">{title}</h3>
        <p className="mt-2 text-sm font-bold text-zinc-700">Goal: {cleanTitle(goal)}</p>
        {confirmAction.payload.suggestion && <p className="mt-2 rounded-2xl bg-white p-3 text-sm font-bold text-zinc-700">Suggested Minimum Win: {confirmAction.payload.suggestion}</p>}
        {goal.minimumWin && <p className="mt-2 rounded-2xl bg-white p-3 text-sm font-bold text-zinc-700">Current Minimum Win: {goal.minimumWin}</p>}
        {confirmAction.payload.tasks && <p className="mt-2 rounded-2xl bg-white p-3 text-sm font-bold text-zinc-700">Tasks to add: {confirmAction.payload.tasks.map((task) => task.title).join(", ")}</p>}
        {confirmAction.payload.task && <p className="mt-2 rounded-2xl bg-white p-3 text-sm font-bold text-zinc-700">Daily goal to add: {confirmAction.payload.task.title}</p>}
        {confirmAction.action === "set-timer" && <p className="mt-2 rounded-2xl bg-white p-3 text-sm font-bold text-zinc-700">Timer length: {confirmAction.payload.minutes} minutes</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={confirmSelectedAction}>Confirm</Button>
          <SecondaryButton onClick={() => setStage("show-recommendation")}>Back</SecondaryButton>
          <SecondaryButton onClick={() => resetFlow()}>Cancel</SecondaryButton>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-[2rem] border border-emerald-100 bg-white/75 p-5 shadow-xl shadow-zinc-200/60 backdrop-blur">
      <div className="max-w-3xl">
        <div>
          <p className="text-xs font-black uppercase text-emerald-600">Panda Smart Coach</p>
          <h2 className="mt-1 text-2xl font-black text-zinc-950">What should we figure out next?</h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold text-zinc-500">
            Choose a tiny plan, a focus nudge, or help getting unstuck on a real goal.
          </p>
        </div>

      </div>

      {stage === "home" && renderHome()}
      {stage === "select-goal" && renderGoalSelection()}
      {stage === "select-barrier" && renderBarrierSelection()}
      {stage === "select-time" && renderTimeSelection()}
      {stage === "show-recommendation" && renderRecommendation()}
      {stage === "confirm-action" && renderConfirmation()}
    </section>
  );
}