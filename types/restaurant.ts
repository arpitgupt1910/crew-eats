export type Borough = 'Manhattan' | 'Brooklyn' | 'Queens' | 'Bronx' | 'Staten Island';

export type ReservationDifficulty = 'Easy' | 'Moderate' | 'Hard' | 'Impossible';

export interface User {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  score: number;
  comment: string;
  createdAt: string;
  user?: Pick<User, 'id' | 'displayName' | 'avatarUrl'>;
}

export interface Restaurant {
  id: string;
  name: string;
  borough: Borough;
  neighborhood?: string;
  cuisine?: string;
  reservationDifficulty: ReservationDifficulty;
  averageScore: number;
  reviewCount: number;
  latitude: number;
  longitude: number;
  createdBy: string;
  createdAt: string;
  reviews?: Review[];
}

export interface RestaurantFilters {
  borough?: Borough | 'All';
  reservationDifficulty?: ReservationDifficulty | 'All';
}
