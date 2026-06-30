import { createContext, useContext, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  deleteGoal,
  getAllGoals,
  getSettings,
  saveGoal,
  saveSettings,
  updateGoal,
} from "../utils/storage.js";
import { formatDate } from "../utils/dateUtils.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [goalsByDate, setGoalsByDate] = useState(() => getAllGoals());
  const [selectedDate, setSelectedDate] = useState(formatDate(dayjs()));
  const [settings, setSettingsState] = useState(() => getSettings());
  const [timerGoal, setTimerGoal] = useState(null);
  const [mascotMood, setMascotMood] = useState("sleepy");

  const addGoal = (date, goal) => {
    const saved = saveGoal(date, goal);
    setGoalsByDate(getAllGoals());
    setMascotMood("sleepy");
    return saved;
  };

  const editGoal = (date, id, updates) => {
    updateGoal(date, id, updates);
    setGoalsByDate(getAllGoals());

    if (updates.completed) {
      setMascotMood("happy");
    }
  };

  const removeGoal = (date, id) => {
    deleteGoal(date, id);
    setGoalsByDate(getAllGoals());
  };

  const updateSettings = (updates) => {
    const nextSettings = saveSettings({ ...settings, ...updates });
    setSettingsState(nextSettings);
  };

  const startFocusForGoal = (goal) => {
    setTimerGoal(goal);
    setMascotMood("strong");
  };

  const value = useMemo(
    () => ({
      goalsByDate,
      selectedDate,
      settings,
      timerGoal,
      mascotMood,
      addGoal,
      editGoal,
      removeGoal,
      setSelectedDate,
      updateSettings,
      startFocusForGoal,
      setMascotMood,
      setTimerGoal,
    }),
    [goalsByDate, mascotMood, selectedDate, settings, timerGoal]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
