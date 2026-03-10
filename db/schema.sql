create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  email text not null unique,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  borough text not null check (borough in ('Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island')),
  neighborhood text,
  cuisine text,
  reservation_difficulty text not null check (reservation_difficulty in ('Easy', 'Moderate', 'Hard', 'Impossible')),
  latitude double precision not null,
  longitude double precision not null,
  created_by uuid not null references users(id),
  average_score numeric(3, 1) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  score integer not null check (score between 1 and 10),
  comment text not null,
  created_at timestamptz not null default now(),
  unique (restaurant_id, user_id, created_at)
);

create index if not exists idx_restaurants_borough on restaurants (borough);
create index if not exists idx_restaurants_difficulty on restaurants (reservation_difficulty);
create index if not exists idx_reviews_restaurant on reviews (restaurant_id);

create or replace function refresh_restaurant_rating()
returns trigger as $$
begin
  update restaurants
  set
    average_score = coalesce((select round(avg(score)::numeric, 1) from reviews where restaurant_id = coalesce(NEW.restaurant_id, OLD.restaurant_id)), 0),
    review_count = (select count(*) from reviews where restaurant_id = coalesce(NEW.restaurant_id, OLD.restaurant_id))
  where id = coalesce(NEW.restaurant_id, OLD.restaurant_id);
  return coalesce(NEW, OLD);
end;
$$ language plpgsql;

create trigger trg_reviews_refresh_rating
after insert or update or delete on reviews
for each row
execute function refresh_restaurant_rating();
