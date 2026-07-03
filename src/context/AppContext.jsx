import dayjs from "dayjs";
import React, { createContext, useContext, useMemo, useState } from "react";
import { decorations } from "../data/decorations.js";
import { outfits } from "../data/outfits.js";
import { evaluateAchievements } from "../utils/achievementLogic.js";
import { todayKey } from "../utils/dateUtils.js";
import {
  celebrateAlreadyAwardedGoal,
  completeGoalStats,
  focusFinishedStats,
  focusStartedStats,
  journalStats,
  withMood,
} from "../utils/pandaLogic.js";
import {
  canClaimDailyReward,
  claimDailyReward,
  completeDailyMission,
  normalizeDailyMissionProgress,
} from "../utils/rewardLogic.js";
import {
  deleteGoal,
  deleteScheduledGoal,
  getAllGoals,
  getData,
  getPandaStats,
  getScheduledGoals,
  getSettings,
  resetAllData,
  saveData,
  saveGoal,
  saveScheduledGoal,
  saveSettings,
  STORAGE_KEYS,
  updateGoal,
  updateScheduledGoal,
} from "../utils/storage.js";

const AppContext = createContext(null);

function deriveStreak(goalsByDate) {
  return Object.entries(goalsByDate).filter(([, goals]) => goals.some((goal) => goal.completed)).length;
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

export function AppProvider({ authSession, children, onExitSession }) {
  const [activePage, setActivePage] = useState("home");
  const [goalsByDate, setGoalsByDate] = useState(() => getAllGoals());
  const [scheduledGoals, setScheduledGoals] = useState(() => getScheduledGoals());
  const [journalEntries, setJournalEntries] = useState(() =>
    getData(STORAGE_KEYS.journalEntries, {}),
  );
  const [pandaStats, setPandaStats] = useState(() => getPandaStats());
  const [settings, setSettingsState] = useState(() => getSettings());
  const [selectedDate, setSelectedDate] = useState(() => todayKey());
  const [currentMonth, setCurrentMonth] = useState(() => dayjs());
  const [timerGoal, setTimerGoal] = useState(null);
  const [dailyRewards, setDailyRewards] = useState(() =>
    getData(STORAGE_KEYS.dailyRewards, { lastClaimedDate: "", lastReward: null }),
  );
  const [dailyMissionProgress, setDailyMissionProgress] = useState(() =>
    normalizeDailyMissionProgress(getData(STORAGE_KEYS.dailyMissions, null)),
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
    getData(STORAGE_KEYS.equippedOutfit, ""),
  );
  const [toast, setToast] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  function showToast(message) {
    setToast(message);
  }

  function requestConfirm(action) {
    setConfirmAction(action);
  }

  function markDailyMission(missionId) {
    const result = completeDailyMission(dailyMissionProgress, missionId);
    if (!result.changed) return result.progress;
    setDailyMissionProgress(saveData(STORAGE_KEYS.dailyMissions, result.progress));
    showToast("Daily mission complete!");
    return result.progress;
  }

  function cancelConfirm() {
    setConfirmAction(null);
  }

  function confirmPendingAction() {
    const action = confirmAction;
    setConfirmAction(null);
    action?.onConfirm?.();
  }

  function persistStats(nextStats, goalsSnapshot = goalsByDate) {
    const statsWithStreak = { ...nextStats, streak: deriveStreak(goalsSnapshot) };
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
    if (newLabels.length > 0) showToast(newLabels[0]);

    return statsWithStreak;
  }

  function addGoal(date, goal) {
    const saved = saveGoal(date, goal);
    if (goal.startTime && goal.endTime) {
      saveScheduledGoal({
        title: goal.title,
        description: goal.description || "",
        note: goal.note || "",
        date,
        startTime: goal.startTime,
        endTime: goal.endTime,
        category: goal.category || "Personal",
        difficulty: goal.difficulty || "medium",
        completed: false,
        xpAwarded: false,
      });
      setScheduledGoals(getScheduledGoals());
    }
    setGoalsByDate(getAllGoals());
    persistStats(withMood(pandaStats, "idle", "New goal added"));
    markDailyMission("create-goal");
    showToast("Goal created.");
    return saved;
  }

  function editGoal(date, id, updates) {
    updateGoal(date, id, updates);
    setGoalsByDate(getAllGoals());
    showToast("Goal edited.");
  }

  function addScheduledGoal(goal) {
    const saved = saveScheduledGoal(goal);
    setScheduledGoals(getScheduledGoals());
    persistStats(withMood(pandaStats, "idle", "Scheduled goal added"));
    markDailyMission("schedule-block");
    showToast("Time block scheduled.");
    return saved;
  }

  function editScheduledGoal(id, updates) {
    setScheduledGoals(updateScheduledGoal(id, updates));
    showToast("Scheduled goal edited.");
  }

  function completeScheduledGoal(id) {
    const goal = scheduledGoals.find((item) => item.id === id);
    if (!goal) return;

    const completingForFirstTime = !goal.completed && !goal.xpAwarded;
    const nextScheduledGoals = updateScheduledGoal(id, {
      completed: !goal.completed,
      xpAwarded: goal.xpAwarded || !goal.completed,
    });
    setScheduledGoals(nextScheduledGoals);

    if (completingForFirstTime) {
      persistStats(completeGoalStats(pandaStats, { ...goal, difficulty: goal.difficulty || "medium" }, false));
      markDailyMission("complete-goal");
      showToast("Goal completed! Your panda is proud of you.");
    } else if (!goal.completed) {
      persistStats(celebrateAlreadyAwardedGoal(pandaStats));
      showToast("Goal completed! Your panda is proud of you.");
    } else {
      persistStats(withMood(pandaStats, "idle", "Scheduled goal unchecked"));
      showToast("Goal marked not complete.");
    }
  }

  function toggleScheduledGoal(id) {
    const goal = scheduledGoals.find((item) => item.id === id);
    if (!goal) return;

    if (!goal.completed) {
      requestConfirm({
        title: "Are you sure this goal is truly completed?",
        goalTitle: goal.title,
        confirmLabel: "Yes, complete it",
        cancelLabel: "Not yet",
        onConfirm: () => completeScheduledGoal(id),
      });
      return;
    }

    completeScheduledGoal(id);
  }

  function removeScheduledGoal(id) {
    const goal = scheduledGoals.find((item) => item.id === id);
    requestConfirm({
      title: "Delete this goal?",
      goalTitle: goal?.title || "Scheduled goal",
      confirmLabel: "Delete goal",
      cancelLabel: "Keep it",
      variant: "danger",
      onConfirm: () => {
        setScheduledGoals(deleteScheduledGoal(id));
        persistStats(withMood(pandaStats, "idle", "Scheduled goal removed"));
        showToast("Goal deleted.");
      },
    });
  }

  function completeGoal(date, id) {
    const goal = (goalsByDate[date] || []).find((item) => item.id === id);
    if (!goal) return;

    const completingForFirstTime = !goal.completed && !goal.xpAwarded;
    updateGoal(date, id, {
      completed: !goal.completed,
      xpAwarded: goal.xpAwarded || !goal.completed,
    });
    const nextGoals = getAllGoals();
    setGoalsByDate(nextGoals);

    if (completingForFirstTime) {
      const allDone = (nextGoals[date] || []).length > 0 && nextGoals[date].every((item) => item.completed);
      persistStats(completeGoalStats(pandaStats, goal, allDone), nextGoals);
      markDailyMission("complete-goal");
      showToast("Goal completed! Your panda is proud of you.");
    } else if (!goal.completed) {
      persistStats(celebrateAlreadyAwardedGoal(pandaStats), nextGoals);
      showToast("Goal completed! Your panda is proud of you.");
    } else {
      persistStats(withMood(pandaStats, "idle", "Goal unchecked"), nextGoals);
      showToast("Goal marked not complete.");
    }
  }

  function toggleGoal(date, id) {
    const goal = (goalsByDate[date] || []).find((item) => item.id === id);
    if (!goal) return;

    if (!goal.completed) {
      requestConfirm({
        title: "Are you sure this goal is truly completed?",
        goalTitle: goal.title,
        confirmLabel: "Yes, complete it",
        cancelLabel: "Not yet",
        onConfirm: () => completeGoal(date, id),
      });
      return;
    }

    completeGoal(date, id);
  }

  function removeGoal(date, id) {
    const goal = (goalsByDate[date] || []).find((item) => item.id === id);
    requestConfirm({
      title: "Delete this goal?",
      goalTitle: goal?.title || "Goal",
      confirmLabel: "Delete goal",
      cancelLabel: "Keep it",
      variant: "danger",
      onConfirm: () => {
        deleteGoal(date, id);
        const nextGoals = getAllGoals();
        setGoalsByDate(nextGoals);
        persistStats(withMood(pandaStats, "idle", "Goal removed"), nextGoals);
        showToast("Goal deleted.");
      },
    });
  }

  function saveJournalEntry(date, text) {
    const nextEntries = {
      ...journalEntries,
      [date]: {
        text,
        updatedAt: new Date().toISOString(),
      },
    };
    setJournalEntries(saveData(STORAGE_KEYS.journalEntries, nextEntries));
    persistStats(journalStats(pandaStats));
    markDailyMission("journal-entry");
    showToast("Journal memory saved.");
  }

  function startFocus(goal = timerGoal) {
    if (goal) setTimerGoal(goal);
    persistStats(focusStartedStats(pandaStats));
    markDailyMission("focus-session");
    showToast(goal ? `Focus timer set for "${goal.title}."` : "Focus timer started.");
  }

  function finishFocusTimer() {
    let nextGoals = goalsByDate;
    let nextStats = focusFinishedStats(pandaStats);

    if (timerGoal?.date && timerGoal?.id && !timerGoal.completed) {
      const firstAward = !timerGoal.xpAwarded;
      updateGoal(timerGoal.date, timerGoal.id, { completed: true, xpAwarded: true });
      nextGoals = getAllGoals();
      setGoalsByDate(nextGoals);
      nextStats = firstAward ? completeGoalStats(nextStats, timerGoal, false) : celebrateAlreadyAwardedGoal(nextStats);
      setTimerGoal({ ...timerGoal, completed: true });
    }

    persistStats(nextStats, nextGoals);
    showToast(timerGoal ? `Focus finished: ${timerGoal.title} is complete` : "Focus timer complete");
  }

  function claimReward() {
    const result = claimDailyReward(pandaStats, dailyMissionProgress);
    if (!result.reward) return;

    setDailyRewards(saveData(STORAGE_KEYS.dailyRewards, {
      lastClaimedDate: result.progress.date,
      lastReward: result.reward,
    }));
    setDailyMissionProgress(saveData(STORAGE_KEYS.dailyMissions, result.progress));
    persistStats(result.stats);
    showToast(`Daily reward claimed! ${result.reward.label}`);
  }

  function updateSettings(updates) {
    const next = saveSettings({ ...settings, ...updates });
    setSettingsState(next);
  }

  function equipOutfit(outfitId) {
    setEquippedOutfit(saveData(STORAGE_KEYS.equippedOutfit, outfitId));
    showToast("Outfit equipped.");
  }

  function resetAppData() {
    resetAllData();
    setGoalsByDate({});
    setJournalEntries({});
    setPandaStats(getPandaStats());
    setUnlockedOutfits([]);
    setUnlockedDecorations([]);
    setUnlockedAchievements([]);
    setScheduledGoals([]);
    setDailyRewards({ lastClaimedDate: "", lastReward: null });
    setDailyMissionProgress(normalizeDailyMissionProgress(null));
    setEquippedOutfit("");
    showToast("Local panda data reset");
  }

  const value = useMemo(
    () => ({
      activePage,
      addGoal,
      addScheduledGoal,
      authSession,
      canClaimReward: canClaimDailyReward(dailyMissionProgress),
      cancelConfirm,
      claimReward,
      clearToast: () => setToast(""),
      confirmAction,
      confirmPendingAction,
      currentMonth,
      dailyRewards,
      dailyMissionProgress,
      editGoal,
      editScheduledGoal,
      equipOutfit,
      equippedOutfit,
      finishFocusTimer,
      goalsByDate,
      journalEntries,
      markDailyMission,
      pandaStats,
      removeGoal,
      requestConfirm,
      resetAppData,
      onExitSession,
      removeScheduledGoal,
      saveJournalEntry,
      scheduledGoals,
      selectedDate,
      setActivePage,
      setCurrentMonth,
      setSelectedDate,
      setTimerGoal,
      showToast,
      settings,
      startFocus,
      timerGoal,
      toast,
      toggleGoal,
      toggleScheduledGoal,
      unlockedAchievements,
      unlockedDecorations,
      unlockedOutfits,
      updateSettings,
    }),
    [
      activePage,
      authSession,
      currentMonth,
      dailyRewards,
      dailyMissionProgress,
      equippedOutfit,
      goalsByDate,
      journalEntries,
      pandaStats,
      scheduledGoals,
      selectedDate,
      settings,
      timerGoal,
      toast,
      confirmAction,
      unlockedAchievements,
      unlockedDecorations,
      unlockedOutfits,
      onExitSession,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}
