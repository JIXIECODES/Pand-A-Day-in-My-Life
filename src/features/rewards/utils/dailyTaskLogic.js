import { DAILY_TASK_POOL } from "../../../data/dailyTasks.js";
import { addXp, clampStat, withMood } from "../../panda/utils/pandaLogic.js";

export function createDailyTaskState(date) {
  return {
    date,
    tasks: DAILY_TASK_POOL.map((task) => ({ ...task, completed: false })),
    claimedTaskIds: [],
  };
}

export function getDailyTaskStateForDate(savedState, date) {
  if (!savedState || savedState.date !== date || !Array.isArray(savedState.tasks)) {
    return createDailyTaskState(date);
  }

  const taskById = new Map(savedState.tasks.map((task) => [task.id, task]));
  return {
    date,
    tasks: DAILY_TASK_POOL.map((task) => ({
      ...task,
      completed: Boolean(taskById.get(task.id)?.completed),
    })),
    claimedTaskIds: Array.isArray(savedState.claimedTaskIds) ? savedState.claimedTaskIds : [],
  };
}

export function completeDailyTaskState(state, taskId) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task || task.completed || state.claimedTaskIds.includes(taskId)) {
    return { changed: false, reward: null, state };
  }

  return {
    changed: true,
    reward: task.reward || null,
    state: {
      ...state,
      tasks: state.tasks.map((item) => (
        item.id === taskId ? { ...item, completed: true } : item
      )),
      claimedTaskIds: [...state.claimedTaskIds, taskId],
    },
  };
}

export function applyDailyTaskReward(stats, reward) {
  if (!reward) return stats;

  const next = addXp(
    {
      ...stats,
      happiness: clampStat(stats.happiness + (reward.happiness || 0)),
      energy: clampStat(stats.energy + (reward.energy || 0)),
    },
    reward.xp || 0,
  );

  return withMood(next, next.mood === "levelUp" ? "levelUp" : "happy", "Daily task completed");
}
