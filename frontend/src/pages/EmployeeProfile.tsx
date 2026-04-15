import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { usePerformanceContext } from '@/contexts/PerformanceContext';
import { Navbar } from '@/components/layout/Navbar';
import { AISummaryCard } from '@/components/performance/AISummaryCard';
import { RadarChartComponent } from '@/components/charts/RadarChartComponent';
import { LineChartComponent } from '@/components/charts/LineChartComponent';
import { getNineBoxLabel } from '@/utils/calculations';
import { Mail, Calendar, Building, Briefcase, Star, Target, ClipboardCheck } from 'lucide-react';

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedEmployee, setSelectedEmployeeId, goals, reviews, feedbackEntries, employees } = usePerformanceContext();

  // Sync URL param to context
  useEffect(() => {
    if (id && id !== selectedEmployee.id) {
      const exists = employees.find(e => e.id === id);
      if (exists) {
        setSelectedEmployeeId(id);
      } else {
        navigate('/profile/e1', { replace: true });
      }
    }
  }, [id]);

  const employee = selectedEmployee;

  const avgFeedback = feedbackEntries.length > 0
    ? (feedbackEntries.reduce((s, f) => s + f.rating, 0) / feedbackEntries.length).toFixed(1)
    : '—';

  const radarData = (() => {
    const cats: Record<string, number[]> = {};
    feedbackEntries.forEach(f => f.categories.forEach(c => {
      if (!cats[c.name]) cats[c.name] = [];
      cats[c.name].push(c.score);
    }));
    return Object.entries(cats).map(([name, scores]) => ({
      subject: name,
      value: scores.reduce((a, b) => a + b, 0) / scores.length,
      fullMark: 5,
    }));
  })();

  const trendData = [
    { month: 'Jan', score: employee.performanceScore - 0.5 },
    { month: 'Feb', score: employee.performanceScore - 0.3 },
    { month: 'Mar', score: employee.performanceScore },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar title="Employee Profile" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Profile Header */}
        <div className="metric-card flex flex-col sm:flex-row items-start gap-6">
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold font-heading shrink-0">
            {employee.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground font-heading">{employee.name}</h2>
            <p className="text-sm text-muted-foreground mb-3">{employee.role}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" /> <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="h-4 w-4" /> {employee.department}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" /> Joined {employee.joinDate}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" /> {getNineBoxLabel(employee.nineBoxPosition.performance, employee.nineBoxPosition.potential)}
              </div>
            </div>
          </div>
          <div className="text-center sm:text-right shrink-0">
            <p className="stat-label mb-1">Performance</p>
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-warning fill-warning" />
              <span className="text-2xl font-bold text-foreground font-heading">{employee.performanceScore.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="metric-card text-center">
            <Target className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="stat-value">{goals.length}</p>
            <p className="stat-label">Goals</p>
          </div>
          <div className="metric-card text-center">
            <ClipboardCheck className="h-5 w-5 text-accent mx-auto mb-2" />
            <p className="stat-value">{reviews.length}</p>
            <p className="stat-label">Reviews</p>
          </div>
          <div className="metric-card text-center">
            <Star className="h-5 w-5 text-warning mx-auto mb-2" />
            <p className="stat-value">{avgFeedback}</p>
            <p className="stat-label">360° Score</p>
          </div>
          <div className="metric-card text-center">
            <Target className="h-5 w-5 text-success mx-auto mb-2" />
            <p className="stat-value">{goals.filter(g => g.status === 'Completed').length}</p>
            <p className="stat-label">Goals Completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="metric-card">
            <h3 className="section-title">Performance Trend</h3>
            <LineChartComponent
              data={trendData}
              xKey="month"
              lines={[{ key: 'score', color: 'hsl(var(--primary))', name: 'Score' }]}
              height={250}
            />
          </div>

          {radarData.length > 0 && (
            <div className="metric-card">
              <h3 className="section-title">Competency Profile</h3>
              <RadarChartComponent data={radarData} height={250} />
            </div>
          )}
        </div>

        {/* AI Summary */}
        <AISummaryCard
          employee={employee}
          goals={goals}
          reviews={reviews}
          feedback={feedbackEntries}
        />

        {/* Goals */}
        <div>
          <h3 className="section-title">Goals</h3>
          <div className="space-y-2">
            {goals.map(g => (
              <div key={g.id} className="metric-card flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-medium text-foreground truncate">{g.title}</p>
                  <p className="text-xs text-muted-foreground">{g.type} · Due {g.dueDate}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${g.progress >= 80 ? 'bg-success' : g.progress >= 50 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${g.progress}%` }} />
                  </div>
                  <span className="text-xs font-medium text-foreground w-8 text-right">{g.progress}%</span>
                </div>
              </div>
            ))}
            {goals.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No goals for this employee.</p>}
          </div>
        </div>

        {/* Review History */}
        <div>
          <h3 className="section-title">Review History</h3>
          <div className="space-y-2">
            {reviews.map(r => (
              <div key={r.id} className="metric-card flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.type} Review — {r.period}</p>
                  <p className="text-xs text-muted-foreground">{r.comments.slice(0, 80)}...</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  <span className="text-sm font-bold text-foreground">{r.rating.toFixed(1)}</span>
                  <span className={r.status === 'Completed' ? 'badge-success' : 'badge-warning'}>{r.status}</span>
                </div>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No reviews for this employee.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
