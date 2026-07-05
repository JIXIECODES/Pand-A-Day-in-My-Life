import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../app/AppProvider.jsx";
import DaySchedule from "./DaySchedule.jsx";
import GoalBlockForm from "./GoalBlockForm.jsx";

export default function DayPlannerModal({ onClose, open }) {
  const { selectedDate } = useAppContext();
  const [editingGoal, setEditingGoal] = useState(null);

  useEffect(() => {
    if (!open) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  useEffect(() => {
    if (!open) setEditingGoal(null);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-white/35 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <section
        className="animate-modal-in my-6 max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-2xl shadow-zinc-200/70"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-emerald-50 p-5">
          <div>
            <p className="text-xs font-black uppercase text-pink-500">Daily planner</p>
            <h2 className="text-2xl font-black text-zinc-950">{dayjs(selectedDate).format("dddd, MMMM D")}</h2>
          </div>
          <button className="grid size-10 place-items-center rounded-full bg-emerald-50 font-black text-zinc-700" onClick={onClose} type="button">
            X
          </button>
        </div>

        <div className="grid max-h-[78vh] gap-5 overflow-y-auto p-5 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="min-w-0">
            <DaySchedule date={selectedDate} onEditGoal={setEditingGoal} showForm={false} />
          </div>
          <aside className="min-w-0">
            <GoalBlockForm date={selectedDate} editingGoal={editingGoal} onDone={() => setEditingGoal(null)} />
          </aside>
        </div>
      </section>
    </div>
  );
}
