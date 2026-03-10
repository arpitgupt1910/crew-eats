'use client';

import { useState } from 'react';

interface ReviewFormProps {
  restaurantId: string;
  onSubmit: (restaurantId: string, score: number, comment: string) => Promise<void>;
}

export default function ReviewForm({ restaurantId, onSubmit }: ReviewFormProps) {
  const [score, setScore] = useState(8);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(restaurantId, score, comment);
      setComment('');
      setScore(8);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-3 space-y-2" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-slate-700">
        Score (1-10)
        <input
          className="mt-1 w-full rounded border border-slate-300 px-2 py-1"
          max={10}
          min={1}
          onChange={(event) => setScore(Number(event.target.value))}
          type="number"
          value={score}
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Review
        <textarea
          className="mt-1 w-full rounded border border-slate-300 px-2 py-1"
          onChange={(event) => setComment(event.target.value)}
          placeholder="How was the food and reservation process?"
          required
          rows={3}
          value={comment}
        />
      </label>
      <button
        className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
