export function getSeason(date = new Date()) {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

export function getSeasonTheme(season = getSeason()) {
  const themes = {
    spring: {
      name: "Spring",
      page: "from-rose-50 via-emerald-50 to-sky-50",
      room: "from-pink-100 via-green-100 to-sky-100",
      accent: "bg-pink-200 text-pink-900",
    },
    summer: {
      name: "Summer",
      page: "from-amber-50 via-lime-50 to-cyan-50",
      room: "from-yellow-100 via-lime-100 to-cyan-100",
      accent: "bg-amber-200 text-amber-950",
    },
    autumn: {
      name: "Autumn",
      page: "from-orange-50 via-rose-50 to-stone-100",
      room: "from-orange-100 via-rose-100 to-stone-200",
      accent: "bg-orange-200 text-orange-950",
    },
    winter: {
      name: "Winter",
      page: "from-sky-50 via-indigo-50 to-rose-50",
      room: "from-sky-100 via-indigo-100 to-white",
      accent: "bg-sky-200 text-sky-950",
    },
  };

  return themes[season] || themes.spring;
}
