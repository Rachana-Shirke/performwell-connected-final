import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';
import type { Employee, Goal, Review, FeedbackEntry } from '@/utils/mockData';
import { METRICS } from '@/utils/constants';
import { getLatestMetricValue } from '@/utils/calculations';
import ReactMarkdown from 'react-markdown';

interface AISummaryCardProps {
  employee: Employee;
  goals: Goal[];
  reviews: Review[];
  feedback: FeedbackEntry[];
}

function buildEmployeeData(employee: Employee, goals: Goal[], reviews: Review[], feedback: FeedbackEntry[]) {
  const goalsText = goals.map(g => `${g.title} (${g.type}): ${g.progress}% — ${g.status}`).join('\n') || 'No goals set';

  const byCategory = (cat: string) =>
    METRICS.filter(m => m.category === cat)
      .map(m => `${m.name}: ${getLatestMetricValue(m.id)} ${m.unit}`)
      .join(', ');

  const feedbackText = feedback.length > 0
    ? feedback.map(f => `${f.fromName} (${f.type}): ${f.rating}/5 — "${f.comment}"`).join('\n')
    : 'No 360° feedback available';

  const managerReview = reviews.find(r => r.type === 'Manager' && r.status === 'Completed');
  const managerNotes = managerReview
    ? `Rating: ${managerReview.rating}/5. Strengths: ${managerReview.strengths.join(', ')}. Areas: ${managerReview.weaknesses.join(', ')}. Comments: ${managerReview.comments}`
    : 'No manager review available';

  return {
    name: employee.name,
    role: employee.role,
    department: employee.department,
    performanceScore: employee.performanceScore,
    goals: goalsText,
    quantityMetrics: byCategory('Work Quantity'),
    qualityMetrics: byCategory('Work Quality'),
    efficiencyMetrics: byCategory('Work Efficiency'),
    engagementMetrics: byCategory('Engagement & Development'),
    feedbackData: feedbackText,
    managerNotes,
  };
}

export function AISummaryCard({ employee, goals, reviews, feedback }: AISummaryCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const employeeData = buildEmployeeData(employee, goals, reviews, feedback);
      const data = await api.generateSummary(employeeData);
      if (data?.error) throw new Error(data.error);
      setSummary(data.summary || data.data?.summary);
    } catch (err: any) {
      setError(err.message || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="section-title mb-0">AI Performance Summary</h3>
        </div>
        <button
          onClick={generateSummary}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Summary
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {summary && (
        <div className="prose prose-sm max-w-none text-foreground bg-muted/30 rounded-lg p-4 border">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      )}

      {!summary && !loading && !error && (
        <p className="text-sm text-muted-foreground text-center py-6">
          Click "Generate Summary" to create an AI-powered performance review for {employee.name}.
        </p>
      )}
    </div>
  );
}
