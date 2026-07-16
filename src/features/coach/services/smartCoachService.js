function asList(value) {
  return Array.isArray(value) ? value : [];
}

function cleanTitle(goal) {
  return goal?.title?.trim() || "your goal";
}

function incompleteGoals(goals) {
  return asList(goals).filter((goal) => !goal?.completed);
}

function firstIncomplete(goals) {
  return incompleteGoals(goals)[0] || null;
}

function nextScheduledGoal(goals) {
  return incompleteGoals(goals)
    .slice()
    .sort((a, b) => (a?.startTime || "").localeCompare(b?.startTime || ""))[0] || null;
}

function allGoals(context = {}) {
  return [
    ...asList(context.todaysGoals),
    ...asList(context.dailyGoals),
    ...asList(context.longTermGoals),
  ];
}

export const coachActions = [
  { id: "encourage", label: "Encourage me" },
  { id: "plan-day", label: "Plan my day" },
  { id: "next-task", label: "Choose my next task" },
  { id: "focus", label: "Help me focus" },
  { id: "break-down", label: "Break down a goal" },
];

export function getSmartCoachResponse(actionId, context = {}) {
  const dailyGoals = incompleteGoals(context.dailyGoals);
  const longTermGoals = incompleteGoals(context.longTermGoals);
  const todaysGoals = incompleteGoals(context.todaysGoals);
  const availableGoals = allGoals({ dailyGoals, longTermGoals, todaysGoals });
  const nextToday = nextScheduledGoal(todaysGoals);
  const nextAny = firstIncomplete(availableGoals);
  const goalToBreakDown = firstIncomplete([...longTermGoals, ...dailyGoals, ...todaysGoals]);

  switch (actionId) {
    case "encourage":
      return {
        title: "You are doing better than you think.",
        message: nextAny
          ? `Start with "${cleanTitle(nextAny)}" and keep it tiny. One calm step still counts.`
          : "You have no unfinished goals right now. Enjoy the clear space, then add one small goal when you are ready.",
      };

    case "plan-day":
      if (todaysGoals.length === 0 && dailyGoals.length === 0) {
        return {
          title: "Let's make today's plan.",
          message: "Add a daily goal first so I can plan your day.",
        };
      }

      return {
        title: "A gentle plan for today",
        message: nextToday
          ? `Begin with "${cleanTitle(nextToday)}" at ${nextToday.startTime || "your next open time"}, then take a short reset before the next task.`
          : `Pick "${cleanTitle(dailyGoals[0] || todaysGoals[0])}" as your first win, then check in with your panda.`,
      };

    case "next-task":
      if (!nextAny) {
        return {
          title: "Nothing is waiting on you.",
          message: "You have no unfinished goals right now.",
        };
      }

      return {
        title: "Your next task",
        message: `Choose "${cleanTitle(nextAny)}" next. Set a 10 minute timer and only worry about starting.`,
      };

    case "focus":
      return {
        title: "Focus mode",
        message: nextAny
          ? `Put everything else aside and work on "${cleanTitle(nextAny)}" for one timer session.`
          : "Pick one tiny task first, then start the focus timer for a short session.",
      };

    case "break-down":
      if (!goalToBreakDown) {
        return {
          title: "I need a goal to break down.",
          message: "Add a goal first so I can break it into steps.",
        };
      }

      return {
        title: `Break down "${cleanTitle(goalToBreakDown)}"`,
        message: "Step 1: write the very next action. Step 2: do it for 10 minutes. Step 3: mark progress and choose the next small piece.",
      };

    default:
      return getSmartCoachResponse(matchCoachIntent(actionId), context);
  }
}

export function matchCoachIntent(input = "") {
  const text = input.toLowerCase();

  if (text.includes("encourage") || text.includes("motivate") || text.includes("cheer")) return "encourage";
  if (text.includes("plan") || text.includes("schedule") || text.includes("day")) return "plan-day";
  if (text.includes("next") || text.includes("choose") || text.includes("task")) return "next-task";
  if (text.includes("focus") || text.includes("timer") || text.includes("concentrate")) return "focus";
  if (text.includes("break") || text.includes("steps") || text.includes("smaller")) return "break-down";

  return "encourage";
}
