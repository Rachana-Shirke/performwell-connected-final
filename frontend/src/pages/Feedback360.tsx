import { useMemo } from 'react';
import { usePerformanceContext } from '@/contexts/PerformanceContext';
import { FeedbackCard } from '@/components/performance/FeedbackCard';
import { RadarChartComponent } from '@/components/charts/RadarChartComponent';
import { Navbar } from '@/components/layout/Navbar';
import { EmployeeSelector } from '@/components/layout/EmployeeSelector';
import { Star } from 'lucide-react';

export default function Feedback360() {
  const { feedbackEntries, selectedEmployee } = usePerformanceContext();

  const avgRating = feedbackEntries.length > 0
    ? (feedbackEntries.reduce((sum, f) => sum + f.rating, 0) / feedbackEntries.length).toFixed(1)
    : '—';

  const radarData = useMemo(() => {
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
  }, [feedbackEntries]);

  const byType = {
    Peer: feedbackEntries.filter(f => f.type === 'Peer'),
    Manager: feedbackEntries.filter(f => f.type === 'Manager'),
    'Direct Report': feedbackEntries.filter(f => f.type === 'Direct Report'),
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar title="360° Feedback" subtitle={`Feedback for ${selectedEmployee.name}`} />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex justify-end">
          <EmployeeSelector />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="metric-card text-center">
            <p className="stat-label mb-2">Overall 360° Score</p>
            <div className="flex items-center justify-center gap-2">
              <Star className="h-6 w-6 text-warning fill-warning" />
              <span className="text-3xl font-bold text-foreground font-heading">{avgRating}</span>
              <span className="text-lg text-muted-foreground">/5</span>
            </div>
          </div>
          <div className="metric-card text-center">
            <p className="stat-label mb-2">Total Reviews</p>
            <p className="text-3xl font-bold text-foreground font-heading">{feedbackEntries.length}</p>
          </div>
          <div className="metric-card text-center">
            <p className="stat-label mb-2">Review Sources</p>
            <div className="flex justify-center gap-3 mt-1">
              {Object.entries(byType).map(([type, entries]) => (
                <div key={type}>
                  <p className="text-lg font-bold text-foreground">{entries.length}</p>
                  <p className="text-xs text-muted-foreground">{type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="metric-card">
            <h2 className="section-title">Competency Radar</h2>
            <RadarChartComponent data={radarData} height={280} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="section-title">All Feedback</h2>
            {feedbackEntries.map(f => (
              <FeedbackCard key={f.id} feedback={f} />
            ))}
            {feedbackEntries.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No feedback entries for this employee.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
