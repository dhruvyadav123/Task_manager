import {
  CalendarDays,
  Check,
  Circle,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const completed = task?.status === "completed";

  const taskDate = useMemo(
    () => formatDate(task?.createdAt),
    [task?.createdAt],
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  const handleEdit = () => {
    setMenuOpen(false);
    onEdit?.(task);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete?.(task);
  };

  return (
    <article
      className={`group relative flex min-h-[245px] flex-col overflow-visible rounded-[1.5rem] border p-5 transition duration-300 sm:p-6 ${
        completed
          ? "border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70 shadow-[0_18px_45px_-30px_rgba(5,150,105,0.32)]"
          : "border-blue-100 bg-gradient-to-br from-white to-blue-50/80 shadow-[0_18px_45px_-30px_rgba(37,99,235,0.32)]"
      } hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_28px_60px_-35px_rgba(37,99,235,0.45)]`}
    >
      <div
        className={`pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-[5rem] rounded-tr-[1.5rem] ${
          completed ? "bg-emerald-100/40" : "bg-blue-100/50"
        }`}
      />

      <div className="relative flex flex-1 items-start gap-4">
        <button
          type="button"
          onClick={() => onToggle?.(task)}
          title={
            completed
              ? "Mark as pending"
              : "Mark as completed"
          }
          className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition focus:outline-none focus:ring-4 ${
            completed
              ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 focus:ring-emerald-100"
              : "border-blue-100 bg-blue-50 text-blue-500 hover:border-blue-200 hover:bg-blue-100 hover:text-blue-700 focus:ring-blue-100"
          }`}
        >
          {completed ? (
            <Check size={19} strokeWidth={3} />
          ) : (
            <Circle size={19} />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                  completed
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-blue-100 bg-blue-50 text-blue-700"
                }`}
              >
                {completed ? "Completed" : "Pending"}
              </span>

              <h3
                className={`mt-3 break-words text-base font-black leading-6 sm:text-lg ${
                  completed
                    ? "text-slate-400 line-through"
                    : "text-slate-900"
                }`}
              >
                {task?.title || "Untitled task"}
              </h3>
            </div>

            <div
              ref={menuRef}
              className="relative z-30 shrink-0"
            >
              <button
                type="button"
                onClick={() =>
                  setMenuOpen((current) => !current)
                }
                aria-label="Task actions"
                className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-white hover:text-blue-700 hover:shadow-sm"
              >
                <MoreVertical size={18} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-11 z-50 w-40 rounded-2xl border border-blue-100 bg-white p-1.5 shadow-2xl">
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Pencil size={15} />
                    Edit task
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                  >
                    <Trash2 size={15} />
                    Delete task
                  </button>
                </div>
              )}
            </div>
          </div>

          <p
            className={`mt-3 break-words text-sm font-medium leading-6 ${
              completed
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            {task?.description?.trim() ||
              "No description has been added for this task."}
          </p>
        </div>
      </div>

      <div className="relative mt-6 flex flex-col gap-3 border-t border-blue-100/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <div
            className={`grid h-7 w-7 place-items-center rounded-lg ${
              completed
                ? "bg-emerald-50 text-emerald-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            <CalendarDays size={14} />
          </div>

          <span>{taskDate}</span>
        </div>

        <button
          type="button"
          onClick={() => onToggle?.(task)}
          className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-extrabold transition ${
            completed
              ? "border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100"
              : "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100"
          }`}
        >
          <Check size={14} />

          {completed
            ? "Move to pending"
            : "Mark complete"}
        </button>
      </div>
    </article>
  );
}