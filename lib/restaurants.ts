import { supabase } from './supabase';
import type { Restaurant, RestaurantFilters } from '../types/restaurant';

export const fetchRestaurants = async (filters: RestaurantFilters = {}) => {
  let query = supabase
    .from('restaurants')
    .select(
      `
        id,
        name,
        borough,
        neighborhood,
        cuisine,
        reservation_difficulty,
        average_score,
        review_count,
        latitude,
        longitude,
        created_by,
        created_at,
        reviews (
          id,
          restaurant_id,
          user_id,
          score,
          comment,
          created_at,
          users:user_id (id, display_name, avatar_url)
        )
      `,
    )
    .order('created_at', { ascending: false });

  if (filters.borough && filters.borough !== 'All') {
    query = query.eq('borough', filters.borough);
  }

  if (filters.reservationDifficulty && filters.reservationDifficulty !== 'All') {
    query = query.eq('reservation_difficulty', filters.reservationDifficulty);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    borough: row.borough,
    neighborhood: row.neighborhood,
    cuisine: row.cuisine,
    reservationDifficulty: row.reservation_difficulty,
    averageScore: row.average_score,
    reviewCount: row.review_count,
    latitude: row.latitude,
    longitude: row.longitude,
    createdBy: row.created_by,
    createdAt: row.created_at,
    reviews: (row.reviews ?? []).map((review: any) => ({
      id: review.id,
      restaurantId: review.restaurant_id,
      userId: review.user_id,
      score: review.score,
      comment: review.comment,
      createdAt: review.created_at,
      user: review.users
        ? {
            id: review.users.id,
            displayName: review.users.display_name,
            avatarUrl: review.users.avatar_url,
          }
        : undefined,
    })),
  })) as Restaurant[];
};

export const submitReview = async (restaurantId: string, score: number, comment: string, userId: string) => {
  const { error } = await supabase.from('reviews').insert({
    restaurant_id: restaurantId,
    user_id: userId,
    score,
    comment,
  });

  if (error) throw error;
};
