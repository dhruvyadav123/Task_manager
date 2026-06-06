import {
  CheckCircle2,
  Circle,
  FileText,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const INITIAL_FORM = { title: "", description: "", status: "pending" };

export default function TaskModal({ open, task, onClose, onSubmit, submitting = false }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({ title: "", description: "" });
  const titleInputRef = useRef(null);
  const editing = Boolean(task?._id);

  useEffect(() => {
    if (!open) return;
    setForm({ title: task?.title || "", description: task?.description || "", status: task?.status || "pending" });
    setErrors({ title: "", description: "" });
    const timer = window.setTimeout(() => titleInputRef.current?.focus(), 100);
    return () => window.clearTimeout(timer);
  }, [open, task]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === "Escape" && !submitting) onClose?.(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", handleKey); };
  }, [open, onClose, submitting]);

  if (!open) return null;

  const updateField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validateForm = () => {
    const nextErrors = { title: "", description: "" };
    const t = form.title.trim();
    const d = form.description.trim();
    if (!t) nextErrors.title = "Title is required.";
    else if (t.length < 2) nextErrors.title = "Min 2 characters.";
    else if (t.length > 120) nextErrors.title = "Max 120 characters.";
    if (d.length > 1000) nextErrors.description = "Max 1000 characters.";
    setErrors(nextErrors);
    return !nextErrors.title && !nextErrors.description;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting || !validateForm()) return;
    onSubmit?.({ title: form.title.trim(), description: form.description.trim(), status: form.status });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !submitting) onClose?.();
  };

  return (
    <div
      role="presentation"
      onMouseDown={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center overflow-y-auto bg-black/70 backdrop-blur-sm px-0 pt-10 sm:p-5"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-white/8 bg-[#13121a] shadow-2xl overflow-hidden"
      >
        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

        {/* Header */}
        <div className="relative border-b border-white/5 px-6 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-10 w-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                {editing ? <Save size={18} /> : <Plus size={18} />}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-400">
                  {editing ? "Edit Task" : "New Task"}
                </p>
                <h2 id="task-modal-title" className="mt-0.5 text-xl font-bold text-white">
                  {editing ? "Update task details" : "Create a new task"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {editing ? "Make your changes and save." : "Add details to keep work organized."}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={submitting}
              aria-label="Close"
              className="mt-0.5 h-9 w-9 rounded-xl border border-white/8 bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 transition disabled:opacity-50 shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-h-[calc(100vh-10rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto px-6 py-6 sm:px-7 space-y-5"
        >
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="task-title" className="text-sm font-semibold text-slate-200">
                Title <span className="text-red-400">*</span>
              </label>
              <span className={`text-[11px] font-medium ${form.title.length > 110 ? "text-red-400" : "text-slate-600"}`}>
                {form.title.length}/120
              </span>
            </div>
            <div className="relative">
              <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                ref={titleInputRef}
                id="task-title"
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                maxLength={120}
                disabled={submitting}
                placeholder="e.g. Complete project report"
                className={`h-11 w-full rounded-xl border bg-white/5 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed focus:ring-1 ${
                  errors.title
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                    : "border-white/8 hover:border-white/12 focus:border-violet-500/60 focus:ring-violet-500/20"
                }`}
              />
            </div>
            {errors.title && (
              <p role="alert" className="mt-1.5 text-xs text-red-400 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="task-desc" className="text-sm font-semibold text-slate-200">Description</label>
              <span className={`text-[11px] font-medium ${form.description.length > 950 ? "text-red-400" : "text-slate-600"}`}>
                {form.description.length}/1000
              </span>
            </div>
            <textarea
              id="task-desc"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              maxLength={1000}
              disabled={submitting}
              placeholder="Add helpful context about this task..."
              className={`min-h-[100px] w-full resize-y rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 leading-6 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed focus:ring-1 ${
                errors.description
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                  : "border-white/8 hover:border-white/12 focus:border-violet-500/60 focus:ring-violet-500/20"
              }`}
            />
            {errors.description && (
              <p role="alert" className="mt-1.5 text-xs text-red-400 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <p className="text-sm font-semibold text-slate-200 mb-2">Status</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: "pending",
                  label: "Pending",
                  sub: "In progress",
                  icon: Circle,
                  activeClass: "border-amber-500/40 bg-amber-500/10 ring-1 ring-amber-500/20",
                  iconActive: "bg-amber-500 text-white",
                  iconInactive: "bg-white/6 text-slate-500",
                  textActive: "text-amber-300",
                },
                {
                  value: "completed",
                  label: "Completed",
                  sub: "Done",
                  icon: CheckCircle2,
                  activeClass: "border-emerald-500/40 bg-emerald-500/10 ring-1 ring-emerald-500/20",
                  iconActive: "bg-emerald-500 text-white",
                  iconInactive: "bg-white/6 text-slate-500",
                  textActive: "text-emerald-300",
                },
              ].map(({ value, label, sub, icon: Icon, activeClass, iconActive, iconInactive, textActive }) => {
                const active = form.status === value;
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={submitting}
                    onClick={() => updateField("status", value)}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      active ? activeClass : "border-white/8 bg-white/4 hover:bg-white/6"
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center transition ${active ? iconActive : iconInactive}`}>
                      <Icon size={15} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold transition ${active ? textActive : "text-slate-300"}`}>{label}</p>
                      <p className="text-[10px] text-slate-600">{sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 border-t border-white/5 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-10 px-5 rounded-xl border border-white/8 bg-white/5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/8 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-10 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-semibold text-white transition shadow-lg shadow-violet-900/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-violet-600 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><Loader2 size={15} className="animate-spin" /> Saving...</>
              ) : editing ? (
                <><Save size={15} /> Save Changes</>
              ) : (
                <><Plus size={15} /> Create Task</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}