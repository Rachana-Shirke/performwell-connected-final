import { useState, useCallback } from 'react';
import { goals as initialGoals, type Goal } from '@/utils/mockData';

export function useGoals(employeeId?: string) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const filtered = employeeId ? goals.filter(g => g.employeeId === employeeId) : goals;

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt'>) => {
    setGoals(prev => [...prev, { ...goal, id: `g${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }]);
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  return { goals: filtered, allGoals: goals, addGoal, updateGoal, deleteGoal };
}
