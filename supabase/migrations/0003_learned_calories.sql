-- Öğrenilmiş kalori bilgileri tablosu
-- AI'dan hesaplanan kalorileri veritabanında saklar ve yeniden kullanır
create table if not exists public.learned_calories (
  id uuid primary key default gen_random_uuid(),
  
  -- Yiyecek bilgileri (meal için)
  food_name text,
  preparation_method text, -- Yapılış yöntemi (örn: "Tereyağlı pilav", "Zeytinyağlı pilav")
  quantity text, -- Miktar (örn: "100g", "1 tabak")
  calories_per_100g numeric, -- 100g için kalori
  calories_per_gram numeric, -- 1g için kalori
  
  -- Egzersiz bilgileri (workout için)
  workout_name text,
  workout_preparation_method text, -- Hazırlık yöntemi (örn: "Koşu bandı", "Açık hava")
  workout_duration_minutes int, -- Süre (dakika)
  workout_type text, -- Tip (cardio, strength, vb.)
  workout_calories numeric, -- Egzersiz için toplam kalori
  
  -- Meta bilgiler
  usage_count int default 1, -- Kaç kez kullanıldı
  last_used_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Constraint: Yiyecek VEYA egzersiz olmalı (ikisi birden olamaz)
  constraint check_food_or_workout check (
    (food_name is not null and workout_name is null) or
    (food_name is null and workout_name is not null)
  )
);

-- Indexler: Hızlı arama için
create index if not exists learned_calories_food_idx on public.learned_calories(
  lower(food_name), 
  lower(coalesce(preparation_method, '')), 
  quantity
) where food_name is not null;

create index if not exists learned_calories_workout_idx on public.learned_calories(
  lower(workout_name), 
  lower(coalesce(workout_preparation_method, '')), 
  workout_duration_minutes, 
  workout_type
) where workout_name is not null;

create index if not exists learned_calories_usage_idx on public.learned_calories(usage_count desc, last_used_at desc);

-- Updated_at trigger
drop trigger if exists learned_calories_set_updated_at on public.learned_calories;
create trigger learned_calories_set_updated_at
before update on public.learned_calories
for each row execute procedure public.set_updated_at();

-- RLS Policy: Herkes okuyabilir, sadece authenticated kullanıcılar yazabilir
alter table public.learned_calories enable row level security;

-- Herkes okuyabilir (public cache)
drop policy if exists "learned_calories_select" on public.learned_calories;
create policy "learned_calories_select" on public.learned_calories
  for select using (true);

-- Sadece authenticated kullanıcılar yeni kayıt ekleyebilir
drop policy if exists "learned_calories_insert" on public.learned_calories;
create policy "learned_calories_insert" on public.learned_calories
  for insert to authenticated
  with check (true);

-- Sadece authenticated kullanıcılar usage_count güncelleyebilir
drop policy if exists "learned_calories_update" on public.learned_calories;
create policy "learned_calories_update" on public.learned_calories
  for update to authenticated
  using (true)
  with check (true);

comment on table public.learned_calories is 'AI''dan öğrenilen kalori bilgileri cache tablosu. Aynı yiyecek/egzersiz kombinasyonu için AI çağrısı yapmak yerine bu tablodan okunur.';
comment on column public.learned_calories.usage_count is 'Bu kalori değerinin kaç kez kullanıldığı (popüler içerikleri öncelemek için)';
comment on column public.learned_calories.last_used_at is 'Son kullanım zamanı (eski kayıtları temizlemek için)';

