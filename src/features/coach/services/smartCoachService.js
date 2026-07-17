function asList(value) {
  return Array.isArray(value) ? value : [];
}

export function normalizeTitle(value = "") {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function cleanTitle(goal) {
  return goal?.title?.trim() || "your goal";
}

function cleanText(value = "") {
  return typeof value === "string" ? value.trim() : "";
}

function incompleteGoals(goals) {
  return asList(goals).filter((goal) => goal?.id && !goal?.completed);
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
  { id: "stuck", label: "I'm stuck" },
  { id: "encourage", label: "Encourage me" },
  { id: "plan-day", label: "Plan my day" },
  { id: "next-task", label: "Choose my next task" },
  { id: "focus", label: "Help me focus" },
  { id: "break-down", label: "Break down a goal" },
];

export const barrierOptions = [
  {
    id: "start",
    label: "I don't know where to start",
    description: "Panda will choose one visible first action.",
  },
  {
    id: "large",
    label: "The task feels too large",
    description: "Panda will break it into smaller daily tasks.",
  },
  {
    id: "time",
    label: "I don't have enough time",
    description: "Panda will scale the action to your time window.",
  },
  {
    id: "missing",
    label: "I'm missing something I need",
    description: "Panda will suggest an unblocker step.",
  },
  {
    id: "rough",
    label: "I'm worried it won't be good enough",
    description: "Panda will suggest a rough-version step.",
  },
];

export const timeOptions = [5, 10, 15, 25];

const capacityProfiles = {
  energized: {
    label: "Energized",
    focusMinutes: 35,
    breakdownCount: 5,
    note: "Since today is marked Energized, Panda chose a fuller starting step.",
  },
  okay: {
    label: "Okay",
    focusMinutes: 25,
    breakdownCount: 4,
    note: "Panda used a balanced plan for today.",
  },
  tired: {
    label: "Tired",
    focusMinutes: 15,
    breakdownCount: 3,
    note: "Since today is marked Tired, Panda made this a smaller starting step.",
  },
  overwhelmed: {
    label: "Overwhelmed",
    focusMinutes: 8,
    breakdownCount: 1,
    note: "Since today is marked Overwhelmed, Panda kept this to one immediate action.",
  },
};

export function getCapacityProfile(capacity) {
  return capacityProfiles[capacity] || capacityProfiles.okay;
}

function textForGoal(goal = {}) {
  return `${goal.title || ""} ${goal.description || ""} ${goal.note || ""}`.toLowerCase();
}

export function detectGoalCategory(goal = {}) {
  const text = textForGoal(goal);
  if (/slide|presentation|powerpoint|present/.test(text)) return "presentation";
  if (/essay|report|write|writing|draft|paper|paragraph|document/.test(text)) return "writing";
  if (/study|test|quiz|exam|practice|review|flashcard/.test(text)) return "study";
  if (/clean|organize|room|desk|closet|laundry|declutter/.test(text)) return "cleaning";
  if (/code|coding|website|project|app|feature|bug|github/.test(text)) return "coding";
  if (/exercise|workout|fitness|run|walk|gym|stretch/.test(text)) return "fitness";
  return "generic";
}

const firstActions = {
  presentation: ["Open the assignment instructions.", "Create the slide file and add a title.", "Write the three main sections."],
  writing: ["Create the document and write a working title.", "Write one sentence describing the main idea.", "List three points you might include."],
  study: ["Gather your notes and open the first topic.", "Write down the three topics you need to review.", "Complete one practice question."],
  cleaning: ["Choose one small surface.", "Remove five items that do not belong.", "Put one category of items away."],
  coding: ["Open the project and locate the relevant file.", "Write down the exact change that should happen.", "Build the smallest visible version first."],
  fitness: ["Put on your exercise clothes.", "Prepare your equipment.", "Complete a two-minute warm-up."],
  generic: ["Open what you need and complete the first visible step.", "Write down what finished would look like.", "Work on the goal for five minutes."],
};

const breakdownSteps = {
  presentation: ["Read the requirements", "Research the topic", "Create an outline", "Build the slides", "Review and practise"],
  writing: ["Read the instructions", "Choose the main idea", "Create an outline", "Write the first draft", "Edit and proofread"],
  study: ["Gather materials", "List important topics", "Review one topic", "Complete practice questions", "Check difficult answers"],
  cleaning: ["Choose one area", "Remove obvious clutter", "Sort remaining items", "Clean the surface", "Put everything away"],
  fitness: ["Prepare clothing or equipment", "Warm up", "Complete the main activity", "Cool down", "Record completion"],
  coding: ["Define the requested change", "Locate the relevant files", "Build the smallest working version", "Test the feature", "Fix errors and review"],
  generic: ["Define what finished means", "Gather what is needed", "Complete the first small step", "Continue the main work", "Review the result"],
};

const missingSteps = {
  presentation: ["Find the assignment instructions.", "Check the deadline or requirements.", "Write down what information is missing."],
  writing: ["Find the assignment instructions.", "Write down what information is missing.", "Ask for clarification on the requirements."],
  study: ["Gather your study materials.", "Locate the notes for the first topic.", "Write down which topic is missing."],
  cleaning: ["Gather the materials.", "Choose the one area you can access now.", "Prepare a bag or box for items that do not belong."],
  coding: ["Locate the required file.", "Request access to the shared document or repo.", "Write down what information is missing."],
  fitness: ["Prepare the required equipment.", "Charge the device if you need it.", "Choose a backup activity you can do now."],
  generic: ["Write down what information is missing.", "Gather the materials.", "Check the deadline or requirements."],
};

const roughSteps = {
  presentation: ["Make a rough slide outline without choosing colors.", "Create one plain slide for each main idea.", "Practise a rough version once."],
  writing: ["Write three imperfect ideas.", "Create an intentionally incomplete first draft.", "Write for ten minutes without editing."],
  coding: ["Build the simplest working version.", "Make the feature work before improving its design.", "Write one testable change."],
  study: ["Answer one question without checking your notes first.", "Write what you remember, then review it.", "Try one practice question imperfectly."],
  generic: ["Create a rough first version.", "Work for ten minutes without correcting anything.", "Choose progress over polish for the first step."],
};

function choose(list, index = 0) {
  if (!list.length) return "Open what you need and complete the first visible step.";
  return list[Math.abs(index) % list.length];
}

export function getIncompleteCoachGoals(context = {}) {
  const daily = incompleteGoals(context.dailyGoals).map((goal) => ({ ...goal, coachType: "classic", coachTypeLabel: "Daily goal" }));
  const longTerm = incompleteGoals(context.longTermGoals).map((goal) => ({ ...goal, coachType: "longTerm", coachTypeLabel: "Long-term goal" }));
  const today = incompleteGoals(context.todaysGoals).map((goal) => ({
    ...goal,
    coachType: "scheduled",
    coachTypeLabel: goal.goalType === "long-term" ? "Scheduled long-term goal" : "Scheduled daily goal",
  }));
  const seen = new Set();
  return [...daily, ...longTerm, ...today].filter((goal) => {
    const key = `${goal.coachType}:${goal.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function findCoachGoal(context = {}, goalRef = {}) {
  return getIncompleteCoachGoals(context).find((goal) => goal.id === goalRef.id && goal.coachType === goalRef.coachType) || null;
}

export function makeGoalRef(goal = {}) {
  return goal?.id ? { id: goal.id, coachType: goal.coachType || goal.type || "classic" } : null;
}

export function generateFirstAction(goal, capacity, suggestionIndex = 0) {
  const profile = getCapacityProfile(capacity);
  const category = detectGoalCategory(goal);
  const base = goal?.minimumWin && profile === capacityProfiles.overwhelmed
    ? goal.minimumWin
    : choose(firstActions[category] || firstActions.generic, suggestionIndex);
  return {
    title: `Start "${cleanTitle(goal)}"`,
    message: `${base} Keep the full goal unchanged for now.`,
    suggestion: base,
    focusMinutes: profile.focusMinutes,
    capacityNote: profile.note,
  };
}

export function generateBreakdown(goal, capacity) {
  const profile = getCapacityProfile(capacity);
  const category = detectGoalCategory(goal);
  const steps = (breakdownSteps[category] || breakdownSteps.generic).slice(0, profile.breakdownCount);
  return {
    title: `Smaller steps for "${cleanTitle(goal)}"`,
    message: profile.breakdownCount === 1
      ? "Panda picked the first immediate step so this stays manageable."
      : "Panda broke this into daily-goal sized steps.",
    tasks: steps.map((title) => ({ title, description: `Part of: ${cleanTitle(goal)}` })),
    capacityNote: profile.note,
  };
}

export function generateTimeAction(goal, capacity, minutes, suggestionIndex = 0) {
  const profile = getCapacityProfile(capacity);
  const category = detectGoalCategory(goal);
  const safeMinutes = [5, 10, 15, 25].includes(Number(minutes)) ? Number(minutes) : 10;
  const categoryAction = choose(firstActions[category] || firstActions.generic, suggestionIndex);
  let suggestion = categoryAction;

  if (safeMinutes === 5) suggestion = category === "generic" ? "Set up what you need and do one tiny part." : categoryAction;
  if (safeMinutes === 10) suggestion = goal?.minimumWin || categoryAction;
  if (safeMinutes === 15) suggestion = choose(breakdownSteps[category] || breakdownSteps.generic, 2) || categoryAction;
  if (safeMinutes === 25) suggestion = profile === capacityProfiles.overwhelmed ? categoryAction : choose(breakdownSteps[category] || breakdownSteps.generic, 3) || categoryAction;

  return {
    title: `${safeMinutes} minute progress`,
    message: `Here is what you can move forward in ${safeMinutes} minutes. ${suggestion}`,
    suggestion,
    focusMinutes: profile === capacityProfiles.overwhelmed ? Math.min(safeMinutes, 10) : safeMinutes,
    capacityNote: profile.note,
  };
}

export function generateMissingAction(goal, capacity, suggestionIndex = 0) {
  const category = detectGoalCategory(goal);
  const suggestion = choose(missingSteps[category] || missingSteps.generic, suggestionIndex);
  return {
    title: `Unblock "${cleanTitle(goal)}"`,
    message: suggestion,
    suggestion,
    focusMinutes: getCapacityProfile(capacity).focusMinutes,
    capacityNote: getCapacityProfile(capacity).note,
  };
}

export function generateRoughAction(goal, capacity, suggestionIndex = 0) {
  const category = detectGoalCategory(goal);
  const suggestion = choose(roughSteps[category] || roughSteps.generic, suggestionIndex);
  return {
    title: `Make a rough version`,
    message: `${suggestion} This is about progress, not polish.`,
    suggestion,
    focusMinutes: getCapacityProfile(capacity).focusMinutes,
    capacityNote: getCapacityProfile(capacity).note,
  };
}

export function getBarrierRecommendation({ barrierId, goal, capacity, minutes, suggestionIndex = 0 }) {
  if (barrierId === "large") return generateBreakdown(goal, capacity);
  if (barrierId === "time") return generateTimeAction(goal, capacity, minutes, suggestionIndex);
  if (barrierId === "missing") return generateMissingAction(goal, capacity, suggestionIndex);
  if (barrierId === "rough") return generateRoughAction(goal, capacity, suggestionIndex);
  return generateFirstAction(goal, capacity, suggestionIndex);
}

function goalListText(goals, limit) {
  return goals.slice(0, limit).map((goal) => `"${cleanTitle(goal)}"`).join(", ");
}

export function getSmartCoachResponse(actionId, context = {}) {
  const capacity = context.capacity || "okay";
  const profile = getCapacityProfile(capacity);
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
          ? `${profile.label === "Overwhelmed" ? "One small step is enough: " : "Start with "}"${cleanTitle(nextAny)}". Panda is counting progress, not perfection.`
          : "You have no unfinished goals right now. Enjoy the clear space, then add one small goal when you are ready.",
      };

    case "plan-day": {
      const planGoals = [...todaysGoals, ...dailyGoals];
      if (planGoals.length === 0) {
        return {
          title: "Let's make today's plan.",
          message: "Add a daily goal first so I can plan your day.",
        };
      }
      if (profile.label === "Overwhelmed") {
        const goal = nextToday || planGoals[0];
        return {
          title: "One-step plan for today",
          message: goal.minimumWin
            ? `Begin with the Minimum Win for "${cleanTitle(goal)}": ${goal.minimumWin}`
            : `Begin with "${cleanTitle(goal)}" for about ${profile.focusMinutes} minutes.`,
        };
      }
      if (profile.label === "Tired") {
        return {
          title: "A lighter plan for today",
          message: `Make "${cleanTitle(planGoals[0])}" the important task. ${planGoals[1] ? `Keep "${cleanTitle(planGoals[1])}" optional.` : "Everything else can wait."}`,
        };
      }
      if (profile.label === "Energized") {
        return {
          title: "A strong plan for today",
          message: `Start with ${nextToday ? `"${cleanTitle(nextToday)}" at ${nextToday.startTime || "your next open time"}` : `"${cleanTitle(planGoals[0])}"`}. ${planGoals[1] ? `If you still have energy, add "${cleanTitle(planGoals[1])}" as a bonus.` : "Use leftover energy to review your progress."}`,
        };
      }
      return {
        title: "A balanced plan for today",
        message: `Try ${goalListText(planGoals, 3)}. Keep the first task small enough to start calmly.`,
      };
    }

    case "next-task":
      if (!nextAny) {
        return {
          title: "Nothing is waiting on you.",
          message: "You have no unfinished goals right now.",
        };
      }
      return {
        title: "Your next task",
        message: profile.label === "Overwhelmed" && nextAny.minimumWin
          ? `Choose the Minimum Win for "${cleanTitle(nextAny)}": ${nextAny.minimumWin}`
          : `Choose "${cleanTitle(nextAny)}" next. Try about ${profile.focusMinutes} minutes and only worry about starting.`,
      };

    case "focus":
      return {
        title: "Focus mode",
        message: nextAny
          ? `Put everything else aside and work on "${cleanTitle(nextAny)}" for about ${profile.focusMinutes} minutes.`
          : `Pick one tiny task first, then start the focus timer for about ${profile.focusMinutes} minutes.`,
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
        message: generateBreakdown(goalToBreakDown, capacity).tasks.map((task, index) => `Step ${index + 1}: ${task.title}`).join(". "),
      };

    default:
      return getSmartCoachResponse(matchCoachIntent(actionId), context);
  }
}

export function matchCoachIntent(input = "") {
  const text = input.toLowerCase();

  if (text.includes("stuck") || text.includes("blocked") || text.includes("hard")) return "stuck";
  if (text.includes("encourage") || text.includes("motivate") || text.includes("cheer")) return "encourage";
  if (text.includes("plan") || text.includes("schedule") || text.includes("day")) return "plan-day";
  if (text.includes("next") || text.includes("choose") || text.includes("task")) return "next-task";
  if (text.includes("focus") || text.includes("timer") || text.includes("concentrate")) return "focus";
  if (text.includes("break") || text.includes("steps") || text.includes("smaller")) return "break-down";

  return "encourage";
}