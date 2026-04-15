import { useMemo } from 'react';
import { employees, metricValues, departmentPerformance, reviews, goals, feedbackEntries } from '@/utils/mockData';
import { METRICS } from '@/utils/constants';
import { getLatestMetricValue, calculateMetricStatus, getMetricTrend } from '@/utils/calculations';

export function usePerformanceData() {
  const metricsWithValues = useMemo(() =>
    METRICS.map(m => ({
      ...m,
      currentValue: getLatestMetricValue(m.id),
      status: calculateMetricStatus(m.id),
      trend: getMetricTrend(m.id),
    })), []
  );

  const categoryMetrics = useMemo(() => {
    const grouped: Record<string, typeof metricsWithValues> = {};
    metricsWithValues.forEach(m => {
      if (!grouped[m.category]) grouped[m.category] = [];
      grouped[m.category].push(m);
    });
    return grouped;
  }, [metricsWithValues]);

  return {
    employees,
    metrics: metricsWithValues,
    categoryMetrics,
    metricValues,
    departmentPerformance,
    reviews,
    goals,
    feedbackEntries,
  };
}
