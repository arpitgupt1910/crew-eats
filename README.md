# Crew Eats NYC — Production Refactor Blueprint

This repository now contains a production-oriented architecture for migrating the original single-file **Crew Eats NYC** map app into a modern full-stack stack using **Next.js (App Router), React, TypeScript, TailwindCSS, and Supabase/Postgres**.

## 1) Existing architecture (single HTML file) — how it works

Because the legacy app is a single HTML file, its architecture is typically organized around a few global buckets:

### Global variables
- A global `restaurants` array holding all restaurant records.
- A global `filters` object (`borough`, `reservationDifficulty`).
- Global map handles such as `map`, `markersLayer`, and selected restaurant/review state.
- Utility globals for localStorage keys and score helpers.

### State management
- State is mutable and shared by top-level script variables.
- UI updates are manually triggered by calling imperative render functions (`renderList()`, `renderMapPins()`, etc.).
- Event listeners mutate global objects directly, then re-render.

### Restaurant data structure
- Usually plain objects in an array:
  - `id`, `name`, `borough`, `difficulty`, `lat`, `lng`
  - optional metadata (`neighborhood`, `cuisine`, `createdAt`)
  - often a nested `reviews` array.

### Review storage
- Reviews are embedded in local in-memory restaurant objects.
- Persistence is done via `localStorage.setItem('key', JSON.stringify(data))`.
- On load, JSON is parsed and merged into memory.

### Map rendering
- Leaflet map initialized in one script block (`L.map(...)`, `L.tileLayer(...)`).
- Markers are created from the current filtered array.
- Marker popups concatenate HTML strings directly.
- Every filter change often clears/rebuilds full marker sets.

## 2) Refactored project architecture

```txt
app/
  api/
    restaurants/
      route.ts
  page.tsx
components/
  Map.tsx
  RestaurantCard.tsx
  ReviewForm.tsx
  Sidebar.tsx
lib/
  restaurants.ts
  scoring.ts
  storage.ts
  supabase.ts
styles/
  globals.css
types/
  restaurant.ts
db/
  schema.sql
```

### What each layer owns
- `types/`: domain contracts (`Restaurant`, `Review`, `User`), shared everywhere.
- `lib/`: pure business/data logic (fetching, scoring, storage fallback).
- `components/`: composable UI units with explicit props.
- `app/page.tsx`: page orchestration and state composition.
- `app/api/*`: server endpoints used by clients or external integrations.
- `db/schema.sql`: relational model + constraints + indexes + rating trigger.

## 3) Modern stack conversion details

### Frontend
- Next.js App Router
- React client components where interactivity is required
- TypeScript interfaces for all entities
- TailwindCSS utility classes
- Leaflet via `react-leaflet` with dynamic import for SSR safety

### Backend
- Supabase client for Postgres access
- SQL schema designed for collaborative usage and analytics

## 4) Database schema

See `db/schema.sql` for complete DDL.

### `users`
- `id uuid pk`
- `display_name text`
- `email text unique`
- `avatar_url text`
- `created_at timestamptz`

### `restaurants`
- `id uuid pk`
- `name text`
- `borough` enum-like `check`
- `reservation_difficulty` enum-like `check`
- `latitude/longitude`
- `created_by -> users(id)`
- denormalized `average_score`, `review_count`

### `reviews`
- `id uuid pk`
- `restaurant_id -> restaurants(id)`
- `user_id -> users(id)`
- `score 1..10`
- `comment`
- `created_at`

A trigger recalculates restaurant aggregates after review mutations.

## 5) TypeScript data model

Implemented in `types/restaurant.ts`:
- `User`
- `Review`
- `Restaurant`
- filter and enum-like union types

## 6) Functional parity retained

The new architecture still supports:
- map pins (`components/Map.tsx`)
- borough/difficulty filtering (`components/Sidebar.tsx`, `app/page.tsx`)
- scoring and review aggregation (`lib/scoring.ts`, `db/schema.sql`)
- adding/fetching restaurants (`lib/restaurants.ts`, `app/api/restaurants/route.ts`)
- collaborative reviews persisted in Postgres (`lib/restaurants.ts`, `db/schema.sql`)

## 7) Performance, maintainability, and security improvements

### Problems in the single-file version
- Global mutable state causes side-effects and stale UI.
- View logic mixed with data/storage logic.
- Full marker redraws on each filter update can be inefficient.
- Local-only storage prevents true collaboration.
- Direct string-based popup markup can lead to injection issues.

### Improvements in this refactor
- Strongly typed boundaries via `types/restaurant.ts`.
- Scoped component responsibilities and explicit props.
- Data access isolated in `lib/restaurants.ts`.
- API route abstraction in `app/api/restaurants/route.ts`.
- Postgres constraints and indexes improve correctness/perf.
- Ready for RLS policies and authenticated user identity in Supabase.

## 8) Example code included

Working examples are included for:
- Map component (`components/Map.tsx`)
- Pin rendering (`components/Map.tsx` markers/popups)
- Review submission (`components/ReviewForm.tsx` + `lib/restaurants.ts`)
- Restaurant fetching from DB (`lib/restaurants.ts`, `app/api/restaurants/route.ts`)

---

## Next steps to run in a real environment

1. Initialize a full Next.js project scaffold if not already present.
2. Install runtime deps:
   - `next react react-dom`
   - `typescript @types/react @types/node`
   - `tailwindcss postcss autoprefixer`
   - `react-leaflet leaflet`
   - `@supabase/supabase-js`
3. Add `.env.local` with Supabase keys.
4. Apply `db/schema.sql` in Supabase SQL editor.
5. Add Supabase RLS policies for `restaurants` and `reviews`.
