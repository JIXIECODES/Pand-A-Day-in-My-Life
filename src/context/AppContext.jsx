import dayjs from "dayjs";
import { createContext, useContext, useMemo, useState } from "react";
import { decorations } from "../data/decorations.js";
import { outfits } from "../data/outfits.js";
import { evaluateAchievements } from "../utils/achievementLogic.js";
import { formatDate, todayKey } from "../utils/dateUtils.js";
import {
  completeGoalStats,
  focusFinishedStats,
  focusStartedStats,
  journalStats,
  withMood,
} from "../utils/pandaLogic.js";
import { canClaimDailyReward, claimDailyReward } from "../utils/rewardLogic.js";
import {
  deleteGoal,
  getAllGoals,
  getData,
  getPandaStats,
  getSettings,
  resetAllData,
  saveData,
  saveGoal,
  saveSettings,
  STORAGE_KEYS,
  updateGoal,
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

export function AppProvider({ children }) {
  const [activePage, setActivePage] = useState("home");
  const [goalsByDate, setGoalsByDate] = useState(() => getAllGoals());
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
    if (newLabels.length > 0) setToast(newLabels[0]);

    return statsWithStreak;
  }

  function addGoal(date, goal) {
    const saved = saveGoal(date, goal);
    setGoalsByDate(getAllGoals());
    persistStats(withMood(pandaStats, "idle", "New goal added"));
    return saved;
  }

  function editGoal(date, id, updates) {
    updateGoal(date, id, updates);
    setGoalsByDate(getAllGoals());
  }

  function toggleGoal(date, id) {
    const goal = (goalsByDate[date] || []).find((item) => item.id === id);
    if (!goal) return;

    updateGoal(date, id, { completed: !goal.completed });
    const nextGoals = getAllGoals();
    setGoalsByDate(nextGoals);

    if (!goal.completed) {
      const allDone = (nextGoals[date] || []).length > 0 && nextGoals[date].every((item) => item.completed);
      persistStats(completeGoalStats(pandaStats, goal, allDone), nextGoals);
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
    const nextEntries = {
      ...journalEntries,
      [date]: {
        text,
        updatedAt: new Date().toISOString(),
      },
    };
    setJournalEntries(saveData(STORAGE_KEYS.journalEntries, nextEntries));
    persistStats(journalStats(pandaStats));
  }

  function startFocus(goal = timerGoal) {
    if (goal) setTimerGoal(goal);
    persistStats(focusStartedStats(pandaStats));
  }

  function finishFocusTimer() {
    persistStats(focusFinishedStats(pandaStats));
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

  function equipOutfit(outfitId) {
    setEquippedOutfit(saveData(STORAGE_KEYS.equippedOutfit, outfitId));
  }

  function resetAppData() {
    resetAllData();
    setGoalsByDate({});
    setJournalEntries({});
    setPandaStats(getPandaStats());
    setUnlockedOutfits([]);
    setUnlockedDecorations([]);
    setUnlockedAchievements([]);
    setDailyRewards({ lastClaimedDate: "", lastReward: null });
    setEquippedOutfit("");
    setToast("Local panda data reset");
  }

  const value = useMemo(
    () => ({
      activePage,
      addGoal,
      canClaimReward: canClaimDailyReward(dailyRewards.lastClaimedDate),
      claimReward,
      clearToast: () => setToast(""),
      currentMonth,
      dailyRewards,
      editGoal,
      equipOutfit,
      equippedOutfit,
      finishFocusTimer,
      goalsByDate,
      journalEntries,
      pandaStats,
      removeGoal,
      resetAppData,
      saveJournalEntry,
      selectedDate,
      setActivePage,
      setCurrentMonth,
      setSelectedDate,
      setTimerGoal,
      settings,
      startFocus,
      timerGoal,
      toast,
      toggleGoal,
      unlockedAchievements,
      unlockedDecorations,
      unlockedOutfits,
      updateSettings,
    }),
    [
      activePage,
      currentMonth,
      dailyRewards,
      equippedOutfit,
      goalsByDate,
      journalEntries,
      pandaStats,
      selectedDate,
      settings,
      timerGoal,
      toast,
      unlockedAchievements,
      unlockedDecorations,
      unlockedOutfits,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}
