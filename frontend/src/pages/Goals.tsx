import { useState } from 'react';
import { usePerformanceContext } from '@/contexts/PerformanceContext';
import { GoalCard } from '@/components/performance/GoalCard';
import { Navbar } from '@/components/layout/Navbar';
import { EmployeeSelector } from '@/components/layout/EmployeeSelector';
import { Plus, X } from 'lucide-react';
import { GOAL_TYPES } from '@/utils/constants';
import { type Goal } from '@/utils/mockData';

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal, selectedEmployeeId } = usePerformanceContext();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const [form, setForm] = useState({
    title: '', description: '', type: 'KPI' as Goal['type'],
    progress: 0, dueDate: '', status: 'On Track' as Goal['status'], employeeId: selectedEmployeeId,
  });

  const filtered = filter === 'All' ? goals : goals.filter(g => g.type === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGoal) {
      updateGoal(editingGoal.id, form);
    } else {
      addGoal({ ...form, employeeId: selectedEmployeeId });
    }
    setShowForm(false);
    setEditingGoal(null);
    setForm({ title: '', description: '', type: 'KPI', progress: 0, dueDate: '', status: 'On Track', employeeId: selectedEmployeeId });
  };

  const handleEdit = (goal: Goal) => {
    setForm({ title: goal.title, description: goal.description, type: goal.type, progress: goal.progress, dueDate: goal.dueDate, status: goal.status, employeeId: goal.employeeId });
    setEditingGoal(goal);
    setShowForm(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar title="Goals" subtitle="Track and manage performance objectives" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap items-center">
            {['All', ...GOAL_TYPES].map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {t}
              </button>
            ))}
            <div className="h-5 w-px bg-border" />
            <EmployeeSelector />
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingGoal(null); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> New Goal
          </button>
        </div>

        {showForm && (
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title mb-0">{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h3>
              <button onClick={() => { setShowForm(false); setEditingGoal(null); }} className="p-1 rounded hover:bg-muted">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="stat-label mb-1 block">Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="w-full h-9 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="md:col-span-2">
                <label className="stat-label mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full h-20 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div>
                <label className="stat-label mb-1 block">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Goal['type'] }))} className="w-full h-9 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {GOAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="stat-label mb-1 block">Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} required className="w-full h-9 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="stat-label mb-1 block">Progress: {form.progress}%</label>
                <input type="range" min={0} max={100} value={form.progress} onChange={e => setForm(f => ({ ...f, progress: parseInt(e.target.value) }))} className="w-full accent-primary" />
              </div>
              <div>
                <label className="stat-label mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Goal['status'] }))} className="w-full h-9 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {['On Track', 'At Risk', 'Behind', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(goal => (
            <GoalCard key={goal.id} goal={goal} onEdit={handleEdit} onDelete={deleteGoal} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No goals found for this filter.</div>
        )}
      </div>
    </div>
  );
}
