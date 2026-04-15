import { usePerformanceContext } from '@/contexts/PerformanceContext';
import { MetricCard } from '@/components/performance/MetricCard';
import { LineChartComponent } from '@/components/charts/LineChartComponent';
import { Navbar } from '@/components/layout/Navbar';
import { EmployeeSelector } from '@/components/layout/EmployeeSelector';
import { getNineBoxLabel } from '@/utils/calculations';
import { Star, Target, ClipboardCheck, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { selectedEmployee, goals, reviews, metrics } = usePerformanceContext();
  const upcomingReviews = reviews.filter(r => r.status !== 'Completed');
  const topMetrics = metrics.slice(0, 8);

  const trendData = [
    { month: 'Jan', score: selectedEmployee.performanceScore - 0.5, engagement: 7.6 },
    { month: 'Feb', score: selectedEmployee.performanceScore - 0.3, engagement: 7.9 },
    { month: 'Mar', score: selectedEmployee.performanceScore, engagement: 8.2 },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar title="Dashboard" subtitle={`Welcome back, ${selectedEmployee.name}`} />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex justify-end">
          <EmployeeSelector />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="metric-card flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Performance Score</p>
              <p className="stat-value">{selectedEmployee.performanceScore.toFixed(1)}<span className="text-sm text-muted-foreground font-normal">/5</span></p>
            </div>
          </div>
          <div className="metric-card flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="stat-label">Active Goals</p>
              <p className="stat-value">{goals.filter(g => g.status !== 'Completed').length}</p>
            </div>
          </div>
          <div className="metric-card flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-warning/10 flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Pending Reviews</p>
              <p className="stat-value">{upcomingReviews.length}</p>
            </div>
          </div>
          <div className="metric-card flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">9-Box Position</p>
              <p className="text-lg font-bold text-foreground font-heading">
                {getNineBoxLabel(selectedEmployee.nineBoxPosition.performance, selectedEmployee.nineBoxPosition.potential)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 metric-card">
            <h2 className="section-title">Performance Trend</h2>
            <LineChartComponent
              data={trendData}
              xKey="month"
              lines={[
                { key: 'score', color: 'hsl(var(--primary))', name: 'Performance Score' },
                { key: 'engagement', color: 'hsl(var(--accent))', name: 'Engagement' },
              ]}
              height={250}
            />
          </div>

          <div className="metric-card">
            <h2 className="section-title">Goal Progress</h2>
            <div className="space-y-3">
              {goals.slice(0, 4).map(goal => (
                <div key={goal.id} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs font-medium text-foreground truncate max-w-[70%]">{goal.title}</span>
                    <span className="text-xs font-semibold text-foreground">{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        goal.progress >= 80 ? 'bg-success' : goal.progress >= 50 ? 'bg-warning' : 'bg-destructive'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
              {goals.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No goals set</p>}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h2 className="section-title">Key Performance Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topMetrics.map(m => (
              <MetricCard
                key={m.id}
                name={m.name}
                value={m.currentValue}
                unit={m.unit}
                target={m.target}
                status={m.status}
                trend={m.trend}
              />
            ))}
          </div>
        </div>

        {/* Upcoming Reviews */}
        {upcomingReviews.length > 0 && (
          <div>
            <h2 className="section-title">Upcoming Reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upcomingReviews.map(r => (
                <div key={r.id} className="metric-card flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.type} Review — {r.period}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Reviewer: {/* reviewer name from employees */}
                    </p>
                  </div>
                  <span className={r.status === 'In Progress' ? 'badge-warning' : 'badge-info'}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
