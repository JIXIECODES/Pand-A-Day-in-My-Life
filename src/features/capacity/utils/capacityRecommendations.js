export const capacityOptions = [
  {
    id: "energized",
    label: "Energized",
    description: "I have room for a challenge.",
    shortLabel: "Challenge day",
    message: "You have room for a challenge today. Panda suggests starting with one important goal.",
  },
  {
    id: "okay",
    label: "Okay",
    description: "I can manage a balanced plan.",
    shortLabel: "Balanced day",
    message: "A balanced plan sounds right today. Try choosing up to three meaningful goals.",
  },
  {
    id: "tired",
    label: "Tired",
    description: "I need a lighter plan.",
    shortLabel: "Lighter day",
    message: "A lighter plan still counts. Start with one important goal and keep the rest optional.",
  },
  {
    id: "overwhelmed",
    label: "Overwhelmed",
    description: "I need one small step.",
    shortLabel: "One-step day",
    message: "One small step is enough to begin. Panda will help keep today manageable.",
  },
];

export function getCapacityOption(capacity) {
  return capacityOptions.find((option) => option.id === capacity) || null;
}

export function getCapacityMessage(capacity) {
  return getCapacityOption(capacity)?.message || "Choose a capacity when you want Panda to shape today's recommendation.";
}

export function getGoalEmphasis(goal, index, capacity) {
  if (!goal || goal.completed || !capacity) return null;

  if (capacity === "energized") {
    if (index === 0) return { label: "Recommended first", tone: "emerald" };
    if (index === 1) return { label: "Bonus", tone: "pink" };
  }

  if (capacity === "okay" && index < 3) {
    return { label: `Balanced pick ${index + 1}`, tone: "emerald" };
  }

  if (capacity === "tired") {
    if (index === 0) return { label: "Start here", tone: "emerald" };
    if (index === 1) return { label: "Optional", tone: "amber" };
  }

  if (capacity === "overwhelmed" && index === 0) {
    return { label: "One small step", tone: "emerald" };
  }

  return null;
}

export function splitGoalsForCapacity(goals = [], capacity = "") {
  const safeGoals = Array.isArray(goals) ? goals : [];
  const incompleteGoals = safeGoals.filter((goal) => !goal.completed);

  if (capacity !== "overwhelmed" || incompleteGoals.length <= 1) {
    return {
      visibleGoals: safeGoals,
      laterGoals: [],
    };
  }

  const firstIncompleteId = incompleteGoals[0].id;
  return {
    visibleGoals: safeGoals.filter((goal) => goal.completed || goal.id === firstIncompleteId),
    laterGoals: safeGoals.filter((goal) => !goal.completed && goal.id !== firstIncompleteId),
  };
}
