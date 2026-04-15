import { METRICS } from './constants';
import { metricValues, type MetricValue } from './mockData';

export function getLatestMetricValue(metricId: string): number | null {
  const values = metricValues.filter(v => v.metricId === metricId);
  if (values.length === 0) return null;
  return values.sort((a, b) => b.month.localeCompare(a.month))[0].value;
}

export function getMetricTrend(metricId: string): MetricValue[] {
  return metricValues.filter(v => v.metricId === metricId).sort((a, b) => a.month.localeCompare(b.month));
}

export function calculateMetricStatus(metricId: string): 'good' | 'warning' | 'poor' {
  const metric = METRICS.find(m => m.id === metricId);
  const value = getLatestMetricValue(metricId);
  if (!metric || value === null) return 'warning';

  const ratio = (metric as any).inverse ? metric.target / value : value / metric.target;
  if (ratio >= 0.95) return 'good';
  if (ratio >= 0.75) return 'warning';
  return 'poor';
}

export function calculateOverallScore(metricIds: string[]): number {
  let total = 0, count = 0;
  for (const id of metricIds) {
    const metric = METRICS.find(m => m.id === id);
    const value = getLatestMetricValue(id);
    if (!metric || value === null) continue;
    const ratio = (metric as any).inverse ? metric.target / value : value / metric.target;
    total += Math.min(ratio, 1.5);
    count++;
  }
  return count > 0 ? Math.round((total / count) * 100) : 0;
}

export function getNineBoxLabel(perf: number, pot: number): string {
  const labels: Record<string, string> = {
    '3-3': 'Star', '3-2': 'High Performer', '3-1': 'Solid Performer',
    '2-3': 'High Potential', '2-2': 'Core Player', '2-1': 'Effective',
    '1-3': 'Enigma', '1-2': 'Up or Out', '1-1': 'Underperformer',
  };
  return labels[`${perf}-${pot}`] || 'Unrated';
}

export function formatMetricValue(value: number, unit: string): string {
  if (unit === '$') return `$${value.toLocaleString()}`;
  if (unit === '%') return `${value}%`;
  return `${value}${unit}`;
}
