export const NO_OUTFIT_ID = "";

export const outfits = [
  {
    id: "cozy-scarf",
    name: "Cozy scarf",
    icon: "🧣",
    condition: "Complete 5 goals",
    requirement: { type: "completedGoals", value: 5 },
  },
  {
    id: "study-glasses",
    name: "Study glasses",
    icon: "👓",
    condition: "Reach level 3",
    requirement: { type: "level", value: 3 },
  },
  {
    id: "raincoat",
    name: "Raincoat",
    icon: "🧥",
    condition: "Maintain a 3-day streak",
    requirement: { type: "streak", value: 3 },
  },
  {
    id: "star-pajamas",
    name: "Star pajamas",
    icon: "🌙",
    condition: "Journal 5 days",
    requirement: { type: "journalDays", value: 5 },
  },
  {
    id: "bamboo-hoodie",
    name: "Bamboo hoodie",
    icon: "🎋",
    condition: "Complete 10 focus timers",
    requirement: { type: "focusTimers", value: 10 },
  },
  {
    id: "winter-hat",
    name: "Winter hat",
    icon: "🧢",
    condition: "Reach level 5",
    requirement: { type: "level", value: 5 },
  },
];

export function normalizeOutfitId(outfitId) {
  return outfits.some((outfit) => outfit.id === outfitId) ? outfitId : NO_OUTFIT_ID;
}
