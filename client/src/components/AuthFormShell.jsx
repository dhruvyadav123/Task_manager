import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TaskModal({ open, task, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({ title: task?.title || '', description: task?.description || '', status: task?.status || 'pending' });
    setError('');
  }, [task, open]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    if (form.title.trim().length < 2) { setError('Title must contain at least 2 characters'); return; }
    onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="w-full max-w-lg rounded-[1.75rem] bg-white p-6 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-indigo-600">{task ? 'Update task' : 'New task'}</p><h2 className="mt-1 text-2xl font-extrabold">{task ? 'Edit task details' : 'Create a task'}</h2></div><button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button></div>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <label className="block"><span className="mb-2 block text-sm font-semibold">Title</span><input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={120} placeholder="e.g. Complete internship assignment" />{error && <p className="mt-2 text-xs text-rose-600">{error}</p>}</label>
          <label className="block"><span className="mb-2 block text-sm font-semibold">Description</span><textarea className="input-field min-h-32 resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={1000} placeholder="Add useful details..." /></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold">Status</span><select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="pending">Pending</option><option value="completed">Completed</option></select></label>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="btn-secondary">Cancel</button><button disabled={submitting} className="btn-primary">{submitting ? 'Saving...' : task ? 'Save changes' : 'Create task'}</button></div>
        </form>
      </div>
    </div>
  );
}
