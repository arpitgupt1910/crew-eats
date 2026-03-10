'use client';

import { useState } from 'react';
import type { Borough, ReservationDifficulty } from '../types/restaurant';

interface AddRestaurantFormProps {
  onSubmit: (payload: {
    name: string;
    borough: Borough;
    neighborhood?: string;
    cuisine?: string;
    reservationDifficulty: ReservationDifficulty;
    latitude: number;
    longitude: number;
  }) => Promise<void>;
}

const BOROUGHS: Borough[] = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
const DIFFICULTIES: ReservationDifficulty[] = ['Easy', 'Moderate', 'Hard', 'Impossible'];

export default function AddRestaurantForm({ onSubmit }: AddRestaurantFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    borough: 'Manhattan' as Borough,
    neighborhood: '',
    cuisine: '',
    reservationDifficulty: 'Moderate' as ReservationDifficulty,
    latitude: 40.7128,
    longitude: -74.006,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      setForm({
        name: '',
        borough: 'Manhattan',
        neighborhood: '',
        cuisine: '',
        reservationDifficulty: 'Moderate',
        latitude: 40.7128,
        longitude: -74.006,
      });
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Add Restaurant
      </button>
    );
  }

  return (
    <form className="space-y-2 rounded border border-slate-200 bg-white p-3" onSubmit={handleSubmit}>
      <input
        className="w-full rounded border border-slate-300 px-2 py-1"
        onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
        placeholder="Restaurant name"
        required
        value={form.name}
      />
      <div className="grid grid-cols-2 gap-2">
        <select
          className="rounded border border-slate-300 px-2 py-1"
          onChange={(e) => setForm((s) => ({ ...s, borough: e.target.value as Borough }))}
          value={form.borough}
        >
          {BOROUGHS.map((borough) => (
            <option key={borough} value={borough}>{borough}</option>
          ))}
        </select>
        <select
          className="rounded border border-slate-300 px-2 py-1"
          onChange={(e) => setForm((s) => ({ ...s, reservationDifficulty: e.target.value as ReservationDifficulty }))}
          value={form.reservationDifficulty}
        >
          {DIFFICULTIES.map((difficulty) => (
            <option key={difficulty} value={difficulty}>{difficulty}</option>
          ))}
        </select>
      </div>
      <input
        className="w-full rounded border border-slate-300 px-2 py-1"
        onChange={(e) => setForm((s) => ({ ...s, neighborhood: e.target.value }))}
        placeholder="Neighborhood"
        value={form.neighborhood}
      />
      <input
        className="w-full rounded border border-slate-300 px-2 py-1"
        onChange={(e) => setForm((s) => ({ ...s, cuisine: e.target.value }))}
        placeholder="Cuisine"
        value={form.cuisine}
      />
      <div className="grid grid-cols-2 gap-2">
        <input className="rounded border border-slate-300 px-2 py-1" type="number" step="any" value={form.latitude} onChange={(e)=>setForm((s)=>({...s, latitude:Number(e.target.value)}))} />
        <input className="rounded border border-slate-300 px-2 py-1" type="number" step="any" value={form.longitude} onChange={(e)=>setForm((s)=>({...s, longitude:Number(e.target.value)}))} />
      </div>
      <div className="flex gap-2">
        <button className="rounded bg-slate-900 px-3 py-1 text-sm text-white" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving…' : 'Save'}
        </button>
        <button className="rounded border border-slate-300 px-3 py-1 text-sm" onClick={() => setIsOpen(false)} type="button">
          Cancel
        </button>
      </div>
    </form>
  );
}
