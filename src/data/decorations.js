export const decorations = [
  {
    id: "bamboo-plant",
    name: "Bamboo plant",
    icon: "🎍",
    condition: "Complete 3 goals",
    requirement: { type: "completedGoals", value: 3 },
  },
  {
    id: "cozy-lamp",
    name: "Cozy lamp",
    icon: "🛋️",
    condition: "Claim a daily reward",
    requirement: { type: "dailyRewards", value: 1 },
  },
  {
    id: "bookshelf",
    name: "Bookshelf",
    icon: "📚",
    condition: "Complete 3 medium or hard goals",
    requirement: { type: "deepGoals", value: 3 },
  },
  {
    id: "cloud-rug",
    name: "Cloud rug",
    icon: "☁️",
    condition: "Journal 3 days",
    requirement: { type: "journalDays", value: 3 },
  },
  {
    id: "star-wallpaper",
    name: "Star wallpaper",
    icon: "🌟",
    condition: "Reach level 4",
    requirement: { type: "level", value: 4 },
  },
  {
    id: "seasonal-window",
    name: "Seasonal window",
    icon: "🪟",
    condition: "Maintain a 5-day streak",
    requirement: { type: "streak", value: 5 },
  },
];
