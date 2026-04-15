import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import {
  employees as mockEmployees,
  metricValues,
  departmentPerformance,
  reviews as allReviews,
  goals as initialGoals,
  feedbackEntries as allFeedback,
  type Goal,
  type Review,
  type FeedbackEntry,
} from '@/utils/mockData';
import { METRICS } from '@/utils/constants';
import { api } from '@/services/api';
import { api } from '@/services/api';
import { getLatestMetricValue, calculateMetricStatus, getMetricTrend } from '@/utils/calculations';

interface PerformanceContextType {
  // Selected employee
  selectedEmployeeId: string;
  setSelectedEmployeeId: (id: string) => void;
  selectedEmployee: typeof allEmployees[0];

  // All data
  employees: typeof allEmployees;
  metricValues: typeof metricValues;
  departmentPerformance: typeof departmentPerformance;

  // Computed metrics
  metrics: ReturnType<typeof computeMetrics>;
  categoryMetrics: Record<string, ReturnType<typeof computeMetrics>>;

  // Goals (with CRUD)
  goals: Goal[];
  allGoals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Reviews
  reviews: Review[];
  allReviews: Review[];

  // Feedback
  feedbackEntries: FeedbackEntry[];
  allFeedbackEntries: FeedbackEntry[];

  // AI Summary
  aiSummary: string | null;
  setAiSummary: (summary: string | null) => void;
}

function computeMetrics() {
  return METRICS.map(m => ({
    ...m,
    currentValue: getLatestMetricValue(m.id),
    status: calculateMetricStatus(m.id),
    trend: getMetricTrend(m.id),
  }));
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('e1');
  const [employeesData, setEmployeesData] = useState<any[]>(mockEmployees);
  const [reviewsData, setReviewsData] = useState<any[]>(allReviews);
  const [feedbackData, setFeedbackData] = useState<any[]>(allFeedback);
  const [employeesData, setEmployeesData] = useState<any[]>(mockEmployees);
  const [reviewsData, setReviewsData] = useState<any[]>(allReviews);
  const [feedbackData, setFeedbackData] = useState<any[]>(allFeedback);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const selectedEmployee = useMemo(
    () => employeesData.find(e => e.id === selectedEmployeeId) || employeesData[0],
    [selectedEmployeeId]
  );

  const metricsWithValues = useMemo(() => computeMetrics(), []);

  const categoryMetrics = useMemo(() => {
    const grouped: Record<string, typeof metricsWithValues> = {};
    metricsWithValues.forEach(m => {
      if (!grouped[m.category]) grouped[m.category] = [];
      grouped[m.category].push(m);
    });
    return grouped;
  }, [metricsWithValues]);

  // Filtered by selected employee
  const employeeGoals = useMemo(() => goals.filter(g => g.employeeId === selectedEmployeeId), [goals, selectedEmployeeId]);
  const employeeReviews = useMemo(() => reviewsData.filter(r => r.employeeId === selectedEmployeeId), [selectedEmployeeId, reviewsData]);
  const employeeFeedback = useMemo(() => feedbackData.filter(f => f.employeeId === selectedEmployeeId), [selectedEmployeeId, feedbackData]);

  useEffect(() => {
    Promise.allSettled([api.getEmployees(), api.getGoals(), api.getReviews(), api.getFeedback()]).then(results => {
      if (results[0].status === 'fulfilled') setEmployeesData(results[0].value);
      if (results[1].status === 'fulfilled') setGoals(results[1].value);
      if (results[2].status === 'fulfilled') setReviewsData(results[2].value);
      if (results[3].status === 'fulfilled') setFeedbackData(results[3].value);
    });
  }, []);

  useEffect(() => {
    Promise.allSettled([api.getEmployees(), api.getGoals(), api.getReviews(), api.getFeedback()]).then(results => {
      if (results[0].status === 'fulfilled') setEmployeesData(results[0].value);
      if (results[1].status === 'fulfilled') setGoals(results[1].value);
      if (results[2].status === 'fulfilled') setReviewsData(results[2].value);
      if (results[3].status === 'fulfilled') setFeedbackData(results[3].value);
    });
  }, []);

  // Reset AI summary when employee changes
  const handleSetSelectedEmployeeId = useCallback((id: string) => {
    setSelectedEmployeeId(id);
    setAiSummary(null);
  }, []);

  // Goal CRUD
  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt'>) => {
    setGoals(prev => [...prev, { ...goal, id: `g${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }]);
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  const value = useMemo<PerformanceContextType>(() => ({
    selectedEmployeeId,
    setSelectedEmployeeId: handleSetSelectedEmployeeId,
    selectedEmployee,
    employees: employeesData,
    metricValues,
    departmentPerformance,
    metrics: metricsWithValues,
    categoryMetrics,
    goals: employeeGoals,
    allGoals: goals,
    addGoal,
    updateGoal,
    deleteGoal,
    reviews: employeeReviews,
    allReviews: reviewsData,
    feedbackEntries: employeeFeedback,
    allFeedbackEntries: feedbackData,
    aiSummary,
    setAiSummary,
  }), [selectedEmployeeId, handleSetSelectedEmployeeId, selectedEmployee, metricsWithValues, categoryMetrics, employeeGoals, goals, addGoal, updateGoal, deleteGoal, employeeReviews, employeeFeedback, aiSummary]);

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformanceContext() {
  const ctx = useContext(PerformanceContext);
  if (!ctx) throw new Error('usePerformanceContext must be used within PerformanceProvider');
  return ctx;
}
