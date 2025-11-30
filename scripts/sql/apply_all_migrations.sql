-- ============================================
-- TÜM MİGRATİON'LARI UYGULA (DÜZELTİLMİŞ)
-- ============================================
-- Bu dosyayı Supabase Dashboard > SQL Editor'de çalıştırın
-- Index hatası düzeltildi

-- ============================================
-- ADIM 1: SU TÜKETİMİ TAKİBİ MİGRATİON
-- ============================================

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

-- ============================================
-- ADIM 2: BEĞENMEME (DISLIKE) SİSTEMİ MİGRATİON
-- ============================================

-- Beğenmeme (dislike) tablosu
create table if not exists public.feature_request_dislikes (
  id uuid primary key default gen_random_uuid(),
  feature_request_id uuid not null references public.feature_requests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(feature_request_id, user_id) -- Bir kullanıcı bir öneriyi sadece bir kez beğenmeyebilir
);

-- Dislike count kolonu ekle
alter table public.feature_requests
add column if not exists dislike_count int default 0;

-- Indexler
create index if not exists feature_request_dislikes_feature_request_id_idx on public.feature_request_dislikes(feature_request_id);
create index if not exists feature_request_dislikes_user_id_idx on public.feature_request_dislikes(user_id);

-- RLS
alter table public.feature_request_dislikes enable row level security;

-- Herkes beğenmeme listesini okuyabilir
drop policy if exists "Feature request dislikes are viewable by everyone." on public.feature_request_dislikes;
create policy "Feature request dislikes are viewable by everyone."
  on public.feature_request_dislikes for select
  using (true);

-- Sadece kendi beğenmemesini oluşturabilir
drop policy if exists "Users can create their own dislikes." on public.feature_request_dislikes;
create policy "Users can create their own dislikes."
  on public.feature_request_dislikes for insert
  with check (auth.uid() = user_id);

-- Sadece kendi beğenmemesini silebilir
drop policy if exists "Users can delete their own dislikes." on public.feature_request_dislikes;
create policy "Users can delete their own dislikes."
  on public.feature_request_dislikes for delete
  using (auth.uid() = user_id);

-- Dislike count'u otomatik güncellemek için trigger
create or replace function update_feature_request_dislike_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.feature_requests
    set dislike_count = dislike_count + 1
    where id = NEW.feature_request_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.feature_requests
    set dislike_count = dislike_count - 1
    where id = OLD.feature_request_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists update_feature_request_dislike_count_trigger on public.feature_request_dislikes;
create trigger update_feature_request_dislike_count_trigger
  after insert or delete on public.feature_request_dislikes
  for each row execute procedure update_feature_request_dislike_count();

-- Like ve dislike aynı anda olmamalı - trigger ile kontrol
create or replace function prevent_like_and_dislike()
returns trigger as $$
begin
  -- Eğer bu kullanıcı aynı öneriyi beğenmişse, beğenmeme eklenemez
  if exists (
    select 1 from public.feature_request_likes
    where feature_request_id = NEW.feature_request_id
      and user_id = NEW.user_id
  ) then
    raise exception 'Aynı öneriyi hem beğenip hem beğenememezsiniz';
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists prevent_like_and_dislike_trigger on public.feature_request_dislikes;
create trigger prevent_like_and_dislike_trigger
  before insert on public.feature_request_dislikes
  for each row execute procedure prevent_like_and_dislike();

-- Like eklenirken dislike varsa sil
create or replace function remove_dislike_on_like()
returns trigger as $$
begin
  delete from public.feature_request_dislikes
  where feature_request_id = NEW.feature_request_id
    and user_id = NEW.user_id;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists remove_dislike_on_like_trigger on public.feature_request_likes;
create trigger remove_dislike_on_like_trigger
  after insert on public.feature_request_likes
  for each row execute procedure remove_dislike_on_like();

-- Dislike eklenirken like varsa sil
create or replace function remove_like_on_dislike()
returns trigger as $$
begin
  delete from public.feature_request_likes
  where feature_request_id = NEW.feature_request_id
    and user_id = NEW.user_id;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists remove_like_on_dislike_trigger on public.feature_request_dislikes;
create trigger remove_like_on_dislike_trigger
  after insert on public.feature_request_dislikes
  for each row execute procedure remove_like_on_dislike();

-- ============================================
-- ADIM 3: MANUEL ÖNERİ EKLEME
-- ============================================

-- Mert Demir kullanıcısını bul ve su içme hatırlatıcısı önerisini ekle
DO $$
DECLARE
  mert_user_id uuid;
  rec RECORD; -- Loop değişkeni record tipinde tanımlanmalı
BEGIN
  -- Mert Demir kullanıcısını bul (full_name'e göre)
  SELECT id INTO mert_user_id
  FROM public.profiles
  WHERE LOWER(full_name) LIKE '%mert%' AND LOWER(full_name) LIKE '%demir%'
  LIMIT 1;

  -- Eğer kullanıcı bulunamazsa, uyarı ver ve çık
  IF mert_user_id IS NULL THEN
    RAISE NOTICE 'Mert Demir kullanıcısı bulunamadı. Lütfen kullanıcı ID''sini manuel olarak girin.';
    RAISE NOTICE 'Mevcut kullanıcılar:';
    FOR rec IN SELECT id, full_name, email FROM public.profiles LIMIT 10 LOOP
      RAISE NOTICE 'ID: %, İsim: %, Email: %', rec.id, rec.full_name, rec.email;
    END LOOP;
  ELSE
    -- Su içme hatırlatıcısı önerisini ekle
    INSERT INTO public.feature_requests (
      user_id,
      title,
      description,
      like_count,
      dislike_count,
      is_implemented,
      implemented_at,
      implemented_version,
      created_at
    ) VALUES (
      mert_user_id,
      'Su İçme Hatırlatıcısı',
      'Su içme hatırlatıcısı olsa çok güzel olur',
      0,
      0,
      true, -- Uygulandı olarak işaretle
      now(), -- Bugün uygulandı
      '0.1.53', -- Versiyon numarası
      now() - interval '7 days' -- 7 gün önce oluşturulmuş gibi göster
    )
    ON CONFLICT DO NOTHING;
    
    -- Kullanıcının profili herkese açık olsun
    UPDATE public.profiles 
    SET show_public_profile = true 
    WHERE id = mert_user_id;
    
    RAISE NOTICE '✅ Öneri başarıyla eklendi. Kullanıcı ID: %', mert_user_id;
  END IF;
END $$;

-- Kullanıcıyı kontrol et
SELECT id, full_name, email, show_public_profile 
FROM public.profiles 
WHERE LOWER(full_name) LIKE '%mert%' OR LOWER(full_name) LIKE '%demir%';

-- Eklenen öneriyi kontrol et
SELECT 
  fr.id,
  fr.title,
  fr.description,
  fr.is_implemented,
  fr.implemented_version,
  fr.created_at,
  p.full_name as user_name,
  p.show_public_profile
FROM public.feature_requests fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
WHERE fr.title = 'Su İçme Hatırlatıcısı'
ORDER BY fr.created_at DESC
LIMIT 1;
