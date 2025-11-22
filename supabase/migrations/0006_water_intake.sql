-- Su tüketimi takip tablosu
create table if not exists public.water_intake (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount_ml numeric not null, -- İçilen su miktarı (mililitre)
  created_at timestamptz default now()
);

create index if not exists water_intake_user_created_idx on public.water_intake(user_id, created_at desc);
-- date(created_at) index'i kaldırıldı - IMMUTABLE hatası nedeniyle
-- Bunun yerine created_at index'i yeterli, tarih sorguları için

-- Su hatırlatıcı ayarları (profiles tablosuna eklenebilir veya ayrı tablo)
alter table public.profiles
add column if not exists daily_water_goal_ml numeric default 2000; -- Günlük hedef (varsayılan 2000ml = 2 litre)

alter table public.profiles
add column if not exists water_reminder_enabled boolean default true; -- Bildirim açık/kapalı

alter table public.profiles
add column if not exists water_reminder_interval_minutes int default 120; -- Bildirim aralığı (dakika)

comment on table public.water_intake is 'Kullanıcı su tüketimi kayıtları';
comment on column public.profiles.daily_water_goal_ml is 'Günlük su hedefi (mililitre)';
comment on column public.profiles.water_reminder_enabled is 'Su hatırlatıcı bildirimleri açık/kapalı';
comment on column public.profiles.water_reminder_interval_minutes is 'Su hatırlatıcı bildirim aralığı (dakika)';

