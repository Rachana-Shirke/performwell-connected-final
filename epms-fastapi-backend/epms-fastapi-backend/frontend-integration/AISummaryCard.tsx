/**
 * AISummaryCard.tsx — FastAPI backend version
 * ─────────────────────────────────────────────
 * DROP-IN REPLACEMENT for src/components/performance/AISummaryCard.tsx
 *
 * Calls POST /api/ai/performance-summary on the FastAPI backend
 * instead of Supabase Edge Functions.
 *
 * Copy to:  src/components/performance/AISummaryCard.tsx
 */

import { useState } from "react";
import { Sparkles, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { aiApi } from "@/services/apiClient";
import type { Employee, Goal, Review, FeedbackEntry } from "@/services/apiClient";
import ReactMarkdown from "react-markdown";

interface AISummaryCardProps {
  employee: Employee;
  goals: Goal[];
  reviews: Review[];
  feedback: FeedbackEntry[];
}

export function AISummaryCard({ employee }: AISummaryCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiApi.generateSummary(employee.id);
      setSummary(result.summary);
    } catch (err: any) {
      setError(err.message ?? "Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="metric-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="section-title mb-0">AI Performance Summary</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            Powered by GPT-4o-mini
          </span>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm
                     font-medium hover:opacity-90 transition-opacity disabled:opacity-50
                     flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : summary ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Summary
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm
                        bg-destructive/10 rounded-lg p-3 mb-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="prose prose-sm max-w-none text-foreground
                        bg-muted/30 rounded-lg p-4 border">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      )}

      {/* Empty state */}
      {!summary && !loading && !error && (
        <p className="text-sm text-muted-foreground text-center py-6">
          Click &ldquo;Generate Summary&rdquo; to create an AI-powered performance
          review for <strong>{employee.name}</strong>.
          <br />
          <span className="text-xs mt-1 block">
            The agent fetches all data from the database — no fabrication.
          </span>
        </p>
      )}
    </div>
  );
}
