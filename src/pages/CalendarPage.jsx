import { useState } from "react";
import Calendar from "../components/Calendar.jsx";
import GoalModal from "../components/GoalModal.jsx";

export default function CalendarPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Calendar onOpenDay={() => setModalOpen(true)} />
      <GoalModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
