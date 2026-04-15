/**
 * PerformanceContext.tsx — FastAPI-powered version
 * ─────────────────────────────────────────────────
 * DROP-IN REPLACEMENT for src/contexts/PerformanceContext.tsx
 *
 * • Removes ALL mockData imports
 * • Fetches everything from the FastAPI backend
 * • Preserves the exact same context shape so no page/component changes needed
 *
 * Copy to:  src/contexts/PerformanceContext.tsx
 * Add env:  VITE_API_URL=http://localhost:8000
 */

import {
  createContext, useContext, useState, useCallback,
  useMemo, useEffect, type ReactNode,
} from "react";
import {
  employeeApi, goalApi, reviewApi, feedbackApi, metricsApi, analyticsApi,
  type Employee, type Goal, type Review, type FeedbackEntry,
  type EnrichedMetric, type DepartmentPerformance,
} from "@/services/apiClient";

// ── Context shape (identical to original) ────────────────────────────────────
interface PerformanceContextType {
  selectedEmployeeId: string;
  setSelectedEmployeeId: (id: string) => void;
  selectedEmployee: Employee | null;

  employees: Employee[];
  departmentPerformance: DepartmentPerformance[];

  metrics: EnrichedMetric[];
  categoryMetrics: Record<string, EnrichedMetric[]>;
  metricValues: { metricId: string; value: number; month: string }[];

  goals: Goal[];
  allGoals: Goal[];
  addGoal:    (g: Omit<Goal, "id" | "createdAt">) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  reviews: Review[];
  allReviews: Review[];

  feedbackEntries: FeedbackEntry[];
  allFeedbackEntries: FeedbackEntry[];

  aiSummary: string | null;
  setAiSummary: (s: string | null) => void;

  loading: boolean;
  error: string | null;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [selectedEmployeeId, _setSelected] = useState("e1");

  const [employees,            setEmployees]            = useState<Employee[]>([]);
  const [allGoals,             setAllGoals]             = useState<Goal[]>([]);
  const [allReviews,           setAllReviews]           = useState<Review[]>([]);
  const [allFeedbackEntries,   setAllFeedbackEntries]   = useState<FeedbackEntry[]>([]);
  const [metrics,              setMetrics]              = useState<EnrichedMetric[]>([]);
  const [categoryMetrics,      setCategoryMetrics]      = useState<Record<string, EnrichedMetric[]>>({});
  const [departmentPerformance,setDeptPerf]             = useState<DepartmentPerformance[]>([]);
  const [aiSummary,            setAiSummary]            = useState<string | null>(null);
  const [loading,              setLoading]              = useState(true);
  const [error,                setError]                = useState<string | null>(null);

  // ── Load employees, all goals/reviews/feedback and dept data once ─────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [emps, goals, reviews, feedback, depts] = await Promise.all([
          employeeApi.getAll(),
          goalApi.getAll(),
          reviewApi.getAll(),
          feedbackApi.getAll(),
          metricsApi.getDepartmentPerformance(),
        ]);
        if (cancelled) return;
        setEmployees(emps);
        setAllGoals(goals);
        setAllReviews(reviews);
        setAllFeedbackEntries(feedback);
        setDeptPerf(depts);
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Reload metrics when selected employee changes ─────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await metricsApi.getByEmployee(selectedEmployeeId);
        if (cancelled) return;
        setMetrics(data.metrics);
        setCategoryMetrics(data.categoryMetrics);
      } catch {
        if (!cancelled) { setMetrics([]); setCategoryMetrics({}); }
      }
    })();
    return () => { cancelled = true; };
  }, [selectedEmployeeId]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const selectedEmployee = useMemo(
    () => employees.find(e => e.id === selectedEmployeeId) ?? null,
    [employees, selectedEmployeeId]
  );

  const goals            = useMemo(() => allGoals.filter(g => g.employeeId === selectedEmployeeId), [allGoals, selectedEmployeeId]);
  const reviews          = useMemo(() => allReviews.filter(r => r.employeeId === selectedEmployeeId), [allReviews, selectedEmployeeId]);
  const feedbackEntries  = useMemo(() => allFeedbackEntries.filter(f => f.employeeId === selectedEmployeeId), [allFeedbackEntries, selectedEmployeeId]);

  // Flatten metric trends into the legacy MetricValue shape (for chart components)
  const metricValues = useMemo(() =>
    metrics.flatMap(m => m.trend.map(t => ({ metricId: m.id, value: t.value, month: t.month }))),
  [metrics]);

  const setSelectedEmployeeId = useCallback((id: string) => {
    _setSelected(id);
    setAiSummary(null);
  }, []);

  // ── Goal CRUD (optimistic local update + API call) ────────────────────────
  const addGoal = useCallback(async (data: Omit<Goal, "id" | "createdAt">) => {
    const created = await goalApi.create(data);
    setAllGoals(prev => [...prev, created]);
  }, []);

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    const updated = await goalApi.update(id, updates);
    setAllGoals(prev => prev.map(g => g.id === id ? { ...g, ...updated } : g));
  }, []);

  const deleteGoal = useCallback(async (id: string) => {
    await goalApi.delete(id);
    setAllGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  const value = useMemo<PerformanceContextType>(() => ({
    selectedEmployeeId, setSelectedEmployeeId, selectedEmployee,
    employees, departmentPerformance,
    metrics, categoryMetrics, metricValues,
    goals, allGoals, addGoal, updateGoal, deleteGoal,
    reviews, allReviews,
    feedbackEntries, allFeedbackEntries,
    aiSummary, setAiSummary,
    loading, error,
  }), [
    selectedEmployeeId, setSelectedEmployeeId, selectedEmployee,
    employees, departmentPerformance,
    metrics, categoryMetrics, metricValues,
    goals, allGoals, addGoal, updateGoal, deleteGoal,
    reviews, allReviews,
    feedbackEntries, allFeedbackEntries,
    aiSummary, loading, error,
  ]);

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformanceContext() {
  const ctx = useContext(PerformanceContext);
  if (!ctx) throw new Error("usePerformanceContext must be used within PerformanceProvider");
  return ctx;
}
