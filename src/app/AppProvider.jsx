import dayjs from "dayjs";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { decorations } from "../data/decorations.js";
import { NO_OUTFIT_ID, normalizeOutfitId, outfits } from "../data/outfits.js";
import { evaluateAchievements } from "../features/rewards/utils/achievementLogic.js";
import {
  applyDailyTaskReward,
  completeDailyTaskState,
  getDailyTaskStateForDate,
} from "../features/rewards/utils/dailyTaskLogic.js";
import { todayKey } from "../features/calendar/utils/dateUtils.js";
import {
  celebrateAlreadyAwardedGoal,
  completeGoalStats,
  focusFinishedStats,
  focusStartedStats,
  journalStats,
  withMood,
} from "../features/panda/utils/pandaLogic.js";
import { completeMinimumWinStats } from "../features/goals/utils/minimumWinRewards.js";
import { canClaimDailyReward, claimDailyReward } from "../features/rewards/utils/rewardLogic.js";
import { getLocalDateKey } from "../features/resilience/utils/localDate.js";
import { processQualifyingActivity } from "../features/resilience/utils/resilienceTracking.js";
import { getResilienceState, saveResilienceState } from "../features/resilience/services/resilienceStorage.js";
import {
  DEFAULT_CATEGORY_COLORS,
  deleteClassicGoal,
  deleteGoal,
  deleteLongTermGoal,
  deleteScheduledGoal,
  getAllGoals,
  getCategoryColors,
  getClassicGoals,
  getData,
  getLongTermGoals,
  getPandaStats,
  getScheduledGoals,
  getSettings,
  resetAllData,
  saveCategoryColors,
  saveClassicGoal,
  saveData,
  saveGoal,
  saveLongTermGoal,
  saveScheduledGoal,
  saveSettings,
  STORAGE_KEYS,
  updateClassicGoal,
  updateGoal,
  updateLongTermGoal,
  updateScheduledGoal,
} from "../shared/utils/storage.js";

const AppContext = createContext(null);

function navigationFromLocation() {
  if (typeof window === "undefined") return { page: "home", planningTab: "calendar" };

  const hash = window.location.hash.replace(/^#\/?/, "");
  const [pagePart, queryPart = ""] = hash.split("?");
  const params = new URLSearchParams(queryPart);
  const tab = params.get("tab");

  if (pagePart === "planning" || pagePart === "calendar") {
    return { page: "calendar", planningTab: tab || "calendar" };
  }

  return { page: pagePart || "home", planningTab: tab || "calendar" };
}

function normalizeJournalEntries(entries = {}) {
  return Object.fromEntries(
    Object.entries(entries).map(([key, entry]) => {
      const normalized = {
        id: entry.id || key,
        date: entry.date || key,
        text: entry.text || "",
        createdAt: entry.createdAt || entry.updatedAt || new Date().toISOString(),
        updatedAt: entry.updatedAt || entry.createdAt || new Date().toISOString(),
      };

      return [normalized.id, normalized];
    }),
  );
}

function minimumWinText(goal = {}) {
  return typeof goal.minimumWin === "string" ? goal.minimumWin.trim() : "";
}
function normalizeGoalTitleForCoach(value = "") {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
function dateKeyFromValue(value) {
  if (!value) return todayKey();
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : todayKey();
}

function deriveStreak(goalsByDate, scheduledGoals, classicGoals, longTermGoals, existingDates = []) {
  const streakDates = new Set(Array.isArray(existingDates) ? existingDates : []);

  Object.entries(goalsByDate || {}).forEach(([date, goals]) => {
    if ((goals || []).some((goal) => goal.completed)) streakDates.add(date);
  });

  (scheduledGoals || []).forEach((goal) => {
    if (goal.completed) streakDates.add(goal.date || dateKeyFromValue(goal.completedAt || goal.createdAt));
  });

  [...(classicGoals || []), ...(longTermGoals || [])].forEach((goal) => {
    if (goal.completed) streakDates.add(dateKeyFromValue(goal.completedAt || goal.createdAt));
  });

  return {
    streak: streakDates.size,
    streakDates: [...streakDates].sort(),
  };
}

function unlockByRequirements(items, stats, currentIds) {
  const metric = {
    completedGoals: stats.completedGoals,
    streak: stats.streak,
    focusTimers: stats.focusTimers,
    journalDays: stats.journalDays,
    level: stats.level,
    hardGoals: stats.hardGoals,
    deepGoals: stats.deepGoals,
    dailyRewards: stats.dailyRewards,
  };
  const next = [...currentIds];
  const newlyUnlocked = [];

  items.forEach((item) => {
    if (next.includes(item.id)) return;
    if ((metric[item.requirement.type] || 0) >= item.requirement.value) {
      next.push(item.id);
      newlyUnlocked.push(item);
    }
  });

  return { next, newlyUnlocked };
}

export function AppProvider({ authSession = null, children, initialToast = "", onLogout = () => {}, syncStatus = "local" }) {
  const initialNavigation = useMemo(() => navigationFromLocation(), []);
  const [activePage, setActivePageState] = useState(initialNavigation.page);
  const [planningTab, setPlanningTab] = useState(initialNavigation.planningTab);
  const [goalsByDate, setGoalsByDate] = useState(() => getAllGoals());
  const [classicGoals, setClassicGoals] = useState(() => getClassicGoals());
  const [longTermGoals, setLongTermGoals] = useState(() => getLongTermGoals());
  const [scheduledGoals, setScheduledGoals] = useState(() => getScheduledGoals());
  const [categoryColors, setCategoryColors] = useState(() => getCategoryColors());
  const [journalEntries, setJournalEntries] = useState(() =>
    normalizeJournalEntries(getData(STORAGE_KEYS.journalEntries, {})),
  );
  const [pandaStats, setPandaStats] = useState(() => getPandaStats());
  const [settings, setSettingsState] = useState(() => getSettings());
  const [selectedDate, setSelectedDate] = useState(() => todayKey());
  const [currentMonth, setCurrentMonth] = useState(() => dayjs());
  const [timerGoal, setTimerGoal] = useState(null);
  const [dailyRewards, setDailyRewards] = useState(() =>
    getData(STORAGE_KEYS.dailyRewards, { lastClaimedDate: "", lastReward: null }),
  );
  const [dailyTasks, setDailyTasks] = useState(() =>
    getDailyTaskStateForDate(getData(STORAGE_KEYS.dailyTasks, null), todayKey()),
  );
  const [unlockedOutfits, setUnlockedOutfits] = useState(() =>
    getData(STORAGE_KEYS.unlockedOutfits, []),
  );
  const [unlockedDecorations, setUnlockedDecorations] = useState(() =>
    getData(STORAGE_KEYS.unlockedDecorations, []),
  );
  const [unlockedAchievements, setUnlockedAchievements] = useState(() =>
    getData(STORAGE_KEYS.achievements, []),
  );
  const [equippedOutfit, setEquippedOutfit] = useState(() =>
    normalizeOutfitId(getData(STORAGE_KEYS.equippedOutfit, "")),
  );
  const [toast, setToast] = useState(initialToast);
  const [resilienceState, setResilienceState] = useState(() => getResilienceState());

  useEffect(() => {
    if (initialToast) setToast(initialToast);
  }, [initialToast]);

  function recordQualifyingActivity() {
    const activityDate = getLocalDateKey();
    const result = processQualifyingActivity(getResilienceState(activityDate), activityDate);
    const savedState = saveResilienceState(result.state, activityDate);
    setResilienceState(savedState);
    if (result.returnAwarded) {
      setToast("Welcome back. Resilience Return +1.");
    }
    return result;
  }
  function persistStats(
    nextStats,
    goalsSnapshot = goalsByDate,
    scheduledSnapshot = scheduledGoals,
    classicSnapshot = classicGoals,
    longTermSnapshot = longTermGoals,
  ) {
    const streakState = deriveStreak(
      goalsSnapshot,
      scheduledSnapshot,
      classicSnapshot,
      longTermSnapshot,
      nextStats.streakDates || pandaStats.streakDates,
    );
    const statsWithStreak = { ...nextStats, ...streakState };
    const outfitResult = unlockByRequirements(outfits, statsWithStreak, unlockedOutfits);
    const decorationResult = unlockByRequirements(decorations, statsWithStreak, unlockedDecorations);
    const achievementResult = evaluateAchievements(
      statsWithStreak,
      unlockedAchievements,
      outfitResult.next,
      decorationResult.next,
    );

    setPandaStats(saveData(STORAGE_KEYS.pandaStats, statsWithStreak));
    setUnlockedOutfits(saveData(STORAGE_KEYS.unlockedOutfits, outfitResult.next));
    setUnlockedDecorations(saveData(STORAGE_KEYS.unlockedDecorations, decorationResult.next));
    setUnlockedAchievements(saveData(STORAGE_KEYS.achievements, achievementResult.nextUnlocked));

    const newLabels = [
      ...outfitResult.newlyUnlocked.map((item) => `Unlocked outfit: ${item.name}`),
      ...decorationResult.newlyUnlocked.map((item) => `Unlocked decoration: ${item.name}`),
      ...achievementResult.newlyUnlocked.map((item) => `Achievement: ${item.title}`),
    ];
    if (newLabels.length > 0) setToast(newLabels[0]);

    return statsWithStreak;
  }

  function completeDailyTask(taskId, statsSnapshot = pandaStats, goalsSnapshot = goalsByDate) {
    const today = todayKey();
    const todayTasks = getDailyTaskStateForDate(dailyTasks, today);
    const result = completeDailyTaskState(todayTasks, taskId);
    if (!result.changed) {
      if (todayTasks !== dailyTasks) {
        setDailyTasks(saveData(STORAGE_KEYS.dailyTasks, todayTasks));
      }
      return statsSnapshot;
    }

    setDailyTasks(saveData(STORAGE_KEYS.dailyTasks, result.state));
    const rewardedStats = applyDailyTaskReward(statsSnapshot, result.reward);
    const savedStats = persistStats(rewardedStats, goalsSnapshot);
    setToast("Daily task completed");
    return savedStats;
  }

  useEffect(() => {
    function syncFromHistory(event) {
      const next = event.state?.activePage ? event.state : navigationFromLocation();
      setActivePageState(next.activePage || next.page || "home");
      setPlanningTab(next.planningTab || "calendar");
    }

    window.history.replaceState(
      { activePage, planningTab },
      "",
      window.location.href,
    );
    window.addEventListener("popstate", syncFromHistory);
    return () => window.removeEventListener("popstate", syncFromHistory);
  }, []);

  function navigatePage(page, options = {}) {
    const nextPlanningTab = options.planningTab || (page === "calendar" ? planningTab : "calendar");
    setActivePageState(page);
    if (page === "calendar") setPlanningTab(nextPlanningTab);
    const nextUrl = page === "calendar" && nextPlanningTab
      ? `#planning?tab=${nextPlanningTab}`
      : `#${page}`;
    window.history.pushState({ activePage: page, planningTab: nextPlanningTab }, "", nextUrl);
    if (page === "panda") {
      completeDailyTask("visit-panda-page");
    }
  }

  function addGoal(date, goal) {
    const saved = saveGoal(date, goal);
    if (goal.startTime && goal.endTime) {
      saveScheduledGoal({
        title: goal.title,
        description: goal.description || "",
        minimumWin: goal.minimumWin || "",
        date,
        startTime: goal.startTime,
        endTime: goal.endTime,
        category: goal.category || "Personal",
        difficulty: goal.difficulty || "easy",
        completed: false,
        xpAwarded: false,
      });
      setScheduledGoals(getScheduledGoals());
    }
    setGoalsByDate(getAllGoals());
    persistStats(withMood(pandaStats, "idle", "New goal added"));
    return saved;
  }

  function editGoal(date, id, updates) {
    updateGoal(date, id, updates);
    setGoalsByDate(getAllGoals());
  }

  function addClassicGoal(goal) {
    const saved = saveClassicGoal(goal);
    setClassicGoals(getClassicGoals());
    const nextStats = persistStats(withMood(pandaStats, "idle", "Daily goal added"));
    completeDailyTask("create-classic-goal", nextStats);
    setToast("Daily goal created");
    return saved;
  }

  function editClassicGoal(id, updates) {
    setClassicGoals(updateClassicGoal(id, updates));
    setToast("Daily goal updated");
  }

  function addLongTermGoal(goal) {
    const saved = saveLongTermGoal(goal);
    setLongTermGoals(getLongTermGoals());
    persistStats(withMood(pandaStats, "idle", "Long-term goal added"));
    setToast("Long-term goal created");
    return saved;
  }

  function editLongTermGoal(id, updates) {
    setLongTermGoals(updateLongTermGoal(id, updates));
    setToast("Long-term goal updated");
  }

  function toggleClassicGoal(id) {
    const goal = classicGoals.find((item) => item.id === id);
    if (!goal) return;

    if (!goal.completed) {
      const confirmed = window.confirm("Are you sure this goal is truly completed?");
      if (!confirmed) return;
    }

    const completingForFirstTime = !goal.completed && !goal.xpAwarded;
    const nextClassicGoals = updateClassicGoal(id, {
      completed: !goal.completed,
      xpAwarded: goal.xpAwarded || !goal.completed,
      completedAt: !goal.completed ? (goal.completedAt || new Date().toISOString()) : goal.completedAt,
    });
    setClassicGoals(nextClassicGoals);

    if (completingForFirstTime) {
      const nextStats = persistStats(completeGoalStats(pandaStats, goal, false), goalsByDate, scheduledGoals, nextClassicGoals, longTermGoals);
      completeDailyTask("complete-goal", nextStats);
      recordQualifyingActivity();
    } else if (!goal.completed) {
      persistStats(celebrateAlreadyAwardedGoal(pandaStats), goalsByDate, scheduledGoals, nextClassicGoals, longTermGoals);
    } else {
      persistStats(withMood(pandaStats, "idle", "Daily goal unchecked"), goalsByDate, scheduledGoals, nextClassicGoals, longTermGoals);
    }
  }

  function toggleLongTermGoal(id) {
    const goal = longTermGoals.find((item) => item.id === id);
    if (!goal) return;

    if (!goal.completed) {
      const confirmed = window.confirm("Are you sure this goal is truly completed?");
      if (!confirmed) return;
    }

    const completingForFirstTime = !goal.completed && !goal.xpAwarded;
    const nextLongTermGoals = updateLongTermGoal(id, {
      completed: !goal.completed,
      xpAwarded: goal.xpAwarded || !goal.completed,
      completedAt: !goal.completed ? (goal.completedAt || new Date().toISOString()) : goal.completedAt,
    });
    setLongTermGoals(nextLongTermGoals);

    if (completingForFirstTime) {
      const nextStats = persistStats(completeGoalStats(pandaStats, goal, false), goalsByDate, scheduledGoals, classicGoals, nextLongTermGoals);
      completeDailyTask("complete-goal", nextStats);
      recordQualifyingActivity();
    } else if (!goal.completed) {
      persistStats(celebrateAlreadyAwardedGoal(pandaStats), goalsByDate, scheduledGoals, classicGoals, nextLongTermGoals);
    } else {
      persistStats(withMood(pandaStats, "idle", "Long-term goal unchecked"), goalsByDate, scheduledGoals, classicGoals, nextLongTermGoals);
    }
  }


  function completeMinimumWin(goal) {
    if (!goal?.id) return;

    if (!minimumWinText(goal)) {
      setToast("Add a Minimum Win before recording partial progress.");
      return;
    }

    if (goal.completed) {
      setToast("This goal is already complete.");
      return;
    }

    if (goal.minimumWinCompleted) {
      setToast("Minimum progress was already completed.");
      return;
    }

    const confirmed = window.confirm("Complete this Minimum Win?\n\nThis records partial progress. The full goal will remain unfinished.");
    if (!confirmed) return;

    const goalDate = goal.date;
    let currentGoal = null;
    let nextGoalsSnapshot = goalsByDate;
    let nextScheduledSnapshot = scheduledGoals;
    let nextClassicSnapshot = classicGoals;
    let nextLongTermSnapshot = longTermGoals;

    if (goal.type === "classic") {
      currentGoal = getClassicGoals().find((item) => item.id === goal.id);
    } else if (goal.type === "longTerm") {
      currentGoal = getLongTermGoals().find((item) => item.id === goal.id);
    } else if (goal.type === "scheduled") {
      currentGoal = getScheduledGoals().find((item) => item.id === goal.id);
    } else if (goalDate) {
      currentGoal = (getAllGoals()[goalDate] || []).find((item) => item.id === goal.id);
    }

    if (!currentGoal) {
      setToast("That goal was already removed.");
      return;
    }

    if (!minimumWinText(currentGoal)) {
      setToast("Add a Minimum Win before recording partial progress.");
      return;
    }

    if (currentGoal.completed) {
      setToast("This goal is already complete.");
      return;
    }

    if (currentGoal.minimumWinCompleted) {
      setToast("Minimum progress was already completed.");
      return;
    }

    const reward = currentGoal.minimumWinRewardGranted
      ? { stats: pandaStats, xp: 0 }
      : completeMinimumWinStats(pandaStats, currentGoal);
    const updates = {
      minimumWinCompleted: true,
      minimumWinCompletedAt: new Date().toISOString(),
      minimumWinRewardGranted: true,
    };

    if (goal.type === "classic") {
      nextClassicSnapshot = updateClassicGoal(goal.id, updates);
      setClassicGoals(nextClassicSnapshot);
    } else if (goal.type === "longTerm") {
      nextLongTermSnapshot = updateLongTermGoal(goal.id, updates);
      setLongTermGoals(nextLongTermSnapshot);
    } else if (goal.type === "scheduled") {
      nextScheduledSnapshot = updateScheduledGoal(goal.id, updates);
      setScheduledGoals(nextScheduledSnapshot);
    } else if (goalDate) {
      updateGoal(goalDate, goal.id, updates);
      nextGoalsSnapshot = getAllGoals();
      setGoalsByDate(nextGoalsSnapshot);
    }

    persistStats(reward.stats, nextGoalsSnapshot, nextScheduledSnapshot, nextClassicSnapshot, nextLongTermSnapshot);
    const resilienceResult = !currentGoal.minimumWinRewardGranted ? recordQualifyingActivity() : { returnAwarded: false };
    if (!resilienceResult.returnAwarded) {
      setToast(reward.xp > 0 ? `Minimum progress completed. +${reward.xp} XP` : "Minimum progress completed. Your full goal is still available.");
    }
  }

  function findGoalForCoach(goalRef = {}) {
    if (!goalRef?.id) return null;
    if (goalRef.coachType === "classic" || goalRef.type === "classic") {
      return getClassicGoals().find((goal) => goal.id === goalRef.id) || null;
    }
    if (goalRef.coachType === "longTerm" || goalRef.type === "longTerm") {
      return getLongTermGoals().find((goal) => goal.id === goalRef.id) || null;
    }
    if (goalRef.coachType === "scheduled" || goalRef.type === "scheduled") {
      return getScheduledGoals().find((goal) => goal.id === goalRef.id) || null;
    }
    if (goalRef.date) {
      return (getAllGoals()[goalRef.date] || []).find((goal) => goal.id === goalRef.id) || null;
    }
    return null;
  }

  function saveGoalMinimumWin(goalRef, minimumWin) {
    const nextMinimumWin = typeof minimumWin === "string" ? minimumWin.trim() : "";
    if (!nextMinimumWin) {
      setToast("Panda needs a Minimum Win before saving.");
      return { ok: false, reason: "empty" };
    }

    const currentGoal = findGoalForCoach(goalRef);
    if (!currentGoal) {
      setToast("That goal was already removed.");
      return { ok: false, reason: "missing" };
    }

    const updates = {
      minimumWin: nextMinimumWin,
      minimumWinCompleted: false,
      minimumWinCompletedAt: null,
      minimumWinRewardGranted: false,
    };

    if (currentGoal.type === "classic") {
      setClassicGoals(updateClassicGoal(currentGoal.id, updates));
    } else if (currentGoal.type === "longTerm") {
      setLongTermGoals(updateLongTermGoal(currentGoal.id, updates));
    } else if (currentGoal.type === "scheduled") {
      setScheduledGoals(updateScheduledGoal(currentGoal.id, updates));
    } else if (currentGoal.date) {
      updateGoal(currentGoal.date, currentGoal.id, updates);
      setGoalsByDate(getAllGoals());
    } else {
      setToast("Panda could not update that goal type.");
      return { ok: false, reason: "unsupported" };
    }

    setToast("Minimum Win saved");
    return { ok: true, goal: { ...currentGoal, ...updates } };
  }

  function addSuggestedDailyGoals(tasks = []) {
    const existingTitles = new Set(getClassicGoals().map((goal) => normalizeGoalTitleForCoach(goal.title || "")));
    const added = [];
    const skipped = [];

    tasks.forEach((task) => {
      const title = typeof task?.title === "string" ? task.title.trim() : "";
      const normalized = normalizeGoalTitleForCoach(title);
      if (!title || existingTitles.has(normalized)) {
        if (title) skipped.push(title);
        return;
      }

      const saved = saveClassicGoal({
        title,
        description: task.description || "Suggested by Panda Smart Coach",
        category: task.category || "Personal",
        difficulty: task.difficulty || "easy",
        minimumWin: task.minimumWin || "",
      });
      existingTitles.add(normalized);
      added.push(saved);
    });

    setClassicGoals(getClassicGoals());
    if (added.length > 0) {
      setToast(added.length === 1 ? "Suggested daily goal added" : `${added.length} suggested daily goals added`);
    } else if (skipped.length > 0) {
      setToast("These steps are already in your daily goals.");
    }

    return { ok: added.length > 0, added, skipped };
  }

  function setFocusTimerFromCoach(goalRef, minutes = 25) {
    const currentGoal = goalRef?.id ? findGoalForCoach(goalRef) : null;
    const safeMinutes = Math.max(1, Math.min(240, Number(minutes) || 25));
    updateSettings({ timerDurationMinutes: safeMinutes });
    if (currentGoal) setTimerGoal(currentGoal);
    setToast(currentGoal ? `Focus timer set for ${currentGoal.title}` : `Focus timer set for ${safeMinutes} minutes`);
    return { ok: true, goal: currentGoal, minutes: safeMinutes };
  }
  function removeClassicGoal(id) {
    setClassicGoals(deleteClassicGoal(id));
    persistStats(withMood(pandaStats, "idle", "Daily goal removed"));
    setToast("Daily goal deleted");
  }

  function removeLongTermGoal(id) {
    setLongTermGoals(deleteLongTermGoal(id));
    persistStats(withMood(pandaStats, "idle", "Long-term goal removed"));
    setToast("Long-term goal deleted");
  }

  function addScheduledGoal(goal) {
    const saved = saveScheduledGoal(goal);
    setScheduledGoals(getScheduledGoals());
    const nextStats = persistStats(withMood(pandaStats, "idle", "Scheduled goal added"));
    completeDailyTask("schedule-time-block", nextStats);
    setToast(`${goal.title} block saved for ${goal.startTime} - ${goal.endTime}.`);
    return saved;
  }

  function editScheduledGoal(id, updates) {
    setScheduledGoals(updateScheduledGoal(id, updates));
    setToast("Scheduled goal updated");
  }

  function toggleScheduledGoal(id) {
    const goal = scheduledGoals.find((item) => item.id === id);
    if (!goal) return;

    if (!goal.completed) {
      const confirmed = window.confirm("Are you sure this goal is truly completed?");
      if (!confirmed) return;
    }

    const completingForFirstTime = !goal.completed && !goal.xpAwarded;
    const nextScheduledGoals = updateScheduledGoal(id, {
      completed: !goal.completed,
      xpAwarded: goal.xpAwarded || !goal.completed,
      completedAt: !goal.completed ? (goal.completedAt || new Date().toISOString()) : goal.completedAt,
    });
    setScheduledGoals(nextScheduledGoals);

    if (completingForFirstTime) {
      const nextStats = persistStats(completeGoalStats(pandaStats, { ...goal, difficulty: goal.difficulty || "medium" }, false), goalsByDate, nextScheduledGoals);
      completeDailyTask("complete-goal", nextStats);
      recordQualifyingActivity();
    } else if (!goal.completed) {
      persistStats(celebrateAlreadyAwardedGoal(pandaStats), goalsByDate, nextScheduledGoals);
    } else {
      persistStats(withMood(pandaStats, "idle", "Scheduled goal unchecked"), goalsByDate, nextScheduledGoals);
    }
  }

  function completeScheduledGoal(id) {
    const goal = scheduledGoals.find((item) => item.id === id);
    if (!goal) return;

    const completing = !goal.completed;
    const completingForFirstTime = completing && !goal.xpAwarded;
    const nextScheduledGoals = updateScheduledGoal(id, {
      completed: completing,
      xpAwarded: goal.xpAwarded || completing,
      completedAt: completing ? (goal.completedAt || new Date().toISOString()) : goal.completedAt,
    });
    setScheduledGoals(nextScheduledGoals);

    if (completingForFirstTime) {
      const nextStats = persistStats(completeGoalStats(pandaStats, { ...goal, difficulty: goal.difficulty || "medium" }, false), goalsByDate, nextScheduledGoals);
      completeDailyTask("complete-goal", nextStats);
      recordQualifyingActivity();
    } else if (completing) {
      persistStats(celebrateAlreadyAwardedGoal(pandaStats), goalsByDate, nextScheduledGoals);
    } else {
      persistStats(withMood(pandaStats, "idle", "Scheduled goal unchecked"), goalsByDate, nextScheduledGoals);
    }
  }

  function removeScheduledGoal(id) {
    setScheduledGoals(deleteScheduledGoal(id));
    persistStats(withMood(pandaStats, "idle", "Scheduled goal removed"));
    setToast("Scheduled goal deleted");
  }

  function toggleGoal(date, id) {
    const goal = (goalsByDate[date] || []).find((item) => item.id === id);
    if (!goal) return;

    if (!goal.completed) {
      const confirmed = window.confirm("Are you sure this goal is truly completed?");
      if (!confirmed) return;
    }

    const completingForFirstTime = !goal.completed && !goal.xpAwarded;
    updateGoal(date, id, {
      completed: !goal.completed,
      xpAwarded: goal.xpAwarded || !goal.completed,
      completedAt: !goal.completed ? (goal.completedAt || new Date().toISOString()) : goal.completedAt,
    });
    const nextGoals = getAllGoals();
    setGoalsByDate(nextGoals);

    if (completingForFirstTime) {
      const allDone = (nextGoals[date] || []).length > 0 && nextGoals[date].every((item) => item.completed);
      const nextStats = persistStats(completeGoalStats(pandaStats, goal, allDone), nextGoals);
      completeDailyTask("complete-goal", nextStats, nextGoals);
      recordQualifyingActivity();
    } else if (!goal.completed) {
      persistStats(celebrateAlreadyAwardedGoal(pandaStats), nextGoals);
    } else {
      persistStats(withMood(pandaStats, "idle", "Goal unchecked"), nextGoals);
    }
  }

  function removeGoal(date, id) {
    deleteGoal(date, id);
    const nextGoals = getAllGoals();
    setGoalsByDate(nextGoals);
    persistStats(withMood(pandaStats, "idle", "Goal removed"), nextGoals);
  }

  function saveJournalEntry(date, text) {
    if (!text.trim()) return null;
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
    const nextEntries = {
      ...journalEntries,
      [id]: {
        id,
        date,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    setJournalEntries(saveData(STORAGE_KEYS.journalEntries, nextEntries));
    const nextStats = persistStats(journalStats(pandaStats));
    completeDailyTask("write-memory", nextStats);
    setToast("Memory saved");
    return nextEntries[id];
  }

  function removeJournalEntry(id) {
    const nextEntries = { ...journalEntries };
    delete nextEntries[id];
    setJournalEntries(saveData(STORAGE_KEYS.journalEntries, nextEntries));
    setToast("Memory deleted");
  }

  function startFocus(goal = timerGoal) {
    if (goal) setTimerGoal(goal);
    const nextStats = persistStats(focusStartedStats(pandaStats));
    completeDailyTask("start-focus-timer", nextStats);
  }

  function finishFocusTimer() {
    let nextGoals = goalsByDate;
    let nextStats = focusFinishedStats(pandaStats);
    let completedGoalForTask = false;

    if (timerGoal?.type === "scheduled" && timerGoal?.id && !timerGoal.completed) {
      const firstAward = !timerGoal.xpAwarded;
      const nextScheduledGoals = updateScheduledGoal(timerGoal.id, {
        completed: true,
        xpAwarded: true,
        completedAt: timerGoal.completedAt || new Date().toISOString(),
      });
      setScheduledGoals(nextScheduledGoals);
      nextStats = firstAward ? completeGoalStats(nextStats, { ...timerGoal, difficulty: timerGoal.difficulty || "medium" }, false) : celebrateAlreadyAwardedGoal(nextStats);
      completedGoalForTask = firstAward;
      setTimerGoal({ ...timerGoal, completed: true, xpAwarded: true });
    } else if (timerGoal?.type === "classic" && timerGoal?.id && !timerGoal.completed) {
      const firstAward = !timerGoal.xpAwarded;
      const nextClassicGoals = updateClassicGoal(timerGoal.id, {
        completed: true,
        xpAwarded: true,
        completedAt: timerGoal.completedAt || new Date().toISOString(),
      });
      setClassicGoals(nextClassicGoals);
      nextStats = firstAward ? completeGoalStats(nextStats, timerGoal, false) : celebrateAlreadyAwardedGoal(nextStats);
      completedGoalForTask = firstAward;
      setTimerGoal({ ...timerGoal, completed: true, xpAwarded: true });
    } else if (timerGoal?.type === "longTerm" && timerGoal?.id && !timerGoal.completed) {
      const firstAward = !timerGoal.xpAwarded;
      const nextLongTermGoals = updateLongTermGoal(timerGoal.id, {
        completed: true,
        xpAwarded: true,
        completedAt: timerGoal.completedAt || new Date().toISOString(),
      });
      setLongTermGoals(nextLongTermGoals);
      nextStats = firstAward ? completeGoalStats(nextStats, timerGoal, false) : celebrateAlreadyAwardedGoal(nextStats);
      completedGoalForTask = firstAward;
      setTimerGoal({ ...timerGoal, completed: true, xpAwarded: true });
    } else if (timerGoal?.date && timerGoal?.id && !timerGoal.completed) {
      const firstAward = !timerGoal.xpAwarded;
      updateGoal(timerGoal.date, timerGoal.id, {
        completed: true,
        xpAwarded: true,
        completedAt: timerGoal.completedAt || new Date().toISOString(),
      });
      nextGoals = getAllGoals();
      setGoalsByDate(nextGoals);
      nextStats = firstAward ? completeGoalStats(nextStats, timerGoal, false) : celebrateAlreadyAwardedGoal(nextStats);
      completedGoalForTask = firstAward;
      setTimerGoal({ ...timerGoal, completed: true });
    }

    const savedStats = persistStats(nextStats, nextGoals, getScheduledGoals(), getClassicGoals(), getLongTermGoals());
    if (completedGoalForTask) {
      completeDailyTask("complete-goal", savedStats, nextGoals);
    }
    const resilienceResult = recordQualifyingActivity();
    if (!resilienceResult.returnAwarded) {
      setToast(timerGoal ? `Focus finished: ${timerGoal.title} is complete` : "Focus timer complete");
    }
  }

  function claimReward() {
    const result = claimDailyReward(pandaStats, dailyRewards.lastClaimedDate);
    if (!result.reward) return;

    setDailyRewards(saveData(STORAGE_KEYS.dailyRewards, {
      lastClaimedDate: result.lastClaimedDate,
      lastReward: result.reward,
    }));
    persistStats(result.stats);
    setToast(`Daily reward: ${result.reward.label}`);
  }

  function updateSettings(updates) {
    const next = saveSettings({ ...settings, ...updates });
    setSettingsState(next);
  }

  function updateCategoryColor(category, color) {
    const next = saveCategoryColors({ ...categoryColors, [category]: color });
    setCategoryColors(next);
  }

  function resetCategoryColors() {
    const next = saveCategoryColors(DEFAULT_CATEGORY_COLORS);
    setCategoryColors(next);
    setToast("Category colors reset");
  }

  function equipOutfit(outfitId) {
    setEquippedOutfit(saveData(STORAGE_KEYS.equippedOutfit, normalizeOutfitId(outfitId)));
  }

  function resetAppData() {
    resetAllData();
    setGoalsByDate({});
    setClassicGoals([]);
    setLongTermGoals([]);
    setJournalEntries({});
    setPandaStats(getPandaStats());
    setUnlockedOutfits([]);
    setUnlockedDecorations([]);
    setUnlockedAchievements([]);
    setScheduledGoals([]);
    setCategoryColors(getCategoryColors());
    setDailyRewards({ lastClaimedDate: "", lastReward: null });
    setDailyTasks(saveData(STORAGE_KEYS.dailyTasks, getDailyTaskStateForDate(null, todayKey())));
    setEquippedOutfit(NO_OUTFIT_ID);
    setToast("Local panda data reset");
  }

  const value = useMemo(
    () => ({
      activePage,
      addClassicGoal,
      addGoal,
      addLongTermGoal,
      addScheduledGoal,
      authSession,
      categoryColors,
      canClaimReward: canClaimDailyReward(dailyRewards.lastClaimedDate),
      claimReward,
      completeScheduledGoal,
      completeMinimumWin,
      clearToast: () => setToast(""),
      currentMonth,
      dailyRewards,
      dailyTasks,
      classicGoals,
      editClassicGoal,
      editGoal,
      editLongTermGoal,
      editScheduledGoal,
      equipOutfit,
      equippedOutfit,
      finishFocusTimer,
      goalsByDate,
      journalEntries,
      longTermGoals,
      pandaStats,
      planningTab,
      removeClassicGoal,
      removeGoal,
      removeJournalEntry,
      removeLongTermGoal,
      resetAppData,
      resetCategoryColors,
      resilienceState,
      logout: onLogout,
      removeScheduledGoal,
      saveJournalEntry,
      setFocusTimerFromCoach,
      addSuggestedDailyGoals,
      saveGoalMinimumWin,
      scheduledGoals,
      selectedDate,
      setActivePage: navigatePage,
      setCurrentMonth,
      setPlanningTab,
      setSelectedDate,
      setTimerGoal,
      settings,
      syncStatus,
      startFocus,
      timerGoal,
      toast,
      toggleClassicGoal,
      toggleGoal,
      toggleLongTermGoal,
      toggleScheduledGoal,
      unlockedAchievements,
      unlockedDecorations,
      unlockedOutfits,
      updateCategoryColor,
      updateSettings,
    }),
    [
      activePage,
      authSession,
      categoryColors,
      classicGoals,
      currentMonth,
      dailyRewards,
      dailyTasks,
      equippedOutfit,
      goalsByDate,
      journalEntries,
      longTermGoals,
      pandaStats,
      planningTab,
      resilienceState,
      scheduledGoals,
      selectedDate,
      settings,
      syncStatus,
      timerGoal,
      toast,
      unlockedAchievements,
      unlockedDecorations,
      unlockedOutfits,
      onLogout,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}