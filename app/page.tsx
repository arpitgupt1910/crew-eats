'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { createRestaurant, fetchRestaurants, submitReview } from '../lib/restaurants';
import type { Borough, ReservationDifficulty, Restaurant } from '../types/restaurant';

const RestaurantMap = dynamic(() => import('../components/Map'), { ssr: false });
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function Page() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [borough, setBorough] = useState<Borough | 'All'>('All');
  const [difficulty, setDifficulty] = useState<ReservationDifficulty | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadRestaurants = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchRestaurants({ borough, reservationDifficulty: difficulty });
      setRestaurants(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load restaurants.');
    } finally {
      setIsLoading(false);
    }
  }, [borough, difficulty]);

  useEffect(() => {
    void loadRestaurants();
  }, [loadRestaurants]);

  const handleReviewSubmit = async (restaurantId: string, score: number, comment: string) => {
    await submitReview(restaurantId, score, comment, DEMO_USER_ID);
    await loadRestaurants();
  };

  const handleRestaurantCreate = async (payload: {
    name: string;
    borough: Borough;
    neighborhood?: string;
    cuisine?: string;
    reservationDifficulty: ReservationDifficulty;
    latitude: number;
    longitude: number;
  }) => {
    await createRestaurant({ ...payload, createdBy: DEMO_USER_ID });
    await loadRestaurants();
  };

  return (
    <main className="grid h-screen grid-cols-[400px,1fr]">
      <Sidebar
        onBoroughChange={setBorough}
        onDifficultyChange={setDifficulty}
        onRestaurantCreate={handleRestaurantCreate}
        onReviewSubmit={handleReviewSubmit}
        restaurants={restaurants}
        selectedBorough={borough}
        selectedDifficulty={difficulty}
      />
      <section className="relative h-full">
        <RestaurantMap restaurants={restaurants} />
        {(isLoading || errorMessage) && (
          <div className="pointer-events-none absolute left-3 top-3 rounded bg-white/90 px-3 py-2 text-sm shadow">
            {isLoading ? 'Loading restaurants…' : `Error: ${errorMessage}`}
          </div>
        )}
      </section>
    </main>
  );
}
