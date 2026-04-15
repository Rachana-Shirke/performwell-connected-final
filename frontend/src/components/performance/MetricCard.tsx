import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatMetricValue } from '@/utils/calculations';

interface MetricCardProps {
  name: string;
  value: number | null;
  unit: string;
  target: number;
  status: 'good' | 'warning' | 'poor';
  trend?: { month: string; value: number }[];
}

export function MetricCard({ name, value, unit, target, status, trend }: MetricCardProps) {
  const statusColors = {
    good: 'badge-success',
    warning: 'badge-warning',
    poor: 'badge-destructive',
  };

  const trendDirection = trend && trend.length >= 2
    ? trend[trend.length - 1].value > trend[trend.length - 2].value ? 'up' : trend[trend.length - 1].value < trend[trend.length - 2].value ? 'down' : 'flat'
    : 'flat';

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground leading-tight max-w-[70%]">{name}</p>
        <span className={statusColors[status]}>
          {status === 'good' ? 'On Target' : status === 'warning' ? 'Near Target' : 'Off Target'}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="stat-value">{value !== null ? formatMetricValue(value, unit) : '—'}</p>
          <p className="text-xs text-muted-foreground mt-1">Target: {formatMetricValue(target, unit)}</p>
        </div>
        {trendDirection === 'up' && <TrendingUp className="h-5 w-5 text-success" />}
        {trendDirection === 'down' && <TrendingDown className="h-5 w-5 text-destructive" />}
        {trendDirection === 'flat' && <Minus className="h-5 w-5 text-muted-foreground" />}
      </div>
    </div>
  );
}
