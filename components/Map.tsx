'use client';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import type { Restaurant } from '../types/restaurant';

interface MapProps {
  restaurants: Restaurant[];
  onRestaurantSelect?: (restaurantId: string) => void;
}

const NYC_CENTER: [number, number] = [40.7128, -74.006];

export default function Map({ restaurants, onRestaurantSelect }: MapProps) {
  return (
    <MapContainer center={NYC_CENTER} className="h-full w-full" scrollWheelZoom zoom={11}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {restaurants.map((restaurant) => (
        <Marker
          eventHandlers={{
            click: () => onRestaurantSelect?.(restaurant.id),
          }}
          key={restaurant.id}
          position={[restaurant.latitude, restaurant.longitude]}
        >
          <Popup>
            <div className="space-y-1">
              <h4 className="font-semibold">{restaurant.name}</h4>
              <p className="text-xs">{restaurant.borough}</p>
              <p className="text-xs">Difficulty: {restaurant.reservationDifficulty}</p>
              <p className="text-xs">⭐ {restaurant.averageScore.toFixed(1)}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
