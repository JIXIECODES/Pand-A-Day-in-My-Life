import React from "react";
import CalendarPage from "../features/calendar/pages/CalendarPage.jsx";
import Home from "../features/home/pages/Home.jsx";
import JournalPage from "../features/journal/pages/JournalPage.jsx";
import PandaPage from "../features/panda/pages/PandaPage.jsx";
import RewardsPage from "../features/rewards/pages/RewardsPage.jsx";
import Settings from "../features/settings/pages/Settings.jsx";

export const routes = {
  home: <Home />,
  calendar: <CalendarPage />,
  panda: <PandaPage />,
  journal: <JournalPage />,
  rewards: <RewardsPage />,
  settings: <Settings />,
};
