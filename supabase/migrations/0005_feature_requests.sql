-- Özellik önerileri tablosu
create table if not exists public.feature_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  like_count int default 0,
  is_implemented boolean default false, -- Admin tarafından uygulamaya kodlandı mı?
  implemented_at timestamptz, -- Ne zaman uygulandı
  implemented_version text, -- Hangi versiyonda uygulandı (örn: "0.1.51")
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Beğenme tablosu (bir kullanıcı bir öneriyi sadece bir kez beğenebilir)
create table if not exists public.feature_request_likes (
  id uuid primary key default gen_random_uuid(),
  feature_request_id uuid not null references public.feature_requests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(feature_request_id, user_id) -- Bir kullanıcı bir öneriyi sadece bir kez beğenebilir
);

-- Kişisel bilgi görünürlük ayarları
alter table public.profiles 
  add column if not exists show_public_profile boolean default true, -- Profili herkese açık göster
  add column if not exists show_community_stats boolean default true; -- Topluluk istatistiklerini göster

-- Indexler
create index if not exists feature_requests_user_id_idx on public.feature_requests(user_id);
create index if not exists feature_requests_like_count_idx on public.feature_requests(like_count desc);
create index if not exists feature_requests_created_at_idx on public.feature_requests(created_at desc);
create index if not exists feature_requests_implemented_idx on public.feature_requests(is_implemented, implemented_at desc);
create index if not exists feature_request_likes_feature_request_id_idx on public.feature_request_likes(feature_request_id);
create index if not exists feature_request_likes_user_id_idx on public.feature_request_likes(user_id);

-- RLS (Row Level Security)
alter table public.feature_requests enable row level security;
alter table public.feature_request_likes enable row level security;

-- Herkes önerileri okuyabilir
create policy "Feature requests are viewable by everyone."
  on public.feature_requests for select
  using (true);

-- Sadece kendi önerisini oluşturabilir
create policy "Users can create their own feature requests."
  on public.feature_requests for insert
  with check (auth.uid() = user_id);

-- Sadece kendi önerisini güncelleyebilir (admin hariç - admin dashboard'dan yapacak)
create policy "Users can update their own feature requests."
  on public.feature_requests for update
  using (auth.uid() = user_id);

-- Herkes beğenme listesini okuyabilir
create policy "Feature request likes are viewable by everyone."
  on public.feature_request_likes for select
  using (true);

-- Sadece kendi beğenmesini oluşturabilir
create policy "Users can create their own likes."
  on public.feature_request_likes for insert
  with check (auth.uid() = user_id);

-- Sadece kendi beğenmesini silebilir
create policy "Users can delete their own likes."
  on public.feature_request_likes for delete
  using (auth.uid() = user_id);

-- updated_at trigger
drop trigger if exists feature_requests_set_updated_at on public.feature_requests;

create trigger feature_requests_set_updated_at
  before update on public.feature_requests
  for each row execute procedure public.set_updated_at();

-- Like count'u otomatik güncellemek için trigger
create or replace function update_feature_request_like_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.feature_requests
    set like_count = like_count + 1
    where id = NEW.feature_request_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.feature_requests
    set like_count = like_count - 1
    where id = OLD.feature_request_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists update_feature_request_like_count_trigger on public.feature_request_likes;

create trigger update_feature_request_like_count_trigger
  after insert or delete on public.feature_request_likes
  for each row execute procedure update_feature_request_like_count();

