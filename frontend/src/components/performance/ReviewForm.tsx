import { useState } from 'react';
import { type Review } from '@/utils/mockData';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  review?: Review;
  onSubmit?: (data: Partial<Review>) => void;
}

export function ReviewForm({ review, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(review?.rating || 3);
  const [strengths, setStrengths] = useState(review?.strengths?.join(', ') || '');
  const [weaknesses, setWeaknesses] = useState(review?.weaknesses?.join(', ') || '');
  const [comments, setComments] = useState(review?.comments || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      rating,
      strengths: strengths.split(',').map(s => s.trim()).filter(Boolean),
      weaknesses: weaknesses.split(',').map(s => s.trim()).filter(Boolean),
      comments,
      status: 'Completed',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="stat-label mb-2 block">Overall Rating</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={5}
            step={0.1}
            value={rating}
            onChange={e => setRating(parseFloat(e.target.value))}
            className="flex-1 accent-primary"
          />
          <div className="flex items-center gap-1 min-w-[60px]">
            <Star className="h-4 w-4 text-warning fill-warning" />
            <span className="text-lg font-bold text-foreground">{rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Needs Improvement</span>
          <span>Outstanding</span>
        </div>
      </div>

      <div>
        <label className="stat-label mb-2 block">Strengths</label>
        <textarea
          value={strengths}
          onChange={e => setStrengths(e.target.value)}
          placeholder="e.g., Leadership, Communication, Technical skills"
          className="w-full h-20 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">Separate with commas</p>
      </div>

      <div>
        <label className="stat-label mb-2 block">Areas for Improvement</label>
        <textarea
          value={weaknesses}
          onChange={e => setWeaknesses(e.target.value)}
          placeholder="e.g., Time management, Delegation"
          className="w-full h-20 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">Separate with commas</p>
      </div>

      <div>
        <label className="stat-label mb-2 block">Comments</label>
        <textarea
          value={comments}
          onChange={e => setComments(e.target.value)}
          placeholder="Provide detailed feedback..."
          className="w-full h-28 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Submit Review
      </button>
    </form>
  );
}
