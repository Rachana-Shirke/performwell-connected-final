const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function apiGet(path: string) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export const api = {
  getEmployees: () => apiGet('/api/employees'),
  getGoals: () => apiGet('/api/goals'),
  getReviews: () => apiGet('/api/reviews'),
  getFeedback: () => apiGet('/api/feedback'),
  generateSummary: async (employeeData: any) => {
    const res = await fetch(`${API_BASE}/api/ai/generate-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_data: employeeData })
    });
    if (!res.ok) throw new Error(`AI Error: ${res.status}`);
    return res.json();
  }
};
