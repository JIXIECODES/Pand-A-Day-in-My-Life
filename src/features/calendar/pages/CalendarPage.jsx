import React, { useState } from "react";
import Calendar from "../components/Calendar.jsx";
import DaySchedule from "../components/DaySchedule.jsx";
import GoalModal from "../../goals/components/GoalModal.jsx";

export default function CalendarPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6">
      <Calendar onOpenDay={() => setModalOpen(false)} />
      <DaySchedule />
      <section className="rounded-[2rem] bg-white/70 p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-pink-500">Classic goals</p>
            <h2 className="text-xl font-black text-zinc-950">Add notes, deadlines, and checklist goals for the selected day.</h2>
          </div>
          <button className="rounded-full bg-zinc-950 px-5 py-3 font-black text-white" onClick={() => setModalOpen(true)} type="button">
            Open daily goals
          </button>
        </div>
      </section>
      <GoalModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
