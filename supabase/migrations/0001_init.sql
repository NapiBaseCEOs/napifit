create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  first_name text,
  last_name text,
  avatar_url text,
  date_of_birth date,
  height_cm numeric,
  weight_kg numeric,
  age int,
  gender text check (gender in ('male', 'female', 'other')),
  target_weight_kg numeric,
  daily_steps int,
  activity_level text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.health_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  weight_kg numeric,
  body_fat numeric,
  muscle_mass numeric,
  water numeric,
  bmi numeric,
  notes text,
  created_at timestamptz default now()
);
create index if not exists health_metrics_user_created_idx on public.health_metrics(user_id, created_at desc);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null,
  duration_minutes int,
  calories numeric,
  distance_km numeric,
  notes text,
  created_at timestamptz default now()
);
create index if not exists workouts_user_created_idx on public.workouts(user_id, created_at desc);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  image_url text,
  foods jsonb not null,
  total_calories numeric not null,
  meal_type text,
  notes text,
  recommendations jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists meals_user_created_idx on public.meals(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists meals_set_updated_at on public.meals;
create trigger meals_set_updated_at
before update on public.meals
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, created_at, updated_at)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email), now(), now());
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.health_metrics enable row level security;
alter table public.workouts enable row level security;
alter table public.meals enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "health_metrics_crud" on public.health_metrics;
create policy "health_metrics_crud" on public.health_metrics
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "workouts_crud" on public.workouts;
create policy "workouts_crud" on public.workouts
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "meals_crud" on public.meals;
create policy "meals_crud" on public.meals
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.avg_daily_steps()
returns numeric
language sql
security definer
set search_path = public
as $$
  select avg(daily_steps)::numeric from public.profiles where daily_steps is not null;
$$;

