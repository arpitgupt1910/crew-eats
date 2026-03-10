# Crew Eats NYC

Production-style Next.js refactor of a collaborative NYC restaurant map app.

## Stack
- Next.js (App Router) + React + TypeScript
- TailwindCSS
- React Leaflet
- Supabase/Postgres
- Vitest (unit tests)

## Project layout

```txt
app/
  api/restaurants/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  AddRestaurantForm.tsx
  Map.tsx
  RestaurantCard.tsx
  ReviewForm.tsx
  Sidebar.tsx
lib/
  restaurants.ts
  scoring.ts
  storage.ts
  supabase.ts
types/
  restaurant.ts
db/schema.sql
tests/scoring.test.ts
```

## Run locally

1) Install dependencies

```bash
npm install
```

2) Configure environment variables in `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

3) Apply database schema
- Open Supabase SQL editor and run `db/schema.sql`.
- Add at least one `users` row, because restaurant creation requires `created_by` foreign key.

4) Start dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

## How to test

### Automated checks

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

### Manual functional test checklist
- Add a restaurant in the sidebar form.
- Confirm a marker appears on the map.
- Filter by borough and reservation difficulty.
- Submit a review and confirm score/review count update.

## Database model

- `users`
- `restaurants` (FK: `created_by -> users.id`)
- `reviews` (FKs: `restaurant_id`, `user_id`)

A trigger in `db/schema.sql` keeps `restaurants.average_score` and `restaurants.review_count` in sync with review mutations.
