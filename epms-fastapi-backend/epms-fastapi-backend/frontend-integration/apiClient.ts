/**
 * apiClient.ts — EPMS FastAPI Backend Client
 * ─────────────────────────────────────────────────────────────────
 * Drop this file into:  src/services/apiClient.ts
 *
 * Add to performwell-hub-main/.env:
 *   VITE_API_URL=http://localhost:8000
 */

const BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000") + "/api";

// ── Generic fetch wrapper ─────────────────────────────────────────────────────
async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const opts: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res  = await fetch(`${BASE}${path}`, opts);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json?.detail ?? json?.error ?? `HTTP ${res.status}: ${res.statusText}`
    );
  }
  // FastAPI routes return data directly (no wrapper) unless they use success/data envelope
  return (json?.data ?? json) as T;
}

const get  = <T>(path: string)               => req<T>("GET",    path);
const post = <T>(path: string, body: unknown) => req<T>("POST",   path, body);
const put  = <T>(path: string, body: unknown) => req<T>("PUT",    path, body);
const del  = <T>(path: string)               => req<T>("DELETE", path);

// ── Types (matching backend Pydantic out-schemas) ─────────────────────────────

export interface NineBoxPosition { performance: number; potential: number }

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  joinDate: string;
  managerId?: string | null;
  performanceScore: number;
  status: string;
  nineBoxPosition: NineBoxPosition;
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  type: "KPI" | "KRA" | "OKR" | "MBO";
  progress: number;
  dueDate: string;
  status: "On Track" | "At Risk" | "Behind" | "Completed";
  createdAt?: string | null;
}

export interface Review {
  id: string;
  employeeId: string;
  reviewerId: string;
  type: "Manager" | "Self" | "Peer";
  period: string;
  rating: number;
  strengths: string[];
  weaknesses: string[];
  comments: string;
  status: "Pending" | "In Progress" | "Completed";
  completedAt?: string | null;
}

export interface CategoryScore { name: string; score: number }

export interface FeedbackEntry {
  id: string;
  employeeId: string;
  fromId: string;
  fromName: string;
  type: "Peer" | "Manager" | "Direct Report";
  rating: number;
  comment: string;
  date: string;
  categories: CategoryScore[];
}

export interface MetricTrend { value: number; month: string }

export interface EnrichedMetric {
  id: string;
  name: string;
  category: string;
  unit: string;
  target: number;
  inverse?: boolean;
  currentValue: number | null;
  status: "good" | "warning" | "poor";
  trend: MetricTrend[];
}

export interface MetricsResponse {
  metrics: EnrichedMetric[];
  categoryMetrics: Record<string, EnrichedMetric[]>;
}

export interface DepartmentPerformance {
  department: string;
  avgScore: number;
  headcount: number;
  retention: number;
}

export interface AISummaryResponse {
  employeeId: string;
  summary: string;
  generatedAt: string;
}

export interface AnalyticsResponse {
  employeeId: string;
  employeeName: string;
  department: string;
  performanceScore: number;
  goalsSummary: Record<string, number>;
  reviewsSummary: Record<string, number | null>;
  feedbackSummary: Record<string, unknown>;
  trendData: Record<string, unknown>[];
  departmentPerformance: DepartmentPerformance[];
  metrics: EnrichedMetric[];
  categoryMetrics: Record<string, EnrichedMetric[]>;
}

// ── API namespaces ────────────────────────────────────────────────────────────

export const employeeApi = {
  getAll:  ()                                           => get<Employee[]>("/employees"),
  getById: (id: string)                                 => get<Employee>(`/employees/${id}`),
  create:  (data: Partial<Employee>)                    => post<Employee>("/employees", data),
  update:  (id: string, data: Partial<Employee>)        => put<Employee>(`/employees/${id}`, data),
};

export const goalApi = {
  getAll:        ()                                      => get<Goal[]>("/goals"),
  getByEmployee: (employeeId: string)                    => get<Goal[]>(`/goals/${employeeId}`),
  create:        (data: Omit<Goal, "id" | "createdAt">) => post<Goal>("/goals", _toSnake(data)),
  update:        (id: string, data: Partial<Goal>)       => put<Goal>(`/goals/${id}`, _toSnake(data)),
  delete:        (id: string)                            => del<{ message: string }>(`/goals/${id}`),
};

export const reviewApi = {
  getAll:        ()                                        => get<Review[]>("/reviews"),
  getByEmployee: (employeeId: string)                      => get<Review[]>(`/reviews/${employeeId}`),
  create:        (data: Omit<Review, "id" | "createdAt">) => post<Review>("/reviews", _toSnake(data)),
  update:        (id: string, data: Partial<Review>)       => put<Review>(`/reviews/${id}`, _toSnake(data)),
};

export const feedbackApi = {
  getAll:        ()                                               => get<FeedbackEntry[]>("/feedback"),
  getByEmployee: (employeeId: string)                             => get<FeedbackEntry[]>(`/feedback/${employeeId}`),
  create:        (data: Omit<FeedbackEntry, "id">)               => post<FeedbackEntry>("/feedback", _toSnake(data)),
};

export const metricsApi = {
  getByEmployee:            (employeeId: string) => get<MetricsResponse>(`/metrics/${employeeId}`),
  getDepartmentPerformance: ()                   => get<DepartmentPerformance[]>("/metrics/departments"),
};

export const analyticsApi = {
  getByEmployee: (employeeId: string) => get<AnalyticsResponse>(`/analytics/${employeeId}`),
};

export const aiApi = {
  generateSummary:  (employeeId: string) => post<AISummaryResponse>("/ai/performance-summary", { employee_id: employeeId }),
  getLatestSummary: (employeeId: string) => get<AISummaryResponse>(`/ai/performance-summary/${employeeId}`),
};

// ── Helper: camelCase → snake_case for POST/PUT bodies ────────────────────────
function _toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    const snake = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    result[snake] = val;
  }
  return result;
}
