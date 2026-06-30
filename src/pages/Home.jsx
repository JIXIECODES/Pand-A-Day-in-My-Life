import { useMemo, useState } from "react";
import Calendar from "../components/Calendar.jsx";
import GoalModal from "../components/GoalModal.jsx";
import Navbar from "../components/Navbar.jsx";
import PandaMascot from "../components/PandaMascot.jsx";
import Timer from "../components/Timer.jsx";
import Settings from "./Settings.jsx";
import { useAppContext } from "../context/AppContext.jsx";

export default function Home() {
  const { goalsByDate, mascotMood } = useAppContext();
  const [page, setPage] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const streak = useMemo(() => {
    return Object.values(goalsByDate).filter((goals) =>
      goals.some((goal) => goal.completed)
    ).length;
  }, [goalsByDate]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff5e8,transparent_28rem),linear-gradient(135deg,#fff8ef,#f7eadf_50%,#e8f7f0)]">
      <Navbar currentPage={page} onNavigate={setPage} />

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0">
          {page === "home" ? (
            <Calendar onOpenDay={() => setIsModalOpen(true)} />
          ) : (
            <Settings />
          )}
        </div>

        <aside className="space-y-5">
          <PandaMascot mood={mascotMood} />
          <Timer />
          <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <p className="text-xs font-black uppercase tracking-wide text-rose-500">
              Streak
            </p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-5xl font-black text-stone-900">
                {streak}
              </span>
              <span className="pb-2 text-sm font-black text-stone-500">
                productive days
              </span>
            </div>
          </section>
        </aside>
      </main>

      <GoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
