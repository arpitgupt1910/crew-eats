import { supabase } from './supabase';
import type { Borough, ReservationDifficulty, Restaurant, RestaurantFilters } from '../types/restaurant';

interface ReviewRow {
  id: string;
  restaurant_id: string;
  user_id: string;
  score: number;
  comment: string;
  created_at: string;
  users: {
    id: string;
    display_name: string;
    avatar_url?: string;
  }[] | null;
}

interface RestaurantRow {
  id: string;
  name: string;
  borough: Borough;
  neighborhood?: string;
  cuisine?: string;
  reservation_difficulty: ReservationDifficulty;
  average_score: number;
  review_count: number;
  latitude: number;
  longitude: number;
  created_by: string;
  created_at: string;
  reviews?: ReviewRow[];
}

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

  if (filters.borough && filters.borough !== 'All') query = query.eq('borough', filters.borough);
  if (filters.reservationDifficulty && filters.reservationDifficulty !== 'All') {
    query = query.eq('reservation_difficulty', filters.reservationDifficulty);
  }

  const { data, error } = await query;
  if (error) throw error;

  return ((data ?? []) as unknown as RestaurantRow[]).map((row) => ({
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
    reviews: (row.reviews ?? []).map((review) => ({
      id: review.id,
      restaurantId: review.restaurant_id,
      userId: review.user_id,
      score: review.score,
      comment: review.comment,
      createdAt: review.created_at,
      user: review.users?.[0]
        ? {
            id: review.users[0].id,
            displayName: review.users[0].display_name,
            avatarUrl: review.users[0].avatar_url,
          }
        : undefined,
    })),
  }));
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

export const createRestaurant = async (input: {
  name: string;
  borough: Borough;
  neighborhood?: string;
  cuisine?: string;
  reservationDifficulty: ReservationDifficulty;
  latitude: number;
  longitude: number;
  createdBy: string;
}) => {
  const { error } = await supabase.from('restaurants').insert({
    name: input.name,
    borough: input.borough,
    neighborhood: input.neighborhood || null,
    cuisine: input.cuisine || null,
    reservation_difficulty: input.reservationDifficulty,
    latitude: input.latitude,
    longitude: input.longitude,
    created_by: input.createdBy,
  });

  if (error) throw error;
};
