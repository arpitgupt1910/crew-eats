import type { Restaurant } from '../types/restaurant';
import { getDifficultyBadgeClass } from '../lib/scoring';
import ReviewForm from './ReviewForm';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onReviewSubmit: (restaurantId: string, score: number, comment: string) => Promise<void>;
}

export default function RestaurantCard({ restaurant, onReviewSubmit }: RestaurantCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{restaurant.name}</h3>
          <p className="text-sm text-slate-600">
            {restaurant.borough}
            {restaurant.neighborhood ? ` • ${restaurant.neighborhood}` : ''}
          </p>
        </div>
        <span className={`rounded px-2 py-1 text-xs font-medium ${getDifficultyBadgeClass(restaurant.reservationDifficulty)}`}>
          {restaurant.reservationDifficulty}
        </span>
      </div>

      <p className="mt-2 text-sm text-slate-700">
        ⭐ {restaurant.averageScore.toFixed(1)} ({restaurant.reviewCount} reviews)
      </p>

      <ReviewForm restaurantId={restaurant.id} onSubmit={onReviewSubmit} />
    </article>
  );
}
