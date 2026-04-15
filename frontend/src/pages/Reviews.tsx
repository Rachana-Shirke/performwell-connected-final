import { useState } from 'react';
import { usePerformanceContext } from '@/contexts/PerformanceContext';
import { ReviewForm } from '@/components/performance/ReviewForm';
import { AISummaryCard } from '@/components/performance/AISummaryCard';
import { Navbar } from '@/components/layout/Navbar';
import { EmployeeSelector } from '@/components/layout/EmployeeSelector';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { getNineBoxLabel } from '@/utils/calculations';

export default function Reviews() {
  const { allReviews, employees, goals, feedbackEntries, selectedEmployee } = usePerformanceContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNewReview, setShowNewReview] = useState(false);

  const nineBoxLabels = [
    ['Enigma', 'High Potential', 'Star'],
    ['Up or Out', 'Core Player', 'High Performer'],
    ['Underperformer', 'Effective', 'Solid Performer'],
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar title="Performance Reviews" subtitle="Manage reviews and ratings" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex justify-end">
          <EmployeeSelector />
        </div>

        {/* 9-Box Grid */}
        <div className="metric-card">
          <h2 className="section-title">9-Box Grid</h2>
          <div className="grid grid-cols-3 gap-1 max-w-lg">
            {nineBoxLabels.map((row, ri) =>
              row.map((label, ci) => {
                const emps = employees.filter(
                  e => e.nineBoxPosition.potential === (3 - ri) && e.nineBoxPosition.performance === (ci + 1)
                );
                return (
                  <div
                    key={`${ri}-${ci}`}
                    className={`p-3 rounded-lg border text-center min-h-[80px] ${
                      emps.length > 0 ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
                    }`}
                  >
                    <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
                    {emps.map(e => (
                      <span key={e.id} className="inline-block bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded mr-1 mb-1">
                        {e.avatar}
                      </span>
                    ))}
                  </div>
                );
              })
            )}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2 max-w-lg">
            <span>← Low Performance</span>
            <span>High Performance →</span>
          </div>
        </div>

        {/* AI Summary for selected employee */}
        <AISummaryCard
          employee={selectedEmployee}
          goals={goals}
          reviews={allReviews.filter(r => r.employeeId === selectedEmployee.id)}
          feedback={feedbackEntries}
        />

        {/* Reviews List */}
        <div className="flex items-center justify-between">
          <h2 className="section-title mb-0">All Reviews</h2>
          <button
            onClick={() => setShowNewReview(s => !s)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {showNewReview ? 'Cancel' : 'New Review'}
          </button>
        </div>

        {showNewReview && (
          <div className="metric-card max-w-xl">
            <h3 className="section-title">Write a Review</h3>
            <ReviewForm onSubmit={() => setShowNewReview(false)} />
          </div>
        )}

        <div className="space-y-3">
          {allReviews.map(r => {
            const employee = employees.find(e => e.id === r.employeeId);
            const reviewer = employees.find(e => e.id === r.reviewerId);
            const expanded = expandedId === r.id;

            return (
              <div key={r.id} className="metric-card">
                <button
                  onClick={() => setExpandedId(expanded ? null : r.id)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {employee?.avatar}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{employee?.name}</p>
                      <p className="text-xs text-muted-foreground">{r.type} Review · {r.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-warning fill-warning" />
                      <span className="text-sm font-bold text-foreground">{r.rating.toFixed(1)}</span>
                    </div>
                    <span className={r.status === 'Completed' ? 'badge-success' : r.status === 'In Progress' ? 'badge-warning' : 'badge-info'}>
                      {r.status}
                    </span>
                    {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </button>

                {expanded && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <p className="text-xs text-muted-foreground">Reviewed by: {reviewer?.name}</p>
                    <p className="text-sm text-foreground">{r.comments}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="stat-label mb-2">Strengths</p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.strengths.map(s => (
                            <span key={s} className="badge-success">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="stat-label mb-2">Areas for Improvement</p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.weaknesses.map(w => (
                            <span key={w} className="badge-warning">{w}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {employee && (
                      <p className="text-xs text-muted-foreground">
                        9-Box: {getNineBoxLabel(employee.nineBoxPosition.performance, employee.nineBoxPosition.potential)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
