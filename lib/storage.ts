import type { Restaurant } from '../types/restaurant';

const STORAGE_KEY = 'crew-eats-fallback-restaurants';

export const loadRestaurantsFromLocalStorage = (): Restaurant[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Restaurant[];
  } catch {
    return [];
  }
};

export const saveRestaurantsToLocalStorage = (restaurants: Restaurant[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
};
