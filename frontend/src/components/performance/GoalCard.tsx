import { type Goal } from '@/utils/mockData';
import { Target, Calendar, MoreVertical, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  'On Track': 'badge-success',
  'At Risk': 'badge-warning',
  'Behind': 'badge-destructive',
  'Completed': 'badge-info',
};

const typeColors: Record<string, string> = {
  KPI: 'bg-primary/10 text-primary',
  KRA: 'bg-accent/10 text-accent',
  OKR: 'bg-warning/10 text-warning',
  MBO: 'bg-info/10 text-info',
};

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="metric-card relative">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary shrink-0" />
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[goal.type]}`}>
            {goal.type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={statusStyles[goal.status]}>{goal.status}</span>
          <div className="relative">
            <button onClick={() => setMenuOpen(o => !o)} className="p-1 rounded hover:bg-muted">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-card border rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                <button
                  onClick={() => { onEdit?.(goal); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-muted"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => { onDelete?.(goal.id); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-destructive hover:bg-muted"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-sm text-foreground mb-1">{goal.title}</h3>
      <p className="text-xs text-muted-foreground mb-4">{goal.description}</p>

      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{goal.progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              goal.progress >= 80 ? 'bg-success' : goal.progress >= 50 ? 'bg-warning' : 'bg-destructive'
            }`}
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        <span>Due {goal.dueDate}</span>
      </div>
    </div>
  );
}
