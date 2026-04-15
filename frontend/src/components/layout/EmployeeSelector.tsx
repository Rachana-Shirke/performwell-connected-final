import { usePerformanceContext } from '@/contexts/PerformanceContext';

export function EmployeeSelector() {
  const { employees, selectedEmployeeId, setSelectedEmployeeId } = usePerformanceContext();

  return (
    <select
      value={selectedEmployeeId}
      onChange={e => setSelectedEmployeeId(e.target.value)}
      className="h-8 rounded-lg border bg-background px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      {employees.map(emp => (
        <option key={emp.id} value={emp.id}>
          {emp.name} — {emp.role}
        </option>
      ))}
    </select>
  );
}
