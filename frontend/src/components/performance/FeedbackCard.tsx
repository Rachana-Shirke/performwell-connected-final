import { type FeedbackEntry } from '@/utils/mockData';
import { Star, MessageSquare } from 'lucide-react';

interface FeedbackCardProps {
  feedback: FeedbackEntry;
}

const typeColors: Record<string, string> = {
  Peer: 'badge-info',
  Manager: 'badge-success',
  'Direct Report': 'badge-warning',
};

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
            {feedback.fromName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{feedback.fromName}</p>
            <p className="text-xs text-muted-foreground">{feedback.date}</p>
          </div>
        </div>
        <span className={typeColors[feedback.type]}>{feedback.type}</span>
      </div>

      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`h-4 w-4 ${i <= Math.round(feedback.rating) ? 'text-warning fill-warning' : 'text-muted'}`}
          />
        ))}
        <span className="text-sm font-medium text-foreground ml-1">{feedback.rating.toFixed(1)}</span>
      </div>

      <div className="flex items-start gap-2 mb-4">
        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground leading-relaxed">{feedback.comment}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {feedback.categories.map(cat => (
          <div key={cat.name} className="flex items-center justify-between bg-muted/50 rounded-md px-2.5 py-1.5">
            <span className="text-xs text-muted-foreground">{cat.name}</span>
            <span className="text-xs font-semibold text-foreground">{cat.score}/5</span>
          </div>
        ))}
      </div>
    </div>
  );
}
