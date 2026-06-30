import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useAppContext } from "../context/AppContext.jsx";

const emptyForm = {
  title: "",
  description: "",
  deadline: "",
};

export default function GoalModal({ isOpen, onClose }) {
  const {
    addGoal,
    editGoal,
    goalsByDate,
    removeGoal,
    selectedDate,
    startFocusForGoal,
  } = useAppContext();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const goals = goalsByDate[selectedDate] || [];

  const completedCount = useMemo(
    () => goals.filter((goal) => goal.completed).length,
    [goals]
  );

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    if (editingId) {
      editGoal(selectedDate, editingId, {
        title: form.title.trim(),
        description: form.description.trim(),
        deadline: form.deadline,
      });
      resetForm();
      return;
    }

    const savedGoal = addGoal(selectedDate, {
      title: form.title.trim(),
      description: form.description.trim(),
      deadline: form.deadline,
    });
    resetForm();

    if (window.confirm("Start a focus timer?")) {
      startFocusForGoal(savedGoal);
    }
  };

  const startEdit = (goal) => {
    setEditingId(goal.id);
    setForm({
      title: goal.title,
      description: goal.description || "",
      deadline: goal.deadline || "",
    });
  };

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-stone-900/40 p-4 backdrop-blur-sm">
      <section className="animate-modal-in max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-[#fffdf9] p-5 shadow-2xl ring-1 ring-stone-200 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-rose-500">
              {dayjs(selectedDate).format("dddd")}
            </p>
            <h2 className="text-2xl font-black text-stone-900">
              {dayjs(selectedDate).format("MMMM D, YYYY")}
            </h2>
            <p className="text-sm font-semibold text-stone-500">
              {completedCount} of {goals.length} goals completed
            </p>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-stone-900 text-lg font-black text-white"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form
          className="grid gap-3 rounded-3xl bg-[#f7eadf] p-4"
          onSubmit={handleSubmit}
        >
          <input
            className="rounded-2xl border border-stone-200 bg-white px-4 py-3 font-bold outline-none focus:border-stone-900"
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            placeholder="Goal title"
            value={form.title}
          />
          <textarea
            className="min-h-24 rounded-2xl border border-stone-200 bg-white px-4 py-3 font-semibold outline-none focus:border-stone-900"
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            placeholder="Notes or description"
            value={form.description}
          />
          <label className="text-sm font-black text-stone-600">
            Deadline
            <input
              className="mt-1 block w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 font-semibold outline-none focus:border-stone-900"
              onChange={(event) =>
                setForm({ ...form, deadline: event.target.value })
              }
              type="datetime-local"
              value={form.deadline}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-full bg-stone-900 px-5 py-3 text-sm font-black text-white"
              type="submit"
            >
              {editingId ? "Save Changes" : "Add Goal"}
            </button>
            {editingId && (
              <button
                className="rounded-full bg-white px-5 py-3 text-sm font-black text-stone-700 ring-1 ring-stone-200"
                onClick={resetForm}
                type="button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-5 space-y-3">
          {goals.length === 0 ? (
            <p className="rounded-3xl bg-white p-5 text-center font-semibold text-stone-500 ring-1 ring-stone-200">
              No goals yet. Add one gentle task for this day.
            </p>
          ) : (
            goals.map((goal) => (
              <article
                className={`rounded-3xl bg-white p-4 shadow-sm ring-1 ring-stone-200 transition ${
                  goal.completed ? "bg-emerald-50" : ""
                }`}
                key={goal.id}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <label className="flex gap-3">
                    <input
                      checked={goal.completed}
                      className="mt-1 h-5 w-5 accent-emerald-600"
                      onChange={(event) =>
                        editGoal(selectedDate, goal.id, {
                          completed: event.target.checked,
                        })
                      }
                      type="checkbox"
                    />
                    <span>
                      <span
                        className={`block text-lg font-black text-stone-900 ${
                          goal.completed ? "line-through" : ""
                        }`}
                      >
                        {goal.title}
                      </span>
                      {goal.description && (
                        <span className="mt-1 block text-sm font-semibold text-stone-500">
                          {goal.description}
                        </span>
                      )}
                      {goal.deadline && (
                        <span className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                          Due {dayjs(goal.deadline).format("MMM D, h:mm A")}
                        </span>
                      )}
                    </span>
                  </label>
                  <div className="flex shrink-0 gap-2">
                    <button
                      className="rounded-full bg-rose-100 px-4 py-2 text-sm font-black text-rose-700"
                      onClick={() => startFocusForGoal(goal)}
                      type="button"
                    >
                      Focus
                    </button>
                    <button
                      className="rounded-full bg-[#f7eadf] px-4 py-2 text-sm font-black text-stone-700"
                      onClick={() => startEdit(goal)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-full bg-stone-100 px-4 py-2 text-sm font-black text-stone-700"
                      onClick={() => removeGoal(selectedDate, goal.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
