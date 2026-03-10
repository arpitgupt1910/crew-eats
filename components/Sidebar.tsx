'use client';

import type { Borough, ReservationDifficulty, Restaurant } from '../types/restaurant';
import RestaurantCard from './RestaurantCard';

interface SidebarProps {
  restaurants: Restaurant[];
  selectedBorough: Borough | 'All';
  selectedDifficulty: ReservationDifficulty | 'All';
  onBoroughChange: (borough: Borough | 'All') => void;
  onDifficultyChange: (difficulty: ReservationDifficulty | 'All') => void;
  onReviewSubmit: (restaurantId: string, score: number, comment: string) => Promise<void>;
}

const BOROUGHS: (Borough | 'All')[] = ['All', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
const DIFFICULTIES: (ReservationDifficulty | 'All')[] = ['All', 'Easy', 'Moderate', 'Hard', 'Impossible'];

export default function Sidebar({
  restaurants,
  selectedBorough,
  selectedDifficulty,
  onBoroughChange,
  onDifficultyChange,
  onReviewSubmit,
}: SidebarProps) {
  return (
    <aside className="flex h-full flex-col gap-4 overflow-y-auto bg-slate-50 p-4">
      <div className="grid grid-cols-2 gap-2">
        <label className="text-sm font-medium text-slate-700">
          Borough
          <select
            className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1"
            onChange={(event) => onBoroughChange(event.target.value as Borough | 'All')}
            value={selectedBorough}
          >
            {BOROUGHS.map((borough) => (
              <option key={borough} value={borough}>
                {borough}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Reservation
          <select
            className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1"
            onChange={(event) => onDifficultyChange(event.target.value as ReservationDifficulty | 'All')}
            value={selectedDifficulty}
          >
            {DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="space-y-3">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} onReviewSubmit={onReviewSubmit} restaurant={restaurant} />
        ))}
      </section>
    </aside>
  );
}
