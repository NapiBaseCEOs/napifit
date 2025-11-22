-- Beğenmeme (dislike) tablosu
create table if not exists public.feature_request_dislikes (
  id uuid primary key default gen_random_uuid(),
  feature_request_id uuid not null references public.feature_requests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(feature_request_id, user_id) -- Bir kullanıcı bir öneriyi sadece bir kez beğenmeyebilir
);

-- Like ve dislike aynı anda olmamalı (constraint)
alter table public.feature_request_dislikes
  add constraint no_like_and_dislike check (
    not exists (
      select 1 from public.feature_request_likes
      where feature_request_likes.feature_request_id = feature_request_dislikes.feature_request_id
        and feature_request_likes.user_id = feature_request_dislikes.user_id
    )
  );

-- Indexler
create index if not exists feature_request_dislikes_feature_request_id_idx on public.feature_request_dislikes(feature_request_id);
create index if not exists feature_request_dislikes_user_id_idx on public.feature_request_dislikes(user_id);

-- Dislike count kolonu ekle
alter table public.feature_requests
  add column if not exists dislike_count int default 0;

-- RLS
alter table public.feature_request_dislikes enable row level security;

-- Herkes beğenmeme listesini okuyabilir
create policy "Feature request dislikes are viewable by everyone."
  on public.feature_request_dislikes for select
  using (true);

-- Sadece kendi beğenmemesini oluşturabilir
create policy "Users can create their own dislikes."
  on public.feature_request_dislikes for insert
  with check (auth.uid() = user_id);

-- Sadece kendi beğenmemesini silebilir
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

-- Like ve dislike aynı anda olmamalı (trigger ile de kontrol)
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

