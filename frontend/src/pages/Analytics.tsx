import { useState, useMemo } from 'react';
import { usePerformanceContext } from '@/contexts/PerformanceContext';
import { MetricCard } from '@/components/performance/MetricCard';
import { BarChartComponent } from '@/components/charts/BarChartComponent';
import { LineChartComponent } from '@/components/charts/LineChartComponent';
import { PieChartComponent } from '@/components/charts/PieChartComponent';
import { Navbar } from '@/components/layout/Navbar';
import { METRIC_CATEGORIES } from '@/utils/constants';

const periods = ['Monthly', 'Quarterly', 'Yearly'] as const;

export default function Analytics() {
  const { categoryMetrics, departmentPerformance, metrics } = usePerformanceContext();
  const [period, setPeriod] = useState<typeof periods[number]>('Monthly');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Object.values(METRIC_CATEGORIES)];

  const displayedMetrics = selectedCategory === 'All'
    ? metrics
    : metrics.filter(m => m.category === selectedCategory);

  const deptChartData = departmentPerformance.map(d => ({
    department: d.department,
    'Avg Score': d.avgScore,
    'Retention %': d.retention / 100 * 5,
  }));

  const retentionPie = departmentPerformance.map((d, i) => ({
    name: d.department,
    value: d.headcount,
    color: [
      'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))',
      'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--primary))',
    ][i],
  }));

  const trendData = useMemo(() => {
    const months = ['2026-01', '2026-02', '2026-03'];
    return months.map(m => {
      const row: any = { month: m.slice(5) === '01' ? 'Jan' : m.slice(5) === '02' ? 'Feb' : 'Mar' };
      ['task_completion_rate', 'mbo_achievement', 'engagement_score'].forEach(id => {
        const metric = metrics.find(met => met.id === id);
        const val = metric?.trend.find(t => t.month === m);
        row[metric?.name || id] = val?.value || 0;
      });
      return row;
    });
  }, [metrics]);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar title="Analytics" subtitle="HR performance metrics and insights" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            {periods.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  period === p ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="h-5 w-px bg-border" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="h-8 rounded-lg border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="metric-card">
            <h3 className="section-title">Department Performance</h3>
            <BarChartComponent
              data={deptChartData}
              xKey="department"
              bars={[
                { key: 'Avg Score', color: 'hsl(var(--primary))', name: 'Avg Score' },
                { key: 'Retention %', color: 'hsl(var(--accent))', name: 'Retention (scaled)' },
              ]}
              height={280}
            />
          </div>
          <div className="metric-card">
            <h3 className="section-title">Headcount Distribution</h3>
            <PieChartComponent data={retentionPie} height={280} />
          </div>
        </div>

        <div className="metric-card">
          <h3 className="section-title">Key Metrics Trend</h3>
          <LineChartComponent
            data={trendData}
            xKey="month"
            lines={[
              { key: 'Task Completion Rate', color: 'hsl(var(--chart-1))', name: 'Task Completion %' },
              { key: 'MBO Achievement', color: 'hsl(var(--chart-2))', name: 'MBO Achievement %' },
              { key: 'Engagement Score', color: 'hsl(var(--chart-3))', name: 'Engagement /10' },
            ]}
            height={300}
          />
        </div>

        {/* All Metrics Grid */}
        <div>
          <h2 className="section-title">
            {selectedCategory === 'All' ? 'All 26 Performance Metrics' : selectedCategory}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedMetrics.map(m => (
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
      </div>
    </div>
  );
}
