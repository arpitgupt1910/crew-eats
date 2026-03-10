import type { Review } from '../types/restaurant';

export const clampScore = (score: number) => Math.max(1, Math.min(10, Math.round(score)));

export const calculateAverageScore = (reviews: Pick<Review, 'score'>[]) => {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + clampScore(review.score), 0);
  return Number((total / reviews.length).toFixed(1));
};

export const getDifficultyBadgeClass = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-emerald-100 text-emerald-800';
    case 'Moderate':
      return 'bg-amber-100 text-amber-800';
    case 'Hard':
      return 'bg-orange-100 text-orange-900';
    case 'Impossible':
      return 'bg-rose-100 text-rose-900';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};
