'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { fetchRestaurants, submitReview } from '../lib/restaurants';
import type { Borough, ReservationDifficulty, Restaurant } from '../types/restaurant';

const RestaurantMap = dynamic(() => import('../components/Map'), { ssr: false });

export default function Page() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [borough, setBorough] = useState<Borough | 'All'>('All');
  const [difficulty, setDifficulty] = useState<ReservationDifficulty | 'All'>('All');

  useEffect(() => {
    const load = async () => {
      const data = await fetchRestaurants({ borough, reservationDifficulty: difficulty });
      setRestaurants(data);
    };

    void load();
  }, [borough, difficulty]);

  const filteredRestaurants = useMemo(() => restaurants, [restaurants]);

  const handleReviewSubmit = async (restaurantId: string, score: number, comment: string) => {
    const demoUserId = '00000000-0000-0000-0000-000000000001';
    await submitReview(restaurantId, score, comment, demoUserId);
    const refreshed = await fetchRestaurants({ borough, reservationDifficulty: difficulty });
    setRestaurants(refreshed);
  };

  return (
    <main className="grid h-screen grid-cols-[400px,1fr]">
      <Sidebar
        onBoroughChange={setBorough}
        onDifficultyChange={setDifficulty}
        onReviewSubmit={handleReviewSubmit}
        restaurants={filteredRestaurants}
        selectedBorough={borough}
        selectedDifficulty={difficulty}
      />
      <section className="h-full">
        <RestaurantMap restaurants={filteredRestaurants} />
      </section>
    </main>
  );
}
